import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserdetailsComponent implements OnInit {
  userDetails: object
  userID: String
  userTrans: object
  private routeSub: Subscription;
  nodetails:boolean;
  notrans:boolean

  constructor(private _http: AdminService, private route: ActivatedRoute, private router: Router) { 
    this.nodetails=true;
    this.notrans=true;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userID = params['id']
    });

    this._http.getAllUserDetails(this.userID)
      .subscribe(r => {
        this.nodetails=false;
        if (r["statusCode"] == 200) {
          
          // this.userDetails = {};
          this.userDetails = r["result"]
          //pull transactions of this user
          this._http.getUserTransactions(this.userDetails["address"])
            .subscribe(r => {
              if(r["statusCode"]==200){
                this.notrans=false
                this.userTrans = r["result"]
              }             
              //console.log(this.userTrans)
            });
        }
      });
  }

  goBack() {
    this.router.navigate(['admin/user'])
  }

  routerDetails(value: any) {
    console.log(value.srcElement.id)
    this.router.navigate(['admin/asset',value.srcElement.id])
  }
}
