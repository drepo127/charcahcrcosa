import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-contrasenya',
  standalone: true,
  imports: [RouterLink,
    CommonModule,HttpClientModule ],
  templateUrl: './contrasenya.component.html',
  styleUrl: './contrasenya.component.css'
})
export class ContrasenyaComponent {
  constructor(private http: HttpClient) {
  }
  ngOnInit(){
  }

  mail() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    if (!email) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Validar formato de correo electrónico
    if (email.indexOf('@') === -1) {
      alert('Por favor, ingresa un correo electrónico válido');
      return;
    }

    const dominiosPermitidos = ['@gmail.com', '@outlook.com', '@hotmail.com', '@yahoo.com', '@aol.com', '@icloud.com', '@comcast.net', '@verizon.net', '@cox.net','@institutvidreres.cat','@gmail.es','gmail.cat']; // Añadir más dominios si es necesario
    const dominioValido = dominiosPermitidos.some(dominio => email.endsWith(dominio));

    if (!dominioValido) {
      alert('Solo se permiten direcciones de correo electrónico de dominios especificados: Gmail, Outlook/Hotmail, Yahoo, AOL, iCloud, y proveedores de internet específicos.');
      return;
    }
    localStorage.setItem('emailRecuperacio', email)
    this.http.post<any>('http://localhost:3080/mail', {mail:email}).subscribe(() => {
      console.log('Correo enviado correctamente');
    }, error => {
      console.error('Error al enviar el correo:', error);
    });
    // Validar si algún campo está vacío

    alert("T'hem enviat un link de recuperacio al teu correu! pots tancar aquesta pagina.")

  }
}
