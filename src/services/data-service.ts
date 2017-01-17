import * as Leaflet from "leaflet";
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { item } from '../models/item';
//import {mapObject} from  '../services/map-service';
import { Geolocation } from 'ionic-native';
import PouchDB from 'pouchdb';
import {models} from '../models/model'
import {Storage, SqlStorage} from 'ionic';
import { Network } from 'ionic-native';
//import { Platform } from 'ionic-angular';
declare var require: any;
declare var L: any;
//var L = require('leaflet');
declare var $:any;
declare var Connection;
//var PouchDB = require('pouchdb');

@Injectable()
export class Data {
   public db:any; 
   username:string;
   models:models;
   online:boolean;
   password:string;
   remote:string;  
   data:any[]; 
   error:boolean = false;  
   currentlat:L.LatLng;
   options:any;
   public  items:any[];
   public preitems:any[];
   loaded:boolean = false;
    onDevice: boolean;
  constructor() {      
    this.db = new PouchDB('branchesupdatefv2finals', {adapter: 'websql'});
    this.items = [];
    this.db.info().then(console.log.bind(console));
    this.username = "ascaultsibledifeammoster";
    this.password = "580bd4a02d7a6999689ab1fb3b20f0784309992c";
    this.remote = 'https://siberobinsion.cloudant.com/branchesfcmb';  
   this.options = { live: true, retry: true,  attachments:true,  auth: { username: this.username, password: this.password }
    };
     
  }
initDB(){
   console.log(this.db);
   console.log(this.remote);
   let th = this;
   this.db.sync(th.remote, th.options).on('change', (change) => {
   th.loaded = false;
   th.handleChange(change);   
   th.db.info().then(console.log.bind(console));  
    });
  }
  addDocument(doc){
    this.db.put(doc);
  }
  
