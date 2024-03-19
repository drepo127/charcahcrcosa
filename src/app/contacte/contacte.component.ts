import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-contacte',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    HttpClientModule,
    NgbRatingModule
  ],
  templateUrl: './contacte.component.html',
  styleUrl: './contacte.component.css'
})
export class ContacteComponent {
  contacte = true
  consulta: string | null = null;
  nombre: string = "anonimo";
  rating = 5;


  constructor(private http: HttpClient) {};
    mandarConsulta(): void {
      if (this.consulta === null) {
        alert("Debes de introducir una consulta");
        window.location.reload();
      } else {
        this.http.post<any>('http://localhost:3080/consultes', {
          consulta: this.consulta,
          nombreConsulta: this.nombre
        }).subscribe()
        alert("Gracies per enviar la teva consulta")
        window.location.reload();
      }
    }
}
