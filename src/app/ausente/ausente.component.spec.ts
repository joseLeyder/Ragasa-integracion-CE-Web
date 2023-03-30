import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AusenteComponent } from './ausente.component';

describe('AusenteComponent', () => {
  let component: AusenteComponent;
  let fixture: ComponentFixture<AusenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AusenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AusenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
