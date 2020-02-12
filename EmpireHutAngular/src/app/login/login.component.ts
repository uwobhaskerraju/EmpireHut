import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Router, NavigationExtras } from '@angular/router';
import {ValidationService} from '../validations/validation.service';
import {OpenService} from '../service/open.service';

declare var M: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  imagePath: String
  public signUp: any = {};

  constructor(private _http: OpenService, private router: Router, private _valService: ValidationService) { }

  ngOnInit() {
    this.imagePath = environment.imagePath
    M.AutoInit();
    M.updateTextFields();
    var textNeedCount = document.querySelectorAll('input');
    M.CharacterCounter.init(textNeedCount);
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
          //console.log(data)
          if (data["statusCode"] == 200) {
            const navigationExtras: NavigationExtras = {
              state: {
                email: data["result"]["email"],
                id: data["result"]["id"],
                name: data["result"]["name"],
                active: data["result"]["emailverified"],
                type: data["result"]["userType"]
              }
            };
            //console.log(navigationExtras)
            localStorage.setItem("ACCESS_TOKEN", data["WWW-Authenticate"]);
            if (!data["result"]["emailverified"]) {
              this.router.navigate(['/verify'], navigationExtras)
            }
            else {
              // route based on user type
              if (data["result"]["userType"] == "admin") {
                this.router.navigate(['/admin'], navigationExtras)
              }
              if (data["result"]["userType"] == "user") {
                this.router.navigate(['/dashboard'], navigationExtras)
              }

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
      //M.toast({ html: 'Something went wrong. Try Again!', classes: 'rounded' })
      //document.getElementById('signinPass').classList.add("invalid")
      // document.getElementById('signinEmail').classList.add("invalid")
    }

  }

  registerUser() {
    let email=this.signUp["email"]
    let pass=this.signUp["pass"]
    let name=this.signUp["name"]
    let errMsg = ''

    errMsg = errMsg.concat(this._valService.validateEmail(String(email).trim()))
    errMsg = errMsg.concat(this._valService.validatePassword(String(pass).trim()))
    errMsg = errMsg.concat(this._valService.validateUserName(String(name).trim()))

    if (!Boolean(errMsg)) {
      this._http.registerUser(name, pass, email)
        .subscribe(data => {
          if (data["statusCode"] == 200) {
            const navigationExtras: NavigationExtras = {
              state: {
                email: data["result"]["email"],
                id: data["result"]["id"],
                name: data["result"]["name"],
                emailverified: data["result"]["emailverified"],
                type: data["result"]["userType"]
              }
            };
            localStorage.setItem("ACCESS_TOKEN", data["WWW-Authenticate"]);
            localStorage.setItem("userRole", data["result"]["userType"]);

            if (!data["result"]["emailverified"]) {
              this.router.navigate(['/verify'], navigationExtras)
            }
            if (data["result"]["emailverified"]) {
              this.router.navigate(['/dashboard'], navigationExtras)
            }
          }
          else {
            // throw a toast
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
}
