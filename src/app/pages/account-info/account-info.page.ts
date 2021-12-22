import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoEditModalComponent } from 'src/app/components/user-info-edit-modal/user-info-edit-modal.component';
import { ModalController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserPasswordChangeComponent } from 'src/app/components/user-password-change/user-password-change.component';
import { LogoutModalComponent } from 'src/app/components/logout-modal/logout-modal.component';


@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss'],
})
export class AccountInfoPage implements OnInit {

  itemsRef: AngularFirestoreCollection;
  items: Observable<any[]>;

  title = "My Account";
  user: any;
  userEmail: any;
  profileURL = "";
  userId: any;
  profileImageURL: any = "/assets/images/default_avatar.png";
  selectedFile: any;
  primaryBtnText = "Save";
  userPassword: any;
  showResetButton: boolean = true;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private storage: AngularFireStorage,
    private auth: AuthService,
    private db: AngularFirestore) {
    this.itemsRef = db.collection('user')
    this.items = this.itemsRef.valueChanges();
  }


  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.userId = user.userId;
        this.userEmail = user.userEmail;
        this.userPassword = user.userPassword

        // this.userId = user.userId ? user.userId : user.id;

        // this.profileImageURL = undefined ? user['photoURL'] : this.profileImageURL;

        if (user['photoURL']) {
          this.profileImageURL = user['photoURL'];
        }
        if (user['isGoogleUser'] == true || user['isFacebookUser'] == true) {
          this.showResetButton = false
        }
      }
    })
  }
  async chooseFile(event) {
    this.selectedFile = event.target.files
    console.log(this.userId)
    const imageUrl = await this.uploadFile(this.userId, event.target.files);
    this.profileImageURL = imageUrl;
    this.itemsRef.doc(this.userId).update({
      photoURL: imageUrl || null
    })

    console.log(imageUrl);
  }

  async uploadFile(id, file): Promise<any> {
    if (file && file.length) {
      try {
        // await this.presentLoading();
        const task = await this.storage.ref('images').child(`${id}/profile/profileImage`).put(file[0])
        console.log(task)
        // this.loading.dismiss();

        const imageUrl = await this.storage.ref(`images/${id}/profile/profileImage`).getDownloadURL().toPromise();
        return imageUrl;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async openEditModal() {
    // console.log("opened");
    const modal = await this.modalCtrl.create({
      component: UserInfoEditModalComponent,
      cssClass: 'modal-cs',

    })


    return await modal.present();
  }

  async userResetPasswordModal() {
    // console.log("opened");
    const modal = await this.modalCtrl.create({
      component: UserPasswordChangeComponent,
      cssClass: 'modal-cs',

    })


    return await modal.present();
  }

  async logoutModal() {
    // console.log("opened");
    const modal = await this.modalCtrl.create({
      component: LogoutModalComponent,
      cssClass: 'modal-css',

    })


    return await modal.present();
  }



  backBtnTo() {
    this.router.navigate(['home']);
  }


}
