import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/auth';
import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-user-password-change',
  templateUrl: './user-password-change.component.html',
  styleUrls: ['./user-password-change.component.scss'],
})
export class UserPasswordChangeComponent implements OnInit {
  @Input() userMemberName = '';
  primaryBtnText = "Save";

  userId: string;
  user: any;
  newPassword = '';
  userPassword: any;
  itemsRef: AngularFirestoreCollection;
  items: Observable<any[]>;
  constructor(
    private modalCtrl: ModalController,
    private afs: AngularFirestore,
    private auth: AuthService,
    private toastr: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {
    this.itemsRef = db.collection('user')
    this.items = this.itemsRef.valueChanges();
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
      this.userId = user.userId;
      this.userPassword = user.userPassword
      console.log(this.userPassword)
    })
  }

  reauthenticate = (currentPassword) => {
    console.log(currentPassword)
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }


  updateProfile(newPassword) {
    this.reauthenticate(this.userPassword).then(() => {
      var user = firebase.auth().currentUser;
      const salt = bcrypt.genSaltSync(10);
      var pass = bcrypt.hashSync(newPassword, salt);

      user.updatePassword(newPassword).then(() => {
        console.log("Password was changed");

        this.itemsRef.doc(this.userId).update({
          "userPassword": pass
        })
      }).catch((error) => {
        console.log(error);
      })

    }).catch((error) => {
      console.log(error);
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
