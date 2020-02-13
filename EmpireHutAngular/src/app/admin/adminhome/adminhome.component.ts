import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {
  allAssets: Object
  imagePath:String
  constructor(private _http: AdminService) { }

  ngOnInit() {
    this.imagePath=environment.imagePath
    this._http.getAssetDetails()
      .subscribe(data => {
        console.log(data);
        this.allAssets = data;
      });
  }

}
