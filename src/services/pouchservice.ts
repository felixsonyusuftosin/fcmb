import { Injectable } from '@angular/core';
import * as Leaflet from "leaflet";
//import '../../www/buid/js/leaflet-bing-layer'
import { Observable } from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';
import { Project } from './model';
import { Services } from './model';
import { Type } from './model';
import {  Community} from './model';
import { Stakeholder} from './model';
import { Activity } from './model';
declare var L: any;
declare var $:any;
declare var require:any;
var PouchDB = require('pouchdb');
@Injectable()
export class DataService {
static get parameters() {
    return [[Http]];
}
  postresponse: EventEmitter<any> = new EventEmitter();
  adminname:string = "";
  adminusername:string = "Anonymous";
  adminpassword:string;
  signedin:boolean = false;
 level:string = "user";  
  username:string = "felixsonyusuftosin";  
  password:string = "password";
  remote:string;
  logfailed:boolean = false;
  resultdisplay:boolean = false;
  local:any;
 local2:any;
 modal:boolean = false;
 remoteactivity:any;
  localuser:any;
remoteaccount:any;
localaccount:any;
loggederror:boolean;
listoutputusers:any[];
listoutputstakeholders:any[];
authorisedstakeholders:any[];
listsettlements:any[];
unauthorisedstakeholders:any[];
 remoteoptions:any;
 camps:any;
 remotestakeholder:any;
 remotecamps:any;
 stakeholderoptions:any;
 headers:Headers;
  options:any;
  accepted:boolean = false;
  usersdb:any;
  listoutput:any[];
  locallist:any[];
  locallist2:any[];
  return:any[] = [];
  creds:string;
  constructor( public http:Http) {
    this.username = "siberobinsion";
    this.password = "password";
    this.remote ='https://siberobinsion.cloudant.com/';    
   // https://felixsonyusuftosin.cloudant.com/_users/_all_docs?limit=20&include_docs=true
    this.options = { live: true, retry: true,  attachments:true,   continuous: true,  auth: { username: this.username, password: this.password }    
    };
     this.creds = "username=" +this.username + "&password=" +this.password;
    this.listoutput = [];
    this.listoutputstakeholders = [];
    this.listsettlements = [];
     var db = new PouchDB('http://localhost:5984/kittens', this.options);
     this.camps = new  PouchDB('camps', {adapter: 'websql'});
     this.local =  new PouchDB('activity', {adapter: 'websql'});  
     this.local2 =  new PouchDB('stakeholder', {adapter: 'websql'});  
     this.localaccount = new PouchDB('',{adapter:'websql'})
     this.localuser = new PouchDB('user2',{adapter: 'websql'});
    this.remoteactivity ='https://'+this.username + '.cloudant.com/activity';  
    this.remotestakeholder ='https://'+this.username + '.cloudant.com/stakeholder';  
    this.remotecamps = 'https://'+this.username + '.cloudant.com/camps'; 
    this.remoteaccount = 'https://'+this.username + '.cloudant.com/account'; 
    this.usersdb = 'https://siberobinsion.cloudant.com/usermodel'; 
    this.remoteoptions = { live: true, retry: true,  attachments:true,   continuous: true,  auth: { username: this.username, password: this.password }
    };

  
   this.headers  = new Headers();
   this.headers.append('Content-Type', 'application/json');
   this.headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));   
   //key:riengempowelysingendlyld
   //password:5f21e3df8be34fac9f800d5d00990070ecb4b41f   

  }
 initdb(){
   console.log(this.remoteoptions);
    this.local.sync(this.remoteactivity, this.remoteoptions);
    this.local2.sync(this.remotestakeholder, this.remoteoptions);
    this.camps.sync(this.remotecamps, this.remoteoptions);
    this.localuser.replicate.from(this.usersdb,this.remoteoptions);
  this.local.changes({live: true, since: 'now', include_docs: true, attachments:true}).on('change', (change) => {
   this.handleChange(change, this.local);   
   this.local.info().then(console.log.bind(console));
      }); 
    this.localuser.changes({live: true, since: 'now', include_docs: true, attachments:true}).on('change', (change) => {
   this.handleChangeuser(change, this.localuser);   
   this.localuser.info().then(console.log.bind(console));
      }); 
  this.local2.changes({live: true, since: 'now', include_docs: true, attachments:true}).on('change', (change) => {
   this.handleChangesh(change, this.local2);   
   this.local2.info().then(console.log.bind(console));
      }); 
  this.camps.changes({live: true, since: 'now', include_docs: true, attachments:true}).on('change', (change) => {
   this.handleChangesettle(change, this.camps);   
   this.camps.info().then(console.log.bind(console));
  })
  
 }
btoBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
}
return new Blob(byteArrays, { type: contentType });
}

resulttoggle(dep){
  
  if (! this.resultdisplay ){
    this.resultdisplay = true;
  }
  else{
    if (! dep){
    this.resultdisplay = false;
    }
  }
}
//Pouchdb Implementation
//gets all documents  from pouchdb
//inputs db:db name , limit: Limit of outputs, picturelist: array of pictures required to to return ie picture, logo, or picture1,picture2 etc
//type promise: returns a list and also changes a global list which can be subscribed to as live 


getalldocs(db, limit, picturelist):Promise<any>{
let th = this;

let iterate:boolean = false;
if (picturelist.length > 0){
iterate = true;
}
let listofurls:any[] = [];
return new Promise(resolve=>{
let options:any;
if (limit > 0){
  options = {  include_docs: true,  attachments: true, limit:limit};
}
else{
  let options = {  include_docs: true,  attachments: true};
}
db.allDocs(options).then(function (result) {  
  let listoutput:any[] = result.map(row=>{  
  if (iterate){
    listofurls = picturelist.map((iter)=>{
      db.getAttachment(row.doc._id, row.doc._id+iter).then(function (blob) {
      let url = URL.createObjectURL(blob);    
      // row.doc.imageurl = listofurls.push(url);    
       return url;          
        }).catch(function (err) {
        console.log(err);
        }); 
   })
   row.doc.imageurl = listofurls;
  }
  else{
  db.getAttachment(row.doc._id, row.doc._id+"picture").then(function (blob) {
      let url = URL.createObjectURL(blob);
    
       row.doc.imageurl = listofurls.push(url);              
        }).catch(function (err) {
        console.log(err);
        });   
     return  row.doc
      } 
  });  
th.listoutput = listoutput;
resolve(listoutput);
}).catch(function (err) {
  console.log(err);
});

});
};//getalldocs





//Pouchdb Implementation
//put documents into pouchdb
//inputs db:db name , doc:object or json to be added to the db
//type promise: returns a status object if successful or returns a fail object if failed  
updatedocs(doc, db):Promise<any>{
return new Promise(resolve=>{
  db.put(doc).then((response)=>{
    if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})      
    }
    else{
      resolve(false)
    }    
  })
 .catch((err)=>{
   console.log(err);
  })

  });
};
putdoc(doc, db):Promise<any>{
return new Promise(resolve=>{  
  db.put(doc).then((response)=>{
    if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})      
    }
    else{
      resolve(false)
    }
    
  })
 .catch((err)=>{
   console.log(err);
  })
  })
};


putdocs(doc, db):Promise<any>{
return new Promise(resolve=>{
  db.get(doc._id).then((dd)=>{   
    console.log(dd);
    
    resolve({'stat':true, 'id':dd._id, 'rev':dd._rev}) 
  }).catch((err)=>{console.log(err)
  db.put(doc).then((response)=>{
    if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})      
    }
    else{
      resolve(false)
    }
    
  })
 .catch((err)=>{
   console.log(err);
  })
  })
  });
};

//Pouchdb Implementation
//put attachment into pouchdb
//inputs db:db name , id:id of the document to put, imgid the id of the iage to put , rev, the rev of the document to update , image the base64 rep of the iage to upload
//type promise: returns a status object if successful or returns a fail object if failed  

putattachment(id,db, imgid,rev, image){ 
 return new Promise(resolve=>{
db.putAttachment(id, imgid,rev, image, 'image/jpg').then(function (response) {
     if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})      
    }
    else{
      resolve(false)
    }
}).catch(function (err) {
  console.log(err);
});
});
}

removeattachment(id,db, imgid,rev){ 
 return new Promise(resolve=>{
db.removeAttachment(id, imgid,rev).then(function (response) {
     if (response.ok){
      resolve({'stat':true, 'id':response.id, 'rev':response.rev})      
    }
    else{
      resolve(false)
    }
}).catch(function (err) {
  console.log(err);
});
});
}






getattachment(id,db,  imagename){ 
 return new Promise(resolve=>{
db.getAttachment(id, imagename).then(function (blob) {
let url = URL.createObjectURL(blob);
resolve(url);
}).catch(function (err) {
  console.log(err);
  resolve(false);
});
});
}


//cloudant implentation

uploadhub(obj, dbname){
 var th = this;
  let  headers = th.headers;
  let data = JSON.stringify(obj);
  let remote = this.remote + dbname;
  th.http.post(remote, data, {headers:headers})
     .map(res => res.json())
      .subscribe(
      data => this.dosuccess(data),
      err => this.doerror(err),
      () => console.log('Post Complete')
    );
}

