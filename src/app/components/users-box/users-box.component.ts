import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-users-box',
  templateUrl: './users-box.component.html',
  styleUrls: ['./users-box.component.scss'],
})
export class UsersBoxComponent implements OnInit {
  profileImageURL: any = "/assets/images/default_avatar.png";
  //
  message = '';
  memberName = '';
  //
  constructor(
    public actionSheetCtrl: ActionSheetController,
    private router: Router,
    private auth: AuthService) {
    this.auth.user$.subscribe(user => {
      if (user) {
        if (user['photoURL']) {
          this.profileImageURL = user['photoURL'];
        }
      }
    })
  }

  @Input() userMemberName = '';
  @Input() deviceIcons = '';
  @Input() deviceIconsType = '';
  @Input() memberId: any;
  @Input() sendMemberId: any
  @Input() memberProfileImage: any;

  @Output() buttonClickEvent = new EventEmitter();
  @Output() memberIdEvent = new EventEmitter();
  @Output() memberNameEvent = new EventEmitter();

  buttonClick() {
    this.buttonClickEvent.emit();
    this.memberIdEvent.emit(this.memberId)
    // this.memberNameEvent.emit(this.userMemberName)
    this.memberName = this.userMemberName

    this.message = this.memberId;
    this.auth.setMessage(this.message)
    this.auth.setMessage2(this.userMemberName)
  }

  ngOnInit(): void { }


}