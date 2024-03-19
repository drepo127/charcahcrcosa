import { Component , OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgbAccordionModule} from "@ng-bootstrap/ng-bootstrap";
interface UserData {
    email: string;
    user: string;
    contrasenya: string;
    nombre: string;
    apellido: string;
    descripcion: string;
    tel: string;
}
@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [
        NgIf,
        HttpClientModule,
        FormsModule,
        NgbAccordionModule
    ],
    templateUrl: './usuario.component.html',
    styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit{
    Info1: boolean = true;
    Info2: boolean = false;
    usuari: string | null = null;
    correuUser: string | null = null;
    contraUser: string | null = null;
    nomuser: string | null = null;
    cognomuser: string | null = null;
    descripciouser: string | null = null;
    telefonuser: string | null = null;

    mostrarInfo2() {
        this.Info1 = false;
        this.Info2 = true;
    }

    mostrarInfo1() {
        this.Info1 = true;
        this.Info2 = false;
    }
    showPassword: boolean = false;

    togglePasswordVisibility() {
        this.showPassword = true;
        setTimeout(() => {
            this.showPassword = false;
        }, 2000); // Cambia este valor (en milisegundos) según lo que prefieras
    }

    constructor(private http: HttpClient) {}

    ngOnInit() {
        const correoUsuario = sessionStorage.getItem('usercorreo');
        if (correoUsuario) {
            this.iniciouse(correoUsuario);
        } else {
            console.error('No se encontró el correo electrónico del usuario en sessionStorage');
        }
    }

    iniciouse(correoUsuario: string) {
        this.http.get<UserData[]>('http://localhost:3080/tadalainfodeluser').subscribe(
            (userData: UserData[]) => {
                const usuarioActual: UserData | undefined = userData.find(user => user.email === correoUsuario);
                if (usuarioActual) {
                    this.usuari = usuarioActual.user;
                    this.correuUser = usuarioActual.email;
                    this.contraUser = usuarioActual.contrasenya;
                    this.nomuser = usuarioActual.nombre;
                    this.cognomuser = usuarioActual.apellido;
                    this.descripciouser = usuarioActual.descripcion;
                    this.telefonuser = usuarioActual.tel;
                } else {
                    console.error('No se encontró información del usuario con el correo electrónico proporcionado');
                }
            },
            (error) => {
                console.error('Error al obtener datos del usuario:', error);
                // Manejar el error apropiadamente, como mostrar un mensaje al usuario o redirigirlo a una página de error.
            }
        );
    }

    aplicarCambios() {
        const correodefull = sessionStorage.getItem('usercorreo')
        this.http.post<any>('http://localhost:3080/modificarUsuario', {
            email: correodefull,
            user: this.usuari,
            contrasenya: this.contraUser,
            nombre: this.nomuser,
            apellido: this.cognomuser,
            descripcion: this.descripciouser,
            tel: this.telefonuser
        }).subscribe(
            (response) => {
                console.log('Información actualizada exitosamente en el servidor:', response);
                alert("Los datos se han cambiado correctamente");
                window.location.reload();
            },
            (error) => {
                console.error('Error al actualizar información en el servidor:', error);
                alert("Hubo un error al intentar aplicar los cambios. Por favor, inténtalo de nuevo más tarde.");
                // Manejar el error apropiadamente, como mostrar un mensaje de error al usuario
            }
        );
    }


}
