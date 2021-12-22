import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.scss'],
})
export class LogoutModalComponent implements OnInit {

  constructor(private modalCtrl: ModalController,
    private auth: AuthService) { }

  primaryBtnText = "Continue"

  ngOnInit() { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  signOutAccount() {
    this.auth.signOut();
    this.dismiss();
  }
}
