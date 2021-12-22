import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions
} from 'ngx-mqtt';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
// import { HideHeaderDirective } from './directives/hide-header.directive';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ButtonComponent } from './components/button/button.component';

// Enivronment
import { environment } from '../environments/environment.prod';

// Auth Service
import { AuthService } from './services/auth.service';

// Auth Guard
import { AuthGuard } from './guards/auth.guard';
// import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'
// import * as serviceAccount from '../admin/apsis-aac9d-firebase-adminsdk-qitdv-3e8869e86f.json'
import {Hotspot} from '@ionic-native/hotspot/ngx'
export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: '44.196.40.28',
  port: 8083,
  path: '/mqtt',
  protocol: 'ws'
};

// const refreshToken = '841742503672-mkp7dl0qplbe8rvpqcievf7219umb1mr.apps.googleusercontent.com'; // Get refresh token from OAuth2 flow

// admin.initializeApp({
//   credential: admin.credential.refreshToken(serviceAccount),
//   databaseURL: 'https://apsis-aac9d-default-rtdb.asia-southeast1.firebasedatabase.app'
// });
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   projectId: '<FIREBASE_PROJECT_ID>',
// });

@NgModule({
  declarations: [AppComponent, ButtonComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)],
  providers: [
    AndroidPermissions,
    AuthService,
    AuthGuard,
    Geolocation,
    GooglePlus,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, BarcodeScanner, ApiService, Hotspot],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
    library.addIcons(faCoffee);
  }
}
