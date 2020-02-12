import { Injectable } from '@angular/core';
import{environment} from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenService {

  constructor(private http: HttpClient) { }

  ValidateLogin(email: any, pass: any) {
    //console.log("inside validatelogin")
    //let URL = 'http://' + window.location.host + '/insertNewItem'
    let URL = environment.apiBaseURL + 'user/login'
    //console.log(URL)

    var JsnData = JSON.stringify({
      email: email,
      password: pass
    })
    //console.log(JsnData)
    let header = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type'
      }

    }
    //console.log(header)
    return this.http.post(URL, JsnData, header);
  }

  registerUser(name, pass, email) {

    //let URL = 'http://' + window.location.host + '/insertNewItem'
    let URL = environment.apiBaseURL + 'user/register'
    console.log(URL)

    var JsnData = JSON.stringify({
      username: name,
      email: email,
      password: pass
    })
    console.log(JsnData)
    let header = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type'
      }

    }
    console.log(header)
    return this.http.post(URL, JsnData, header);
  }
}
