import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() _tokenCount: EventEmitter<any> = new EventEmitter();

  imagePath: String
  asset: any = {};
  constructor(private _http: AdminService) {
    M.AutoInit();
    M.updateTextFields();
    var textNeedCount = document.querySelectorAll('input');
    M.CharacterCounter.init(textNeedCount);
  }

  ngOnInit() {
    this.imagePath = environment.apiBaseURL;
  
  }

  addasset() {
    this._http.createAsset(this.asset)
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          M.toast({ html: r["result"], classes: 'rounded' });
          this.ngOnInit();
          this.updateCount()
        }
        else {
          M.toast({ html: r["result"], classes: 'rounded' });
        }
      });
  }

  updateCount() {
    // emit data to parent component
    this._http.getTotalCount()
    .subscribe(r => {
      console.log(r)
      //this._VariableService.tokenCount = r["data"]["result"];
      this._tokenCount.emit(r["data"]["result"]);
    });
    
  }

}
