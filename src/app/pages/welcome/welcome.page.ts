import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  public isGoogleLogin = false;
  constructor(private router: Router, private afAuth: AngularFireAuth, private auth: AuthService, private platform: Platform, private loadingCtrl: LoadingController) { }

  ngOnInit() {

    // this.afAuth.onAuthStateChanged(user => {
    // //   if (user) {
    // //     console.log(user)
    // //     this.router.navigate(['/homepage']);
    // //   }
    // // });

    this.platform.ready().then(async () => {
      const loading = await this.loadingCtrl.create({
        message: 'Please Wait',
        spinner: 'crescent',
        duration: 3000,
        showBackdrop: true
      });
      loading.present();
      this.afAuth.onAuthStateChanged(user => {
        if (user) {
          this.isGoogleLogin = true;
          this.router.navigate(['/homepage']);
          loading.dismiss();
        }
        else {
          this.isGoogleLogin = false;
          loading.dismiss();
        }
      });
    });
    // this.auth.user$.subscribe(user => {
    //   if (user) {
    //     this.router.navigate(['/homepage']);
    //   }
    // });
  }


  navigateToLogin() {
    this.router.navigate(['login']);
  }
}
