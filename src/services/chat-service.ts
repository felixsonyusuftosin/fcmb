import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { item } from '../models/item';
import { Geolocation } from 'ionic-native';
import {models} from '../models/model'
import {Storage, SqlStorage, LocalStorage} from 'ionic';
import { Network } from 'ionic-native';
import { Http, Response, Headers, RequestOptions } from '@angular/http'
declare var require: any;
declare var $:any;
declare var Connection;
var PouchDB = require('pouchdb');
@Injectable()
export class Chat {
   public db:any; 
   username:string;
   online:boolean;
   password:string;   
   remote:string;  
   Login:boolean = false;
   chatname:string;
   cloudant:string;
   http:Http;
   chatnumber:string;
   chatid:string;
   creds:string;
   dbname:string;
   chatemail:string;
   options:any;
   error:boolean;
   onDevice: boolean;
   local:Storage;
  constructor() {    
     // this.local = new Storage(LocalStorage);  
    //this.db = new PouchDB('branchesupdateunionfinals', {adapter: 'websql'});
    //this.db.info().then(console.log.bind(console));
    this.username = "357296f9-7b7a-41f8-a578-099ae6a7187d-bluemix";
    this.password = "db808ee4a8828d79369a6f972d0901e0c381c9a5026446f4566c4d68f3178d24";
    this.creds = 'username='+this.username +"&password="+this.password;
    this.cloudant ='https://357296f9-7b7a-41f8-a578-099ae6a7187d-bluemix.cloudant.com' 
   this.options = { live: true, retry: true,  attachments:true,   continuous: true,  auth: { username: this.username, password: this.password } };   
   this.dbname =  this.chatname+this.chatnumber; 
     }
   setupremote():Promise<any[]>{
    return new Promise(resolve =>{
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');  
    this.http.post(this.cloudant +'/'+this.dbname, this.creds, {
    headers: headers
    })
    .subscribe(data =>{
        this.remote = this.cloudant +'/'+this.dbname;
        resolve('success');
    });
      //data => this.remote = this.cloudant +'/'+this.dbname,
      //err => this.error = true,
      //() => console.log('Authentication Complete')
    
   }); 
  }
  setuplocal(){
   var th = this;
   this.db = new PouchDB('union', { adapter: 'websql' });
      this.db.info()
      .then(() => {
          console.log('success');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  })
  .catch(e => {
    console.log(e)
  });
  }
  getsetupinfo():Promise<any>{
    return new Promise(resolve =>{
    this.db.get('logininfo', {'include_docs':true}) 
    .then((res)=>{
         console.log('accountopened');
         this.Login = false;
         this.chatnumber = res.password;
         this.chatname = res.username;
         this.chatemail = res.email;
         this.dbname = res.dbname;
         this.remote = res.remote;
         resolve(true);
   })
   .catch(e =>{
         console.log('account not opened');
         this.Login = true;  
         resolve(false);                
   });
  });
  }

initsetup():Promise<any>{
 return new Promise(resolve =>{
  this.setupremote()
    .then(function(){
       let doc= {_id:'logininfo', username:this.chatname, password:this.chatnumber,  number:this.chatnumber, email:this.chatemail, dbname:this.dbname, remote:this.remote}
        this.db.put(doc).then(console.log('created'));
        resolve('success');
         })
        .catch(err=>{
            console.log('Could not setup DB');
            resolve('error');
        });
         
    });
}
initDB(){
   this.db.sync(this.remote, this.options);
   this.db.changes({live: true, since: 'now', include_docs: true, attachments:true}).on('change', (change) => {
   //this.handleChange(change);   
   this.db.info().then(console.log.bind(console));  
    });
  }

};