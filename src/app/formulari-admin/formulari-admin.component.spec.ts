import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariAdminComponent } from './formulari-admin.component';

describe('FormulariAdminComponent', () => {
  let component: FormulariAdminComponent;
  let fixture: ComponentFixture<FormulariAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulariAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormulariAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
