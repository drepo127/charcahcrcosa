import {Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ProductosService } from '../productos.service';
import { Producto } from '../productos.service';
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-cesta',
  standalone: true,
  imports: [CommonModule,
    NgIf,
    RouterLink, NgOptimizedImage],
  templateUrl: './cesta.component.html',
  styleUrl: './cesta.component.css'
})
export class CestaComponent implements OnInit {
  productos: Producto[][] = [];
  preuTotal = 0;
  isLoggedIn: boolean | null = false;
  user: string | null = null
  private storedNom: string | null;

  constructor(private productosService: ProductosService, private  http: HttpClient) {
    this.storedNom = sessionStorage.getItem('username');
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
