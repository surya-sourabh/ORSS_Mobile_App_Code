import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-component',
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.scss'],
})
export class FooterComponentComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }
  @Input() home: boolean;

  myDevices() {
    this.router.navigate(['my-devices']);
  }
  myChannels() {
    this.router.navigate(['view-all-channels']);
  }
  myScenes() {
    this.router.navigate(['view-all-scenes']);
  }
  myUsers() {
    this.router.navigate(['user-listing-screen']);
  }

  homeBtn() {
    this.router.navigate(['homepage']);
  }


}
