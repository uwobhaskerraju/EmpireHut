import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.css']
})
export class NotfoundComponent implements OnInit {

  
  constructor(private router:Router) {
    
  }

  goBack(){
    this.router.navigate([''])
  }

  ngOnInit() {
  }

}
