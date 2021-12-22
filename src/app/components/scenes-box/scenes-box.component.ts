import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-scenes-box',
  templateUrl: './scenes-box.component.html',
  styleUrls: ['./scenes-box.component.scss'],
})
export class ScenesBoxComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }
  @Input () sceneName='';
  @Input () statusArray='';
  @Input () sceneIcon='';
  @Input () sceneId='';
  @Input () totalScenesDevices='';
  @Output() sceneIdEvent = new EventEmitter();
  @Output() clickEvent = new EventEmitter();
//  active=false
sceneClickEvent()
{
  this.sceneIdEvent.emit(this.sceneId);
  this.clickEvent.emit();
}

}



