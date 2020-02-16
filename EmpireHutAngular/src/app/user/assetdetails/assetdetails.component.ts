import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { VariableService } from 'src/app/service/variable.service';

declare var M: any;

@Component({
  selector: 'app-assetdetails',
  templateUrl: './assetdetails.component.html',
  styleUrls: ['./assetdetails.component.css']
})
export class AssetdetailsComponent implements OnInit {
  assetDetails = [];
  imagePath: String;
  private routeSub: Subscription;
  assetID: String;
  amount: String;

  constructor(private _http: UserService, private route: ActivatedRoute, private router: Router,
    private _var: VariableService) { }

  ngOnInit() {
    this.imagePath = environment.imagePath
    this.routeSub = this.route.params.subscribe(params => {
      this.assetID = params['id']
    });
    this._http.getAssetDetails(this.assetID)
      .subscribe(data => {
        this.assetDetails.push(data);
        //console.log(this.assetDetails)
      });
  }

  goBack() {
    this.router.navigate(['user'])
  }

  submitProposal() {

    if (this.amount > this._var.userdetails["balance"]) {
      M.toast({ html: "The proposed amount exceeds your balance", classes: 'rounded' })
      return false
    }
    if (Number(this.amount) <= 0) {
      M.toast({ html: "The proposed amount cannot be less than zero", classes: 'rounded' })
      return false;
    }

    //check whether the owner is admin or not
    //hit respective APIs based on that
    this._http.checkAdmin(this.assetDetails[0]["address"])
      .subscribe(r => {
        if (r["result"]) {
          // yes owner is admin(govt), so we can directly buy 
          this._http.purchaseAsset(this.assetDetails[0],this._var.userdetails["address"])
          .subscribe();
        }
        else {
          this._http.submitProposal(this.amount, this._var.userdetails["address"], this.assetDetails[0])
            .subscribe(r => {
              console.log(r);
            });
        }
      });


  }
}
