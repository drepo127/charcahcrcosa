import { Component } from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-validacion',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './validacion.component.html',
  styleUrl: './validacion.component.css'
})
export class ValidacionComponent {

  constructor(private http: HttpClient) {
  }


  asignaricrear() {
    const usuarioData = {
      user: localStorage.getItem('nomvali') || "", // Obtener el valor de 'nomvali' desde localStorage
      email: localStorage.getItem('emailvali') || "", // Obtener el valor de 'emailvali' desde localStorage
      contrasenya: localStorage.getItem('contrasenyavali') || "", // Obtener el valor de 'contrasenyavali' desde localStorage
      nombre: "nombre",
      apellido: "apellido",
      descripcion: "descripcion",
      tel: "999999999",
    };

    this.http.post<any>("http://localhost:3080/registroUsuario", usuarioData).subscribe(() => {
      alert("Usuario registrado correctamente");
      // Redirigir después de que el usuario se haya registrado correctamente
      // Borrar los valores del localStorage después de enviar los datos
      localStorage.removeItem('nomvali');
      localStorage.removeItem('emailvali');
      localStorage.removeItem('contrasenyavali');
    }, error => {
      alert("No se a podido registrar")
      console.error("Error al registrar usuario:", error);
    });
    window.location.replace('http://localhost:4200/formulari');
  }
}
