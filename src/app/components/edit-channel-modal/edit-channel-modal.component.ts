import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ComponentsModule } from '../components.module';
import { DeviceIconModalComponent } from '../device-icon-modal/device-icon-modal.component';

@Component({
  selector: 'app-edit-channel-modal',
  templateUrl: './edit-channel-modal.component.html',
  styleUrls: ['./edit-channel-modal.component.scss'],
})
export class EditChannelModalComponent implements OnInit {
  primaryBtnText = 'Save';
  modelData: any;
  channelIcon: string;
  constructor(private modalController: ModalController) { }
  @Input() editChannelNam: string;
  @Input() userSelectedIcon: string = 'file-image'
  editChannelName:string="";

  ngOnInit() {
this.editChannelName=this.editChannelNam

  }
  ionViewWillEnter(){
    this.editChannelName=this.editChannelNam
    this.channelIcon = this.userSelectedIcon
  }
  dismiss() {


        this.modalController.dismiss(
          {

            'editChannelName':""
          });
      }


  dismissWithName() {
    if((this.editChannelName).length>0)
    {

      this.modalController.dismiss(
        {

          'editChannelName':this.editChannelName,
          'editChannelIcon': this.userSelectedIcon
        });
    }
    else{
      this.modalController.dismiss(
        {

          'editChannelName':""
        });
    }
  }
  saveEditedName(){
    // console.log(this.editChannelName)
  this.dismissWithName()

  }

  async openModal(){
    const modal = await this.modalController.create({
      component: DeviceIconModalComponent,
      cssClass: '',
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
        this.userSelectedIcon = modelData.data
        console.log("Selected icon",this.userSelectedIcon)
      }
    })
    return await modal.present();
  }
}


