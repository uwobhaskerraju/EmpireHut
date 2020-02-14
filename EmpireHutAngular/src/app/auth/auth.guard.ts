import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OpenService } from '../service/open.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private _http: OpenService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (localStorage.getItem('ACCESS_TOKEN') != null) {

      // this._http.validateToken()
      //   .subscribe(d => {
      //     console.log("inside auth")
      //     if (d["statusCode"] == 200) {
      //       // if (d["message"]["userType"] == "admin") {
      //       //   this.router.navigate(['admin'])
      //       //   //return true;
      //       // }
      //       // if (d["message"]["userType"] == "user") {
      //       //   this.router.navigate(['user'])
             
      //       // }
      //       //this.router.navigate(['user'])
      //       this.router.navigate(['/'])
      //       return true;
      //     }
      //     else{
      //       this.router.navigate(['/'])
      //       return false;
      //     }

      //   });
    
    }
    else {
     this.router.navigate(['/'])
      return false;
    }
  }

}
