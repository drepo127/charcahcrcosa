import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContrasenyaComponent } from './contrasenya.component';

describe('ContrasenyaComponent', () => {
  let component: ContrasenyaComponent;
  let fixture: ComponentFixture<ContrasenyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContrasenyaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContrasenyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
