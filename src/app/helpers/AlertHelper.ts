import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastHelperService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, duration: number = 2000, position: 'top' | 'middle' | 'bottom' = 'bottom', color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color
    });
    await toast.present();
  }

  async presentToastWithOptions(options: ToastOptions) {
    const toast = await this.toastController.create(options);
    await toast.present();
  }
}
