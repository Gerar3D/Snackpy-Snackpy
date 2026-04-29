import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule]
})
export class HomePage {
  categorias: any[] = [];
  establecimientoSeleccionado: any = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Obtener establecimiento seleccionado
    const establecimientoStr = localStorage.getItem('establecimientoSeleccionado');
    if (establecimientoStr) {
      this.establecimientoSeleccionado = JSON.parse(establecimientoStr);
    } else {
      // Si no hay establecimiento, redirigir a selección
      this.router.navigate(['/seleccion-establecimiento']);
      return;
    }
    this.LoadCategorias();
  }

    LoadCategorias() {
    const establecimientoId = this.establecimientoSeleccionado?.id;
    const categoriasUrl = `http://localhost:5000/api/Categorias${establecimientoId ? `?establecimientoId=${establecimientoId}` : ''}`;
    const productosUrl = `http://localhost:5000/api/Productos/establecimiento/${establecimientoId}`;

    forkJoin({
      categorias: this.http.get<any[]>(categoriasUrl),
      productos: this.http.get<any[]>(productosUrl),
    }).subscribe({
      next: ({ categorias, productos }) => {
        const categoriaIdsConProductos = new Set(
          productos
            .map((producto) => producto.categoriaId ?? producto.categoria?.id)
            .filter((id) => id != null)
            .map((id) => String(id)),
        );

        this.categorias = categorias.filter((categoria) => categoriaIdsConProductos.has(String(categoria.id)));

        console.log('Categorías cargadas:', this.categorias);
        console.log('Productos cargados para establecimiento:', productos.length);
      },
      error: (err) => {
        console.error('Error al cargar categorías o productos:', err);
      },
    });
  }

  goToCategoria(id: number) {
    console.log('Click detectado en categoría:', id);
    this.router.navigate(['/tabs/tab2', id]);
  }

  goToCarrito() {
  console.log('Click en carrito');
  this.router.navigate(['/tabs/tab4']); // 👈 cuando tengamos tab4 (Carrito)
}

  goBack() {
    this.router.navigate(['/seleccion-establecimiento']);
  }
}
