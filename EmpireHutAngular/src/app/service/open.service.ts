import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenService {

  constructor(private http: HttpClient) { }

  ValidateLogin(email: any, pass: any) {
    //console.log("inside validatelogin")
    //let URL = 'http://' + window.location.host + '/insertNewItem'
    let URL = environment.apiBaseURL + 'open/login'
    //console.log(URL)

    var JsnData = JSON.stringify({
      email: email,
      password: pass
    })

    return this.http.post(URL, JsnData);
  }

  registerUser(name, pass, email) {

    //let URL = 'http://' + window.location.host + '/insertNewItem'
    let URL = environment.apiBaseURL + 'open/register'
    //console.log(URL)

    var JsnData = JSON.stringify({
      username: name,
      email: email,
      password: pass
    })
    //console.log(JsnData)

    return this.http.post(URL, JsnData);
  }

  validateToken() {
    let URL = environment.apiBaseURL + 'open/val'
    return this.http.get(URL);
  }

  // returnToken():any{
  //   let URL = environment.apiBaseURL + 'open/token'
  //   this.http.get(URL).subscribe(r=>{
  //     return r;
  //   });
  // }

  test() {
    let URL = environment.apiBaseURL + 'open/testmeafter';
    return this.http.get(URL);
  }
}
