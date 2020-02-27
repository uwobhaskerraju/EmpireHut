import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from '../service/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VariableService } from '../service/variable.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  imagePath: String
  userDetails: Object
  tokenCount: String
  constructor(private _http: AdminService,
    private router: Router, private _VariableService: VariableService
    , private route: ActivatedRoute) {
    // this.userDetails["balance"] = 0;
  }
  ngOnChanges() {
    this.userDetails["balance"] = 0;
  }
  ngOnInit() {
    // this should be like this as we are checking token to update userdetails
    this.imagePath = environment.imagePath
    this._http.decodeToken()
      .subscribe(d => {
        if (d["statusCode"] == 200) {
          this._http.getUserDetails(d["result"]["address"])
            .subscribe(r => {
              if (r["statusCode"] == 200) {
                this.userDetails = r["result"]
                this._VariableService.userdetails = r["result"]
                //console.log(this.userDetails)
                this._http.getTotalCount()
                  .subscribe(r => {
                    //console.log(r)
                    this._VariableService.tokenCount = r["result"];
                    this.tokenCount = this._VariableService.tokenCount;
                  });
              }
            });
        }
        else {
          this.router.navigate(['']);
        }
      });
    //console.log(this._VariableService.userdetails)
  }

  logout() {
    localStorage.clear();
    this._VariableService.userdetails=null;
    this.router.navigate([''])
  }

  navigate(value: any) {

    switch (value) {
      case 1:
        this.router.navigate(['admin']);
        break;
      case 2:
        this.router.navigate(['create'], { relativeTo: this.route });
        break;
      case 3:
        this.router.navigate(['user'], { relativeTo: this.route });
        break;
    }

  }
  updateAssetCount(componentReference) {
    // console.log(componentReference)
    // componentReference.anyFunction();
    //Below will subscribe to the searchItem emitter
    componentReference._tokenCount.subscribe((data) => {
      // Will receive the data from child here 
      this.tokenCount = data;
    })
  }

}
