import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class CommentPage implements OnInit {
  producto: any = null;
  comentario: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.cargarProducto();
  }

  ionViewWillEnter() {
    this.cargarProducto();
  }

  cargarProducto() {
    const productoSeleccionado = localStorage.getItem('comentarioProductoSeleccionado');
    if (!productoSeleccionado) {
      this.regresarAlCatalogo();
      return;
    }

    this.producto = JSON.parse(productoSeleccionado);
    this.cargarComentarioGuardado();
  }

  cargarComentarioGuardado() {
    const comentariosAlmacenados = localStorage.getItem('comentariosProductos');
    if (comentariosAlmacenados) {
      try {
        const comentarios = JSON.parse(comentariosAlmacenados) || {};
        this.comentario = comentarios[this.producto.id] || '';
      } catch {
        this.comentario = '';
      }
    } else {
      this.comentario = '';
    }
  }

  guardarComentario() {
    if (!this.producto) {
      return;
    }

    const comentariosAlmacenados = localStorage.getItem('comentariosProductos');
    let comentarios: { [key: string]: string } = {};
    if (comentariosAlmacenados) {
      try {
        comentarios = JSON.parse(comentariosAlmacenados) || {};
      } catch {
        comentarios = {};
      }
    }

    if (this.comentario.trim()) {
      comentarios[this.producto.id] = this.comentario.trim();
    } else {
      delete comentarios[this.producto.id];
    }

    localStorage.setItem('comentariosProductos', JSON.stringify(comentarios));
    this.regresarAlCatalogo();
  }

  cancelar() {
    this.regresarAlCatalogo();
  }

  private regresarAlCatalogo() {
    const categoriaId = this.route.snapshot.queryParamMap.get('categoriaId');
    const ruta = categoriaId ? ['/tabs/tab2', categoriaId] : ['/tabs/tab2'];
    this.router.navigate(ruta);
  }

  onComentarioChange(event: any) {
  this.comentario = event.detail.value; // ← aquí sí funciona
  console.log('Comentario actualizado:', this.comentario);
  }
}
