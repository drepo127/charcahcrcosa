import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";



@Component({
  selector: 'app-formulari-admin',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './formulari-admin.component.html',
  styleUrl: './formulari-admin.component.css'
})
export class FormulariAdminComponent implements  OnInit{
  mensaje: string = '';
  isAdmin: boolean = false;

    nombre_producto: string = "";
    precio_producto: number =  0;
    descripcion_producto: string = '';
    cantidad: number = 0;
    cantidad_descuento: number = 0;
    tipo_producto: string = '';
    imagen_producto: string = '';
    storedNom: string | null;
  constructor(private router: Router, private http: HttpClient) {
    this.storedNom = sessionStorage.getItem('username');
    this.mirarUser();
  }

  mirarUser(){
    if (this.storedNom !== "joeljoel"){
      window.location.replace('http://localhost:4200/inici')
    }
  }

  ngOnInit(): void {
    const isAdminString = sessionStorage.getItem('isAdmin');
    this.isAdmin = isAdminString ? JSON.parse(isAdminString) : false;

    if (!this.isAdmin) {
      alert('No tienes permisos para acceder a esta página.');
      this.router.navigate(['/']).then(r => this );
    }
  }




  agregarProducto() {
    this.http.post<any>('http://192.168.1.2:3080/api/agregar-producto',{ nombre_producto: this.nombre_producto, descripcion_producto: this.descripcion_producto, cantidad: this.cantidad,cantidad_descuento: this.cantidad_descuento, precio_producto: this.precio_producto, imagen_producto: this.imagen_producto, tipo_producto: this.tipo_producto }).subscribe({
        next: response => {
          console.log(response);
          console.log('Producto creado con éxito');
        },
        error: err => {
          if (err.error instanceof ErrorEvent) {
            console.error('Error en el cliente:', err.error.message);
          } else {
            console.error('Error en el servidor:', err);
            console.error('Mensaje de error:', err.error.error);
          }
        }
      });

  }
}
