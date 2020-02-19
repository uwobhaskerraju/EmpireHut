import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http: HttpClient) { }

  getAllAssets() {
    let URL = environment.apiBaseURL + 'admin/assets'
    return this._http.get(URL);
  }

  getAssetDetails(id: any) {
    let URL = environment.apiBaseURL + 'admin/asset/' + id;
    return this._http.get(URL);
  }

  decodeToken() {
    let URL = environment.apiBaseURL + 'open/val';
    return this._http.get(URL);
  }

  getUserDetails(add: String) {
    let URL = environment.apiBaseURL + 'admin/udetails';
    let jsnData = {
      address: add
    }
    return this._http.post(URL, jsnData);
  }

  createAsset(value: any) {
    let URL = environment.apiBaseURL + 'admin/create';
    let jsnData = {
      name: value.name,
      address: value.address,
      area: value.area
    }
    return this._http.post(URL, jsnData);
  }

  getTotalCount() {
    let URL = environment.apiBaseURL + 'admin/count';
    return this._http.get(URL);
  }

  getAllUsers() {
    let URL = environment.apiBaseURL + 'admin/users';
    return this._http.get(URL);
  }

  getAllUserDetails(id: any) {
    let URL = environment.apiBaseURL + 'admin/userdetails/' + id;
    return this._http.get(URL);
  }

  getUserTransactions(address: String) {
    let URL = environment.apiBaseURL + 'admin/trans';
    let jsnData = {
      address: address
    }
    return this._http.post(URL, jsnData);

  }
}