 isOnline(): boolean {
    if(Network.connection){
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(Network.connection){
      return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }

getLocation():any{
        var deferred = $.Deferred();
        // if geo location is supported
        if(navigator.geolocation) {
            // get current position and pass the results to getPostalCode or time out after 5 seconds if it fails
            navigator.geolocation.getCurrentPosition(deferred.resolve, this.geoLocationError, {
                timeout: 10000
            });

        } else {
            //geo location isn't supported
            console.log('Your browser does not support Geo Location.');
        }

        return deferred.promise();

    };

    geoLocationError() {
        console.log('Geo Location failed.');
    };



  getposition():any{ 
   
    Geolocation.getCurrentPosition().then((position) => {
      //let currentlato = L.latLng(position.coords.latitude, position.coords.longitude);
      let currentlato = {lat:position.coords.latitude, lng:position.coords.longitude}
      console.log('Device location' + currentlato);
      return currentlato;
    }, (err) => {
      console.log(err);
     $.when(this.getLocation())
     .then((position, textStatus, jqXHR)=> {
        console.log("this is my location" + position.coords.longitude, position.coords.latitude);
        return {lat:position.coords.latitude, lng:position.coords.longitude};
       
});
    });
  }

comparedistance(currentlat:any, objectlat:any){
var pnts = currentlat.distanceTo(objectlat).toFixed(3);
return pnts;

} ;

      

getDocuments():Promise<any[]>{  
//if(this.isOnline()){      .................uncomment in deployment
let th = this;
let db = this.db;
let  geolocation = function():Promise<any>{
return new Promise(resolve=>{
	Geolocation.getCurrentPosition({enableHighAccuracy:true, timeout:19000}).then((position) => {
  th.currentlat = new L.LatLng(position.coords.latitude, position.coords.longitude)  
  resolve(th.currentlat);
}).catch(err=>{
  console.log(err);
  th.error = true;
  });	
})
};
let querydb = function():Promise<any>{ 
	return new Promise(resolve=>{
     let dc:any[]
	  th.db.allDocs({ include_docs: true, attachments:true}).then(result=>{           
    	dc = result.rows.map(row => { 
      let currentObj:L.LatLng = Leaflet.latLng(parseFloat(row.doc.easting), parseFloat(row.doc.northing)) ;       
       row.doc.distance =(th.currentlat.distanceTo(currentObj)* 0.001).toFixed(3);      
       db.getAttachment(row.doc._id, row.doc._id + 3 ).then(function (blob) {
        let url = URL.createObjectURL(blob);
         row.doc.imageurl = url;              
        }).catch(function (err) {
        console.log(err);
        });          
         db.getAttachment(row.doc._id, row.doc._id + 2).then(function (blob) {
         let url = URL.createObjectURL(blob);
         row.doc.imageurl2 = url;             
        }).catch(function (err) {
        console.log(err);
        }); 
        db.getAttachment(row.doc._id, row.doc._id +4 ).then(function (blob) {
         let url = URL.createObjectURL(blob);
         row.doc.imageurl4 = url;  
            
        }).catch(function (err) {
        console.log(err);
        });
          if (th.items.filter(e=> e._id == row.doc._id).length > 0) {
              
                 }
            th.items.sort(function (a, b) {
           if (a.distance > b.distance) {
                return 1;
               }
             if (a.distance < b.distance) {
               return -1;
                }
                 // a must be equal to b
                 return 0;
                 });  
                 return row.doc                             
                });
                th.items.concat(dc);
                if (dc.length > 0){th.loaded = false};
                resolve(dc)
    }), (err) => {
        }			
	});	
}


return new Promise(resolve =>{ 
  if (th.currentlat) {
    resolve(querydb());
  }
else{  resolve(geolocation().then(querydb).catch(err=>{
  th.error  = true;
  console.log(err);
  }));
}


 });
/*}.................................uncomment in deployment
else{
  this.online = false;
}*/ //..................................................uncomment in deployment
      }






 
  filterItems(searchTerm, thispreitems){  
        return thispreitems.filter((itema) => {            
            return itema.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || itema.geoaddress.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            
        });     
 
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
  
 
   handleChange(change){
     console.log(change)
    let th = this;
    let changedDoc = null;
    let changedIndex = null;
    try{ 
    this.items.forEach((doc, index) => { 
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
      this.data.splice(changedIndex, 1);
    } 
    else {
 
      //A document was updated
      if(changedDoc){       
        th.getDocuments().then(result=>{
          th.error = false;
          th.loaded = true; 
          th.items = result;
          th.preitems = result;
           this.items.sort(function (a, b) {
           if (a.distance > b.distance) {
                return 1;
               }
             if (a.distance < b.distance) {
               return -1;
                }
                 // a must be equal to b
                 return 0;
                 });  
          console.log(this.items.length)   
          this.loaded = true;     
        }).catch(err=>{
          this.error = true;
        });
        this.data[changedIndex] = change.doc;
      } 
      //A document was added
      else {
        try{
        this.getDocuments().then(result=>{
          this.error = false;
          this.items = result;
          this.loaded = true;
           this.preitems = result;
           this.items.sort(function (a, b) {
           if (a.distance > b.distance) {
                return 1;
               }
             if (a.distance < b.distance) {
               return -1;
                }
                 // a must be equal to b
                 return 0;
                 }); 
          console.log(this.items.length) 
          this.loaded = true;
        }).catch(err=>{
          this.error = true;
          console.log(err)
        });
        this.data.push(change.doc);  
        }
        catch(err) {
          console.log(err);
        }     
      }
 
    }
 
  } 
  getseconddoc(){
    this.getDocuments().then(result=>{
            this.items = result;
            if (this.items.length > 0){
              this.loaded = true;
            };
            this.error = false;
            this.preitems = result;
            this.items.sort(function (a, b) {
            if (a.distance > b.distance) {
                return 1;
               }
             if (a.distance < b.distance) {
               return -1;
                }
                 // a must be equal to b
                 return 0;
                 }); 
    });
  } 

}