import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-add-channel-connected',
  templateUrl: './add-channel-connected.page.html',
  styleUrls: ['./add-channel-connected.page.scss'],
})
export class AddChannelConnectedPage implements OnInit {
  channelId = ""
  userId: string = " ";
  title = ""
  statusConnected: boolean
  statusNotConnected: boolean
  connectStatus: boolean
  constructor(private router: Router, private afs: AngularFirestore,
    private afauth: AngularFireAuth) {

    var navigation = this.router.getCurrentNavigation();
    var state1 = navigation.extras.state as { id: string, connectStatus: boolean, channelName: string };
    if (state1) {

      this.channelId = state1.id
      this.connectStatus = state1.connectStatus
      this.title = state1.channelName
      if (this.connectStatus == true) {

        this.statusConnected = true;
        this.statusNotConnected = false;
      }
      else {

        this.statusConnected = false;
        this.statusNotConnected = true;
      }
      // console.log(this.channelId)
    }

  }
  ngOnInit() {
  }
  ionViewWillEnter() {

  }
  home() {
    this.router.navigate(['home']);
  }

  channelPage() {
    this.router.navigate(['add-channel'])
  }

  addChannel() {
    this.router.navigate(['add-channel']);
  }

  addDevice() {
    this.router.navigate(['add-device-to-channel']);
  }
}
