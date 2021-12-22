import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot/ngx';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-wifi-scan-list',
  templateUrl: './wifi-scan-list.page.html',
  styleUrls: ['./wifi-scan-list.page.scss'],
})
export class WifiScanListPage implements OnInit {
  title = 'Select a Wifi';
  titleIcon = true;
  iconName = 'wifi';
  networks:HotspotNetwork[] = [];
  network = [];
  // network = [
  //   {
  //     SSID: "hello",
  //     BSSID: 'yes'
  //   },{
  //     SSID: "hello2",
  //     BSSID: 'yes2'
  //   },{
  //     SSID: "hello3",
  //     BSSID: 'yes3'
  //   }
  // ]
  constructor(
    private router: Router,
    private hotspot: Hotspot,
    private util: UtilService
  ) {
    this.hotspot.scanWifi().then((networks: HotspotNetwork[]) => {
      this.network = []
      console.log(networks);
      this.network = networks
  });
   }

  ngOnInit() {
  }

  backBtnTo(){
    this.router.navigate(['view-all-channels'])
  }

  onClick(ssid){
    console.log(ssid)
    var navigationExtras: NavigationExtras = {
      state: { ssid: ssid}
    };
    this.util.setMessage(ssid)

    this.router.navigate(['/add-channel'], navigationExtras);
  }
  

}
