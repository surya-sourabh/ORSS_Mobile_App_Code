import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-members-box',
  templateUrl: './members-box.component.html',
  styleUrls: ['./members-box.component.scss'],
})
export class MembersBoxComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  @Input() userMemberName = '';
  @Input() memberPhoto = '';
}
