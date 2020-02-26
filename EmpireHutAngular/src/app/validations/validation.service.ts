import { Injectable } from '@angular/core';
declare var M: any
@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  succOpMsg = 'Operation Succesfull'
  OpFailedMsg = 'Operation Failed. Try Again!'
  fieldsErr = 'fields shouldnt be empty and greater than 15 characters'
  loggedInUser = {}
  constructor() { }


  validateYear(year: any) {
    let msg = ''
    if (Number(year)) {
      if (Number(year) < 0 || Number(year) > 2020) {
        msg = 'Year should be less than 2020||'
      }

    }
    else {
      msg = 'year should be number||'
    }
    return msg;
  }
  validateDuration(duration: any) {
    let msg = ''
    if (parseFloat(duration)) {
      if (parseFloat(duration) < 1 || parseFloat(duration) > 7) {
        msg = 'Duration should be less than 7min||'
      }
    }
    else {
      msg = 'duration should be mm.ss format||'
    }
    return msg;
  }

  validateTitle(title: String) {
    let msg = ''
    if (Boolean(title)) {
      if (String(title).length < 1 || String(title).length > 15) {
        msg = msg.concat("title should be less than 15||")
      }
    }
    else {
      msg = 'title shouldnt be empty||'
    }
    return msg
  }
  validateDesc(desc: String) {
    let msg = ''
    if (Boolean(desc)) {
      if (String(desc).length < 1 || String(desc).length > 120) {
        msg = msg.concat("Description should be less than 120||")
      }
    }
    else {
      msg = 'Description shouldnt be empty||'
    }
    return msg
  }
  generateToast(errMsg: String) {
    errMsg.split('||').forEach(
      d => {
        if (Boolean(d)) {
          M.toast({ html: d, classes: 'rounded' })
        }

      }
    );
  }

  validatereview(review: any) {
    let msg = ''
    if (Boolean(review)) {
      if (String(review).length > 120) {
        msg = 'review should be 120 characters||'
      }
    }
    else {
      msg = 'review shouldnt be empty||'
    }
    return msg;
  }
  validaterating(rate) {
    let msg = ''
    //console.log(typeof rate)
    if (Number(rate)) {
      //should be between 0 and 5
      if (Number(rate) > 5 || Number(rate) <= 0) {
        msg = 'Rating should be between 1 and 5||'
      }
    }
    else {
      msg = 'rating should be number||'
    }
    return msg;
  }
  //validation for Email
  validateEmail(uEmail: any) {
    let errMsg = ''
    if (Boolean(uEmail)) {
      var re = /^([a-zA-Z])+([a-zA-Z0-9_.+-])+\@(([a-zA-Z])+\.+?(com|co|ca|in|org|net|edu|info|gov|vekomy))\.?(com|co|in|org|net|edu|info|gov)?$/
      if (!re.test(uEmail)) {
        errMsg = errMsg.concat('Invalid Email||')
      }
    }
    else {
      errMsg = errMsg.concat('Email cannot be empty||')
    }

    //console.log(errMsg)
    return errMsg;
  }
  validatePassword(uPass: any) {
    let errMsg = ''
    if (Boolean(uPass)) {

      if (uPass.length > 7 && uPass.length < 11) {

        // var regex = new Regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
        var letter = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if (!uPass.match(letter)) {
          errMsg = errMsg.concat('Password must have one upper&lower case English letter,one digit and special character and minimum 8 in length||')
        }
      }
      else {
        errMsg = errMsg.concat('Password should be between 8 and 10||')
      }
    }
    else {
      errMsg = errMsg.concat('Password cannot be empty||')
    }
    return errMsg
  }

  validateUserName(uName) {
    let errMsg = ''
    if (Boolean(uName)) {
      if (String(uName).length < 0 || String(uName).length > 15) {
        errMsg = errMsg.concat('Username should be max of 15 characters||')
      }
      //Expression can start or end only with a letter
      //Expression cannot contain consecutive spaces
      var letter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/
      if (!uName.match(letter)) {
        errMsg = errMsg.concat('Username can start or end only with a letter and cannot contain consecutive spaces||')
      }
    }
    else {
      errMsg = errMsg.concat('Username cannot be empty||')
    }
    return errMsg
  }

  validateAssetArea(area: any) {
    //console.log(area);
    if (String(area).length == 0) {
      return "Area cannot be empty||"
    }
    let errMsg = '';
    if (Boolean(area)) {
      if (String(area).length < 0 || String(area).length > 3) {
        //console.log("here area")
        errMsg = errMsg.concat('Area should be max of 3 characters||')
      }
    }
    else {
      errMsg = errMsg.concat('Area cannot be empty||')
    }
    return errMsg;
  }

  validateAssetAddress(address: String) {
    //console.log(address)
    if (String(address).length == 0) {
      return "address cannot be empty||"
    }
    let errMsg = '';
    if (Boolean(address)) {
      if (String(address).length < 0 || String(address).length > 25) {
        errMsg = errMsg.concat('Address should be max of 25 characters||')
      }
    }
    else {
      // console.log("her")
      errMsg = errMsg.concat('Address cannot be empty||')
    }
    return errMsg
  }

  validateAssetName(name: String) {
    if (String(name).length == 0) {
      //console.log("ASd")
      return "name cannot be empty||"
    }
    let errMsg = '';
    if (Boolean(name)) {
      if (String(name).length < 0 || String(name).length > 15) {
        errMsg = errMsg.concat('name should be max of 15 characters||')
      }
      var letter = /^([a-zA-Z]+\s)*[a-zA-Z]+$/
      if (!name.match(letter)) {
        errMsg = errMsg.concat('Name should be alphabets only||')
      }
    }
    else {
      errMsg = errMsg.concat('Name cannot be empty||')
    }
    return errMsg;
  }
}
