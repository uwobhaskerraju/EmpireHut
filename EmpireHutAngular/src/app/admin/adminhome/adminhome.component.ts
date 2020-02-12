import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {

  constructor(private _http: AdminService) { }

  ngOnInit() {
  }

}
