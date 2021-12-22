import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPassPageModule } from '../pages/forgot-pass/forgot-pass.module';
import { IndexPage } from './index.page'


const routes: Routes = [
  {
    path: '',
    component: IndexPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../pages/welcome/welcome.module').then(m => m.WelcomePageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../pages/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('../pages/signup/signup.module').then(m => m.SignupPageModule)
      },
      {
        path: 'forgotpass',
        loadChildren: () => import('../pages/forgot-pass/forgot-pass.module').then(m => ForgotPassPageModule)
      }, {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexRouter { }
