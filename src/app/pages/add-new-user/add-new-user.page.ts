import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import 'firebase/auth';

import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.page.html',
  styleUrls: ['./add-new-user.page.scss'],
})
export class AddNewUserPage implements OnInit {

  items: Observable<any[]>;
  itemsRef: AngularFirestoreCollection;
  photoURL: any;
  primaryBtnText = "Add";

  memberInfo: {
    memberName: string,
    memberEmail: string,
    memberId: any,
    memberPass: string;
  }
  reactiveForm: FormGroup;
  submitted: boolean = false;
  name: string;
  email: string;
  password: string;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private afauth: AngularFireAuth,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,

  ) {
    this.itemsRef = db.collection('user')
    this.items = this.itemsRef.valueChanges();
    var navigation = this.router.getCurrentNavigation();
    var state = navigation.extras.state as { photoURL: string };

    this.reactiveForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}')]),
    });

  }

  get f() {
    return this.reactiveForm.controls;
  }

  title = "Add Member";
  viewLText = "Permissions";
  viewRText = "Clone";
  viewRIcon = 'copy';
  viewLIcon = 'dice-two';
  navigateLink = 'login';
  channelName = ['Migro_CH1', 'Migro_CH2'];
  deviceName = ['Fan', 'Tubelight'];
  roomName = ['Living Room', 'Dinnin Room'];
  selectedFile = "";
  userId: string;

  profileImageURL: any = "/assets/images/default_avatar.png";

  backBtnTo() {
    this.router.navigate(['user-listing-screen']);
  }

  ngOnInit() {
    this.afauth.authState.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      cssClass: 'modal-css',

    })


    return await modal.present();
  }



  memberName: any;
  currentUser: any;


  async onSubmit() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return
    } else {


      if (this.name && this.email && this.password) {
        const loading = await this.loadingCtrl.create({
          message: 'processing..',
          spinner: 'crescent',
          showBackdrop: true
        });
        loading.present();
      
        console.log(this.email);
        console.log(firebase.auth().currentUser)
        this.currentUser = firebase.auth().currentUser;

        this.afauth.createUserWithEmailAndPassword(this.email, this.password).then(async (data) => {
          console.log(data)
          await firebase.auth().updateCurrentUser(this.currentUser);


          // data.user.sendEmailVerification()
          const salt = bcrypt.genSaltSync(10);
          var pass = bcrypt.hashSync(this.password, salt);
          console.log(data)
          console.log(this.currentUser.uid)
          console.log(firebase.auth().currentUser)
          this.db
            .collection('referredUser').doc(data.user.uid)
            .set({
              memberName: this.name,
              memberEmail: this.email,
              memberId: data.user.uid,
              memberPass: pass,
              referrerId: this.currentUser.uid,
              accessLevel: "1"
            })
            .then(async () => {
              loading.dismiss();
              data.user.sendEmailVerification()
              this.toast('Registration Success!! Please check & validate your email..', 'success');
              // await firebase.auth().updateCurrentUser(this.currentUser);
              this.router.navigate(['/user-lisiting-screen']);
            })
            .catch(async error => {
              loading.dismiss();
              // await firebase.auth().updateCurrentUser(this.currentUser);
              this.toast(error.message, 'danger');
            })
          console.log(this.name)
        }).catch(error => {
          loading.dismiss();
          this.toast(error.message, 'danger');
        })

      }
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
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      window.location.reload();
    }, 3000);
  }

}

