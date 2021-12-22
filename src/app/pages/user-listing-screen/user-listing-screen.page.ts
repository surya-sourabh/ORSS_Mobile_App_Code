import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, NavigationExtras } from '@angular/router';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-user-listing-screen',
  templateUrl: './user-listing-screen.page.html',
  styleUrls: ['./user-listing-screen.page.scss'],
})
export class UserListingScreenPage implements OnInit {
  memberList: boolean = false;
  noMember: boolean = true;
  devices = [];
  title = "Users";
  titlebarRTiText = "Total Members";
  viewLText = "Members";
  viewLIcon = "users-cog";
  viewRText = "Add More Members";
  viewRIcon = "plus";
  navigateLink = 'add-new-user';
  userId: string = '';
  membersArray = [];
  memberName = [];
  memberId = [];
  memberPhoto = [];
  boxMemberId: any;
  titlebarRSubTiText: number = 0;
  showRightButton = true;
  member: {
    memberName: string;
    memberId: string;
  };


  constructor(private router: Router,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private auth: AuthService) {


    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.membersArray = data.get('membersarray');
          // console.log(this.membersArray)

          // if (this.membersArray) {
          //   this.memberList = true
          // }
          if (this.membersArray !== undefined) {
            this.memberList = true
            this.noMember = false
            this.membersArray.forEach(
              (element: any, index: string | number) => {
                this.memberName[index] = element.memberName;
                this.memberId[index] = element.memberId;
                // this.memberPhoto[index] = element.photoURL;
                length = this.membersArray.length;
                this.titlebarRSubTiText = length;
              }
            );
          } else {
            this.noMember = true
          }
          this.memberId.forEach((data, i) => {
            this.afs
              .collection('user')
              .doc(data)
              .get()
              .subscribe((photoData) => {
                this.memberPhoto[i] = photoData.get('photoURL')
                if (this.memberPhoto[i] == undefined) {
                  this.memberPhoto[i] = "/assets/images/default_avatar.png";
                } else {
                  this.memberPhoto[i]
                }
              })
          })
        });

    })
    this.membersArray.forEach(
      (element: any, index: string | number) => {
        this.memberName[index] = element.memberName;
        this.memberId[index] = element.memberId;
        length = this.membersArray.length;
        this.titlebarRSubTiText = length;
        console.log(this.memberName)
      }
    );
  }
  ngOnInit() {




  }

  length() {
    this.length;
  }


  async buttonClickE() {
    const actionSheet = await this.actionSheetCtrl.create({

      cssClass: 'action-sheet-css',
      buttons: [{
        text: 'Permissions to access device',
        handler: () => {

          this.router.navigate(['user-edit']);

        }
      }, {
        text: 'Delete User',
        handler: async () => {
          const loading = await this.loadingCtrl.create({
            message: 'processing..',
            spinner: 'crescent',
            showBackdrop: true
          });
          loading.present();

          console.log(this.boxMemberId)
          this.afs
            .collection('user')
            .doc(this.userId)
            .update({
              membersarray: this.membersArray.filter(
                (id: { memberId: any }) => id.memberId !== this.boxMemberId)
            })
          this.afs
            .collection('user')
            .doc(this.userId)
            .collection('members')
            .doc(this.boxMemberId).delete()
            .then(async () => {
              loading.dismiss();
              this.toast('Member Deletion Success', 'success');

            }).catch(async error => {
              this.router.navigate(['user-listing-screen'])
              loading.dismiss();
              this.toast(error.message, 'danger')
            })

          this.afs.collection('user')
            .doc(this.userId)
            .get()
            .subscribe((data) => {
              this.membersArray = data.get('membersarray');
              if (this.membersArray.length > 0) {
                this.noMember = false

                for (let i = 0; i < this.membersArray.length; i++) {
                  this.memberName[i] = this.membersArray[i].memberName;
                  this.memberId[i] = this.membersArray[i].memberId;
                  length = this.membersArray.length;
                  this.titlebarRSubTiText = length;
                }
              } else {
                this.noMember = true
              }
            })

        },
      }, {
        text: 'Cancel',

        handler: () => {
          console.log('Cancelled');
        }
      }],
      animated: true,
      backdropDismiss: true,
      keyboardClose: false
    });
    actionSheet.present();


  }
  backBtnTo() {
    this.router.navigate(['homepage']);
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

}
