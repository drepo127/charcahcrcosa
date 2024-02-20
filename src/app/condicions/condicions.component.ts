import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import {FooterComponent} from "../footer/footer.component";
@Component({
  selector: 'app-condicions',
  standalone: true,
  imports: [
    MenuComponent,
    FooterComponent
  ],
  templateUrl: './condicions.component.html',
  styleUrl: './condicions.component.css'
})
export class CondicionsComponent {

}
