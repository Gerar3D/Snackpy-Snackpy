import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CarritoItem } from '../models/carrito-model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: CarritoItem[] = [];
  private itemsSubject = new BehaviorSubject<CarritoItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  agregarProducto(producto: any) {
    const existente = this.items.find(p => p.productoId === producto.id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.items.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagenUrl: producto.imagenUrl
      });
    }
    this.itemsSubject.next([...this.items]);
  }

  quitarProducto(productoId: number) {
    const existente = this.items.find(p => p.productoId === productoId);
    if (existente) {
      if (existente.cantidad > 1) {
        existente.cantidad--;
      } else {
        this.items = this.items.filter(p => p.productoId !== productoId);
      }
    }
    this.itemsSubject.next([...this.items]);
  }

  limpiarCarrito() {
    this.items = [];
    this.itemsSubject.next([]);
  }

  total() {
    return this.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

      // Actualizar items (ej. cuando cambias cantidad desde la página)
  actualizarItems(items: CarritoItem[]) {
    this.items = items;
    this.itemsSubject.next([...this.items]);
  }
}
