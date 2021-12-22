import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  constructor(private router: Router) { }
  showPassword = false;
  passwordToggleIcon = 'eye';
  buttonName = "Reset Password";
  ngOnInit() {
  }
  title = 'Create New Password';
  primaryBtnText = "Reset Password";
  toLogin() {
    this.router.navigate(['login']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  backBtnTo() {
    this.router.navigate(['login']);
  }
}
