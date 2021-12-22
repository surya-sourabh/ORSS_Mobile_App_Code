import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  name: string = '';
  email: string = '';
  password: string = '';

  reactiveForm: FormGroup;
  submitted: boolean = false;
  channelsarray: {

  };
  showPassword = false;
  passwordToggleIcon = 'eye';
  primaryBtnText = "Sign Up";
  title = "Sign Up";
  check: boolean = false;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afauth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toaster: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.reactiveForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}')]),
      cPassword: new FormControl(null, [Validators.required])
    }), {
      validators: this.mustMatch('password', 'cPassword')
    }
  }

  get f() {
    return this.reactiveForm.controls;
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true })
      }
      else {
        matchingControl.setErrors(null);
      }
    }
  }
  
  toggle() {
  
    console.log(this.check)
  }

  onSubmit() {
    this.submitted = true;
    if (this.reactiveForm.invalid) {
      return;
    }
    // /^[a-zA-Z]+$/
    else {
      if (this.name.match(/[a-zA-Z][a-zA-Z ]+/)) {
        this.register();
      } else {
        this.toast('Name should be in Alphabets', 'warning');
      }
    }
  }



  ngOnInit() {
  }

  async register() {
    if (this.check == false) {
      this.toast('Please Accept the policy and terms', 'warning')
    }
    else if (this.name && this.email && this.password) {
      const loading = await this.loadingCtrl.create({
        message: 'processing..',
        spinner: 'crescent',
        showBackdrop: true
      });
      loading.present();
      this.afauth.createUserWithEmailAndPassword(this.email, this.password).then((data) => {

        data.user.sendEmailVerification()
        const salt = bcrypt.genSaltSync(10);
        var pass = bcrypt.hashSync(this.password, salt);
        console.log(data)

        this.afs.collection('user').doc(data.user.uid).set({
          'userId': data.user.uid,
          'userName': this.name,
          'userEmail': this.email,
          'userPassword': pass,
          'createdAt': Date.now(),
          'accessLevel': 0,
          'wifi': {
            state: false,
            ssid: '',
            wifiPass: '',
          },
        })
          .then(() => {
            loading.dismiss();
            this.toast('Registration Success!! Please check & validate your email..', 'success');
            this.router.navigate(['/login']);
          })
          .catch(error => {
            loading.dismiss();
            this.toast(error.message, 'danger');
          })
      }).catch(error => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      })
    }
  } //end of register

  async toast(message, status) {
    const toast = await this.toaster.create({
      message: message,
      color: status,
      position: 'top',
      duration: 3000
    });

    toast.present();
  } // end of toast

  login() {
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
