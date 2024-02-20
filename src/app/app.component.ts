import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {IniciComponent} from "./inici/inici.component";
import {MenuComponent} from "./menu/menu.component";
import {FooterComponent} from "./footer/footer.component";
import {filter} from "rxjs";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IniciComponent, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  mostrarMenuYFooter: boolean = true;
  title = 'Git-NF1-LaCharcadelPejelagarto';
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Escucha los cambios de navegación para determinar si estás en la página de contacto
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.mostrarMenuYFooter = !this.router.url.includes('/404');
      }
    });
  }

  shouldShowFooter(): boolean {
    return !(this.router.url.includes('/contacte'));
  }
  shouldShowMenuAndFooter(): boolean {
    return this.mostrarMenuYFooter;
  }
  nom = "";
  contrasenya = "";
}
