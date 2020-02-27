import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { VariableService } from 'src/app/service/variable.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  userTrans=[]
  notrans:boolean;
  constructor(private _http:UserService,private _var:VariableService) {
    this.notrans=true;
   }

  ngOnInit() {
    this._http.getUserTransactions(this._var.userdetails["address"])
    .subscribe(r => {
      this.notrans=false;
      if(r["statusCode"]==200){
        this.userTrans = r["result"]
        //console.log(this.userTrans)
      }
   
    });
  }

}