//cloudant Implementation

updatehub(obj, dbname, field/*list of field strings*/){
 var th = this;
 let  headers = th.headers;
 let remote = this.remote +dbname;
 let datav = JSON.stringify({selector:{"_id" : obj.id} , fields:["_id"] })
 th.http.post(this.remote, datav,{ headers: headers  })
  .map(res => res.json())
  .subscribe(
      data => th.updatesuccess(data, remote, headers, obj, field, th),
      err => this.doerror(err),
      () => console.log('data gotten')
  );
}
//cloudant Implementation

updatesuccess(data,remote,headers, obj, field,th){
 let  object = data.docs[0];
  obj._rev = object._rev;
  field.push('_rev');
  let datav = JSON.stringify({selector:obj , fields:field });
   th.http.post(remote, datav,{ headers: headers  })
    .map(res => res.json())
    .subscribe(
      data => this.dosuccess(data),
      err => this.doerror(err),
      () => console.log('data update complete')
    );
}
//cloudant Implementation
dosuccess(data){
if (data.ok){
this.postresponse.emit(true)
};
}
//cloudant Implementation
doerror(data){
console.log(data);
this.postresponse.emit(false)
}


//cloudant implenetation
checklogin():Promise<any>{
let th = this;
return new Promise(resolve =>{
  th.localuser.get("username", {include_docs:true}).then((doc)=>{
    console.log(doc)
  th.adminname = doc.firstname +' '+doc.lastname;
  th.adminusername = doc.username
  th.adminpassword = doc.password
  th.level = doc.level;
  if (th.level == "stakeholder"){
   th.local2.get(doc.username+doc.password, {include_docs:true, attachments:true}).then((dc)=>{
     console.log(dc)
     th.listoutputstakeholders = [];
     th.listoutputstakeholders.push(dc);
     console.log(th.listoutputstakeholders)
   }).catch((err)=>{console.log(err)})
  }
  else{
    th.local2.allDocs({include_docs:true, attachments:true}).then((result)=>{
    // console.log(result)
     let dc = result.rows
     console.log(result.rows.length)
       th.listoutputstakeholders = [];

       result.rows.forEach(element => {
       th.listoutputstakeholders.push(element.doc);       
     });
     console.log(th.listoutputstakeholders) 
     th.localuser.allDocs({include_docs:true, attachments:true}).then((result2)=>{  
    //console.log(result2)
    //console.log('result2')
    let df = result2.rows
    let temp = [];
    result2.rows.forEach(element => {
    temp.push(element.doc);       
     });
   // console.log(temp)
    //console.log('temp')
     th.authorisedstakeholders = temp.filter((obj)=>{ obj.accepted});
     th.unauthorisedstakeholders =temp.filter((obj)=>{ !obj.accepted});

     console.log(th.authorisedstakeholders)
      console.log('th.authorisedstakeholders')
       console.log(th.unauthorisedstakeholders)
        console.log('th.unauthorisedstakeholders')
     }).catch((err)=>{console.log(err)})
     //th.authorisedstakeholders = result.rows.map
   }).catch((err)=>{console.log(err)})
       th.camps.allDocs({include_docs:true, attachments:true}).then((result)=>{
    // console.log(result)
     let dc = result.rows
     console.log(result.rows.length)
       th.listsettlements = [];

       result.rows.forEach(element => {
       th.listsettlements.push(element.doc);       
     });
       }).catch((err)=>{console.log(err)})
  }
  try{
    th.accepted =doc.accepted;
  }
  catch(err){
    console.log('not accepted')
  }
  th.listoutputusers = [];
  th.listoutputusers.push(doc);
  th.signedin = true;
  resolve(th.signedin);
  }).catch((err)=>{
    console.log(err);
    th.signedin = false;
    th.listoutputusers = []
    resolve(th.signedin);
  });

});


}
logout():Promise<any>{
  let th =this;
  return new Promise(resolve =>{
  th.adminusername = "Anonymous";
  th.signedin = false;
  th.level = "user";  
  th.adminname = "";
  th.localuser.allDocs().then(function (result) {
  return Promise.all(result.rows.map(function (row) {
  th.listoutputusers = []
  return th.localuser.remove(row.id, row.value.rev);
  }));
}).then(function () {
   console.log('Successfully deleted db');
   resolve(true)
}).catch(function (err) {
   console.log(err);
   resolve(false);
});
  });
}

