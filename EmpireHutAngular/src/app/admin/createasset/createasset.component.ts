import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from '../../service/admin.service'
//import { VariableService } from '../../service/variable.service';
import { ValidationService } from 'src/app/validations/validation.service';
declare var M: any;

@Component({
  selector: 'app-createasset',
  templateUrl: './createasset.component.html',
  styleUrls: ['./createasset.component.css']
})
export class CreateassetComponent implements OnInit {
  @Output() _tokenCount: EventEmitter<any> = new EventEmitter();

  imagePath: String
  asset: any = {};
  loader:boolean
  constructor(private _http: AdminService, private _val: ValidationService) {
    M.AutoInit();
    M.updateTextFields();
    this.loader=false;
  }

  ngOnInit() {
    this.imagePath = environment.apiBaseURL;


    var textNeedCount = document.querySelectorAll('input');
    M.CharacterCounter.init(textNeedCount);
  }

  addasset() {
    this.loader=true;
    let errMsg = ''
    let area = this.asset["area"]
    let address = this.asset["address"]
    let name = this.asset["name"]
    let province = this.asset["province"]
    let city = this.asset["city"]
    let postalcode = this.asset["postalcode"]

 
    if (!Boolean(area) || !Boolean(address) || !Boolean(name)|| 
    !Boolean(province)|| !Boolean(city)|| !Boolean(postalcode)) {
      errMsg = errMsg.concat("All fields are mandatory||")
      this._val.generateToast(errMsg)
      this.loader=false;
    }
    else {

      errMsg = errMsg.concat(this._val.validateAssetArea(String(area).trim()))

      errMsg = errMsg.concat(this._val.validateAssetAddress(String(address).trim()))

      errMsg = errMsg.concat(this._val.validateAssetName(String(name).trim()))

      errMsg = errMsg.concat(this._val.validateAssetCity(String(city).trim()))

      errMsg = errMsg.concat(this._val.validateAssetPostal(String(postalcode).trim()))

      errMsg = errMsg.concat(this._val.validateAssetProvince(String(name).trim()))

      if (!Boolean(errMsg)) {
      //  console.log("true")
        this._http.createAsset(this.asset)
          .subscribe(r => {
            this.loader=false;
            if (r["statusCode"] == 200) {
              M.toast({ html: r["result"], classes: 'rounded' });
             // this.ngOnInit();
              this.updateCount()
            }
            else {
              M.toast({ html: r["result"], classes: 'rounded' });
            }
          });
      }
      else {
        // console.log(errMsg)
        this.loader=false;
        this._val.generateToast(errMsg)
      }
    }

  }

  updateCount() {
    // emit data to parent component
    this._http.getTotalCount()
      .subscribe(r => {
        console.log(r)
        //this._VariableService.tokenCount = r["data"]["result"];
        this._tokenCount.emit(r["result"]);
      });

  }

}
