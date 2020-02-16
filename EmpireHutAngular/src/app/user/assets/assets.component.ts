import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { UserService } from 'src/app/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {

  allAssets: Object
  imagePath: String
  constructor(private _http: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.imagePath = environment.imagePath
    this._http.getAllAssets()
      .subscribe(data => {
       // console.log(data);
        this.allAssets = data;
      });
  }

  showDetails(value: any) {
    //console.log(value.srcElement.id)
    this.router.navigate(['asset', value.srcElement.id], { relativeTo: this.route });
  }

}
