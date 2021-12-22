import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
})
export class CustomModalComponent implements OnInit {
  customPickerOptions: { buttons: { text: string; handler: (time: any) => void; }[]; };
  primaryBtnText = 'Save';
  public label: any
  clickTime: any;
  minute: any=0
  isChecked:boolean
  constructor(private modalController: ModalController,
    private auth: AuthService,
    private router: Router) {
      this.customPickerOptions = {
        buttons: [
          {
            text: 'Save',
            handler: (time) => {
              // console.log("Start", time.minute.text)

              this.clickTime= time.minute.text
              this.minute=time.minute.text
              // console.log(this.clickTime)
            }
          },
          {
            text: 'Cancel',
            handler: e => {
              // modalCtrl.dismiss(e)
            }
          }
        ]
      }
  }
  setTime = ['1', '5', '10', '15']
  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss();
  }

  timeSelected(time) {
    this.clickTime = time
this.minute=0
  }

  custom()
  {
   this.isChecked=false
  }
  async save() {
    console.log(this.clickTime)
    this.auth.setMessage(this.clickTime)
    await this.modalController.dismiss(this.clickTime);
  }


}

