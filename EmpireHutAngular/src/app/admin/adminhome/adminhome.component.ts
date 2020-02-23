import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
declare var M: any;
@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {
  allAssets: Object
  imagePath: String
  @Output() _tokenCount: EventEmitter<any> = new EventEmitter();

  constructor(private _http: AdminService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.imagePath = environment.imagePath
    this._http.getAllAssets()
      .subscribe(data => {
        // console.log(data);
        if (data["statusCode"] == 200) {
          this.allAssets = data["result"];
        }

      });
  }

  showDetails(value: any) {
    //console.log(value.srcElement.id)
    this.router.navigate(['asset', value.srcElement.id], { relativeTo: this.route });
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
          M.toast({ html: "Asset Hidden", classes: 'rounded' })
        }
        else {
          M.toast({ html: "Something went wrong", classes: 'rounded' })
        }
      });
  }
  onSearchChange(value: any) {
    if (value) {
      this._http.getSearchedAssets(value).subscribe(data => {
        if (data["statusCode"] == 200) {
          this.allAssets = data["result"]
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
