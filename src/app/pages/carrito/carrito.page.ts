import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito-model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CarritoPage implements OnInit {
  items: CarritoItem[] = [];
  total = 0;
  
  // Nueva lógica
  tipoEntrega: string = 'envio';   // por defecto "Enviar"
  direccionEnvio: string = '';
  precioEnvio: number = 50;        // costo fijo de envío (puedes ajustarlo)


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

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              disminuirCantidad(index: number) {
    if (this.items[index].cantidad > 1) {
      this.items[index].cantidad--;
      this.carritoService.actualizarItems(this.items);
    }
  }

    // Métodos para manipular cantidades
  aumentarCantidad(index: number) {
    this.items[index].cantidad++;
    this.carritoService.actualizarItems(this.items);
  }

  eliminarProducto(productoId: number) {
    this.carritoService.quitarProducto(productoId);
  }


}