getlogin(username,password):Promise<any>{
return new Promise(resolve =>{
let th = this;
let remote = th.usersdb;
let  headers = this.headers;
let pouch = new PouchDB(this.usersdb, this.options);
pouch.get(username+password, {include_docs:true}).then((dat)=>{
  if (dat._id != username+password){
     th.logfailed = true;
    resolve(false)
  }
  th.loginsuccess(dat).then((dat)=>{
    if (dat){
    th.logfailed = false;
    resolve(true)
    }
    else{
      resolve(false);
    }
  });
  }).catch(err=>{
    console.log(err);
    th.logfailed = true;
    resolve(false)
  });
  
})
}
loginerror(err){
  console.log(err);
  this.loggederror = true
  this.modal = false;
}
 loginsuccess(data):Promise<any>{
    let th = this; 
    return new Promise(resolve =>{
   let pouch = new PouchDB(this.usersdb, this.options);
   pouch.get(data._id, {include_docs:true}).then((doc)=>{
    let docs:any;
    try{
    docs = {_id: "username",username:doc.username, password:doc.password, firstname:doc.firstname, lastname:doc.lastname, level:doc.level,accepted:doc.accepted}
    th.getalldocs(th.local2, 1, []).then((output)=>{
      console.log("this is output of stakeholde"+ output.length)
      if (output.length < 0){
        let ddt = new Stakeholder();
         ddt._id =doc.username+doc.password;
         ddt.address = ""; ddt.comments = "";
         let dt =  JSON.stringify(ddt);
        th.http.post( th.remotestakeholder, dt,{ headers: th.headers  })
            .map(res => res.json())
            .subscribe(
              dat =>console.log(true),
              erre =>console.log(erre),
              () =>console.log(true)
            );
      }
    });
    }
    catch(err){
     docs = {_id: "username",username:doc.username, password:doc.password, firstname:doc.firstname, lastname:doc.lastname, level:doc.level}  
    }
   console.log(doc)
    th.putdocs(docs, th.localuser).then((dat)=>{
      console.log(dat)
       if (dat){
      th.checklogin().then((con)=>{
        th.modal = false;
        console.log(con);
        resolve(true);
      });
       }
       else{
         resolve(false);
       }
    })
  
  })
    })
    
 }

signup(username,password, level, firstname, lastname):Promise<any>{
let th = this;
return new Promise(resolve=>{
let remote = th.usersdb
let  headers = this.headers;
let data:any;
let date = new Date();
if (level =="stakeholder"){
data = JSON.stringify({_id:username+password,level:level, firstname:firstname, lastname:lastname,  username:username, password:password, accepted:false, date:date  });
th.accepted = false;
}
else{
data = JSON.stringify({_id:username+password,level:level, firstname:firstname, lastname:lastname,  username:username, password:password , date:date });
}
let url = remote;
 th.http.post(remote, data,{ headers: headers  })
  .map(res => res.json())
  .subscribe(
   ((data) =>{
       if(level == "stakeholder"){
         let ddt = new Stakeholder();
         ddt._id =username+password;
         ddt.address = ""; ddt.comments = "";
         let dt =  JSON.stringify(ddt);
         th.http.post( th.remotestakeholder, dt,{ headers: headers  })
            .map(res => res.json())
            .subscribe(
              dat =>resolve(true),
              erre =>resolve(false),
              () =>resolve(true)
            );
       }     

       resolve(true)
      
    }),
      err =>resolve(false),
      () => resolve(true)
    );
  });

}


//cloudant Implementation
gethubbystate(dbname, length , state ):Promise<any>{
return new Promise(resolve=>{
let th = this;
let remote = this.remote +dbname;
let  headers = this.headers;
let data = JSON.stringify({selector:{"state":state}, fields:["state"] });
  let url = remote+"/_find"
  th.http.post(remote, data,{ headers: headers  })
    .map(res => res.json())
    .subscribe(
      data => resolve(data),
      err => resolve(err),
      () => console.log('get by state Complete')
    );
  });
  }
//Pouchdb not user specific
handleChangesettle(change, db){
let th = this;
let changedDoc = null;
let changedIndex = null;
try{ 
    th.listsettlements.forEach((doc, index) => { 
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
       });
    }
    catch(err){
      console.log(err);
    } 
    //A document was deleted
    if(change.deleted){
      this.listsettlements.splice(changedIndex, 1);
    } 
    else { 
      //A document was updated
      if(changedDoc){      
       let modifieddoc = db.getAttachment(changedDoc._id, changedDoc._id+"picture").then(function (blob) {
       let url = URL.createObjectURL(blob);    
       modifieddoc.imageurl = [url];              
        }).catch(function (err) {
        console.log(err);
        });       
          this.listsettlements.splice(changedIndex, 1);      
       
      }
}
}

