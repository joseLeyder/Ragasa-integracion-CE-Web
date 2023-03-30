import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasDetalleComponent } from './consultas-detalle.component';

describe('ConsultasDetalleComponent', () => {
  let component: ConsultasDetalleComponent;
  let fixture: ComponentFixture<ConsultasDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultasDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
