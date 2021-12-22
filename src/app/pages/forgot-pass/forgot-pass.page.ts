import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {

  email: string;
  constructor(
    private router: Router,
    private toaster: ToastController,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController) { }
  buttonName = "Continue";
  title = 'Forgot Password';
  primaryBtnText = "Continue";
  ngOnInit() {
  }

  async resetPassword() {
    if (this.email) {
      const loading = await this.loadingCtrl.create({
        message: 'Sending reset password link..',
        spinner: 'crescent',
        showBackdrop: true
      });
      loading.present();

      this.afauth.sendPasswordResetEmail(this.email)
        .then(() => {
          loading.dismiss();
          this.router.navigate(['/fg-mail']);
        })
        .catch((error) => {
          loading.dismiss();
          this.toast(error.message, 'danger');
        })
    } else {
      this.toast('Please enter your email address', 'danger')
    }
  }
  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      color: status,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  login() {
    this.router.navigate(['login']);

  }

  fg_pass_mailed() {
    this.router.navigate(['fg-mail']);
  }

  backBtnTo() {
    this.router.navigate(['login']);
  }


}
