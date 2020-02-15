import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from '../../service/admin.service'
import { VariableService } from '../../service/variable.service';
declare var M: any;

@Component({
  selector: 'app-createasset',
  templateUrl: './createasset.component.html',
  styleUrls: ['./createasset.component.css']
})
export class CreateassetComponent implements OnInit {

  imagePath: String
  asset: any = {};
  constructor(private _http: AdminService, private _VariableService: VariableService) {
    M.AutoInit();
    M.updateTextFields();
    var textNeedCount = document.querySelectorAll('input');
    M.CharacterCounter.init(textNeedCount);
   }

  ngOnInit() {
    this.imagePath = environment.apiBaseURL;
  }

  addasset() {
    this._http.createAsset(this.asset, this._VariableService.userdetails["address"])
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          M.toast({ html: r["result"], classes: 'rounded' })
        }
        else{
          M.toast({ html: r["result"], classes: 'rounded' })
        }
      });
  }

}
