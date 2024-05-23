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
import {FormsModule} from "@angular/forms";
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
    RouterLink, NgOptimizedImage, NgbAlertModule, FormsModule
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
  pricebit: number | undefined;
  pricebnb: number | undefined;
  selectedCurrency: string = 'euros'; // Moneda por defecto
  precioTotalEnMoneda: string = ''; // Precio total en la moneda seleccionada


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
            let carrito = new Cistella(carro.id_producto_cistella, carro.usuari_afegit, carro.nom_producte, carro.cantitat, carro.preu_unitat, carro.imagen_producto, carro.descuento_producto);
            if (carrito.usuari_afegit == this.storedNom) {
              this.productosArrayUsuario.push(carrito);
            }
          }
        });
        this.contarStockIDesactivarBoton();
      });
    }
    getProductes();
  }

  ngOnInit() {
    this.productosService.productos$.subscribe(productos => {
      this.productos = productos;
      this.calcularPrecio()
    });
    const isLoggedInString = sessionStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;

    this.getCurrentPrices();
    this.Refrescar();
    this.calcularPrecioEnMoneda(this.precioTotalEnMoneda)

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
  comprar() {
    this.productosArrayUsuario.forEach(producto => {
      let preuTotal = producto.preu_unitat * producto.cantitat;
      console.log(preuTotal)
      let productovendido = new Productosvendidos(producto.id_producto_cistella, producto.nom_producte, producto.cantitat, preuTotal, producto.descuento_producto, producto.usuari_afegit);
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

  getCurrentPrices() {
    this.http.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,binancecoin&vs_currencies=eur")
      .subscribe((data: any) => {
        if (data) {
          this.pricebit = data.bitcoin.eur;
          this.pricebnb = data.binancecoin.eur;
          this.updatePrecioTotal(); // Actualizar el precio total al obtener los precios
        } else {
          console.error("Error fetching current prices");
        }
      });
  }

  updatePrecioTotal() {
    this.precioTotalEnMoneda = this.calcularPrecioEnMoneda(this.selectedCurrency);
  }



  async Refrescar() {
    this.getCurrentPrices()
      setInterval(() => {
      this.getCurrentPrices()
      }, 60000);
  }

  calcularPrecioEnMoneda(moneda: string) {
    this.preuTotal = 200;
    switch (moneda) {
      case 'euros':
        return this.preuTotal + '€';
      case 'bitcoin':
        if (this.pricebit) {
          const precioEnBitcoin = this.preuTotal / this.pricebit;
          return precioEnBitcoin.toFixed(8) + ' BTC';
        } else {
          return 'Precio de Bitcoin no disponible';
        }
      case 'bnb':
        if (this.pricebnb) {
          const precioEnBNB = this.preuTotal / this.pricebnb;
          return precioEnBNB.toFixed(8) + ' BNB';
        } else {
          return 'Precio de BNB no disponible';
        }
      default:
        return 'Moneda no válida';
    }
  }

}
