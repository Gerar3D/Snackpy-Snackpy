import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-seleccion-establecimiento',
  templateUrl: './seleccion-establecimiento.page.html',
  styleUrls: ['./seleccion-establecimiento.page.scss'],
  standalone: true,
  imports: [IonicModule, HttpClientModule]
})
export class SeleccionEstablecimientoPage implements OnInit {
  establecimientos: any[] = [];
  allEstablecimientos: any[] = [];
  private readonly STORAGE_KEY = 'establecimientosAgregados';

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadGuardados();
    this.loadEstablecimientos();
  }

  private loadGuardados() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      this.establecimientos = [];
      return;
    }

    try {
      this.establecimientos = JSON.parse(stored);
    } catch {
      this.establecimientos = [];
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private saveEstablecimientos() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.establecimientos));
  }

  loadEstablecimientos() {
    this.http.get<any[]>('http://localhost:5000/api/Establecimientos')
      .subscribe({
        next: (data) => {
          this.allEstablecimientos = data;
          console.log('Establecimientos cargados:', this.allEstablecimientos);
        },
        error: (err) => {
          console.error('Error al cargar establecimientos:', err);
        }
      });
  }

  async agregarEstablecimiento() {
    const alert = await this.alertController.create({
      header: 'Agregar establecimiento',
      inputs: [
        {
          name: 'id',
          type: 'number',
          placeholder: 'ID del establecimiento'
        },
        {
          name: 'telefono',
          type: 'text',
          placeholder: 'Teléfono del socio'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            return this.agregarEstablecimientoPorId(data.id, data.telefono);
          }
        }
      ]
    });

    await alert.present();
  }

  agregarEstablecimientoPorId(id: string | number, telefono: string): boolean {
    const establecimientoId = Number(id);
    if (!establecimientoId || !telefono) {
      this.mostrarError('Debes ingresar el ID y el teléfono del socio.');
      return false;
    }

    const establecimiento = this.allEstablecimientos.find((item) =>
      item.id === establecimientoId && item.socio?.telefono === telefono
    );

    if (!establecimiento) {
      this.mostrarError('No se encontró un establecimiento con ese ID y teléfono.');
      return false;
    }

    const yaAgregado = this.establecimientos.some((item) => item.id === establecimientoId);
    if (yaAgregado) {
      this.mostrarError('El establecimiento ya está agregado.');
      return false;
    }

    this.establecimientos.push(establecimiento);
    this.saveEstablecimientos();
    this.mostrarToast('Establecimiento agregado correctamente.');
    return true;
  }

  async mostrarToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  async mostrarError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  seleccionarEstablecimiento(establecimiento: any) {
    // Guardar el establecimiento seleccionado, por ejemplo en localStorage o servicio
    localStorage.setItem('establecimientoSeleccionado', JSON.stringify(establecimiento));
    // Navegar a home
    this.router.navigate(['/tabs/tab1']);
  }
}