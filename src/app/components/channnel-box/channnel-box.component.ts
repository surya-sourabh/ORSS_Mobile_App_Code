import { Component, OnInit ,Input, Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-channnel-box',
  templateUrl: './channnel-box.component.html',
  styleUrls: ['./channnel-box.component.scss'],
})
export class ChannnelBoxComponent implements OnInit {

  constructor() { }

  @Input() powerState = '';
  @Input() channelIcon='';
  @Input() channelName='';
  @Input() channelDeviceConnected:any;
  @Input ()  channelId:any;
  @Input ()  channelCapacity:any;
  @Output() btnEvent = new EventEmitter;
  @Output() onOffBtnEvent = new EventEmitter;
  ngOnInit() {}

  btnClick(){
    this.onOffBtnEvent.emit();
  }

  channelClick(){
    this.btnEvent.emit()
  }


}
