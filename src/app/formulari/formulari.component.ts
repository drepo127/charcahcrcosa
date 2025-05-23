import {Component} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {FooterComponent} from "../footer/footer.component";
import {CheckboxModule} from "primeng/checkbox";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgbPopoverModule} from "@ng-bootstrap/ng-bootstrap";


interface Usuario {
  loginEmail: string;
  loginContrasenya: string;
}
@Component({
  selector: 'app-formulari',
  standalone: true,
  imports: [
    MenuComponent,
    FooterComponent,
    CheckboxModule,
    RouterLink,
    FormsModule,
    RouterLinkActive,
    HttpClientModule,
    NgbPopoverModule
  ],
  templateUrl: './formulari.component.html',
  styleUrl: './formulari.component.css'
})
export class FormulariComponent {
  isLoggedIn: boolean = false;
  admin: boolean  = false;
  iniciarSesion() {
    // const storedEmail = localStorage.getItem('email');
    // const storedContrasenya = localStorage.getItem('contrasenya');

    const loginEmail = (document.getElementById('loginEmail') as HTMLInputElement).value;
    const loginContrasenya = (document.getElementById('loginContrasenya') as HTMLInputElement).value;

    // Comparar las credenciales ingresadas con las almacenadas
    // if (storedEmail === emailInput.value && storedContrasenya === contrasenyaInput.value) {
    //   console.log('Login successful');
    //   this.isLoggedIn = true;
    // } else {
    //   alert('Invalid email or password');
    // }

    // @ts-ignore
    const nuevoUsuario: Usuario = {loginEmail, loginContrasenya};
    this.login(nuevoUsuario)
  }
  constructor(private http: HttpClient) {
  }

  usercorreo = null;
  username = null;
  login(nuevoUsuario: Usuario) {
    this.http.get<any>('http://localhost:3080/passworduser').subscribe(async (datosuser) => {
      let informacioncoincide = false;
      // @ts-ignore
      this.usercorreo = nuevoUsuario.loginEmail;
      for (let i = 0; i < datosuser.length; i++) {
        if (datosuser[i].email === nuevoUsuario.loginEmail && datosuser[i].contrasenya === nuevoUsuario.loginContrasenya) {
          this.username = datosuser[i].user;
          informacioncoincide = true;
          break;
        }
      }
      if (informacioncoincide) {
        // @ts-ignore
        if (typeof window.ethereum !== "undefined") {
          let logEnMetamasc = new Promise(async (resolve, reject) => {
            // @ts-ignore
            window.ethereum.request({method: 'eth_requestAccounts'}).then((response) => {
              console.log(response);
              resolve(response);
              reject(response);
            });
          });
          await logEnMetamasc
            .then(async () => {

              // @ts-ignore
              sessionStorage.setItem('usercorreo', this.usercorreo);
              // @ts-ignore
              sessionStorage.setItem('username', this.username);
              this.isLoggedIn = true;
              sessionStorage.setItem('isLoggedIn', String(this.isLoggedIn));

              alert('Inicio de sesión correcto');
              this.logsISessio()
              window.location.replace('http://localhost:4200/inici');
            })
            .catch(async (error) => {
              console.log(error);
              alert("No se pudo iniciar sesión o se rechazó la autenticación. Compruebe su conexión a Internet y vuelva a intentarlo.");
            });
        } else {
          alert("MetaMask no esta instalado");
        }
      } else {
        alert('El correo o la contraseña no son correctos');
        this.logsnoSessio()
        window.location.reload();
      }
    }, error => {
      console.error('Error al obtener datos del usuario:', error);
      // Manejar el error apropiadamente, como mostrar un mensaje al usuario o redirigirlo a una página de error.
    });
  }

  logsISessio() {
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.usercorreo, accion: "Ha iniciat sessio", data: data }, { responseType: 'text' }).subscribe({});
  }
  logsnoSessio() {
    const currentDate = new Date();
    const data = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    this.http.post('http://localhost:3080/logs', { user: this.usercorreo, accion: "Ha intentat iniciar sessio", data: data }, { responseType: 'text' }).subscribe({});
  }

}





