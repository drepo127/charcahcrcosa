import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import { NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-inici',
  standalone: true,
  imports: [],
  templateUrl: './inici.component.html',
  styleUrl: './inici.component.css'
})
export class IniciComponent implements OnInit {
  storedEmail: string | null = null;
  storedContrasenya: string | null = null;
  contacte = false
  private offcanvasService = inject(NgbOffcanvas);

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end'}).result.then(
    );
  }



  ngOnInit() {
    // Obtener los datos almacenados en localStorage
    this.storedEmail = localStorage.getItem('email');
    this.storedContrasenya = localStorage.getItem('contrasenya');

    // Puedes hacer lo que necesites con los datos aquí
    if (this.storedEmail && this.storedContrasenya) {
      console.log('Datos almacenados:', this.storedEmail, this.storedContrasenya);
    }
  }
}
