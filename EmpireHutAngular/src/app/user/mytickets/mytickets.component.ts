import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { VariableService } from 'src/app/service/variable.service';
import { ValidationService } from 'src/app/validations/validation.service';
import { Router } from '@angular/router';
declare var M: any;
@Component({
  selector: 'app-mytickets',
  templateUrl: './mytickets.component.html',
  styleUrls: ['./mytickets.component.css']
})
export class MyticketsComponent implements OnInit {
  ticket: {}
  selectedFile: File = null;
  constructor(private _http: UserService, 
    private _var: VariableService, private _val: ValidationService
    ,private _router:Router) {

  }

  ngOnInit() {
    M.AutoInit();
    var textNeedCount = document.querySelectorAll('input,textarea');
    M.CharacterCounter.init(textNeedCount);
    this.ticket = { subject: '' }
    this.ticket['desc'] = ''
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  createTicket() {
    let errMsg = ''

    errMsg = errMsg.concat(this._val.validateSubject(String(this.ticket['subject']).trim()))

    errMsg = errMsg.concat(this._val.validateTicketDesc(String(this.ticket['desc']).trim()))

    if (!Boolean(errMsg)) {
      this._http.createTicket(this.selectedFile, this._var.userdetails["address"], this.ticket)
        .subscribe(r => {
          if (r["statusCode"] == 200) {
            M.toast({ html: "Operation Succesful", classes: 'rounded' })
            this._router.navigate(['user'])
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
