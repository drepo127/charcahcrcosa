import {Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ProductosService } from '../productos.service';
import { Producto } from '../productos.service';
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
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
  alerts: Alert[] | undefined;
  close(alert: Alert) {
    // @ts-ignore
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  reset() {
    this.alerts = Array.from(ALERTS);
  }
  constructor(private productosService: ProductosService) {
    this.reset();
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
}
