import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrabajoDetallePage } from './trabajo-detalle.page';

describe('TrabajoDetallePage', () => {
  let component: TrabajoDetallePage;
  let fixture: ComponentFixture<TrabajoDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
