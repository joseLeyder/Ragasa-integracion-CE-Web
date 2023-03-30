import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseraeComponent } from './userae.component';

describe('UseraeComponent', () => {
  let component: UseraeComponent;
  let fixture: ComponentFixture<UseraeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseraeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseraeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
