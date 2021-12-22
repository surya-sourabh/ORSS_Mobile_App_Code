import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-devices-in-my-device',
  templateUrl: './devices-in-my-device.component.html',
  styleUrls: ['./devices-in-my-device.component.scss'],
})
export class DevicesInMyDeviceComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Input() deviceIcon = '';
  @Input() plugNumber = '';
  @Input() deviceName = '';
  @Input() deviceId = '';
  @Input() channelName = '';
  @Input() powerState = '';

  @Output() btnClickEvent = new EventEmitter

  btnClick() {
    this.btnClickEvent.emit();
  }

}
