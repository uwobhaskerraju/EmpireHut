import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/service/admin.service';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private _http: AdminService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.userID = params['id']
    });

    this._http.getAllUserDetails(this.userID)
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          // this.userDetails = {};
          this.userDetails = r["result"]
          //pull transactions of this user
          this._http.getUserTransactions(this.userDetails["address"])
            .subscribe(r => {
              this.userTrans = r["result"]
              //console.log(this.userTrans)
            });
        }
      });
  }

}
