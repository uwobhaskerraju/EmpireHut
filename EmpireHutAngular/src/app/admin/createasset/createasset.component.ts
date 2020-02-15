import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-createasset',
  templateUrl: './createasset.component.html',
  styleUrls: ['./createasset.component.css']
})
export class CreateassetComponent implements OnInit {

  imagePath:String
  asset: any = {};
  constructor() { }

  ngOnInit() {
    this.imagePath=environment.apiBaseURL;
  }

  addasset(){

  }

}
