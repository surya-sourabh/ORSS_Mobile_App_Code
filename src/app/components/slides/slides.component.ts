import { AfterViewInit, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements AfterViewInit {
  styleButton: any;
  buttonName = 'Skip';
  selectedSlide: any;



  slideOpts = {
    loop: false,
    autoplay: false,
  };
  activeIndex: any;
  rememberMe: string;
  userId: string;


  constructor(private router: Router,
    private auth: AuthService,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
  ) { }

  ngOnInit() {

    // this.afauth.authState.subscribe((user) => {
    //   if (user) {
    //     this.userId = user.uid;

    //   }
    //   this.afs.collection('user').doc(this.userId).get()
    //     .subscribe((data) => {
    //       this.rememberMe = data.get('Remember')
    //       if (this.rememberMe == 'yes') {
    // this.auth.user$.subscribe(user => {
    //   if (user) {
    //     this.router.navigate(['/homepage']);
    //   }
    // });
    // }

    //     })
    // })

  }
  ngAfterViewInit() {
  }

  ionSlideChange(slides) {
    this.styleButton = {
      'background-color': 'green'
    }

    slides.getActiveIndex().then((activeIndex) => {
      if (activeIndex == 0) {
        this.styleButton = {
          'border': '1px solid #A078F4', 'color': '##A078F4'
        }
      } else if (activeIndex == 1) {
        this.styleButton = {
          'border': '1px solid #f478ca', 'color': '#f478ca'
        }
      } else if (activeIndex == 2) {
        this.styleButton = {
          'border': '1px solid #a078f4', 'color': '#a078f4'
        }
      }
    });

    slides.isEnd().then((isLast) => {
      if (isLast) {
        this.buttonName = 'Get Started';
      } else {
        this.buttonName = 'Skip';
      }
    });

  }



  next() {
    this.router.navigate(['login']);

  }
}


