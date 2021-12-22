import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ExsistingUserModalComponent } from 'src/app/components/exsisting-user-modal/exsisting-user-modal.component';
import { UserInfoEditModalComponent } from 'src/app/components/user-info-edit-modal/user-info-edit-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilService } from 'src/app/services/util.service';
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {

  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;
  require: any;
  items: Observable<any[]>;


  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required)
  })

  itemsRef: AngularFirestoreCollection;
  memberName: any;
  memberId: any;
  title = "Users";
  viewLText = "Permissions";
  viewRText = "Clone";
  viewRIcon = 'copy';
  viewLIcon = 'dice-two';
  navigateLink = 'login';
  // channelName = ['Migro_CH1', 'Migro_CH2'];
  // deviceName = ['Fan', 'Tubelight'];
  roomName = ['Living Room', 'Dinnin Room'];
  user: any;
  profileURL = "";
  userId: string;
  memberPhoto: any;
  selectedFile = "";
  membersArray = [];
  boxMemberId: any;
  devices = [];
  deviceId: any;
  channelName = [];
  deviceName = [];
  plugNumber = [];
  state = [];
  deviceIcon = [];
  showDevices: boolean;
  message = '';
  message2 = '';
  channels = [];
  channelId = [];
  deviceArray: [];
  clickedId: any;
  mId = this.auth.getMessage();
  channelChannelId: any;
  channelState = [];
  icon = [];
  iotChannelId = [];
  macId = [];
  manufacturingDate = [];
  capacity = [];
  arr = [];
  channelsarray =[];
  channelIdInDevices = [];
  uniqueArray2 = [];
  channelsInChannelsDoc = []

  constructor(private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private modalCtrl: ModalController,
    private router: Router,
    private auth: AuthService,
    private afauth: AngularFireAuth,
    private util: UtilService,
    private toastr: ToastController
  ) {
    this.itemsRef = afs.collection('user')
    this.items = this.itemsRef.valueChanges();
  }



  backBtnTo() {
    this.router.navigate(['user-listing-screen']);
  }

  saveBtnTo() {

    // console.log(this.util.getSelectedDevices())
    // console.log(this.util.getRemovedDevices())

    const selectedDevicesList = this.util.getSelectedDevices();
    const removedDevicesList = this.util.getRemovedDevices();
    // let saveDeviceList = [];




    const mid = this.auth.getMessage();

    Object.entries(selectedDevicesList).map(entry => {
      let deviceId = entry[0];
      let deviceData: any = entry[1];
      // console.log(mid)
      // console.log(deviceData);
      this.afs.collection('user')
        .doc(this.userId).collection('channels', ref => ref.where('channelId', '==', deviceData.channelId))
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.channels[index] = doc.data();
            console.log(this.channels)


            this.afs.collection('user').doc(mid)
              .collection('channels')
              .doc(deviceData.channelId)
              .set({

                channelName: this.channels[index].channelName,
                channelId: this.channels[index].channelId,
                channelState: this.channels[index].channelState,
                icon: this.channels[index].icon,
                iotChannelId: this.channels[index].iotChannelId,
                macId: this.channels[index].macId,
                manufacturingDate: this.channels[index].manufacturingDate,
                capacity: this.channels[index].capacity
              })

          })


        })

      this.afs.collection('user')
        .doc(mid).update({
          "channelsarray": firebase.default.firestore.FieldValue.arrayUnion({
            channelId: deviceData.channelId
          })
        })

      this.afs.collection('user').doc(mid)
        .collection('devices').doc(deviceData.deviceId)
        .set(deviceData).then(()=>{
          this.toast("Permission changed successfully",'success')
        });

    });

    Object.entries(removedDevicesList).map(entry => {
      let deviceId = entry[0];
      let deviceData: any = entry[1];
      const mid = this.auth.getMessage();
      // console.log(mid)
      // console.log(deviceData);

      this.afs.collection('user').doc(mid)
        .collection('devices').doc(deviceData.deviceId)
        .delete();
        console.log(deviceData.channelId)

      this.afs.collection('user').doc(mid)
      .collection('channels').doc(deviceData.channelId)
      .delete();

      let channelsarray = []
      let arr = []
      this.afs.collection('user')
      .doc(mid).collection('channels')
      .get().subscribe(snapshot => {
        snapshot.docs.forEach((doc, index) => {
          this.channelsInChannelsDoc[index] = doc.data().channelId;
        })

        this.afs.collection('user')
          .doc(mid).update({
              "channelsarray": firebase.default.firestore.FieldValue.delete()
                  
              })
        console.log(this.channelsInChannelsDoc)
        this.channelsInChannelsDoc.forEach(element => {
          
          this.afs.collection('user')
            .doc(mid).update({
                "channelsarray": firebase.default.firestore.FieldValue.arrayUnion({
                    channelId: element
                  })
                }).then(()=>{
                  this.toast("Permission changed successfully",'success')
                })
        });
          })
    });

    // this.afs.collection('user')
    // .doc(mid)
    // .get().subscribe(value => {
    //   this.channelsarray = value.get('channelsarray')
    //   console.log(this.channelsarray)

    //   this.afs.collection('user')
    //   .doc(mid).collection('devices')
    //   .get().subscribe((snapshot) => {
    //     snapshot.docs.forEach((doc, index) => {
    //       this.channelIdInDevices[index] = doc.data().channelId;
    //     });
    //     let uniqueArray = this.channelIdInDevices.filter(function(item, pos, self) {
    //       return self.indexOf(item) == pos;
    //     })
    //     console.log(uniqueArray)

    //     let newarr = []
    //     this.channelsarray.forEach(val1 => {
    //       console.log(val1)
    //       this.channelIdInDevices.forEach(val2=> {
    //         console.log(val2)
    //         if(val1.channelId !== val2){
    //           newarr.push(val1)
    //           console.log(newarr)
    //           this.uniqueArray2 = newarr.filter(function(item, pos, self) {
    //             return self.indexOf(item) == pos;
    //           })
    //         }
    //         console.log(this.uniqueArray2)
    //       })
    //     })

    //     // this.afs.collection('user')
    //     // .doc(mid).update({
    //     //   "channelsarray": firebase.default.firestore.FieldValue.arrayUnion({
    //     //     channelId: this.uniqueArray2
    //     //   })
    //     // })
    //   })
    // })
  




    this.router.navigate(['user-listing-screen']);

  }


  ngOnInit() {

  }

  ionViewWillEnter() {
    this.memberId = this.auth.getMessage();
    this.message2 = this.auth.getMessage2();

    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
        // console.log(this.userId);
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .collection('channels')
        .get()
        .subscribe((snapshot) => {
          snapshot.docs.forEach((doc, index) => {
            this.channels[index] = doc.data();
            // console.log(this.channels)
          });

          // console.log(this.channels)
          if (this.channels.length > 0) {

            for (let index = 0; index < this.channels.length; index++) {

              this.channelName[index] = this.channels[index].channelName;
              this.channelId[index] = this.channels[index].channelId;
              this.capacity[index] = this.channels[index].capacity;
              this.channelState[index] = this.channels[index].channelState;
              this.icon[index] = this.channels[index].icon;
              this.iotChannelId[index] = this.channels[index].iotChannelId;
              this.macId[index] = this.channels[index].macId;
              this.manufacturingDate[index] = this.channels[index].manufacturingDate
            }
          }
        });
      this.afs
        .collection('user')
        .doc(this.memberId)
        .get()
        .subscribe((data) => {
          this.memberPhoto = data.get('photoURL')
          if (this.memberPhoto == undefined || this.memberPhoto == null) {
            this.memberPhoto = "/assets/images/default_avatar.png";
          }
        })

    });
    this.util.resetSelectedDevices();
    // console.log(this.util.getSelectedDevices())
  }

  fromModal: any;
  async cloneModal() {
    const modal = await this.modalCtrl.create({
      component: ExsistingUserModalComponent,
      cssClass: 'modal-css',

    })


    return await modal.present();
  }

  async openEditModal() {
    const modal = await this.modalCtrl.create({
      component: UserInfoEditModalComponent,
      cssClass: 'modal-cs',
      componentProps: {
        'data': 'boxMemberId'
      }
    })


    return await modal.present();
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
