import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { item } from '../models/item';
import {Http, Headers} from '@angular/http';
import { NativeStorage} from 'ionic-native';
//import { userItem } from '../../models/userItem';
import {Storage, SqlStorage} from 'ionic';
import { Network } from 'ionic-native';
import * as io from "socket.io-client";
declare var require: any;
//var PouchDB = require('pouchdb');
@Injectable()
export class User {
static get parameters() {
    return [[Http]];
}
//user:userItem;
db:any;
remote:string;
options:any;
clientusername:string;
clientpassword:string;
clientphone:number;
clientemail:string;
signingup:boolean;
default:boolean;
logininit:boolean;
signupinit:boolean;
failedsignup:boolean;
successsignedup:boolean;
loginfailed:boolean;
logingin:boolean;
loggedin:boolean;
failedmessage:boolean;
username:string;
creds:string;
//public http:Http;
password:string;
phone:number;
constructor( public http:Http){ 
    console.log(this.http)   
    this.signingup = false;
    this.failedsignup = false;
    this.successsignedup = false;
    this.loginfailed = false;
    this.logingin = false;
    this.loggedin =  false;
    this.signupinit = true;
    this.logininit = true;
    this.failedmessage = false;
    //this.db = new PouchDB('unionusers', {adapter: 'websql'});     
    //this.db.info().then(console.log.bind(console));
    this.username = "siberobinsion";
    this.password = "password";
    this.remote = 'https://siberobinsion.cloudant.com/users';   
    this.options = { live: true, retry: true,  attachments:true,   continuous: true,  auth: { username: this.username, password: this.password }
    
    };
     this.creds = "username=" +this.username + "&password=" +this.password;
  }

signup(){
    var th = this;
    if ( this.clientpassword && this.clientphone && this.clientemail != "" ){ 
    this.signupinit = false;
    this.successsignedup = false;
    this.signingup = true;
    this.failedsignup = false;
    this.clientusername =  this.clientemail;
    let  headers = new Headers();
  headers.append('Content-Type', 'application/json');
  //headers.append('username',this.username);
  // headers.append('password',this.password);
   headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password)); 
  let data = JSON.stringify({_id:this.clientemail,  username: this.clientemail,  password:this.clientpassword, phone:this.clientphone, email:this.clientemail});

  th.http.post(this.remote, data,{ headers: headers  })
    .map(res => res.json())
    .subscribe(
      data => this.dosuccess(data),
      err => this.doerror(err),
      () => console.log('Authentication Complete')
    );
}
    }
doerror(data){
console.log(data);  
this.failedsignup = true;  
this.signupinit = true;
this.successsignedup = false;
this.signingup = false;
}
dosuccess(data){
if (data.ok){
    this.signupinit = false;
    this.successsignedup = true;
    this.signingup = false;
    this.failedsignup = false;
}
else{    
this.failedsignup = true;  
this.signupinit = true;
this.successsignedup = false;
this.signingup = false;    
}
}
 logout(){
NativeStorage.remove('User')
.then(
   data => console.log(data),
   error => console.log(error)
);

 }
 login(){
  if ( this.clientpassword && this.clientemail != "" ){ 
 this.logininit = false;
 this.loginfailed = false;
 this.loggedin = false;
 this.logingin = true;
 this.logout()
 let user:any = {};
 user.clientemail =  this.clientemail;
 user.clientpassword = this.clientpassword;  
 let  headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password)); 
  let data = JSON.stringify({selector:{"username":user.clientemail, password:user.clientpassword}, fields:["username","password","phone"] });
  let url = this.remote+"/_find"
    this.http.post(url, data,{ headers: headers })
    .map(res => res.json())
    .subscribe(
      data => this.logsuccess(data),
      err => this.logerror(err),
      () => console.log('Authentication Complete')
    );
  }
}
logsuccess(data){
     this.logingin = false;
    if (data.docs.length > 0){
     this.logininit = false;
     this.loginfailed = false;
     this.loggedin = true;
 
     let user =  data.docs[0];
     NativeStorage.setItem('User', {username:user.username, password:user.password, phone:user.phone})
      .then(()=>{
      this.loggedin = true;
     console.log('loggedin!'+user.username);
     })
   .catch( error =>{ console.log('Error storing item'+ error);
       this.logingin = false;
       this.loginfailed = true;
     });
    }
    else{
  this.logininit =true;
  this.loginfailed = true;
  this.loggedin = false;
  this.logingin = false;
    }
}
logerror(err) {
    console.log(err);
  this.logininit =true;
  this.loginfailed = true;
  this.loggedin = false;
  this.logingin = false; 
} 

saveuser(user:User){
 this.clientusername = user.clientusername;
 this.clientpassword = user.clientpassword;
 this.clientphone = user.clientphone;
 NativeStorage.getItem('User')
  .then(data=>{
      console.log("exists");
  })
 .catch(err => {
console.log("Saving User") 
  NativeStorage.setItem('User', {username:this.clientusername, password:this.clientpassword, phone:this.clientphone})
  .then(()=>{
    console.log('Stored item!'+this.clientusername);
  })
  .catch( error =>{ console.log('Error storing item'+ error);
  });
    }
  );
}
saveuserphone(phone:number, user:User){
 this.phone = phone;
  NativeStorage.setItem('User', {phone:this.phone})
  .then(
    () => console.log('Stored item!'+this.username),
    error => console.error('Error storing item', error)
  );
}
getuser():any{
   NativeStorage.getItem('User')
  .then(data=>{
      return data;
  })
    .catch(err => {console.log(err)
      return false;  
    }
  );
}

}