import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/service/admin.service';
declare var M: any;
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: any
  constructor(private _router: Router, private _http: AdminService) {
    //this.tickets = { subject: '' }
  }

  ngOnInit() {
    this._http.getTickets()
      .subscribe(r => {
        if (r["statusCode"] == 200) {
          //M.toast({ html: "Something went wrong", classes: 'rounded' })
          if (r["result"].length == undefined) {
            var temp = []
            temp.push(r["result"])
            this.tickets = temp;
          }
          else {
            this.tickets = r["result"]
          }
        }
        else {
          M.toast({ html: "Something went wrong", classes: 'rounded' })
        }
      })
  }
  viewTicket(event) {
    this._router.navigate(['admin/ticket', event.srcElement.id])
  }
  onSearchChange(value) {
    value=value.toLowerCase()
    if (String(value).length > 0) {
      var temp = [];
      for (var i = 0; i < this.tickets.length; i++) {
        if (String(this.tickets[i].subject).toLowerCase().includes(value)) {
          temp.push(this.tickets[i])
        }
      }
      this.tickets = temp;
    }
    else {
      this.tickets=null
      this.ngOnInit()
    }

  }
}
