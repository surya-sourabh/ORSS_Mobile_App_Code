import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-my-scene-box',
  templateUrl: './my-scene-box.component.html',
  styleUrls: ['./my-scene-box.component.scss'],
})
export class MySceneBoxComponent implements OnInit {
  devicesText: string;
  constructor() { }
  @Input() powerState = '';
  @Input() deviceIcons = '';
  @Input() sceneName = '';
  @Input() deviceIconsType = '';
  @Input() channelDeviceConnected: any;
  @Input() channelCapacity: any;
  @Input() channelId: any;

  @Output() buttonClickEvent = new EventEmitter();
  @Output() channelIdEvent = new EventEmitter();

  @Output() sceneBtnClickEvent = new EventEmitter

  btnClick() {
    this.sceneBtnClickEvent.emit();
  }
  buttonClick() {
    this.buttonClickEvent.emit();
    this.channelIdEvent.emit(this.channelId)
  }

  ngOnInit() {
    if (this.channelDeviceConnected > 1) {
      this.devicesText = "devices"
    }
    else {
      this.devicesText = "device"
    }
    // console.log(this.devicesText)
  }
  ionViewWillEnter() {

  }

}
