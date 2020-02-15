import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http: HttpClient) { }

  getAllAssets() {
    let URL = environment.apiBaseURL + '/admin/assets'
    return this._http.get(URL);
  }

  getAssetDetails(id: any) {
    let URL = environment.apiBaseURL + '/admin/asset/' + id;
    return this._http.get(URL);
  }

  decodeToken() {
    let URL = environment.apiBaseURL + '/open/val';
    return this._http.get(URL);
  }

  getUserDetails(add: String) {
    let URL = environment.apiBaseURL + '/admin/udetails';
    let jsnData = {
      address: add
    }
    return this._http.post(URL, jsnData);
  }

  createAsset(value: any,address:any) {
    let URL = environment.apiBaseURL + '/admin/create';
    let jsnData = {
      name: value.name,
      address: value.address,
      area: value.area,
      userID:address
    }
    return this._http.post(URL, jsnData);
  }
}
