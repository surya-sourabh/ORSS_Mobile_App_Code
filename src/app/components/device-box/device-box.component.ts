import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-device-box',
  templateUrl: './device-box.component.html',
  styleUrls: ['./device-box.component.scss'],
})
export class DeviceBoxComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }
  @Input() powerState = '';
  @Input() deviceIcon = '';
  @Input() deviceIconsType = '';
  @Input() deviceName = '';
  @Input() channelName = '';
  @Input() plugNumber: number;
  @Input() plugBox: boolean;
  @Input() deviceId: '';

  // dOnOff = 0;
  @Output() btnClickEvent = new EventEmitter();

  btnClick() {

    this.btnClickEvent.emit();
  }


}


