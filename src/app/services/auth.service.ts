import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
// import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import 'firebase/auth';
import firebase from 'firebase/app';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  // user: User;
  userInfo = null;
  subscription: Subscription;
  boxMemberId: any;
  accessLevel: any;
  //
  clickedMemberName: string
  //
  userData = [];
  clickedMemberId: any;
  status: any;


  public isGoogleLogin = false;
  public user = null;

  constructor
    (
      private afs: AngularFirestore,
      private afauth: AngularFireAuth,
      private router: Router,
      private LoadingCtrl: LoadingController,
      private toaster: ToastController,
      private google: GooglePlus,
      private platform: Platform
    ) {
    this.user$ = this.afauth.authState
      .pipe(
        switchMap(user => {

          if (user) {
            return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      )
  } // end of constructor

  setMessage(data) {
    this.clickedMemberId = data;
  }

  setMessage2(data2) {
    this.clickedMemberName = data2;
  }

  getMessage() {
    return this.clickedMemberId;
  }

  getMessage2() {
    return this.clickedMemberName
  }
  async signIn(email, password) {
    const loading = await this.LoadingCtrl.create({
      message: 'Authenticating..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afauth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        // console.log(response)
        this.afauth.signInWithEmailAndPassword(email, password)
          .then(async (data) => {
            //User successfully logged in so he is a valid user
            //check if email is verified
            console.log(data)
            if (!data.user.emailVerified) {
              loading.dismiss();
              this.toast('Please verify your email address!', 'warning');
              this.afauth.signOut();
            } else {
              //check if user.uid present in  USER collection 
              this.subscription = this.afs.collection('user').doc(data.user.uid).valueChanges().subscribe(userData => {

                // console.log(userData)

                if (userData) {
                  this.subscription.unsubscribe();
                  loading.dismiss();
                  // console.log('existingUser', data);
                  this.router.navigate(['/home']);

                } else {
                  //valid user but not present in USER collection (so must be a referred user)
                  console.log('NEW USER add the user to USER collection', data);
                  this.subscription.unsubscribe();

                  //get user data from referredUser collection
                  this.subscription = this.afs.collection('referredUser').doc(data.user.uid).valueChanges().subscribe(refUserData => {
                    console.log('refUser data', refUserData)

                    //add the referredUser data into USER colection
                    this.afs.collection('user').doc(data.user.uid).set({
                      'userId': refUserData['memberId'],
                      'userName': refUserData['memberName'],
                      'userEmail': refUserData['memberEmail'],
                      'userPassword': refUserData['memberPass'],
                      'createdAt': Date.now(),
                      'accessLevel': 1,
                      'wifi': {
                        state: false,
                        ssid: '',
                        wifiPass: '',
                      },
                    })
                      .then(() => {
                        loading.dismiss();
                        this.toast('Registration Success!! Registered as secondary user', 'success');
                        this.router.navigate(['/home']);
                      })
                      .catch(error => {
                        loading.dismiss();
                        this.toast(error.message, 'danger');
                      }).finally(() => {
                        this.subscription.unsubscribe();
                      })


                    // ADD the current user(secondary) to member array of referrer(parent) using refUserData.referrerId
                    this.afs.collection('user').doc(refUserData['referrerId']).update({
                      "membersarray": firebase.firestore.FieldValue.arrayUnion({
                        memberName: refUserData['memberName'],
                        memberEmail: refUserData['memberEmail'],
                        memberId: refUserData['memberId'],
                        memberPass: refUserData['memberPass'],
                      })
                    });


                    // ADD the current user to parent member collection
                    this.afs.collection('user').doc(refUserData['referrerId']).collection('members').doc(refUserData['memberId']).set({
                      memberName: refUserData['memberName'],
                      memberEmail: refUserData['memberEmail'],
                      memberId: refUserData['memberId'],
                      memberPass: refUserData['memberPass'],
                    });

                  })
                }
                return data;
              })

            }
          })
          .catch(error => {
            loading.dismiss();
            this.toast(error.message, 'danger');
          })
          // })
          .catch(error => {
            loading.dismiss();
            this.toast(error.message, 'danger');
          });

      })
  } // end of signin

  async signInNoLocal(email, password) {
    const loading = await this.LoadingCtrl.create({
      message: 'Authenticating..',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afauth.setPersistence(firebase.auth.Auth.Persistence.NONE)
      .then(() => {
        // console.log(response)
        this.afauth.signInWithEmailAndPassword(email, password)
          .then(async (data) => {
            //User successfully logged in so he is a valid user
            //check if email is verified
            console.log(data)
            if (!data.user.emailVerified) {
              loading.dismiss();
              this.toast('Please verify your email address!', 'warning');
              this.afauth.signOut();
            } else {
              //check if user.uid present in  USER collection 
              this.subscription = this.afs.collection('user').doc(data.user.uid).valueChanges().subscribe(userData => {

                // console.log(userData)

                if (userData) {
                  this.subscription.unsubscribe();
                  loading.dismiss();
                  // console.log('existingUser', data);
                  this.router.navigate(['/home']);

                } else {
                  //valid user but not present in USER collection (so must be a referred user)
                  console.log('NEW USER add the user to USER collection', data);
                  this.subscription.unsubscribe();

                  //get user data from referredUser collection
                  this.subscription = this.afs.collection('referredUser').doc(data.user.uid).valueChanges().subscribe(refUserData => {
                    console.log('refUser data', refUserData)

                    //add the referredUser data into USER colection
                    this.afs.collection('user').doc(data.user.uid).set({
                      'userId': refUserData['memberId'],
                      'userName': refUserData['memberName'],
                      'userEmail': refUserData['memberEmail'],
                      'userPassword': refUserData['memberPass'],
                      'createdAt': Date.now(),
                      'accessLevel': 1,
                      'wifi': {
                        state: false,
                        ssid: '',
                        wifiPass: '',
                      },
                    })
                      .then(() => {
                        loading.dismiss();
                        this.toast('Registration Success!! Registered as secondary user', 'success');
                        this.router.navigate(['/home']);
                      })
                      .catch(error => {
                        loading.dismiss();
                        this.toast(error.message, 'danger');
                      }).finally(() => {
                        this.subscription.unsubscribe();
                      })


                    // ADD the current user(secondary) to member array of referrer(parent) using refUserData.referrerId
                    this.afs.collection('user').doc(refUserData['referrerId']).update({
                      "membersarray": firebase.firestore.FieldValue.arrayUnion({
                        memberName: refUserData['memberName'],
                        memberEmail: refUserData['memberEmail'],
                        memberId: refUserData['memberId'],
                        memberPass: refUserData['memberPass'],
                      })
                    });


                    // ADD the current user to parent member collection
                    this.afs.collection('user').doc(refUserData['referrerId']).collection('members').doc(refUserData['memberId']).set({
                      memberName: refUserData['memberName'],
                      memberEmail: refUserData['memberEmail'],
                      memberId: refUserData['memberId'],
                      memberPass: refUserData['memberPass'],
                    });

                  })
                }
                return data;
              })

            }
          })
          .catch(error => {
            loading.dismiss();
            this.toast(error.message, 'danger');
          })
          // })
          .catch(error => {
            loading.dismiss();
            this.toast(error.message, 'danger');
          });

      })
  } // end of signin

  async signOut() {
    const loading = await this.LoadingCtrl.create({
      message: 'Loging Out',
      spinner: 'crescent',
      showBackdrop: true,
      duration: 10000
    });
    loading.present();

    this.afauth.signOut().then(() => {
      loading.dismiss();
      this.isGoogleLogin = false;
      this.user = null;
      window.localStorage.clear()
      this.router.navigate(['login'])

    });
  }



  async googleSignIn() {
    let params: any;
    if (this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        params = {
          webClientId: '841742503672-dq3l3rbkkcvl4k0312t79q0smj886mih.apps.googleusercontent.com', //  webclientID 'string'
          offline: true
        };
      } else {
        params = {};
      }
      this.google.login(params)
        .then((response) => {
          const { idToken, accessToken } = response;
          this.onLoginSuccess(idToken, accessToken);
        }).catch((error) => {
          console.log(error);
          console.log('error:' + JSON.stringify(error));
        });
    } else {
      const loading = await this.LoadingCtrl.create({
        message: 'Loging In',
        spinner: 'crescent',
        showBackdrop: true,
        duration: 10000
      });
      loading.present();
      console.log('else...');
      this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(success => {
        console.log('success in google login', success);
        this.isGoogleLogin = true;
        this.user = success.user;
        this.subscription = this.afs.collection('user').doc(success.user.uid).valueChanges().subscribe(userData => {

          if (userData) {
            console.log('exsisting user')
            console.log(userData)
            loading.dismiss();
            this.subscription.unsubscribe();
            this.router.navigate(['/home']);
          }
          else {
            console.log('new user')
            this.afs.collection('user').doc(success.user.uid).set({
              'userName': success.user.displayName,
              'userId': success.user.uid,
              'userEmail': success.user.email,
              'photoURL': success.user.photoURL,
              'isGoogleUser': true
            });
            this.router.navigate(['home'])
          }
        })
      }).catch(err => {
        console.log(err.message, 'error in google login');
      });
    }
  }


  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
      .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
        .credential(accessToken);
    console.log(credential)
    this.afauth.signInWithCredential(credential)
      .then(async (success) => {
        const loading = await this.LoadingCtrl.create({
          message: 'Loging In',
          spinner: 'crescent',
          showBackdrop: true,
          duration: 10000
        });
        loading.present();
        console.log('successfully', success);
        this.isGoogleLogin = true;
        this.user = success.user;
        this.subscription = this.afs.collection('user').doc(success.user.uid).valueChanges().subscribe(userData => {

          if (userData) {
            console.log('exsisting user')
            console.log(userData)
            loading.dismiss();
            this.subscription.unsubscribe();
            this.router.navigate(['/home']);
          }
          else {
            console.log('new user')
            this.afs.collection('user').doc(success.user.uid).set({
              'userName': success.user.displayName,
              'userId': success.user.uid,
              'userEmail': success.user.email,
              'photoURL': success.user.photoURL,
              'isGoogleUser': true
            });
            this.router.navigate(['home'])
          }
        })

        // this.loading.dismiss();
      });

  }
  onLoginError(err) {
    console.log(err);
  }



  async loginInWithFacebook() {
    await this.afauth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(
      res => {
        console.log(res);
        this.afs.collection('user').doc(res.user.uid).set({
          'userId': res.user.email,
          'photoURL': res.user.photoURL,
          'createdAt': res.user.metadata.creationTime,
          'lastSignedInAt': res.user.metadata.lastSignInTime
        });
        this.router.navigate(['/homepage']);
      }).catch(err => {
        console.log('error while signing in!!', err);
      })
  }

  sendDeviceStatus(data) {
    this.status = data;
  }

  getDeviceStatus() {
    return this.status;
  }

  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      color: status,
      position: 'top',
      duration: 3000
    });
    toast.present();
  } // end of toast
}

