import { Component, EnvironmentInjector, inject } from '@angular/core';
import {  IonTabs, IonIcon, IonTabBar, IonTabButton, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, home, fastFoodOutline, person, cart } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonLabel, IonTabButton, IonTabBar, IonTabs, IonIcon],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({home,fastFoodOutline,person,cart,triangle,ellipse,square});
  }
}
