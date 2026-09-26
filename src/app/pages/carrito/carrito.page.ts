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
  comentarios: { [productoId: number]: string[] } = {};
  complementos: { [productoId: number]: string[] } = {};
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
      this.cargarComentariosLocales();
      this.cargarComplementosLocales();
      console.log('Carrito actualizado:', this.items, 'Total:', this.total);
    });
  }

    cargarComentariosLocales() {
    const comentariosGuardados = localStorage.getItem('comentariosProductos');
    if (comentariosGuardados) {
      try {
        const comentariosObj = JSON.parse(comentariosGuardados);
        // Convertir a arreglo para compatibilidad con @for
        this.comentarios = Object.keys(comentariosObj).reduce((acc, id) => {
          acc[+id] = [comentariosObj[id]];
          return acc;
        }, {} as { [productoId: number]: string[] });
      } catch {
        this.comentarios = {};
      }
    } else {
      this.comentarios = {};
    }
  }

  cargarComplementosLocales() {
    const complementosGuardados = localStorage.getItem('complementosProductos');
    if (complementosGuardados) {
      try {
        const complementosObj = JSON.parse(complementosGuardados);
        this.complementos = Object.keys(complementosObj).reduce((acc, id) => {
          acc[+id] = [complementosObj[id]];
          return acc;
        }, {} as { [productoId: number]: string[] });
      } catch {
        this.complementos = {};
      }
    } else {
      this.complementos = {};
    }
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
