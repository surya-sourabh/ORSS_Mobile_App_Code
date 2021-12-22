import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss'],
})
export class DeviceListComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  @Input() deviceIcon= '';
  @Input() deviceIconsType = '';
  @Input() deviceName = '';
  @Input() channelName = '';
  @Input() plugNumber :number

}
