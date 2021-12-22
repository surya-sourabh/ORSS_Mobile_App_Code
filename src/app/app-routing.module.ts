
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./index/index.module').then(m => m.IndexPageModule)

  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'homepage',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-pass',
    loadChildren: () => import('./pages/forgot-pass/forgot-pass.module').then(m => m.ForgotPassPageModule)
  },
  {
    path: 'fg-mail',
    loadChildren: () => import('./pages/fg-mail/fg-mail.module').then(m => m.FgMailPageModule)
  },
  {
    path: 'reset-pass',
    loadChildren: () => import('./pages/reset-pass/reset-pass.module').then(m => m.ResetPassPageModule)
  },
  {
    path: 'add-channel',
    loadChildren: () => import('./pages/add-channel/add-channel.module').then(m => m.AddChannelPageModule)
  },
  {
    path: 'add-channel-one',
    loadChildren: () => import('./pages/add-channel-one/add-channel-one.module').then(m => m.AddChannelOnePageModule)
  },
  // {
  //   path: 'add-channel-connect',
  //   loadChildren: () => import('./pages/add-channel-connect/add-channel-connect.module').then(m => m.AddChannelConnectPageModule)
  // },
  {
    path: 'add-channel-connected',
    loadChildren: () => import('./pages/add-channel-connected/add-channel-connected.module').then(m => m.AddChannelConnectedPageModule)
  },
  {
    path: 'view-all-scenes',
    loadChildren: () => import('./pages/view-all-scenes/view-all-scenes.module').then(m => m.ViewAllScenesPageModule)
  },
  {
    path: 'add-device-to-channel',
    loadChildren: () => import('./pages/add-device-to-channel/add-device-to-channel.module').then(m => m.AddDeviceToChannelPageModule)
  },
  {
    path: 'my-devices',
    loadChildren: () => import('./pages/my-devices/my-devices.module').then(m => m.MyDevicesPageModule)
  },
  {
    path: 'user-listing-screen',
    loadChildren: () => import('./pages/user-listing-screen/user-listing-screen.module').then(m => m.UserListingScreenPageModule)
  },
  {
    path: 'view-all-channels',
    loadChildren: () => import('./pages/view-all-channels/view-all-channels.module').then(m => m.ViewAllChannelsPageModule)
  },
  {
    path: 'schedule-the-scene',
    loadChildren: () => import('./pages/schedule-the-scene/schedule-the-scene.module').then(m => m.ScheduleTheScenePageModule)
  },
  {
    path: 'view-all-devices',
    loadChildren: () => import('./pages/view-all-devices/view-all-devices.module').then(m => m.ViewAllDevicesPageModule)
  },
  {
    path: 'nodevice-in-channel',
    loadChildren: () => import('./pages/nodevice-in-channel/nodevice-in-channel.module').then(m => m.NodeviceInChannelPageModule)
  },
  {
    path: 'add-new-user',
    loadChildren: () => import('./pages/add-new-user/add-new-user.module').then(m => m.AddNewUserPageModule)
  },
  {
    path: 'user-edit',
    loadChildren: () => import('./pages/user-edit/user-edit.module').then(m => m.UserEditPageModule)

  },
  {
    path: 'add-scenepage',
    loadChildren: () => import('./pages/add-scenepage/add-scenepage.module').then(m => m.AddScenepagePageModule)
  },
  {
    path: 'account-info',
    loadChildren: () => import('./pages/account-info/account-info.module').then( m => m.AccountInfoPageModule)
  },
  {
    path: 'testing-page',
    loadChildren: () => import('./pages/testing-page/testing-page.module').then( m => m.TestingPagePageModule)
  },
  {
    path: 'wifi-scan-list',
    loadChildren: () => import('./pages/wifi-scan-list/wifi-scan-list.module').then( m => m.WifiScanListPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
