import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {findServiceAccountEmail} from "firebase-admin/lib/utils";

interface UserData {
  email: string;
  user: string;
  contrasenya: string;
  nombre: string;
  apellido: string;
  descripcion: string;
  tel: string;
  admin: boolean;
}

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css'
})
export class RecuperarComponent {
  // usuari: string | null = null;
  // correuUser: string | null = null;
  contraUser: string | null = null;
  // nomuser: string | null = null;
  // cognomuser: string | null = null;
  // descripciouser: string | null = null;
  // telefonuser: string | null = null;

  mail: string | null = localStorage.getItem('emailRecuperacio')

  constructor(private http: HttpClient) {
  }

  aplicarCambios() {
    this.http.post('http://localhost:3080/contra', {contrasenya: this.contraUser, mail: this.mail}).subscribe()
    alert("La contrasenya s'ha cambiat")
    window.location.replace('http://localhost:4200/inici')
    localStorage.setItem('emailRecuperacio', '')
  }

}
