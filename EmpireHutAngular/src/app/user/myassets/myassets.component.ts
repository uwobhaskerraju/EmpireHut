import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { VariableService } from 'src/app/service/variable.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
declare var M: any;
@Component({
  selector: 'app-myassets',
  templateUrl: './myassets.component.html',
  styleUrls: ['./myassets.component.css']
})
export class MyassetsComponent implements OnInit {

  allAssets: Object
  imagePath: any
  nomyassets:boolean;

  constructor(private _http: UserService, private _var: VariableService, private route: ActivatedRoute, private router: Router) {
    this.imagePath = environment.imagePath
    this.nomyassets=true;
  }

  ngOnInit() {
    this._http.getPersonalAssets(this._var.userdetails["address"])
      .subscribe(r => {
        this.nomyassets=false;
        if (r["statusCode"] == 200) {
          console.log(r)
          if (r["result"].length == undefined) {
            var temp = [];
            temp.push(r["result"])
            this.allAssets = temp;
          }
          else{
            this.allAssets = r["result"];
          }
        }
      });
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
