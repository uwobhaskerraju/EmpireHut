import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/service/admin.service';
import { VariableService } from 'src/app/service/variable.service';
import { environment } from 'src/environments/environment.prod';
import { ValidationService } from 'src/app/validations/validation.service';
declare var M: any;
@Component({
  selector: 'app-adminticketdetails',
  templateUrl: './adminticketdetails.component.html',
  styleUrls: ['./adminticketdetails.component.css']
})
export class AdminticketdetailsComponent implements OnInit {
  private routeSub: Subscription;
  ticketID: any
  ticketDetails: {}
  ticketResp: any
  comment: String
  imagePath: String
  constructor(private _router: Router, private _route: ActivatedRoute,
    private _http: AdminService, private _var: VariableService, private _val: ValidationService) {
    this.ticketDetails = { subject: '' }
    this.imagePath = environment.imagePath
  }

  ngOnInit() {
    M.AutoInit();
    var textNeedCount = document.querySelectorAll('input,textarea');
    M.CharacterCounter.init(textNeedCount);
    this.routeSub = this._route.params.subscribe(params => {
      this.ticketID = params['id']
    });

    this._http.getTicketDetails(this.ticketID)
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          var temp = []
          //console.log(r)
          this.ticketDetails = r["ticket"]
          if (r["response"].length == undefined) {
            temp.push(r["response"])
            this.ticketResp = temp;
          }
          else {
            this.ticketResp = r["response"]
          }
        }
        else {
          M.toast({ html: "Something went wrong", classes: 'rounded' })
        }
      })
  }

  goBack() {
    this._router.navigate(['admin/tickets'])
  }
  submitResponse(event) {

    let errMsg = ''

    errMsg = errMsg.concat(this._val.validateTicketComment(String(this.comment).trim()))
    if (!Boolean(errMsg)) {
      this._http.submitTicketComment(event.srcElement.id, this._var.userdetails["username"], this.comment, this._var.userdetails["address"])
        .subscribe(r => {
          if (r["statusCode"] == 200) {
            M.toast({ html: "Operation Successful", classes: 'rounded' })
            this.ngOnInit()
          }
          else {
            M.toast({ html: "Operation Failed", classes: 'rounded' })
          }
        })
    }
    else {
      this._val.generateToast(errMsg)
    }

  }
}
