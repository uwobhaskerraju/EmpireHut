import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http:HttpClient) { }

  getAllAssets(){
    let URL = environment.apiBaseURL + '/admin/assets'
    return this._http.get(URL);
  }

  getAssetDetails(id:any){
    let URL=environment.apiBaseURL+'/admin/asset/'+id;
    return this._http.get(URL);
  }
}