handleChange(change, db){
let th = this;
let changedDoc = null;
let changedIndex = null;
try{ 
    th.listoutput.forEach((doc, index) => { 
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
       });
    }
    catch(err){
      console.log(err);
    } 
    //A document was deleted
    if(change.deleted){
      this.listoutput.splice(changedIndex, 1);
    } 
    else { 
      //A document was updated
      if(changedDoc){      
       let modifieddoc = db.getAttachment(changedDoc._id, changedDoc._id+"picture").then(function (blob) {
       let url = URL.createObjectURL(blob);    
       modifieddoc.imageurl = [url];              
        }).catch(function (err) {
        console.log(err);
        });       
          this.listoutput.splice(changedIndex, 1);      
       
      }
}
}


handleChangeuser(change, db){
let th = this;
let changedDoc = null;
let changedIndex = null;
try{ 
    th.listoutputusers.forEach((doc, index) => { 
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
       });
    }
    catch(err){
      console.log(err);
    } 
    //A document was deleted

    if(change.deleted){
     th.logout().then(()=>{console.log("Your account has being disabled remotely!!! please contact administrator")})
     th.listoutputusers = [];
     console.log(this.listoutputusers)
    } 
    else { 
      //A document was updated
    try{
    if (! changedDoc){
     this.listoutputusers.push(change)
     console.log(this.listoutputusers)
    }
    else{
    if (change.id == changedDoc._id ){
      if(changedDoc){      
       let modifieddoc = db.getAttachment(changedDoc._id, changedDoc._id+"picture").then(function (blob) {
       let url = URL.createObjectURL(blob);    
       modifieddoc.imageurl = [url];              
        }).catch(function (err) {
        console.log(err);
        }); 
          this.listoutputusers.splice(changedIndex, 1);  
          console.log(this.listoutputusers)
      }
      }
    }
}
    catch(err){
      console.log(err);
    }

    }

}

deletedb(db, thelist):Promise<any>{
  let th =this;
  return new Promise(resolve =>{
  db.allDocs().then(function (result) {
  return Promise.all(result.rows.map(function (row) {
    thelist = []
    return db.remove(row.id, row.value.rev);
  }));
}).then(function () {
   console.log('SUccessfully deleted db');
}).catch(function (err) {
   console.log(err);
});
  });
}
handleChangesh(change, db){
let th = this;
let changedDoc = null;
let changedIndex = null;
try{ 
    th.listoutputstakeholders.forEach((doc, index) => { 
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
       });
    }
    catch(err){
      console.log(err);
    } 
    //A document was deleted

    if(change.deleted){
     th.deletedb(th.local2,th.listoutputstakeholders).then(()=>{console.log("Your account has being disabled remotely!!! please contact administrator")})     
    if (th.level == 'admin' ){
    th.listoutputstakeholders.splice(changedIndex, 1);  
    console.log(this.listoutputstakeholders)
    }
    else{
     th.listoutputstakeholders = [];
     console.log(this.listoutputstakeholders)
    }
    } 
    else { 
      //A document was updated
    try{
    if (! changedDoc){
      if (th.level == 'admin'){
     this.listoutputstakeholders.unshift(change)
     console.log(this.listoutputstakeholders)
      }
      else{ 
     this.listoutputstakeholders.push(change)
     console.log(this.listoutputstakeholders)
      }
    }
    else{
    if (change.id == changedDoc._id ){
      if(changedDoc){      
       let modifieddoc = db.getAttachment(changedDoc._id, changedDoc._id+"picture").then(function (blob) {
       let url = URL.createObjectURL(blob);    
       modifieddoc.imageurl = [url];              
        }).catch(function (err) {
        console.log(err);
        }); 
        
          th.listoutputstakeholders.splice(changedIndex, 1);  
          console.log(this.listoutputstakeholders)
      }
      }
    }
}
    catch(err){
      console.log(err);
    }

    }

}




   }//end of class
/*
var rep = PouchDB.replicate('mydb', 'http://localhost:5984/mydb', {
  live: true,
  retry: true
}).on('change', function (info) {
  // handle change
}).on('paused', function (err) {
  // replication paused (e.g. replication up to date, user went offline)
}).on('active', function () {
  // replicate resumed (e.g. new changes replicating, user went back online)
}).on('denied', function (err) {
  // a document failed to replicate (e.g. due to permissions)
}).on('complete', function (info) {
  // handle complete
}).on('error', function (err) {
  // handle error
});



*/ 

