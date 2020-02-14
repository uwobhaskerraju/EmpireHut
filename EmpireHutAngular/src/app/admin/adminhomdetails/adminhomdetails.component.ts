import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { AdminService } from 'src/app/service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adminhomdetails',
  templateUrl: './adminhomdetails.component.html',
  styleUrls: ['./adminhomdetails.component.css']
})
export class AdminhomdetailsComponent implements OnInit {
  assetDetails=[];
  imagePath: String;
  private routeSub: Subscription;
  assetID: String;
  constructor(private _http: AdminService, private route: ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.imagePath = environment.imagePath
    this.routeSub = this.route.params.subscribe(params => {
      this.assetID = params['id']
    });
    this._http.getAssetDetails(this.assetID)
      .subscribe(data => {
        this.assetDetails.push(data);
        console.log(this.assetDetails)
      });
  }

  goBack(){
    this.router.navigate(['admin'])
  }

}
