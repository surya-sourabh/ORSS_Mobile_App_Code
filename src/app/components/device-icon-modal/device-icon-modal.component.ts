import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-device-icon-modal',
  templateUrl: './device-icon-modal.component.html',
  styleUrls: ['./device-icon-modal.component.scss'],
})
export class DeviceIconModalComponent implements OnInit {

  primaryBtnText = 'Save';
  public label: any
  clickedIcon: any;
  constructor(private modalController: ModalController,
    private auth: AuthService,
    private router: Router) {
  }

  icons = ['fan','laptop','mobile',
  'tablet-alt',
  'lightbulb',
  'car-battery',
  'faucet',
  'laptop-house',
  'laptop',
  'fan',
  'battery-half',
  'bell',
  'charging-station',
  'desktop',
  'fax',
  'fill-drip',
  'filter',
  'hand-holding-water',
  'hanukiah','hot-tub',
  'phone',
  'network-wired',
  'server',
  'tv']
  setTime = ['1', '5', '10', '15']
  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss();
  }

 async selectedIcon(icon) {
    console.log(icon)
    this.clickedIcon = icon
    await this.modalController.dismiss(this.clickedIcon);
  }

}
