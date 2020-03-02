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

    var JsnData = {
      email: email,
      password: pass
    }

    return this.http.post(URL, JsnData);
  }

  registerUser(name, pass, email) {

    //let URL = 'http://' + window.location.host + '/insertNewItem'
    let URL = environment.apiBaseURL + 'open/register'
    //console.log(URL)

    var JsnData = {
      username: name,
      email: email,
      password: pass
    }
    //console.log(JsnData)

    return this.http.post(URL, JsnData);
  }

  validateToken() {
    console.log("validate")
    try {
      let URL = environment.apiBaseURL + 'open/val'
      console.log(URL)
      return this.http.get(URL);
    } catch (error) {
      console.log(error)
    }

  }

  // returnToken():any{
  //   let URL = environment.apiBaseURL + 'open/token'
  //   this.http.get(URL).subscribe(r=>{
  //     return r;
  //   });
  // }

  test() {
    let URL = environment.apiBaseURL + 'open/test';
    let JsnData = {
      we: "rt"
    }
    return this.http.post(URL, JsnData);
  }
}
