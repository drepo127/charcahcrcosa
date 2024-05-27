import {Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ProductosService } from '../productos.service';
import { Producto } from '../productos.service';
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import {Cistella} from "../cistella.model";
import {Productosvendidos} from "../productosvendidos.model";
import {Producte} from "../producte.model";
import {resolve} from "@angular/compiler-cli";
import { ethers } from 'ethers';
import { Web3 } from 'web3';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [
  {
    type: 'success',
    message: 'Aquesta es la teva cistella',
  },];


@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule,
    NgIf,
    RouterLink, NgOptimizedImage, NgbAlertModule
  ],
  templateUrl: './cesta.component.html',
  styleUrl: './cesta.component.css'
})
export class CestaComponent implements OnInit {
  productos: Producto[][] = [];
  preuTotal = 0;
  isLoggedIn: boolean | null = false;
  user: string | null = null
  storedNom: string | null;
  alerts: Alert[] | undefined;
  productosArrayUsuario: Cistella[] = [];
  stockNoSuperado: boolean = true;
  close(alert: Alert) {
    // @ts-ignore
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  constructor(private productosService: ProductosService, private  http: HttpClient) {
    this.storedNom = sessionStorage.getItem('username');
    this.reset();

    const getProductes = () => {
      this.http.get<Cistella[]>('http://localhost:3080/obtenirCarrito').subscribe((carrito) => {
        carrito.forEach((carro) => {
          let productoExistente = this.productosArrayUsuario.find(producto => producto.nom_producte === carro.nom_producte);
          if (productoExistente) {
            // Si el producto ya existe en el carrito, actualiza la cantidad
            productoExistente.cantitat += carro.cantitat;
          } else {
            // Si el producto no existe en el carrito, agrégalo
            let carrito = new Cistella(carro.id_producto_cistella, carro.usuari_afegit, carro.nom_producte, carro.cantitat, carro.preu_unitat, carro.imagen_producto, carro.descuento_producto);
            if (carrito.usuari_afegit == this.storedNom) {
              this.preuTotal = this.preuTotal + (carro.preu_unitat * carro.cantitat);
              this.productosArrayUsuario.push(carrito);
            }
          }
        });
        this.contarStockIDesactivarBoton();
      });
    }
    getProductes();
  }
  sacarDeLaCesta(nomProducte: string, precioProducto: number){
    this.preuTotal = this.preuTotal - precioProducto;
    this.http.post('http://localhost:3080/eliminarProductoCarrito', {usuari_afegit: this.storedNom, nom_producte:nomProducte}).subscribe({

    })
    window.location.reload();
  }
  sacarDeLaCestaalComprar(){
    this.http.post('http://localhost:3080/eliminarProductoCarritoComprado', {usuari_afegit: this.storedNom}).subscribe({

    })
  }
  contarStockIDesactivarBoton(){
    this.http.get<Producte[]>('http://localhost:3080/obtenirProductes').subscribe((productes) =>{
      productes.forEach((producte) =>{
        let nombreProducto = producte.nombre_producto
        let cantidadProducto = producte.cantidad
        console.log(cantidadProducto)
        this.productosArrayUsuario.forEach((productosCesta) =>{
          if(productosCesta.nom_producte == nombreProducto){
            this.stockNoSuperado = productosCesta.cantitat <= cantidadProducto;
            console.log(this.stockNoSuperado)
          }
        })
      })
    })
  }

  descontarStock(nomProducte: string, cantidadRestar: number ){
    this.http.post('http://localhost:3080/descontarStock', {nom_producte: nomProducte,cantidad_restar:cantidadRestar}).subscribe({

    })
  }
  async comprar() {
    if (this.productosArrayUsuario.length === 0) {
      alert("No tienes productos en la cesta");
    } else {
      try {
        // Asegúrate de que 'preuTotal' esté correctamente formateado como string con los decimales permitidos
        const valueInWei = Web3.utils.toWei(this.preuTotal.toFixed(18), 'ether'); // Ajusta la precisión según lo necesario
        console.log(valueInWei.toString());

        let PromesadePago = new Promise(async (resolve, reject) => {
          //@ts-ignore
          window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: '0xcA38c36c5e7b80CF50a7848085F1e6BBef96c5e8',
              to: '0xCA108c6e1ec14d13403C6bb1DD446AA88a4Dd7Ea',
              value: valueInWei // Convertir el valor en Wei a una cadena hexadecimal
            }]
            //@ts-ignore
          }).then((response) => {
            console.log(response);
            resolve(response);
          }).catch((error: any) => {
            console.log(error);
            reject(error);
          });
        });

        await PromesadePago
          .then(async () => {
            for (const producto of this.productosArrayUsuario) {
              let preuTotal = producto.preu_unitat * producto.cantitat;
              console.log(preuTotal);
              let productovendido = new Productosvendidos(
                producto.id_producto_cistella,
                producto.nom_producte,
                producto.cantitat,
                preuTotal,
                producto.descuento_producto,
                producto.usuari_afegit
              );
              this.http.post('http://localhost:3080/comprarproductos', productovendido).subscribe(() => {
                console.log(producto.nom_producte);
                this.descontarStock(producto.nom_producte, producto.cantitat);
              });
            }
            this.sacarDeLaCestaalComprar();
            alert("Gracias por su compra 🥰🥰");
            window.location.reload();
          })
          .catch(async (error) => {
            console.log(error);
            alert("No se pudo pagar. Compruebe su conexión a Internet y vuelva a intentarlo.");
          });
      } catch (error) {
        console.log(error);
        alert("Se produjo un error al procesar la compra.");
      }
    }
  }

  reset() {
    this.alerts = Array.from(ALERTS);
  }

  ngOnInit() {
    this.productosService.productos$.subscribe(productos => {
      this.productos = productos;
      this.calcularPrecio()
    });
    const isLoggedInString = sessionStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;
  }
  quitarProducto(prodName: string) {
    this.productosService.eliminarArrayPorNombre(prodName);
  }
  calcularPrecio() {
    this.preuTotal = this.productosService.calcularPrecioTotalConCantidad(this.productos);
    console.log(`Precio total actualizado: ${this.preuTotal}`);
  }
  comprarProductos(){
    this.productos = []
  }
  logsComprar() {

    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: `Ha Comprat los productos`, data: data }, { responseType: 'text' }).subscribe({});
  }
  logsQuitarProducto() {
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion:"ha eliminat productes de la cesta", data: data }, { responseType: 'text' }).subscribe({});
  }



}
