import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { environment } from 'src/environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {
  allAssets: Object
  imagePath: String
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

  onSearchChange() {

  }
}
