import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OpenService } from '../service/open.service';
import { VariableService } from '../service/variable.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  dState: Object;
  constructor(private router: Router, private _http: OpenService, private _VariableService: VariableService) {
    this._http.validateToken()
      .subscribe(d => {
        console.log("inside auth")
        if (d["statusCode"] == 200) {
          this._VariableService.userdetails = d["message"]
          this.dState = d["message"];
          console.log("end2")
          // return true;

        }
        else {
          this.router.navigate(['/'])
          // return false;
        }

      });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (localStorage.getItem('ACCESS_TOKEN') != null) {

      if (this.dState == null) {
        console.log("inside null")
        this.router.navigate(['/'])
        return false;
      }
      console.log("end")
      return true;
    }
    else {
      this.router.navigate(['/'])
      return false;
    }
  }

}
