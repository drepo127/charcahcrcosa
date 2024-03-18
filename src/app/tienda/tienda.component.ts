import { Component, OnInit } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ProductosService } from '../productos.service';
import {HttpClient} from "@angular/common/http";


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
    NgIf
  ],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})

export class TiendaComponent implements OnInit{
  isLoggedIn: boolean | null = false;
  mostrarropa: boolean = true;
  mostrarcomida: boolean = true;
  cantidadProducto1: number = 1;
  cantidadProducto2: number = 1;
  cantidadProducto3: number = 1;
  cantidadProducto4: number = 1;
  cantidadProducto5: number = 1;
  cantidadProducto6: number = 1;
  productos: Producto[][] = [];
  private storedNom: string | null;

  constructor(private productosService: ProductosService, private http: HttpClient) {
    this.storedNom = sessionStorage.getItem('username');
  }

  ngOnInit() {
    this.productosService.productos$.subscribe(productos => {
      this.productos = productos;
    });
    const isLoggedInString = localStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;
  }
  errorMsg(){
    window.alert("Has d'iniciar sessio per afegir productes a la cesta!")
  }
  filtrar() {
    this.mostrarropa = true
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    // Obtener los checkboxes marcados
    const checkboxes = document.querySelectorAll('.check_filtro:checked');

    // Verificar si hay algún checkbox marcado
    if (checkboxes.length === 0) {
      this.noSelecionado();  // Llamada a la función para la opción por defecto
    } else {
      // Establecer todas las variables en false
      this.mostrarropa = false;
      this.mostrarcomida = false;

      // Iterar sobre los checkboxes y ejecutar las funciones correspondientes
      checkboxes.forEach((checkbox: any) => {
        switch (checkbox.value) {
          case 'roba':
            this.mostrarropa = true
            if (!this.isLoggedIn ){
              this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion:"Se esta filtrando ropa", data: data }, { responseType: 'text' }).subscribe({});
            }

            break;
          case 'alimentacio':
            this.mostrarcomida = true
            if (!this.isLoggedIn) {
            this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion:"Se esta filtrando Alimentos", data: data }, { responseType: 'text' }).subscribe({});
            }
            break;
          // Agregar más casos según sea necesario
        }
      });
    }
  }
  noSelecionado() {
    // Lógica para manejar la opción por defecto cuando no hay checkboxes marcados
    this.mostrarropa = true
    this.mostrarcomida = true
    if (!this.isLoggedIn) {
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion:"no se esta filtrando nada", data: data }, { responseType: 'text' }).subscribe({});}
  }



  comprar(prodName: string, prodPreu: number, cantidadProducto: number, rutaImagen: string) {
    switch (prodName) {
      case 'Camiseta do Peixelagarto':
        cantidadProducto = this.cantidadProducto1
        break;
      case 'Vi do Peixelagarto':
        cantidadProducto = this.cantidadProducto2
        break;
      case 'Mitjó do Peixelagarto':
        cantidadProducto = this.cantidadProducto3
        break;
      case 'Motxilla do Peixelagarto':
        cantidadProducto = this.cantidadProducto4
        break;
      case 'Galetes do Sapo':
        cantidadProducto = this.cantidadProducto5
        break;
      case 'Comida do Ranas':
        cantidadProducto = this.cantidadProducto6
        break;
    }

    const nuevoProducto: Producto = { prodName, prodPreu, cantidadProducto, rutaImagen };

    // Verifica si ya existe un array para este producto
    const index = this.productos.findIndex(arr => arr.some(item => item.prodName === prodName));

    if (index !== -1) {
      // Ya existe un array para este producto, encuentra el producto y suma la cantidad
      const productoExistenteIndex = this.productos[index].findIndex(item => item.prodName === prodName);

      if (productoExistenteIndex !== -1) {
        // Producto existente, suma la cantidad
        this.productos[index][productoExistenteIndex].cantidadProducto += cantidadProducto;
      } else {
        // Producto no encontrado en el array existente, agrega el nuevo producto
        this.productos[index].push(nuevoProducto);
        this.productosService.actualizarProductos(this.productos);
      }
    } else {
      // No existe un array para este producto, crea un nuevo array con el nuevo producto
      this.productos.push([nuevoProducto]);
      this.productosService.actualizarProductos(this.productos);
    }
    console.log(this.productos)
    this.logsComprar(nuevoProducto)
  }
  logsComprar(nuevoProducto: Producto) {

    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: `Ha añadido a la cesta  ${nuevoProducto.cantidadProducto} de ${nuevoProducto.prodName}`, data: data }, { responseType: 'text' }).subscribe({});
  }

}
