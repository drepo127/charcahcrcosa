import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {FooterComponent} from "../footer/footer.component";
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-condicions',
  standalone: true,
  imports: [
    MenuComponent,
    FooterComponent,
    NgbTimepickerModule,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './condicions.component.html',
  styleUrl: './condicions.component.css'
})
export class CondicionsComponent {
  time = { hour: 13, minute: 30 };
}
