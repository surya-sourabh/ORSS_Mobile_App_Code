import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-sliding',
  templateUrl: './item-sliding.component.html',
  styleUrls: ['./item-sliding.component.scss'],
})
export class ItemSlidingComponent implements OnInit {

  constructor() { }


  @Input() deviceIcons = '';
  @Input() deviceIconsType = '';
  @Input() deviceName = '';
  @Input() plugNumber: number;
  @Input() powerState = '';
  @Input() showPowerButton: boolean;
  @Input() deviceId: any;
  @Input() hideEdit: boolean;
  @Input() hideDelete: boolean;

  @Output() editClickEvent = new EventEmitter();
  @Output() deleteClickEvent = new EventEmitter();
  @Output() deviceIdEvent = new EventEmitter();
  @Output() btnClickEvent = new EventEmitter();


  editClick() {
    // console.log(this.deviceId)
    this.deviceIdEvent.emit(this.deviceId)
    this.editClickEvent.emit();
  }
  deleteClick() {
    // console.log(this.deviceId)
    this.deviceIdEvent.emit(this.deviceId)
    this.deleteClickEvent.emit();
  }

  btnClick() {
    this.btnClickEvent.emit();
  }
  ngOnInit() {
    // console.log(this.deviceId)
  }

}
