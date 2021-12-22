import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras,ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.page.html',
  styleUrls: ['./add-channel.page.scss'],
})
export class AddChannelPage implements OnInit {
  reactiveForm: FormGroup;
  submitted: boolean = false;
  title = 'Add Channel';
  wifiPass: string = '';
  ssid: string = '';
  userId: string = '';
  wifi: {
    state: boolean;
    ssid: string;
    wifiPass: string;
  };
  primaryBtnText ="Next";
  timeZone: string;
  sub: any;
  id: any;
  timeZones = [
    {
            "value": "+0400",
            "text": "Abu Dhabi"
         },
       {
          "value": "-0900",
          "text": "Alaska"
       },
       {
          "value": "-0100",
          "text": "Azores"
       },
     {
            "value": "+0600",
            "text": "Almaty"
         },
        {
              "value": "+0930",
              "text": "Adelaide"
           },
         {
            "value": "+0700",
            "text": "Bangkok"
         },
         {
            "value": "+0800",
            "text": "Beijing"
         },
       {
          "value": "-0500",
          "text": "Bogota, Lima"
       },
       {
          "value": "-0300",
          "text": "Brazil"
       },
    {
            "value": "-0300",
            "text": "Buenos Aires"
         },
    {
            "value": "+0100",
            "text": "Brussels Paris"
         },
      {
              "value": "+0300",
              "text": "Baghdad"
           },
       {
          "value": '-0400',
          "text": "Canada"
       },
    {
            "value": '-0400',
            "text": "Caracas"
         },
        {
            "value": "-1200",
            "text": "Eniwetok"
         },
       {
              "value": "+0000",
              "text": "Europe"
           },
        {
          "value": "-1000",
          "text": "Hawaii"
        },
        {
                "value": "+0530",
                "text": "India"
             },
           {
              "value": "+0200",
              "text": "Kaliningrad"
           },
           {
              "value": "+0430",
              "text": "Kabul"
           },
           {
              "value": "+0500",
              "text": "Karachi"
      },
      {
              "value": "+0545",
              "text": "Kathmandu"
      },
         {
            "value": "+1200",
            "text": "Kamchatka"
         },
       {
              "value": "+0000",
              "text": "London"
           },
         {
            "value": "-0600",
            "text": "Mexico City"
         },
         {
            "value": "-0200",
            "text": "Mid-Atlantic"
         },
      {
              "value": "+0300",
              "text": "Moscow"
           },
         {
            "value": "+1100",
            "text": "New Caledonia"
         },
           {
              "value": "-1100",
              "text": "Samoa"
           },
         {
                "value": "+0800",
                "text": "Singapore"
             },
        {
                "value": "+0200",
                "text": "South Africa"
             },
           {
              "value": "+0330",
              "text": "Tehran"
           },
           {
              "value": "+0900",
              "text": "Tokyo"
           },
        {
                "value": "+0500",
                "text": "Tashkent"
        },
         {
            "value": "-0800",
            "text": "United States"
         },
         
       
         {
            "value": "+1000",
            "text": "Vladivostok"
         },
       {
              "value": "+0900",
              "text": "Yakutsk"
           }
  ]
  selected = ''
  location: any;
  ionViewWillEnter() {
    const date = new Date();
    console.log(date)
    let string = date.toString()
    console.log(string.split(/(\s+)/)[10])
    this.timeZone = string.split(/(\s+)/)[10]
    this.wifi = {
      state: false,
      ssid: '',
      wifiPass: '',
    };
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
      this.afs
        .collection('user')
        .doc(this.userId)
        .get()
        .subscribe((data) => {
          this.wifi = data.get('wifi');
          if (this.wifi) {
            this.ssid = this.wifi.ssid;
            this.wifiPass = this.wifi.wifiPass;
          }
   
          if(!this.ssid){
            this.ssid= this.util.getMessage()
          }
        });
    });
  }

  ngOnInit() { }
  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private util: UtilService
  ) {
    this.reactiveForm = this.formBuilder.group({
      ssid: new FormControl(null, [Validators.required]),
      wifiPass: new FormControl(null, [Validators.required]),
      selected: new FormControl(null, [Validators.required])
    })

  }

  get f() {
    return this.reactiveForm.controls;
  }




  backBtnTo() {
    this.router.navigate(['view-all-channels']);
  }

  nextBtnTo() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    } else {

      var navigationExtras: NavigationExtras = {
        state: { wifiPass: this.wifiPass, ssid: this.ssid, timeZone: this.location },
      };

      this.router.navigate(['add-channel-one'], navigationExtras);
    }
  }

  valFunc(){
    this.timeZones.forEach(val => {
      if(this.selected == val.text){
        this.location = val.value
      }
    })
    console.log(this.location)
  }

  test() {
    this.router.navigate(['testing-page']);
  }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      window.location.reload();
    }, 3000);
  }
}
