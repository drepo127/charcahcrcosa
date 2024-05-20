import { Component, OnInit } from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ProductosService } from '../productos.service';
import {HttpClient} from "@angular/common/http";
import {NgbProgressbarConfig, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {Producte} from "../producte.model";
import {Cistella} from "../cistella.model";
import {Filtro} from "../filtro.model";
import {response} from "express";



interface Producto {
  prodName: string;
  prodPreu: number;
  cantidadProducto: number;
  rutaImagen: String;
}

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgbProgressbarModule,
    NgForOf
  ],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css',
  providers: [NgbProgressbarConfig]
})

export class TiendaComponent implements OnInit{
  isLoggedIn: boolean | null = false;
  mostrarropa: boolean = false;
  mostrarcomida: boolean = false;
  cantidadProducto: number = 1;
  productos: Producto[][] = [];
  storedNom: string | null;
  productosArray: Producte[] = [];
  filtroProductoArray: Filtro[] = [];
  productosFiltrados: Producte[] = [];
  precioEcerium: number = 0;
  tipoMoneda: String = "ethereum"



  constructor(private productosService: ProductosService,config: NgbProgressbarConfig , private http: HttpClient) {
    this.storedNom = sessionStorage.getItem('username');
    //---------------- PROGRESS BAR CONFIG ----------------
    config.height = '10px';
    config.type = 'linear';
    config.striped = true;
    config.animated = true;
    //-------------------------------------------------------

    this.getProductes();
    this.obtenerCriptomoneda();
  }
  getFiltro(productosArray: Producte[]){
    for (const producto of productosArray) {
      if (producto.tipo_producto && !this.filtroProductoArray.map(filtro => filtro.nombre_filtro).includes(producto.tipo_producto)) {
        let filtro = new Filtro(producto.tipo_producto, false);
        this.filtroProductoArray.push(filtro);
      }
    }
    this.aplicarFiltro();
  }

  // selecionarTipoMoneda(tipoMonedaEscogida : string){
  //   this.tipoMoneda = tipoMonedaEscogida;
  //   this.obtenerCriptomoneda();
  //   this.getProductes();
  //
  // }
  obtenerCriptomoneda(){
    let promesaDelPrecioETH = new Promise (async (resolve, reject) => {
      this.http.get<any>(`https://api.coingecko.com/api/v3/simple/price?ids=${this.tipoMoneda}&vs_currencies=eur`).subscribe(data => {
        resolve(data.ethereum.eur);
        reject(0);
      })
    })
    return promesaDelPrecioETH;
  }
  async getProductes(){
    await this.obtenerCriptomoneda()
      .then((result) =>{
        if (typeof result === "number") {
          this.precioEcerium = result;
        }
      })
     .catch((error) =>{
        console.log(error);
      })

    this.http.get<Producte[]>('http://localhost:3080/obtenirProductes').subscribe((productes) =>{
      productes.forEach((producte) =>{
        let imagenUrl = "http://localhost:3080/assets/"+producte.imagen_producto;
        console.log(imagenUrl);
        let Descuento = (producte.cantidad_descuento * producte.precio_producto)/100;
        let precioConDescuento = producte.precio_producto - Descuento;

        let precioAEth =  this.precioEcerium * precioConDescuento;

        console.log(precioAEth, precioConDescuento)
        let producto = new Producte(
          producte.id_producto,
          producte.nombre_producto,
          producte.descripcion_producto, producte.cantidad,
          precioAEth, producte.cantidad_descuento,
          imagenUrl, producte.tipo_producto,
          0);

        this.productosArray.push(producto);
      })
      this.getFiltro(this.productosArray);
    })
  }
  aplicarFiltro() {
    let todosFalse = true; // Flag para verificar si todos los filtros están apagados
    let productosFiltradosTemp : Producte[] = []; // Array temporal para almacenar los productos filtrados

    // Iteramos sobre cada filtro
    for (const filtro of this.filtroProductoArray) {
      // Si encontramos un filtro encendido, cambiamos la bandera y salimos del bucle
      if (filtro.filtro_encendido) {
        todosFalse = false;
        break;
      }
    }

    // Si todos los filtros están apagados, añadimos todos los productos
    if (todosFalse) {
      productosFiltradosTemp = this.productosArray.slice();
    } else {
      // Si no, aplicamos los filtros encendidos
      for (const filtro of this.filtroProductoArray) {
        if (filtro.filtro_encendido) {
          const productosFiltroActual = this.productosArray.filter(producto => producto.tipo_producto === filtro.nombre_filtro);
          productosFiltradosTemp = productosFiltradosTemp.concat(productosFiltroActual);
        }
      }
    }

    // Asignamos el resultado final a this.productosFiltrados
    this.productosFiltrados = productosFiltradosTemp;
  }

