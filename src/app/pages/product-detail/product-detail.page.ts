import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class ProductDetailPage implements OnInit {
  producto: any = null;
  complementos = '';
  comentario = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
  ) {}

  ngOnInit() {
    const productoGuardado = localStorage.getItem('productoDetalleSeleccionado');
    if (!productoGuardado) {
      this.regresarAlCatalogo();
      return;
    }

    try {
      this.producto = JSON.parse(productoGuardado);
      this.cargarPersonalizacion();
    } catch {
      this.regresarAlCatalogo();
    }
  }

  cargarPersonalizacion() {
    const complementosGuardados = this.leerMapa('complementosProductos');
    const comentariosGuardados = this.leerMapa('comentariosProductos');
    this.complementos = complementosGuardados[this.producto.id] || '';
    this.comentario = comentariosGuardados[this.producto.id] || '';
  }

  agregarAlCarrito() {
    if (!this.producto) {
      return;
    }

    this.guardarValor('complementosProductos', this.complementos);
    this.guardarValor('comentariosProductos', this.comentario);
    this.carritoService.agregarProducto(this.producto);
    this.regresarAlCatalogo();
  }

  cancelar() {
    this.regresarAlCatalogo();
  }

  private leerMapa(clave: string): { [productoId: string]: string } {
    try {
      return JSON.parse(localStorage.getItem(clave) || '{}') || {};
    } catch {
      return {};
    }
  }

  private guardarValor(clave: string, valor: string) {
    const datos = this.leerMapa(clave);
    const texto = valor.trim();
    if (texto) {
      datos[this.producto.id] = texto;
    } else {
      delete datos[this.producto.id];
    }
    localStorage.setItem(clave, JSON.stringify(datos));
  }

  private regresarAlCatalogo() {
    const categoriaId = this.route.snapshot.queryParamMap.get('categoriaId');
    const ruta = categoriaId ? ['/tabs/tab2', categoriaId] : ['/tabs/tab2'];
    this.router.navigate(ruta);
  }
}