import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-contacte',
  standalone: true,
    imports: [
        MenuComponent
    ],
  templateUrl: './contacte.component.html',
  styleUrl: './contacte.component.css'
})
export class ContacteComponent {
  contacte = true

}