    setProductoCesta(id_producto_cistella: number, usuari_afegit: string | null, nom_producte: string, cantitat: number, preu_unitat: number, imagen_producto: any, stock: number, desc_producto: number){
      if (cantitat <= 0){
        alert("No pots agregar 0 productes")
      }else {
        if (cantitat > stock){
          alert("No pots agregar mes productes dels que tenim")
        }else {
          console.log(imagen_producto)
          this.http.post('http://localhost:3080/setProducteCarrito', {id_producto_cistella: id_producto_cistella, usuari_afegit: usuari_afegit, nom_producte: nom_producte, cantitat: cantitat, preu_unitat: preu_unitat, imagen_producto: imagen_producto, descuento_producto: desc_producto}).subscribe(
          )
          this.openPopup()
        }
      }
  }
  showPopup = false;

  value = 0;
  private timer: any;

  ngOnInit() {
    this.productosService.productos$.subscribe(productos => {
      this.productos = productos;
    });
    const isLoggedInString = sessionStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;

  }
  errorMsg(){
    window.alert("Has d'iniciar sessio per afegir productes a la cesta!")
  }

  // comprar(prodName: string, prodPreu: number, cantidadProducto: number, rutaImagen: string) {
  //   this.openPopup()
  //   switch (prodName) {
  //     case 'Camiseta do Peixelagarto':
  //       cantidadProducto = this.cantidadProducto1
  //       break;
  //     case 'Vi do Peixelagarto':
  //       cantidadProducto = this.cantidadProducto2
  //       break;
  //     case 'Mitjó do Peixelagarto':
  //       cantidadProducto = this.cantidadProducto3
  //       break;
  //     case 'Motxilla do Peixelagarto':
  //       cantidadProducto = this.cantidadProducto4
  //       break;
  //     case 'Galetes do Sapo':
  //       cantidadProducto = this.cantidadProducto5
  //       break;
  //     case 'Comida do Ranas':
  //       cantidadProducto = this.cantidadProducto6
  //       break;
  //   }
  //
  //   const nuevoProducto: Producto = { prodName, prodPreu, cantidadProducto, rutaImagen };
  //
  //   // Verifica si ya existe un array para este producto
  //   const index = this.productos.findIndex(arr => arr.some(item => item.prodName === prodName));
  //
  //   if (index !== -1) {
  //     // Ya existe un array para este producto, encuentra el producto y suma la cantidad
  //     const productoExistenteIndex = this.productos[index].findIndex(item => item.prodName === prodName);
  //
  //     if (productoExistenteIndex !== -1) {
  //       // Producto existente, suma la cantidad
  //       this.productos[index][productoExistenteIndex].cantidadProducto += cantidadProducto;
  //     } else {
  //       // Producto no encontrado en el array existente, agrega el nuevo producto
  //       this.productos[index].push(nuevoProducto);
  //       this.productosService.actualizarProductos(this.productos);
  //     }
  //   } else {
  //     // No existe un array para este producto, crea un nuevo array con el nuevo producto
  //     this.productos.push([nuevoProducto]);
  //     this.productosService.actualizarProductos(this.productos);
  //   }
  //   console.log(this.productos)
  //   this.logsComprar(nuevoProducto)
  // }
  openPopup() {
    this.showPopup = true;
    this.value = 0; // Reset the progress bar value
    this.timer = setInterval(() => {
      this.value = Math.min(this.value + 2, 140);
      if (this.value === 140) {
        this.closePopup(); // Close the popup when the progress bar reaches 100%
      }
    }, 40);
  }

  closePopup() {
    clearInterval(this.timer);
    this.showPopup = false;
    this.value = 0;
    window.location.reload();
  }
  logsComprar(nuevoProducto: Producto) {

    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: `Ha añadido a la cesta  ${nuevoProducto.cantidadProducto} de ${nuevoProducto.prodName}`, data: data }, { responseType: 'text' }).subscribe({});
  }


}
