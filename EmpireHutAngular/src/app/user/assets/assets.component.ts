import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { UserService } from 'src/app/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VariableService } from 'src/app/service/variable.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {
  @Output() _tokenCount: EventEmitter<any> = new EventEmitter();

  allAssets: Object
  imagePath: String
  self: boolean

  constructor(private _http: UserService, private router: Router,
    private route: ActivatedRoute, private _var: VariableService) {
      this.self=true;
     }

  ngOnInit() {
    this.imagePath = environment.imagePath
    //console.log(this._var.userdetails["address"])
    this._http.decodeToken()
      .subscribe(d => {
        if (d["statusCode"] == 200) {
          this._http.getAllAssets(d["result"]["address"])
            .subscribe(data => {
              this.self = false;
               console.log(data);
              if (data["statusCode"] == 200) {
                if (data["result"].length == undefined) {
                  var temp = [];
                  temp.push(data["result"])
                  this.allAssets = temp;
                }
                else{
                  this.allAssets = data["result"];
                }
                // console.log(this.allAssets);
              }

            });
        }
      })
  }

  getAssets() {
    console.log("child called")

  }
  showDetails(value: any) {
    //console.log(value.srcElement.id)
    this.router.navigate(['asset', value.srcElement.id], { relativeTo: this.route });
  }

  onSearchChange(value: any) {
    if (value) {
      this._http.getSearchedAssets(this._var.userdetails["address"], value).subscribe(data => {
        if (data["statusCode"] == 200) {
          if (data["result"].length == undefined) {
            var temp = [];
            temp.push(data["result"])
            this.allAssets = temp;
          }
          else{
            this.allAssets = data["result"];
          }
          //console.log(this.orgSongs)
        }
        else {
          this.ngOnInit();
        }
      });
    }
    else {
      this.ngOnInit();
    }
  }

}
