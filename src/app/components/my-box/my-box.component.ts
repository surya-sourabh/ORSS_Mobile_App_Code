import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-box',
  templateUrl: './my-box.component.html',
  styleUrls: ['./my-box.component.scss'],
})
export class MyBoxComponent implements OnInit {


  constructor() { }

  @Input() powerState = '';
  @Input() deviceIcons = '';
  @Input() sceneName = '';
  @Input() deviceIconsType = '';
  @Input() channelDeviceConnected: any;
  @Input() channelCapacity: any;
  @Input() channelId: any;
  @Input() hideManageBtn: boolean;

  @Output() buttonClickEvent = new EventEmitter();
  @Output() channelIdEvent = new EventEmitter();
  @Output() channelBtnClickEvent = new EventEmitter();

  buttonClick() {
    this.buttonClickEvent.emit();
    this.channelIdEvent.emit(this.channelId)
  }

  btnClick() {
    this.channelBtnClickEvent.emit();
  }

  ngOnInit() {
    // console.log(this.channelId)
  }

}
