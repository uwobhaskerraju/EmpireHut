import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { VariableService } from 'src/app/service/variable.service';
import { ValidationService } from 'src/app/validations/validation.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var M: any;
@Component({
  selector: 'app-mytickets',
  templateUrl: './mytickets.component.html',
  styleUrls: ['./mytickets.component.css']
})
export class MyticketsComponent implements OnInit {
  ticket: {}
  selectedFile: File = null;
  openTickets = []
  resTickets = []
  constructor(private _http: UserService,
    private _var: VariableService, private _val: ValidationService
    , private _router: Router, private _route: ActivatedRoute) {

  }

  ngOnInit() {
    M.AutoInit();
    var textNeedCount = document.querySelectorAll('input,textarea');
    M.CharacterCounter.init(textNeedCount);
    this.ticket = { subject: '' }
    this.ticket['desc'] = ''
    this.getUserTickets()
  
  }

  getUserTickets(){
    this._http.getUserTickets(this._var.userdetails["address"])
    .subscribe(r => {
      if (r["statusCode"] == 200) {
        console.log(r["result"])
        var temp = []
        if (r["result"].length == undefined) {
          temp.push(r["result"])
          if (r["result"]["resolved"]) {
            this.resTickets = temp;
          }
          else {
            this.openTickets = temp;
          }
        }
        else {

          for (var i = 0; i < r["result"].length; i++) {

            if (r["result"][i]["resolved"]) {
              this.resTickets.push(r["result"][i])
            }
            else {
              this.openTickets.push(r["result"][i])
            }

          }
        }
      }
      else {
        //M.toast({ html: "Operation Failed", classes: 'rounded' })
      }
      // console.log(this.openTickets)
      // console.log(this.resTickets)
    })
  }
  // onSearchChange(value) {
  //  let tempOpen=[...this.openTickets]
  //  let tempRes=[...this.resTickets]

  // //  for(var i=0;i<this.openTickets.length;i++){
  // //   tempOpen.push(Object.create(this.openTickets[i]))
  // //  }
  // //  for(var i=0;i<this.resTickets.length;i++){
  // //   tempRes.push(Object.create(this.resTickets[i]))
  // //  }
  
  //  value=String(value).toLowerCase()
  //   if (String(value).length > 0) {
  //     var temp = [];
  //     for (var i = 0; i < this.openTickets.length; i++) {
  //       if (String(this.openTickets[i]["subject"]).toLowerCase().includes(value)) {
  //         temp.push(this.openTickets[i])
  //       }
  //     }
  //    // console.log(temp)
  //     this.openTickets = temp;
  //     var temp = [];
  //     for (var i = 0; i < this.resTickets.length; i++) {
  //      // console.log(this.resTickets[i])
  //       if (String(this.resTickets[i]["subject"]).toLowerCase().includes(value)) {
  //         temp.push(this.resTickets[i])
  //       }
  //     }
  //     //console.log(temp)
  //     this.resTickets = temp;
  //   }
  //   else {
  //     console.log("else")
  //     console.log(tempOpen)
  //     console.log(tempRes)
  //     this.resTickets=tempRes
  //     this.openTickets = tempOpen;
     
  //   }

  // }
  viewTicket(event: any) {
    //console.log(event.srcElement.id)
    this._router.navigate(['user/ticket', event.srcElement.id])
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  createTicket() {
    let errMsg = ''
    const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    errMsg = errMsg.concat(this._val.validateSubject(String(this.ticket['subject']).trim()))

    errMsg = errMsg.concat(this._val.validateTicketDesc(String(this.ticket['desc']).trim()))

    if (this.selectedFile.size <= 0) {
      errMsg = errMsg.concat('Screenshot is mandatory||')
    }
    if(!validImageTypes.includes(this.selectedFile.type.toLowerCase())){
      errMsg = errMsg.concat('Only jpeg,jpg,png are allowed||')
    }
    if(this.selectedFile.name.toLowerCase().includes('_')){
      errMsg = errMsg.concat('File Name cannot include special Characters||')
    }
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
