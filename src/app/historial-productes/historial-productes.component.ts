
import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import { NgFor } from '@angular/common';
import {Productesvenuts} from "../productesvenuts.model";
import { BscscanService } from '../bscscan.service';



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

  walletAddress: string = "0xa1751878e76B5cFC9B2617C091fCae7892266343";
  transacciones: any[] = [];
  error: any;
  historialProductos: Productesvenuts[] = [];

  storedNom: string | null;
  constructor(private router: Router, private http: HttpClient, private bscscanService: BscscanService) {
    this.storedNom = sessionStorage.getItem('username');
    this.mirarUser();
  }

  mirarUser(){
    if (this.storedNom !== "joeljoel"){
      window.location.replace('http://localhost:4200/inici')
    }
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerTransacciones();
  }

  obtenerProductos(): void {
    // Realizar la solicitud HTTP para obtener el historial de productos
    this.http.get<Productesvenuts[]>('http://192.168.1.2:3080/historial').subscribe({
      next: data => {
        // Asignar los datos obtenidos a la variable historialProductos
        this.historialProductos = data;
      },
      error: err => {
        console.error('Error al obtener el historial de productos:', err);
      }
    });
  }
  obtenerTransacciones(): void {
    this.bscscanService.obtenerHistorialTransacciones(this.walletAddress)
      .subscribe(
        data => {
          if (data.status === '1') {
            this.transacciones = data.result.map((tx: any) => {
              return {
                ...tx,
                timeStamp: this.convertirTimestamp(tx.timeStamp),
                valueBnb: this.convertirWeiABnb(tx.value) // Añadir la conversión de wei a BNB
              };
            });
            this.error = null;
          } else {
            this.error = data.message;
          }
        },
        error => {
          this.error = `Error en la solicitud HTTP: ${error.status}`;
        }
      );
  }


  convertirTimestamp(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  }
  convertirWeiABnb(wei: string): string {
    const weiBN = BigInt(wei);
    const bnb = Number(weiBN) / Math.pow(10, 18);
    return bnb.toFixed(3); // Ajusta el número de decimales según tus necesidades
  }


}
