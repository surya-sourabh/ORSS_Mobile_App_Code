import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-primary-button',
  templateUrl: './primary-button.component.html',
  styleUrls: ['./primary-button.component.scss'],
})
export class PrimaryButtonComponent implements OnInit {
  @Input() primaryBtnText = '';
  @Output() btnEvent = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  btnClick() {
    this.btnEvent.emit();
  }
}
