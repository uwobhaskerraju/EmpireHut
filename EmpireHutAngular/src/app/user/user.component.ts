import { Component, OnInit, ContentChild } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { UserService } from '../service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VariableService } from '../service/variable.service';
import { AssetsComponent } from './assets/assets.component';


declare var M: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']//,
  //providers: [AssetsComponent]
})
export class UserComponent implements OnInit {
  // @ContentChild(AssetsComponent, { static: true }) component: AssetsComponent;

  imagePath: String
  tokenCount: any
  //userDetails: Object
  constructor(private _http: UserService, private router: Router,
    private _VariableService: VariableService, private route: ActivatedRoute) {
    M.AutoInit();
    this.callTokenAndPerDetails();
  }

  callTokenAndPerDetails() {

    this._http.getUserDetails(this._VariableService.userdetails["address"])
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          this._VariableService.userdetails = r["result"]
          this._http.getOwnedAssets(this._VariableService.userdetails["address"])
            .subscribe(r => {
              if (r["statusCode"] == 200) {
                this.tokenCount = r["result"];
              }
              else {
                this.tokenCount = 0;
              }
            });

        }
      });

  }

  updateUserBalance(componentReference) {

    componentReference._userBal.subscribe((data) => {
      // Will receive the data from child here 
      this._VariableService.userdetails["balance"] = data;
    })

    componentReference._UsertokenCount.subscribe((data) => {
      // Will receive the data from child here 
      this.tokenCount = data;
    })
  }

  ngOnInit() {

    this.imagePath = environment.imagePath

  }

  logout() {
    localStorage.clear();
    this._VariableService.userdetails=null;
    this.router.navigate([''])
  }

  navigate(value: any) {

    switch (value) {
      case 1:
        this.router.navigate(['user']);
        break;
      case 2:
        this.router.navigate(['proposals'], { relativeTo: this.route });
        break;
      case 3:
        this.router.navigate(['personal'], { relativeTo: this.route });
        break;
      case 4:
        this.router.navigate(['transactions'], { relativeTo: this.route })
        break;
    }

  }

}
