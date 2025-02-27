import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './notfound/notfound.component'
import { AuthGuard } from '../app/auth/auth.guard'


import { AdminComponent } from '../app/admin/admin.component'
import { AdminhomeComponent } from '../app/admin/adminhome/adminhome.component'
import { AdminhomdetailsComponent } from '../app/admin/adminhomdetails/adminhomdetails.component'
import { CreateassetComponent } from '../app/admin/createasset/createasset.component'
import { UsersComponent } from '../app/admin/users/users.component'
import { UserdetailsComponent } from '../app/admin/userdetails/userdetails.component'
import { TicketsComponent } from '../app/admin/tickets/tickets.component'
import{AdminticketdetailsComponent} from '../app/admin/adminticketdetails/adminticketdetails.component'

import { UserComponent } from '../app/user/user.component'
import { AssetsComponent } from '../app/user/assets/assets.component'
import { AssetdetailsComponent } from '../app/user/assetdetails/assetdetails.component'
import { ProposalsComponent } from '../app/user/proposals/proposals.component'
import { UserDetailsComponent } from '../app/user/myassets/myassets.component'
import { TransactionsComponent } from '../app/user/transactions/transactions.component'
import { MyticketsComponent } from '../app/user/mytickets/mytickets.component'
import { TicketdetailsComponent } from '../app/user/ticketdetails/ticketdetails.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', component: AdminhomeComponent },
      { path: 'asset/:id', component: AdminhomdetailsComponent },
      { path: 'create', component: CreateassetComponent },
      { path: 'user', component: UsersComponent },
      { path: 'user/view/:id', component: UserdetailsComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'ticket/:id', component: AdminticketdetailsComponent }
    ], canActivate: [AuthGuard], data: { role: 'admin' }
  },
  {
    path: 'user', component: UserComponent, children: [
      { path: '', component: AssetsComponent },
      { path: 'asset/:id', component: AssetdetailsComponent },
      { path: 'proposals', component: ProposalsComponent },
      { path: 'personal', component: UserDetailsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'tickets', component: MyticketsComponent },
      { path: 'ticket/:id', component: TicketdetailsComponent }
    ], canActivate: [AuthGuard], data: { role: 'user' }
  }
  ,
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/404' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
