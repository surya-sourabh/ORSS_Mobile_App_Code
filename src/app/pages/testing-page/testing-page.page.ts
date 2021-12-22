import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-testing-page',
  templateUrl: './testing-page.page.html',
  styleUrls: ['./testing-page.page.scss'],
})
export class TestingPagePage implements OnInit {
  ssid: string = '';
  password: string = '';
  reactiveForm: FormGroup;
  showHide: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private _api: ApiService
  ) {

  }
  P1: string = '';
  P2: string = '';
  P3: string = '';
  P4: string = '';
  P5: string = '';
  P6: string = '';
  P7: string = '';
  P8: string = '';
  P9: string = '';
  P10: string = '';
  P11: string = '';
  P12: string = '';
  P13: string = '';
  P14: string = '';
  P15: string = '';

  data1: string = '';
  data2: string = '';
  data3: string = '';
  data4: string = '';
  data5: string = '';
  data6: string = '';
  data7: string = '';
  data8: string = '';
  data9: string = '';
  data10: string = '';
  data11: string = '';
  data12: string = '';
  data13: string = '';
  data14: string = '';
  data15: string = '';

  newArray = [];
  newObj = {
    paramName: '',
    paramText: '',
    valueName: '',
    valueText: ''
  }
  tempObj;
  ngOnInit() {
  }


  getValues() {
    if (this.P1.length > 0) {

      this.newObj.paramName = "P1";
      this.newObj.paramText = this.P1;
      this.newObj.valueName = "data1";
      this.newObj.valueText = this.data1;

      this.tempObj = { ...this.newObj }

      this.newArray.push(this.tempObj)
    }

    if (this.P2.length > 0) {

      this.newObj.paramName = "P2";
      this.newObj.paramText = this.P2;
      this.newObj.valueName = "data2";
      this.newObj.valueText = this.data2;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P3.length > 0) {
      this.newObj.paramName = "P3";
      this.newObj.paramText = this.P3;
      this.newObj.valueName = "data3";
      this.newObj.valueText = this.data3;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P4.length > 0) {
      this.newObj.paramName = "P4";
      this.newObj.paramText = this.P4;
      this.newObj.valueName = "data4";
      this.newObj.valueText = this.data4;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P5.length > 0) {
      this.newObj.paramName = "P5";
      this.newObj.paramText = this.P5;
      this.newObj.valueName = "data5";
      this.newObj.valueText = this.data5;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P6.length > 0) {
      this.newObj.paramName = "P6";
      this.newObj.paramText = this.P6;
      this.newObj.valueName = "data6";
      this.newObj.valueText = this.data6;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P7.length > 0) {
      this.newObj.paramName = "P7";
      this.newObj.paramText = this.P7;
      this.newObj.valueName = "data7";
      this.newObj.valueText = this.data7;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P8.length > 0) {
      this.newObj.paramName = "P8";
      this.newObj.paramText = this.P8;
      this.newObj.valueName = "data8";
      this.newObj.valueText = this.data8;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P9.length > 0) {
      this.newObj.paramName = "P9";
      this.newObj.paramText = this.P9;
      this.newObj.valueName = "data9";
      this.newObj.valueText = this.data9;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P10.length > 0) {
      this.newObj.paramName = "P10";
      this.newObj.paramText = this.P10;
      this.newObj.valueName = "data10";
      this.newObj.valueText = this.data10;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P11.length > 0) {
      this.newObj.paramName = "P11";
      this.newObj.paramText = this.P11;
      this.newObj.valueName = "data11";
      this.newObj.valueText = this.data11;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P12.length > 0) {
      this.newObj.paramName = "P12";
      this.newObj.paramText = this.P2;
      this.newObj.valueName = "data12";
      this.newObj.valueText = this.data12;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P13.length > 0) {
      this.newObj.paramName = "P13";
      this.newObj.paramText = this.P13;
      this.newObj.valueName = "data13";
      this.newObj.valueText = this.data13;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P14.length > 0) {
      this.newObj.paramName = "P14";
      this.newObj.paramText = this.P14;
      this.newObj.valueName = "data14";
      this.newObj.valueText = this.data14;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }
    if (this.P15.length > 0) {
      this.newObj.paramName = "P15";
      this.newObj.paramText = this.P15;
      this.newObj.valueName = "data15";
      this.newObj.valueText = this.data15;

      this.tempObj = { ...this.newObj }


      this.newArray.push(this.tempObj)
    }



    console.log(this.newArray)
    var str = '';
    for (var i = 0; i < this.newArray.length; i++) {
      console.log(this.newArray[i]);
      str = str + this.newArray[i].paramText + "=" + this.newArray[i].valueText + "&";
      var newStr = str.slice(0, -1);
      // var strippedStr = newStr.replace(/\s+/g, '')
      console.log(newStr);
    }
    // ssid=%20home&pass=23456&door=23&loca=noida&
    // ssid= homepass=23456door=23
    this.http.get(`${this._api.apiEndPoint}/setting?${newStr}`, {})
      .subscribe(data => {
        if (data["status"] === 200) {
          console.log("Success")
        }
      },
        (error => {
          console.log(error.status);
        })
      );
  }
  // ${this.P1}=${this.data1}&${this.P2}=${this.data2}&${this.P3}=${this.data3}&${this.P4}=${this.data4}&${this.P5}=${this.data5}
  //     &${this.P6}=${this.data6}&${this.P7}=${this.data7}&${this.P8}=${this.data8}&${this.P9}=${this.data9}&${this.P10}=${this.data10}&${this.P11}=${this.data11}
  //     &${this.P12}=${this.data12}&${this.P13}=${this.data13}&${this.P14}=${this.data14}&${this.P15}=${this.data15}`
}
