import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { VariableService } from 'src/app/service/variable.service';

declare var M: any;
@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {

  allProposals: Object;
  constructor(private _http: UserService, private _var: VariableService) {

  }

  ngOnInit() {
    this._http.reviewProposals(this._var.userdetails["address"])
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          this.allProposals = r["result"];
          console.log(r)
        }
        else {
          console.log("failed proposals")
        }
      });
  }

  approvereject(value: any) {
    // a purchase proposal deducts amount from user and has an expiry.
    //once it expires, the amount is refunded to the user
    //1-approve 2-reject


    //approve - apart from money transfer from proposed user to owner, we need to transfer ownership
    //and make proposals for this asset inactive, proposals after expiry are automatically transferred

    switch (value) {
      case 1:
        this._http.acceptProposal(this.allProposals)
          .subscribe(r => {
            if (r["statusCode"] == 200) {
              M.toast({ html: "Proposal Accepted", classes: 'rounded' })
            }
            else {
              M.toast({ html: "Something went Wrong", classes: 'rounded' })
            }
          });
        break;
      case 2:
        break;
    }
  }

}
