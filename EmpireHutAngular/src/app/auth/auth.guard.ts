import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OpenService } from '../service/open.service';
import { VariableService } from '../service/variable.service'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
//https://codeburst.io/using-angular-route-guard-for-securing-routes-eabf5b86b4d1
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private _http: OpenService, private _VariableService: VariableService) {
    // console.log("auth")
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log("first")
    try {
      return this._http.validateToken().pipe(
        map((r: Response) => {
          //console.log(r)
          // if (r["result"].length == 1) {
          //   r["result"] = r["result"][0];
          // }
          if ((r["statusCode"] == 200) && (r["result"]["userType"] == next.data.role)) {
            this._VariableService.userdetails = r["result"]
            //console.log(r["result"])
            return true;
          }
          else {
            this._VariableService.userdetails = null;
            this.router.navigate([''])
            return false;
          }
        }));
    }
    catch (e) {
      console.log(e)
    }


  }

}
