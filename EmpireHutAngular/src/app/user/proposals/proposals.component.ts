import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { VariableService } from 'src/app/service/variable.service';

declare var M: any;
@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent implements OnInit {
  @Output() _userBal: EventEmitter<any> = new EventEmitter();
  @Output() _UsertokenCount: EventEmitter<any> = new EventEmitter();

  allProposals = [];
  hasProp: boolean
  constructor(private _http: UserService, private _var: VariableService) {
    this.hasProp = true;
    this.allProposals.length=0
  }

  ngOnInit() {
    this.allProposals=[];
    this._http.reviewProposals(this._var.userdetails["address"])
      .subscribe(r => {
       // console.log(r)
        this.hasProp = false;
        if (r["statusCode"] == 200) {
          var temp=[]
          if(r["result"].length==undefined){
            temp.push(r["result"])
            this.allProposals=temp
          }
          else{
            this.allProposals = r["result"];
          }
         
          
        }
        //console.log(this.allProposals.length)
        //console.log(this.allProposals)
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
          .subscribe(r=>{
            this._UsertokenCount.emit(r["result"])
           // this.router.navigate(['user'])
          });
         
        }
        else {
          //console.log("something went wrong in getting balance")
          M.toast({ html: "something went wrong in getting balance", classes: 'rounded' })
        }

      });
  }

  approvereject(values: any) {
    // a purchase proposal deducts amount from user and has an expiry.
    //once it expires, the amount is refunded to the user
    //1-approve 2-reject

    let value = Number(String(values.srcElement.id).split('_')[1])
    let id = String(values.srcElement.id).split('_')[0]
    let jsnData = {};
    //console.log(value+" "+id)

    for (var c in this.allProposals) {
      // console.log(c)
      // console.log(this.allProposals[c]["_id"])
      if (this.allProposals[c]["_id"] == id) {
        jsnData = this.allProposals[c];
        //console.log("Asd")
        break;
      }
    }

    //console.log(jsnData)
    //approve - apart from money transfer from proposed user to owner, we need to transfer ownership
    //and make proposals for this asset inactive, proposals after expiry are automatically transferred

    switch (value) {
      case 1:
        this._http.acceptProposal(jsnData)
          .subscribe(r => {
            if (r["statusCode"] == 200) {
              M.toast({ html: "Proposal Accepted", classes: 'rounded' })
              this.updateCount();
              this.ngOnInit()

            }
            else {
              M.toast({ html: "Something went Wrong", classes: 'rounded' })
            }
          });
        break;
      case 2:
        this._http.rejectProposal(jsnData)
          .subscribe(r => {
            if (r["statusCode"] == 200) {
              M.toast({ html: "Proposal Rejected", classes: 'rounded' })
              this.ngOnInit()
            }
            else {
              M.toast({ html: "Something went Wrong", classes: 'rounded' })
            }
          });
        break;
    }
  }

}
