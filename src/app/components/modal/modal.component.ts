import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  primaryBtnText = "Save";

  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveBtnTo() {
    this.router.navigate(['login']);
  }
}
