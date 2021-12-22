import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss'],
})
export class TitleBarComponent implements OnInit {

  user: User;
  name: any;
  profileImageURL = "/assets/images/default_avatar.png";

  today: number = Date.now();
  userId: string;
  userName: string;
  date: any;
  hour: any;
  minute: any;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.name = user.userName;

        if (user?.photoURL) {
          this.profileImageURL = user.photoURL;
        }
      }

    })
    this.date = new Date();
    this.hour = this.date.getHours();
    this.minute = this.date.getMinutes();

    if (this.minute < 10) {
      this.minute = "0" + this.minute;
    }
    if (this.hour < 12) {
      this.titlebarLTiText = "Good Morning!";
    } else if (this.hour < 17) {
      this.titlebarLTiText = "Good Afternoon!";
    } else {
      this.titlebarLTiText = "Good Evening!";
    }
  }
  @Input() titlebarLTiText = '';
  @Input() titlebarRTiText = '';
  @Input() titlebarLSubTiText = '';
  @Input() titlebarRSubTiText = '';


  goToAccountInfo() {
    this.router.navigate(['account-info']);
  }
}
