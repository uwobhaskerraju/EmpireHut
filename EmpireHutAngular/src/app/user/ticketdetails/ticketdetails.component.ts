import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { VariableService } from 'src/app/service/variable.service';
import { ValidationService } from 'src/app/validations/validation.service';
declare var M: any;
@Component({
  selector: 'app-ticketdetails',
  templateUrl: './ticketdetails.component.html',
  styleUrls: ['./ticketdetails.component.css']
})
export class TicketdetailsComponent implements OnInit {
  private routeSub: Subscription;
  ticketID: String;
  ticketDetails: {}
  imagePath: String
  ticketResp: {}
  comment: String

  constructor(private _http: UserService, private route: ActivatedRoute,
    private _var: VariableService, private _router: Router, private _val: ValidationService) {
    this.ticketDetails = { subject: '' }
    this.imagePath = environment.imagePath
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.ticketID = params['id']
    });
    this._http.getTicketDetails(this.ticketID, this._var.userdetails["address"])
      .subscribe(r => {
        var temp = []
        if (r["statusCode"] == 200) {
          this.ticketDetails = r["ticket"]
          // console.log(this.ticketDetails)
          if (r["response"].length == undefined) {
            temp.push(r["response"])
            this.ticketResp = temp;
          }
          else {
            this.ticketResp = r["response"]
          }
          // console.log(this.ticketResp)
        }
        else {
          M.toast({ html: "Not Authorized", classes: 'rounded' })
          this._router.navigate(['user/tickets'])
        }
      })
  }

  checkAll(value) {
    let state = Boolean(value.srcElement.checked)
    let stateValue;
    if (state) {
      stateValue = 1
    }
    else {
      stateValue = 0
    }
    this._http.resolveTicket(this.ticketID, stateValue)
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          M.toast({ html: "Operation Successful", classes: 'rounded' })
        }
        else {
          M.toast({ html: "Operation Failed", classes: 'rounded' })
        }
      })
  }

  goBack() {
    this._router.navigate(['user/tickets'])
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
