import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { CommonModule } from '@angular/common';


// @ts-ignore
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  storedNom: string | null = null;
  storedId: string | null = null;
  isLoggedIn: boolean | null = false;

  ngOnInit() {
    this.storedId = sessionStorage.getItem('usercorreo');
    this.storedNom = sessionStorage.getItem('username');
    const isLoggedInString = sessionStorage.getItem('isLoggedIn');
    this.isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;
  }
  clearLogInData() {

    sessionStorage.setItem('usercorreo', '');
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('isLoggedIn', 'false');
    window.location.replace('http://localhost:4200/inici')
  }
}
