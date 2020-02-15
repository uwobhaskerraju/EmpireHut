import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  imagePath: String
  userDetails: Object
  constructor(private _http: AdminService, private router: Router) { }

  ngOnInit() {
    this.imagePath = environment.imagePath
    this._http.decodeToken()
      .subscribe(d => {
        if (d["statusCode"] == 200) {
          this._http.getUserDetails(d["message"]["address"])
            .subscribe(r => {
              if (r["statusCode"] == 200) {
                this.userDetails = r["data"]
                console.log(this.userDetails)
              }
            });
        }
        else {
          this.router.navigate(['']);
        }
      });
  }

  logout() {
    localStorage.clear();
    this.router.navigate([''])
  }

  navigate(value:any){

    switch(value){
      case 1:
        this.router.navigate(['admin']);
        break;
      case 2:
        this.router.navigate(['admin/create']);
        break;
      case 3:
        this.router.navigate(['admin/user']);
        break;
    }

  }

}
