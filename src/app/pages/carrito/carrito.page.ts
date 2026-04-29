import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito-model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CurrencyPipe]
})
export class CarritoPage implements OnInit {
  items: CarritoItem[] = [];
  total = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    // Suscribirse al observable del servicio
    this.carritoService.items$.subscribe(items => {
      this.items = items;
      this.total = this.carritoService.total();
      console.log('Carrito actualizado:', this.items, 'Total:', this.total);
    });
  }

  quitar(productoId: number) {
    this.carritoService.quitarProducto(productoId);
  }

  limpiar() {
    this.carritoService.limpiarCarrito();
  }
}
