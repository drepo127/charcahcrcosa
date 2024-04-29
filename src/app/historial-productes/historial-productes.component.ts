
import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import { NgFor } from '@angular/common';
import {Productesvenuts} from "../productesvenuts.model";


@Component({
  selector: 'app-historial-productes',
  standalone: true,
  imports: [
    RouterLink,
    NgFor
  ],
  templateUrl: './historial-productes.component.html',
  styleUrl: './historial-productes.component.css'
})
export class HistorialProductesComponent {
  historialProductos: Productesvenuts[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    // Realizar la solicitud HTTP para obtener el historial de productos
    this.http.get<Productesvenuts[]>('http://localhost:3080/historial').subscribe({
      next: data => {
        // Asignar los datos obtenidos a la variable historialProductos
        this.historialProductos = data;
      },
      error: err => {
        console.error('Error al obtener el historial de productos:', err);
      }
    });
  }
}
