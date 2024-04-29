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
          this.preuTotal = this.preuTotal + (carro.preu_unitat*carro.cantitat);
          if (productoExistente) {
            // Si el producto ya existe en el carrito, actualiza la cantidad
            productoExistente.cantitat += carro.cantitat;
          } else {
            // Si el producto no existe en el carrito, agrégalo
            let carrito = new Cistella(carro.id_producto_cistella, carro.usuari_afegit, carro.nom_producte, carro.cantitat, carro.preu_unitat, carro.imagen_producto);
            if (carrito.usuari_afegit == this.storedNom) {
              this.productosArrayUsuario.push(carrito);
            }
          }
        });
      });
      console.log(this.productosArrayUsuario)
    }
    getProductes();
  }
  sacarDeLaCesta(nomProducte: string){
    this.http.post('http://localhost:3080/eliminarProductoCarrito', {usuari_afegit: this.storedNom, nom_producte:nomProducte}).subscribe({

    })
    window.location.reload();
  }
  sacarDeLaCestaalComprar(){
    this.http.post('http://localhost:3080/eliminarProductoCarritoComprado', {usuari_afegit: this.storedNom}).subscribe({

    })
  }

  descontarStock(nomProducte: string, cantidadRestar: number ){
    this.http.post('http://localhost:3080/descontarStock', {nom_producte: nomProducte,cantidad_restar:cantidadRestar}).subscribe({

    })
  }
  comprar() {
    this.productosArrayUsuario.forEach(producto => {
      let preuTotal = producto.preu_unitat * producto.cantitat;
      console.log(preuTotal)
      let productovendido = new Productosvendidos(producto.id_producto_cistella, producto.nom_producte, producto.cantitat, preuTotal, 20, producto.usuari_afegit);
      this.http.post('http://localhost:3080/comprarproductos', productovendido).subscribe(
      );
      console.log(producto.nom_producte)
      this.descontarStock(producto.nom_producte, producto.cantitat)
    });
    this.sacarDeLaCestaalComprar();
    alert("Gracias por su compra 🥰🥰")
    window.location.reload();
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
