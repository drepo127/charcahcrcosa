import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialProductesComponent } from './historial-productes.component';

describe('HistorialProductesComponent', () => {
  let component: HistorialProductesComponent;
  let fixture: ComponentFixture<HistorialProductesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialProductesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialProductesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
