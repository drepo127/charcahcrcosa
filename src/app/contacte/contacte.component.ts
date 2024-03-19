import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {RecaptchaModule} from "ng-recaptcha";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-contacte',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    HttpClientModule,
    RecaptchaModule,
    NgIf
  ],
  templateUrl: './contacte.component.html',
  styleUrl: './contacte.component.css'
})
export class ContacteComponent implements OnInit{
  contacte = true
  consulta: string | null = null;
  nombre: string = "anonimo";
  recaptcha: string | null | undefined;

  onResolved(captchaResponse: string | null){
    this.recaptcha = captchaResponse;
    console.log(this.recaptcha);
  }

  constructor(private http: HttpClient) {
  };
  ngOnInit(): void {
  }
    mandarConsulta(): void {
      if (this.consulta === null) {
        alert("Debes de introducir una consulta");
        window.location.reload();
      } else {
            this.http.post<any>('http://localhost:3080/consultes', {nombreConsulta: this.nombre, consulta: this.consulta }).subscribe();
            alert("Gracies per enviar la teva consulta");
            window.location.reload();
      }
    }

}
