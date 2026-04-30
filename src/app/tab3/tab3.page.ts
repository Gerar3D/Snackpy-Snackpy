import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonTextarea, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonTextarea, IonGrid, IonRow, IonCol],
})
export class Tab3Page implements OnInit {
  perfil = {
    nombre: '',
    calle: '',
    numExt: '',
    numInt: '',
    colonia: '',
    cp: '',
    delegacion: '',
    pais: 'México',
    telefono: '',
    notas: ''
  };
  enEdicion = false;
  cargandoDatos = false;

  constructor(private toastController: ToastController, private http: HttpClient) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  ionViewWillEnter() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const perfilGuardado = localStorage.getItem('perfilUsuario');
    if (perfilGuardado) {
      try {
        this.perfil = JSON.parse(perfilGuardado);
        // Asegurar que pais siempre tenga un valor por defecto
        if (!this.perfil.pais) {
          this.perfil.pais = 'México';
        }
      } catch {
        this.perfil = {
          nombre: '',
          calle: '',
          numExt: '',
          numInt: '',
          colonia: '',
          cp: '',
          delegacion: '',
          pais: 'México',
          telefono: '',
          notas: ''
        };
      }
    }
  }

  async buscarDatosPorCP() {
    if (!this.perfil.cp || this.perfil.cp.length < 5) {
      return;
    }

    this.cargandoDatos = true;
    try {
      // Intentar con API de códigos postales de México
      const response = await this.http.get<any>(`https://api.copomex.com/query/info_cp/${this.perfil.cp}?token=test`).toPromise();
      
      if (response && response.response) {
        const datos = response.response[0];
        this.perfil.colonia = datos.asentamiento || '';
        this.perfil.delegacion = datos.municipio || '';
        this.perfil.pais = 'México';
      }
    } catch (error) {
      console.log('No se encontraron datos para este CP');
    } finally {
      this.cargandoDatos = false;
    }
  }

  toggleEdicion() {
    this.enEdicion = !this.enEdicion;
  }

  async guardarPerfil() {
    localStorage.setItem('perfilUsuario', JSON.stringify(this.perfil));
    this.enEdicion = false;
    
    const toast = await this.toastController.create({
      message: 'Perfil guardado con éxito',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}
