import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all-button',
  templateUrl: './view-all-button.component.html',
  styleUrls: ['./view-all-button.component.scss'],
})
export class ViewAllButtonComponent implements OnInit {

  constructor(private router: Router) { }


  ngOnInit() { }
  @Input() viewLText = '';
  @Input() viewRText = '';
  @Input() viewLIcon = '';
  @Input() viewRIcon = '';
  @Input() navigateLink = '';
  @Input() clone = '';
  @Input() showRightButton: boolean;


  navigate() {
    this.router.navigate([this.navigateLink]);
  }

}
