import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockHttpCalIInterceptor } from '../app/interceptor/http.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NotfoundComponent } from './notfound/notfound.component';
import { AdminComponent } from './admin/admin.component';
import { AdminhomeComponent } from './admin/adminhome/adminhome.component';
import { AdminhomdetailsComponent } from './admin/adminhomdetails/adminhomdetails.component';
import { UserComponent } from './user/user.component';
import { CreateassetComponent } from './admin/createasset/createasset.component';
import { EditassetComponent } from './admin/editasset/editasset.component';
import { AssetsComponent } from './user/assets/assets.component';
import { AssetdetailsComponent } from './user/assetdetails/assetdetails.component';
import { UsersComponent } from './admin/users/users.component';
import { UserdetailsComponent } from './admin/userdetails/userdetails.component';
import { ProposalsComponent } from './user/proposals/proposals.component';
import { UserDetailsComponent } from './user/myassets/myassets.component';
import { TransactionsComponent } from './user/transactions/transactions.component';
import { AuthGuard } from './auth/auth.guard';
import { MyticketsComponent } from './user/mytickets/mytickets.component';
import { TicketdetailsComponent } from './user/ticketdetails/ticketdetails.component';
import { TicketsComponent } from './admin/tickets/tickets.component';
import { AdminticketdetailsComponent } from './admin/adminticketdetails/adminticketdetails.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NotfoundComponent,
    AdminComponent,
    AdminhomeComponent,
    AdminhomdetailsComponent,
    UserComponent,
    CreateassetComponent,
    EditassetComponent,
    AssetsComponent,
    AssetdetailsComponent,
    UsersComponent,
    UserdetailsComponent,
    ProposalsComponent,
    UserDetailsComponent,
    TransactionsComponent,
    MyticketsComponent,
    TicketdetailsComponent,
    TicketsComponent,
    AdminticketdetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MockHttpCalIInterceptor,
    multi: true
  },AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
