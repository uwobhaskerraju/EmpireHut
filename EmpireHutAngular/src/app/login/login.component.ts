import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Router, NavigationExtras } from '@angular/router';
import { ValidationService } from '../validations/validation.service';
import { OpenService } from '../service/open.service';

declare var M: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  imagePath: String
  public signUp: any = {};

  constructor(private _http: OpenService, private router: Router, private _valService: ValidationService) {
    M.AutoInit();
    M.updateTextFields();
    // var textNeedCount = document.querySelectorAll('input');
    // M.CharacterCounter.init(textNeedCount);
  }

  ngOnInit() {
    this.imagePath = environment.imagePath
     M.AutoInit();
    // M.updateTextFields();
    var textNeedCount = document.querySelectorAll('input');
    M.CharacterCounter.init(textNeedCount);
   // console.log(environment.port)
  }

  ValidateLogin(email: String, pass: String) {
    var errMsg = '';
    if (this._valService.validateEmail(email)) {
      errMsg = errMsg.concat('email is not in proper format||')
    }
    if (!Boolean(pass)) {
      errMsg = errMsg.concat('password cannot be empty||')
    }

    if (!Boolean(errMsg)) {

      this._http.ValidateLogin(email, pass)
        .subscribe(data => {
          console.log(data)
          if (data["statusCode"] == 200) {

            localStorage.setItem("ACCESS_TOKEN", data["WWW-Authenticate"]);
            switch (data["result"]["userType"]) {
              case "user":
                console.log("this")
                this.router.navigate(['user']);
                break;

              case "admin":
                this.router.navigate(['admin']);
                break;
            }
          }
          else {
            // throw a toast
            M.toast({ html: data["result"], classes: 'rounded' })
            //document.getElementById('signinPass').classList.add("invalid")
            // document.getElementById('signinEmail').classList.add("invalid")

            //clear the form
          }

        });
    }
    else {
      this._valService.generateToast(errMsg)
    }

  }

  registerUser() {
    let email = this.signUp["email"]
    let pass = this.signUp["pass"]
    let name = this.signUp["name"]
    let errMsg = ''

    errMsg = errMsg.concat(this._valService.validateEmail(String(email).trim()))
    errMsg = errMsg.concat(this._valService.validatePassword(String(pass).trim()))
    errMsg = errMsg.concat(this._valService.validateUserName(String(name).trim()))

    if (!Boolean(errMsg)) {
      this._http.registerUser(name, pass, email)
        .subscribe(data => {
          if (data["statusCode"] == 200) {
            //console.log("as")
            localStorage.setItem("ACCESS_TOKEN", data["WWW-Authenticate"]);
            switch (data["result"]["userType"]) {
              case "user":
                this.router.navigate(['user']);
                break;

              case "admin":
                this.router.navigate(['admin']);
                break;
            }

          }
          else {
            //console.log("here")
            // throw a toast
            console.log(data["result"])
            M.toast({ html: data["result"], classes: 'rounded' })
            //clear the form
            this.ngOnInit();
          }
        });
    }
    else {
      this._valService.generateToast(errMsg)
    }

  }


  test(){
    //console.log("here")
    this._http.test()
    .subscribe(r=>{
      //console.log(r)
    })
  }
}
