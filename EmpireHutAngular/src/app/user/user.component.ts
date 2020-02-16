import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import {UserService} from '../service/user.service';
import { Router } from '@angular/router';
import {VariableService} from '../service/variable.service';

declare var M: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  imagePath: String
  //userDetails: Object
  constructor(private _http:UserService,private router:Router,private _VariableService:VariableService) {
    M.AutoInit();
   }

  ngOnInit() {
  
    this.imagePath = environment.imagePath
    this._http.decodeToken()
      .subscribe(d => {
        if (d["statusCode"] == 200) {
          this._http.getUserDetails(d["message"]["address"])
            .subscribe(r => {
              if (r["statusCode"] == 200) {
               // this.userDetails = r["data"]
                this._VariableService.userdetails=r["data"]
                console.log(this._VariableService.userdetails)
              }
            });
        }
        else {
          this.router.navigate(['']);
        }
      });
  }

  logout(){
    localStorage.clear();
    this.router.navigate([''])
  }

  navigate(value:any){

    switch(value){
      case 1:
        this.router.navigate(['user']);
        break;
      case 2:
        //this.router.navigate(['user/create']);
        break;
      case 3:
       // this.router.navigate(['admin/user']);
        break;
    }

  }

}
