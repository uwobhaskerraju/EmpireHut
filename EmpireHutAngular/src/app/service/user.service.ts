import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  decodeToken() {
    let URL = environment.apiBaseURL + 'open/val';
    return this._http.get(URL);
  }

  getAllAssets(address: any) {
    let URL = environment.apiBaseURL + 'user/assets/' + address
    console.log(URL)
    return this._http.get(URL);
  }

  getOwnedAssets(address: any) {
    let URL = environment.apiBaseURL + 'user/count/' + address
    return this._http.get(URL);
  }

  getBalance(address: any) {
    let url = environment.apiBaseURL + 'user/balance';
    let jsnData = {
      userID: address
    }
    return this._http.post(url, jsnData);
  }

  getuserPersonalDetails(id: any) {
    let url = environment.apiBaseURL + 'user/userdetails/' + id
    //console.log(url)
    return this._http.get(url);
  }
  updateUserDetails(userDetails: any) {
    let url = environment.apiBaseURL + 'user/update'
    let jsnData = {
      address: userDetails["address"],
      phone: userDetails['homePhone'],
      postal: userDetails['homepostalcode'],
      homeaddress: userDetails['homeaddress']
    }

    return this._http.post(url, jsnData)
  }

  updateAssetValue(amount, assetid) {
    let url = environment.apiBaseURL + 'user/update/asset'
    let jsnData = {
      assetID: assetid,
      amount: amount
    }
    return this._http.post(url, jsnData)
  }

  getUserDetails(add: String) {
    let URL = environment.apiBaseURL + 'user/udetails';
    let jsnData = {
      address: add
    }
    return this._http.post(URL, jsnData);
  }

  getAssetDetails(id: any) {
    let URL = environment.apiBaseURL + 'user/asset/' + id;
    return this._http.get(URL);
  }

  submitProposal(amount: any, address: any, assetDetails: any) {

    let URL = environment.apiBaseURL + 'user/proposal';
    let jsnData = {
      proposedAmount: amount,
      assetId: assetDetails["_id"],
      propertyValue: assetDetails["price"],
      owner: assetDetails["ownerAdd"],
      proposalAddr: address //in the end he will be _to
    }
    //console.log(jsnData)
    return this._http.post(URL, jsnData);
  }

  getAssetTransactionHistory(assetID: any) {
    let URL = environment.apiBaseURL + 'user/assettrans/' + assetID;
    return this._http.get(URL);
  }

  checkAdmin(admin: any) {
    let URL = environment.apiBaseURL + 'user/admin';
    let jsnData = {
      admin: admin
    }
    return this._http.post(URL, jsnData);
  }

  purchaseAsset(assetDetails: any, usrAdd: any, _amount: any) {
    let URL = environment.apiBaseURL + 'user/purchase';
    let jsnData = {
      owner: assetDetails["ownerAdd"],
      amount: _amount,
      to: usrAdd,
      assetID: assetDetails["_id"]
    }
    return this._http.post(URL, jsnData);
  }

  reviewProposals(address: any) {
    let URL = environment.apiBaseURL + 'user/proposals/' + address;
    console.log(URL)
    return this._http.get(URL);
  }

  acceptProposal(propObj: any) {
    let URL = environment.apiBaseURL + 'user/proposal/approve';
    let jsnData = {
      notID: propObj._id,
      assetID: propObj.assetId,
      to: propObj.proposalAddr,
      owner: propObj.owner,
      amount: propObj.proposedAmount
    }
    //console.log
    return this._http.post(URL, jsnData);
  }

  createTicket(fileObj, address, ticket) {
    let url = environment.apiBaseURL + 'user/create/ticket';
    const fd = new FormData();
    fd.append('address', address);
    fd.append('date', new Date().toISOString().slice(0, 10).concat('_', (new Date()).getTime().toString()));
    fd.append('subject', ticket['subject']);
    fd.append('desc', ticket['desc']);
    fd.append('image', fileObj, fileObj.name);

    return this._http.post(url, fd)
  }

  rejectProposal(propObj: any) {
    let URL = environment.apiBaseURL + 'user/proposal/reject';
    let jsnData = {
      notID: propObj._id,
      assetID: propObj.assetId,
      amount: propObj.proposedAmount,
      owner: propObj.proposalAddr
    }
    console.log(jsnData)
    return this._http.post(URL, jsnData);
  }

  getPersonalAssets(address: any) {
    let URL = environment.apiBaseURL + 'user/personal/' + address;
    return this._http.get(URL);
  }

  getUserTickets(address: String) {
    let url = environment.apiBaseURL + 'user/tickets/' + address;
    return this._http.get(url)
  }

  getTicketDetails(ticketID: String) {
    let url = environment.apiBaseURL + 'user/tickets/fetch/' + ticketID;
    return this._http.get(url)
  }
  resolveTicket(ticketID,state) {
    let url = environment.apiBaseURL + 'user/ticket/resolve'
    let jsnData={
      ticketID:ticketID,
      state:state
    }
    return this._http.post(url,jsnData)
  }
  submitTicketComment(ticketID: String, name: String, comment: String, address) {
    let url = environment.apiBaseURL + 'user/ticket/comment';
    let jsnData = {
      username: name,
      ticketID: ticketID,
      comment: comment,
      address: address
    }
    return this._http.post(url, jsnData)
  }

  toggleAsset(id: any, hidden: any) {
    let URL = environment.apiBaseURL + 'user/asset/toggle';
    let jsnData = {
      id: id,
      state: hidden
    }
    console.log(jsnData)
    return this._http.post(URL, jsnData)
  }

  getSearchedAssets(address: any, value: any) {
    let URL = environment.apiBaseURL + 'user/search/assets/' + address;
    let jsnData = {
      value: value
    };
    return this._http.post(URL, jsnData);
  }

  getUserTransactions(address: String) {
    let URL = environment.apiBaseURL + 'user/trans';
    let jsnData = {
      address: address
    }
    return this._http.post(URL, jsnData);

  }
}
