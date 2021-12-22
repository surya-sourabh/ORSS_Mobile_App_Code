import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { HttpClient } from '@angular/common/http';
import firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [AngularFireAuth, AuthService]
})
export class LoginPage implements OnInit {
  title = 'Login';
  buttonName = 'Login';
  primaryBtnText = "Login";
  showPassword = false;
  passwordToggleIcon = 'eye';
  email: string;
  password: string;
  toggle: boolean = true
  remeberMe: boolean = false;
  user = null
  token = null

  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastController,
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
  }


  change(event) {
    console.log(event)
    this.remeberMe = event.srcElement.checked
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  signup() {
    this.router.navigate(['signup']);
  }

  fg() {
    this.router.navigate(['forgotpass'])
  }

  homePage() {
    this.router.navigate(['homepage']);
  }

  backBtnTo() {
    this.router.navigate(['welcome']);
  }

  login() {
    console.log(this.remeberMe)
    if (this.remeberMe == false) {

      if (this.email && this.password) {
        this.auth.signIn(this.email, this.password);
      } else {
        this.toast('Please enter your email & password', 'warning');
      }
    } else if (this.remeberMe == true) {
      if (this.email && this.password) {
        this.auth.signInNoLocal(this.email, this.password);
      } else {
        this.toast('Please enter your email & password', 'warning');
      }
    }
  }

  signInViaGoogle() {
    this.auth.googleSignIn();
  }

  async signInViaFacebook() {
    // this.auth.loginInWithFacebook();

    const FACEBOOK_PERMISSIONS = ['email'];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

    if (result.accessToken && result.accessToken.userId) {
      // Login successful.
      this.token = result.accessToken
      this.loadUserData()
      console.log(`Facebook access token is ${result.accessToken.token}`);
    } else if (result.accessToken && !result.accessToken.userId) {
      this.getCurrentToken()
    } else {
      //login failed
    }

  }

  async getCurrentToken() {
    const result = await FacebookLogin.getCurrentAccessToken()
    if (result.accessToken) {
      this.token = result.accessToken
      console.log(result)
      this.loadUserData()
    } else {

    }
  }

  async loadUserData() {
    const credential = firebase.auth.FacebookAuthProvider.credential(this.token.token)
    this.afAuth.signInWithCredential(credential)
      .then((response) => {
        console.log(response)
        const url = `https://graph.facebook.com/${this.token.userId}?
        fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
        this.http.get(url).subscribe(res => {
          console.log('User:', res)
          this.user = res
          this.afs.collection('user').doc(response.user.uid).set({
            'userName': response.user.displayName,
            'userId': response.user.uid,
            'userEmail': response.user.email,
            'photoURL': this.user.picture.data.url,
            'isFacebookUser': true
          });
          this.router.navigate(['home'])
        });
      })
  }

  async toast(message, status) {
    const toast = await this.toastr.create({
      message: message,
      color: status,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }
}
