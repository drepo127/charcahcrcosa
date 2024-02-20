import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {MenuComponent} from "../menu/menu.component";
import {FooterComponent} from "../footer/footer.component";
import {CheckboxModule} from "primeng/checkbox";
import {StyleClassModule} from 'primeng/styleclass';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";


interface Usuario {
  nom: string;
  email: string;
  contrasenya: string;
}

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [
    MenuComponent,
    FooterComponent,
    CheckboxModule,
    RouterLink,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './registre.component.html',
  styleUrl: './registre.component.css'
})


export class RegistreComponent {
  registrarUsuario() {
    const nom = (document.getElementById('nom') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const contrasenya = (document.getElementById('contrasenya') as HTMLInputElement).value;


    // Validar si algún campo está vacío
    if (!nom || !email || !contrasenya) {
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

    //De la otra paractica localStorage
  //   const usuariosRegistrados: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
  //
  //   // Verificar si el nombre de usuario o el correo electrónico ya existen
  //   if (usuariosRegistrados.some((user: Usuario) => user.nom === nom || user.email === email)) {
  //     alert('El correo electrónico ya está registrado!');
  //     return;
  //   }
  //
  //   // Guardar el nuevo usuario en la lista de usuarios registrados
  //   const nuevoUsuario: Usuario = {nom, email, contrasenya};
  //   usuariosRegistrados.push(nuevoUsuario);

    const nuevoUsuario: Usuario = {nom, email, contrasenya};
    this.getmail(nuevoUsuario)
  }

  constructor(private http: HttpClient) {
  }

    mail(nuevoUsuario: Usuario) {
        const correo = (document.getElementById('email') as HTMLInputElement).value;

        // Verificar si ya se ha enviado el correo de verificación
        console.log('Correo enviado correctamente');
        localStorage.setItem('nomvali', nuevoUsuario.nom);
        localStorage.setItem('emailvali', nuevoUsuario.email);
        localStorage.setItem('contrasenyavali', nuevoUsuario.contrasenya);
        console.log(nuevoUsuario.nom, nuevoUsuario.email, nuevoUsuario.contrasenya)
        // Hacer la llamada HTTP para enviar el correo de verificación solo si no se ha enviado previamente
        this.http.post<any>('http://localhost:3080/mailberificacion', { mail: correo }).subscribe(() => {
            alert("Correo de verificación enviado. Por favor, verifica tu correo electrónico antes de continuar.");
        }, error => {
            console.error('Error al enviar el correo:', error);
        });
    }

  // crearUser(nuevoUsuario: Usuario) {
  //     const usuarioData = {
  //         user: nuevoUsuario.nom,
  //         email: nuevoUsuario.email,
  //         contrasenya: nuevoUsuario.contrasenya,
  //         nombre: "nombre",
  //         apellido: "apellido",
  //         descripcion: "descripcion",
  //         tel: "999999999",
  //     };
  //     this.http.post<any>("http://localhost:3080/registroUsuario", usuarioData).subscribe(() => {
  //         console.log("Usuario registrado correctamente");
  //         // Redirigir después de que el usuario se haya registrado correctamente
  //         window.location.replace('http://localhost:4200/formulari');
  //     }, error => {
  //         console.error("Error al registrar usuario:", error);
  //       window.location.reload()
  //     });
  // }

  correos = null;
  getmail(nuevoUsuario: Usuario) {
    this.http.get<any>('http://localhost:3080/gmailuser').subscribe((mail) => {
      this.correos = mail; // Asignar el valor de los correos a la variable de clase
      console.log(mail);

      // Comprobar si el correo ya está registrado
      if (mail.includes(nuevoUsuario.email)) {
        alert('El correo ' + nuevoUsuario.email + ' ya está registrado, prueva con otro');
        window.location.reload()
        // No hacer nada más si el correo ya está registrado
      } else {
        // Si el correo no está registrado, crear el nuevo usuario
        this.mail(nuevoUsuario);
        alert('Verifica el correo');
      }
    });
  }


}

