import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { CommonModule } from '@angular/common';
import {ProductosService} from "../productos.service";
import {HttpClient} from "@angular/common/http";
import {HttpClientModule} from "@angular/common/http";

// @ts-ignore
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  storedNom: string | null = null;
  storedId: string | null = null;
  isLoggedIn: boolean | null = false;
  isAdmin: boolean | null = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.storedId = sessionStorage.getItem('usercorreo');
    this.storedNom = sessionStorage.getItem('username');
    const isLoggedInString = sessionStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;
    this.isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;

    const isAdminString = sessionStorage.getItem('isAdmin');
    this.isAdmin = isAdminString ? JSON.parse(isAdminString) : false;
  }

   // constructor(private  http: HttpClient) {}
  clearLogInData() {

    sessionStorage.setItem('usercorreo', '');
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('isLoggedIn', 'false');
    window.location.replace('http://localhost:4200/inici')
  }

  // //logs per a les pagines cambiar nom de pagina per a cada pagina.
  logsInici() {
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: "Ir a pagina Inici", data: data }, { responseType: 'text' }).subscribe({});
  }

  logstenda(){
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: "Ir a pagina tenda", data: data }, { responseType: 'text' }).subscribe({});
  }
  logsCesta(){
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: "Ir a pagina cesta", data: data }, { responseType: 'text' }).subscribe({});
  }
  logsCondicions(){
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: "Ir a pagina condicions", data: data }, { responseType: 'text' }).subscribe({});
  }
  logsContacte(){
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: "Ir a pagina contacte", data: data }, { responseType: 'text' }).subscribe({});
  }
  logsPerfil(){
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: "Ir a pagina Perfil", data: data }, { responseType: 'text' }).subscribe({});
  }
  logsDesloguejar(){
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.storedNom, accion: "S'ha desloguejat", data: data }, { responseType: 'text' }).subscribe({});
  }

}
