import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  decodeToken() {
    let URL = environment.apiBaseURL + '/open/val';
    return this._http.get(URL);
  }

  getAllAssets() {
    let URL = environment.apiBaseURL + '/user/assets'
    return this._http.get(URL);
  }

  getBalance() {
    let url = environment.apiBaseURL + '/user/balance';
    return this._http.get(url);
  }

  getUserDetails(add: String) {
    let URL = environment.apiBaseURL + '/user/udetails';
    let jsnData = {
      address: add
    }
    return this._http.post(URL, jsnData);
  }

  getAssetDetails(id: any) {
    let URL = environment.apiBaseURL + '/user/asset/' + id;
    return this._http.get(URL);
  }

  submitProposal(amount: any, address: any, assetDetails: any) {

    let URL = environment.apiBaseURL + '/user/proposal';
    let jsnData = {
      proposedAmount: amount,
      assetId: assetDetails["_id"],
      propertyValue: assetDetails["price"],
      owner: assetDetails["ownerAdd"],
      proposalAddr: address
    }
    //console.log(jsnData)
    return this._http.post(URL, jsnData);
  }

  checkAdmin(admin: any) {
    let URL = environment.apiBaseURL + '/user/admin';
    let jsnData = {
      admin: admin
    }
    return this._http.post(URL, jsnData);
  }

  purchaseAsset(assetDetails: any, usrAdd: any) {
    let URL = environment.apiBaseURL + '/user/purchase';
    let jsnData = {
      owner:assetDetails["ownerAdd"],//_to
      amount:assetDetails["price"],
      from:usrAdd
    }
    return this._http.post(URL, jsnData);
  }
}
