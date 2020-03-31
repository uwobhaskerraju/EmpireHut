import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { VariableService } from 'src/app/service/variable.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationService } from 'src/app/validations/validation.service';
declare var M: any;
@Component({
  selector: 'app-myassets',
  templateUrl: './myassets.component.html',
  styleUrls: ['./myassets.component.css']
})
export class UserDetailsComponent implements OnInit {

  allAssets: Object
  imagePath: any
  nomyassets: boolean;
  nomydetails: boolean;
  userDetails: any

  constructor(private _http: UserService, private _var: VariableService,
    private route: ActivatedRoute, private router: Router, private _val: ValidationService) {
    this.imagePath = environment.imagePath
    this.nomyassets = true;
    this.nomydetails = true;
  }

  ngOnInit() {
    this._http.getuserPersonalDetails(this._var.userdetails["address"])
      .subscribe(rr => {
        // console.log(rr)
        if (rr["statusCode"] == 200) {
          this.nomydetails = false

          this.userDetails = rr["result"]

          console.log(this.userDetails)
          this._http.getPersonalAssets(this._var.userdetails["address"])
            .subscribe(r => {
              this.nomyassets = false;
              if (r["statusCode"] == 200) {
                 console.log(r)
                if (r["result"].length == undefined) {
                  var temp = [];
                  temp.push(r["result"])
                  this.allAssets = temp;
                }
                else {
                  this.allAssets = r["result"];
                }
              }
            });
        }

      })

  }
  showButton(value) {
    let elem: HTMLElement = document.getElementById('updateBtn');
    //console.log(value)
    if (!value) {
      elem.style.display = 'block'
    }
    else {
      // console.log("here")
      elem.style.display = 'none'
    }

  }

  updateDetails() {
    let errMsg = ''

    errMsg = errMsg.concat(this._val.validateAssetPostal(String(this.userDetails['homepostalcode']).trim()))

    errMsg = errMsg.concat(this._val.validatePhoneNumber(String(this.userDetails['homePhone']).trim()))

    errMsg = errMsg.concat(this._val.validatecmbdAddress(String(this.userDetails['homeaddress']).trim()))
   
    if (!Boolean(errMsg)) {
      this._http.updateUserDetails(this.userDetails)
        .subscribe(r => {
          if (r["statusCode"] == 200) {
            M.toast({ html: "Operation Succesful", classes: 'rounded' })
            this.showButton(true) //false
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
  checkAll(value: any) {
    let state = Boolean(value.srcElement.checked)
    let id = value.srcElement.id
    let stateValue;
    if (state) {
      stateValue = 1
    }
    else {
      stateValue = 0
    }
    this._http.toggleAsset(id, stateValue)
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          M.toast({ html: "Operation Succesful", classes: 'rounded' })
        }
        else {
          M.toast({ html: "Something went wrong", classes: 'rounded' })
        }
      });
  }

  showDetails(value: any) {
    //console.log(value.srcElement.id)
    this.router.navigate(['user/asset', value.srcElement.id]);
  }

}
