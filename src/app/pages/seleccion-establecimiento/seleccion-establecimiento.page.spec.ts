import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionEstablecimientoPage } from './seleccion-establecimiento.page';

describe('SeleccionEstablecimientoPage', () => {
  let component: SeleccionEstablecimientoPage;
  let fixture: ComponentFixture<SeleccionEstablecimientoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionEstablecimientoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionEstablecimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});