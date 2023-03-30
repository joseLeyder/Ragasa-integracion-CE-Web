import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SincronizacionEditComponent } from './sincronizacion-edit.component';

describe('SincronizacionEditComponent', () => {
  let component: SincronizacionEditComponent;
  let fixture: ComponentFixture<SincronizacionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SincronizacionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SincronizacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
