import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import {UserService} from '../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  imagePath:String
  
  constructor(private _http:UserService,private router:Router) { }

  ngOnInit() {
    this.imagePath=environment.imagePath;

    // get name , email , balance
  }

  logout(){
    localStorage.clear();
    this.router.navigate([''])
  }

  navigate(){

  }

}
