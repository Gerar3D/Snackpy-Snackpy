import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CarritoService } from '../../services/carrito.service';


@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.page.html',
    styleUrls: ['./catalog.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, HttpClientModule, FormsModule]
})
export class CatalogPage implements OnInit {
    productos: any[] = [];
    productosOriginales: any[] = [];
    categoriaId: number | null = null;
    establecimientoSeleccionado: any = null;
    cantidades: { [key: number]: number } = {};
    comentarios: { [key: number]: string } = {};
    terminoBusqueda: string = '';

constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient, 
    private carritoService: CarritoService
) {}

  ngOnInit() {
    // Leer parámetro de ruta
    this.categoriaId = this.route.snapshot.params['id'] || null;
    // Obtener establecimiento seleccionado
    const establecimientoStr = localStorage.getItem('establecimientoSeleccionado');
    if (establecimientoStr) {
      this.establecimientoSeleccionado = JSON.parse(establecimientoStr);
    }

    this.cargarComentarios();

    // Suscribirse a cambios del carrito para actualizar contadores
    this.carritoService.items$.subscribe(items => {
      this.actualizarCantidades(items);
    });

    // Llamar a cargar datos
    this.CargarDatos();
  }

  ionViewWillEnter() {
    this.cargarComentarios();
  }

  CargarDatos() {
    let url = 'http://localhost:5000/api/Productos';
    const params = [];
    if (this.categoriaId) {
      params.push(`categoriaId=${this.categoriaId}`);
    }
    if (this.establecimientoSeleccionado) {
      console.log('Establecimiento seleccionado:', this.establecimientoSeleccionado);
      params.push(`establecimientoId=${this.establecimientoSeleccionado.id}`);
    }
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    console.log('URL de productos:', url);

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        let productosFiltrados = data;

        if (this.establecimientoSeleccionado) {
          productosFiltrados = data.filter((producto) => {
            return (
              producto.establecimientoId === this.establecimientoSeleccionado.id ||
              producto.establecimiento?.id === this.establecimientoSeleccionado.id ||
              producto.socioId === this.establecimientoSeleccionado.socioId ||
              producto.socio?.id === this.establecimientoSeleccionado.socioId
            );
          });
        }

        this.productosOriginales = [...productosFiltrados];
        this.buscarProductos();
        console.log('Productos cargados:', this.productos);
        console.log('Total de productos filtrados:', this.productos.length);
      },
      error: (err) => console.error('Error cargando productos:', err),
    }); 
    }

  buscarProductos() {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      this.productos = [...this.productosOriginales];
    } else {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.productos = this.productosOriginales.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino)
      );
    }
  }

  actualizarCantidades(items: any[]) {
    // Resetear contadores
    this.cantidades = {};
    
    // Actualizar contadores basados en el estado del carrito
    items.forEach(item => {
      this.cantidades[item.productoId] = item.cantidad;
    });

    this.limpiarComentariosSinCantidad();
  }

  cargarComentarios() {
    const comentariosAlmacenados = localStorage.getItem('comentariosProductos');
    if (comentariosAlmacenados) {
      try {
        this.comentarios = JSON.parse(comentariosAlmacenados) || {};
      } catch {
        this.comentarios = {};
      }
    } else {
      this.comentarios = {};
    }
  }

  guardarComentariosEnLocalStorage() {
    localStorage.setItem('comentariosProductos', JSON.stringify(this.comentarios));
  }

  limpiarComentariosSinCantidad() {
    let cambio = false;
    Object.keys(this.comentarios).forEach(key => {
      const productoId = Number(key);
      if (!this.cantidades[productoId] || this.cantidades[productoId] === 0) {
        delete this.comentarios[productoId];
        cambio = true;
      }
    });
    if (cambio) {
      this.guardarComentariosEnLocalStorage();
    }
  }

  productoEnCarrito(productoId: number) {
    return !!this.cantidades[productoId];
  }

  abrirComentarios(producto: any) {
    if (!this.productoEnCarrito(producto.id)) {
      return;
    }
    localStorage.setItem('comentarioProductoSeleccionado', JSON.stringify(producto));
    this.router.navigate(['/tabs/tab2/comment']);
  }

  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
    console.log('Producto agregado al carrito:', producto);
  }

  aumentarCantidad(producto: any) {
    this.agregarAlCarrito(producto);
  }

  disminuirCantidad(productoId: number) {
    if (this.cantidades[productoId] && this.cantidades[productoId] > 0) {
      this.carritoService.quitarProducto(productoId);
      console.log('Producto eliminado del carrito:', productoId);
    }
  }

  goBack() {
    this.router.navigate(['/tabs/tab1']);
  }

}