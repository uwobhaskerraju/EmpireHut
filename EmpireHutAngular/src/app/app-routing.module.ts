import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component'
import { AuthGuard } from '../app/auth/auth.guard'


import { AdminComponent } from '../app/admin/admin.component'
import { AdminhomeComponent } from '../app/admin/adminhome/adminhome.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard], children: [
      { path: '', component: AdminhomeComponent }
    ]
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
