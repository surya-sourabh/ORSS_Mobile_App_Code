import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fg-mail',
  templateUrl: './fg-mail.page.html',
  styleUrls: ['./fg-mail.page.scss'],
})
export class FgMailPage implements OnInit {

  constructor(private router: Router) { }
  buttonName = "Ok";
  primaryBtnText = "Continue";
  ngOnInit() {
  }

  login() {
    this.router.navigate(['login']);
  }

  fgPass() {
    this.router.navigate(['forgot-pass']);
  }

}
