import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-addscene-accordion',
  templateUrl: './addscene-accordion.component.html',
  styleUrls: ['./addscene-accordion.component.scss'],
})
export class AddsceneAccordionComponent implements OnInit {

  deviceIdArr:any[] = [];
deviceIdSelected: {
  deviceId: string;
  toggleDuring:boolean;
  toggleAfter:boolean;
}
  deviceIconName = [];
  plug = [];
  userId: string = '';
  devicesInfo = [];
  devicesInfoId = [];
  deviceIcons = [];
  deviceId;
 deviceName;
showState =[];
showAfter =[];
showDuring =[];
@Input() channelName = '';
@Input() channelId = '';
 constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
  ) {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
        this.afs
          .collection('user')
          .doc(this.userId)
          .collection('devices', ref => ref.where('channelId', '==', this.channelId)
          ).get().subscribe((snapshot) => {
            snapshot.docs.forEach((doc, index) => {
              this.devicesInfo[index] = doc.data();
            });
            if (this.devicesInfo.length > 0) {
              for (let index = 0; index < this.devicesInfo.length; index++) {
                this.devicesInfoId[index] = this.devicesInfo[index].deviceId
                this.deviceIconName[index] = this.devicesInfo[index].deviceName
                this.plug[index] = this.devicesInfo[index].plugNumber
                this.deviceIcons[index] = this.devicesInfo[index].deviceIcon
              }
            }
          });
});
this.showState.length=this.devicesInfo.length;
this.showState.forEach((element)=>{
  element=false;
})
this.showAfter.length=this.devicesInfo.length;
this.showAfter.forEach((element)=>{
  element=false;
})
this.showDuring.length=this.devicesInfo.length;
this.showDuring.forEach((element)=>{
  element=false;
})


   }
  ngOnInit() {
  }
getDeviceID(num){
  if(this.showState[num]){
    this.deviceIdSelected={
      deviceId:this.devicesInfoId[num],
      toggleAfter:false,
      toggleDuring:false
    };
    this.deviceIdArr.push(this.deviceIdSelected);
    console.log(this.deviceIdArr);
  }
  else{
    this.deviceIdArr.forEach((element,index)=>{
      if(element.deviceId===this.devicesInfoId[num])
      this.deviceIdArr.splice(index,1);
    })
    console.log(this.deviceIdArr)
  }
}
  show(num: any){
    this.showState[num]=!this.showState[num];
    if(this.showState[num]===false){
      this.showAfter[num]=false;
      this.showDuring[num]=false;
    }
  }
  showAfterToggle(num: any){
      this.showAfter[num]=!this.showAfter[num];
      this.deviceIdArr.forEach((element,index)=>{
        if(element.deviceId===this.devicesInfoId[num])
        {
          element.toggleAfter=this.showAfter[num];
        }
      })
      console.log(this.deviceIdArr)
  }
  showDuringToggle(num: any){
      this.showDuring[num]=!this.showDuring[num];
      this.deviceIdArr.forEach((element,index)=>{
        if(element.deviceId===this.devicesInfoId[num])
        {
          element.toggleDuring=this.showDuring[num];
        }
      })
      console.log(this.deviceIdArr)
  }
}
