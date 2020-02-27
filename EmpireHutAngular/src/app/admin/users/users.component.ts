import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  allUsers: Object;
  nousers:boolean
  constructor(private _http: AdminService, private router: Router, private route: ActivatedRoute) { 
    this.nousers=true
  }

  ngOnInit() {
    this._http.getAllUsers()
      .subscribe(r => {
        this.nousers=false;
        if (r["statusCode"] == 200) {
          this.allUsers = r["result"]
        }
      });
  }

  showDetails(value: any) {
    //console.log(value.srcElement.id);
    this.router.navigate(['view', value.srcElement.id],{relativeTo:this.route})
  }

}
