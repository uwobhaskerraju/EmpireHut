import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { VariableService } from 'src/app/service/variable.service';
import * as jspdf from 'jspdf';

declare var M: any;

@Component({
  selector: 'app-assetdetails',
  templateUrl: './assetdetails.component.html',
  styleUrls: ['./assetdetails.component.css']
})
export class AssetdetailsComponent implements OnInit {
  @Output() _userBal: EventEmitter<any> = new EventEmitter();
  @Output() _UsertokenCount: EventEmitter<any> = new EventEmitter();


  assetDetails = [];
  imagePath: String;
  private routeSub: Subscription;
  assetID: String;
  amount: String;
  self: boolean;
  assetTrans = [];
  nodetails: boolean
  notrans: boolean
  assetValue: String

  constructor(private _http: UserService, private route: ActivatedRoute, private router: Router,
    private _var: VariableService) {
    this.nodetails = true;
    this.notrans = true;
  }

  ngOnInit() {
    this.imagePath = environment.imagePath
    this.routeSub = this.route.params.subscribe(params => {
      this.assetID = params['id']
    });
    this._http.getAssetDetails(this.assetID)
      .subscribe(data => {
        this.nodetails = false;
        if (data["statusCode"] == 200) {
          this.assetDetails.push(data["result"]);
          if (data["result"]["ownerAdd"] == this._var.userdetails["address"]) {
            this.self = true
            this.getAssetTransactionHistory()
          }
        }
        else {
          M.toast({ html: "something went wrong", classes: 'rounded' })
          this.router.navigate(['user'])
        }

        //console.log(this.assetDetails)
      });
  }

  updateAssetValue() {
    this._http.updateAssetValue(this.assetValue, this.assetID)
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          M.toast({ html: "Operation Succesfull", classes: 'rounded' })
        }
        else {
          M.toast({ html: "Operation failed", classes: 'rounded' })
        }

      })
  }

  goBack() {
    this.router.navigate(['user'])
  }

  downloadPDF() {
    this._http.downloadPDF(this._var.userdetails["address"], this.assetID)
      .subscribe(r => {
        console.log(r)
        var doc = new jspdf('p', 'pt', 'letter');
        
        doc.setFontSize(12);
       let margins = {
          top: 30,
          bottom: 30,
          left: 10,
          width: 900
      };
        // let specialElementHandlers = {
        //   '#editor': function (element, renderer) {
        //     return true;
        //   }
        // }
        doc.fromHTML(r["result"], margins.left, margins.top, {
          'width': margins.width
          // ,
          // 'elementHandlers':specialElementHandlers
        })

        doc.save('file.pdf')

      })
  }

  getAssetTransactionHistory() {
    this._http.getAssetTransactionHistory(this.assetID)
      .subscribe(r => {
        //console.log(r)
        this.notrans = false
        if (r["statusCode"] == 200) {
          if (r["result"].length == undefined) {
            var temp = []
            temp.push(r["result"])
            this.assetTrans = temp
          }
          else {
            this.assetTrans = r["result"];
          }

        }
        else {
          M.toast({ html: "No Transaction History", classes: 'rounded' })
        }
      });
  }

  updateCount() {
    // emit data to parent component
    this._http.getBalance(this._var.userdetails["address"])
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          console.log(r)
          //this._VariableService.tokenCount = r["data"]["result"];
          this._userBal.emit(r["result"]);
          this._http.getOwnedAssets(this._var.userdetails["address"])
            .subscribe(r => {
              this._UsertokenCount.emit(r["result"])
              this.router.navigate(['user'])
            });

        }
        else {
          //console.log("something went wrong in getting balance")
          M.toast({ html: "something went wrong in getting balance", classes: 'rounded' })
        }

      });
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
    if (Number(this.amount) < Number(this.assetDetails[0]["price"])) {
      M.toast({ html: "The proposed amount cannot be less than Current Asset Value", classes: 'rounded' })
      return false;
    }
    //check whether the owner is admin or not
    //hit respective APIs based on that
    this._http.checkAdmin(this.assetDetails[0]["ownerAdd"])
      .subscribe(r => {
        console.log(r)
        if (r["result"]) {
          // yes owner is admin(govt), so we can directly buy 
          this._http.purchaseAsset(this.assetDetails[0], this._var.userdetails["address"], this.amount)
            .subscribe(r => {
              console.log(r)
              if (r["statusCode"] == 200) {
                M.toast({ html: "Asset Purchased! :) ", classes: 'rounded' })

                //call parent method
                this.updateCount();
                //;
              }
              else {
                M.toast({ html: "Something went wrong. Try Later ", classes: 'rounded' })
              }
              // console.log(r);
            });
        }
        else {
          this._http.submitProposal(this.amount, this._var.userdetails["address"], this.assetDetails[0])
            .subscribe(r => {
              if (r["statusCode"] == 200) {
                M.toast({ html: "Submitted Proposal", classes: 'rounded' })
                //call parent method
                this.updateCount();
                //;
              }
              else {
                M.toast({ html: "Something went wrong. Try Later ", classes: 'rounded' })
              }
              // console.log(r);

            });
        }
      });
  }

}
