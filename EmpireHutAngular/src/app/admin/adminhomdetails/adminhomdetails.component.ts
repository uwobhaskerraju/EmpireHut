import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from 'src/app/service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
declare var M: any;
@Component({
  selector: 'app-adminhomdetails',
  templateUrl: './adminhomdetails.component.html',
  styleUrls: ['./adminhomdetails.component.css']
})
export class AdminhomdetailsComponent implements OnInit {
  assetDetails = [];
  imagePath: String;
  private routeSub: Subscription;
  assetID: String;
  assetTrans = [];
  constructor(private _http: AdminService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.imagePath = environment.imagePath
    this.routeSub = this.route.params.subscribe(params => {
      this.assetID = params['id']
    });
    this._http.getAssetDetails(this.assetID)
      .subscribe(data => {
        if (data["statusCode"] == 200) {
          this.assetDetails.push(data["result"]);
          this.getAssetTransactionHistory()
        }

        //console.log(this.assetDetails)
      });
  }

  goBack() {
    this.router.navigate(['admin'])
  }

  getAssetTransactionHistory() {
    this._http.getAssetTransactionHistory(this.assetID)
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          //M.toast({ html: "Proposal Rejected", classes: 'rounded' })
          this.assetTrans = r["result"];
        }
        else {
          M.toast({ html: "No Transaction History", classes: 'rounded' })
        }
      });
  }

}
