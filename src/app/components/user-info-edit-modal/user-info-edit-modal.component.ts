import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-info-edit-modal',
  templateUrl: './user-info-edit-modal.component.html',
  styleUrls: ['./user-info-edit-modal.component.scss'],
})
export class UserInfoEditModalComponent implements OnInit {

  primaryBtnText = "Save";
  name: string;
  email: string;
  userId: string;
  photoUrl: string;

  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.userId = user.userId;
        this.name = user.userName;
        this.email = user.userEmail;
        console.log(this.email);

      }
    })
  }
  async updateProfile() {
    const loading = await this.loadingCtrl.create({
      message: 'Updating...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afs.collection('user').doc(this.userId).set({
      'userName': this.name,
      'userEmail': this.email,
      'editedAt': Date.now()
    }, { merge: true })
      .then(() => {
        loading.dismiss();
        this.toast('Update Successful!!', 'success');
        this.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      })
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      color: status,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

}
