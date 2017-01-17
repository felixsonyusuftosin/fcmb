import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { item } from '../models/item';
import { User } from './user-service';
import { Geolocation } from 'ionic-native';
import {models} from '../models/model';
import {App} from "ionic-angular/index";
import { Nav, NavController, ModalController } from 'ionic-angular';
import {Component, ViewChild} from "@angular/core";
import {Storage, SqlStorage} from 'ionic';
import { Network } from 'ionic-native';
import * as io from "socket.io-client";
import { NativeStorage} from 'ionic-native';
import { CallpagePage } from '../pages/callpage/callpage';
import { UsersPage } from '../pages/users/users';
//import {MyApp} from   '../app/app.component';
declare var require: any;
//var Random = require('Random');
@Injectable()
export class Call {
id:number;
user:User;
modal:CallpagePage;
callee:any;

peer_id:number;
public peer_phone:number
caller:any;
contact:any;
username:string
callInProgress:boolean;
callIgnored:boolean;
callEnded:boolean;
isCalling:boolean;
default:boolean;
private navCtrl:NavController;
public modalCtrl:ModalController;

constructor(private app:App){ 

this.callInProgress= false;
this.callIgnored = false;
this.callEnded= false;
this.isCalling = false;
this.default = true;
this.default = true;

}
initialize(peer_phone:number):Promise<any>{
  let th = this;
    return new Promise(resolve=>{
    //th.navCtrl = th.app.getActiveNav();

    this.peer_phone = peer_phone;
    this.peer_id = peer_phone; 
    resolve(true);
    });
}
showmodal(isCalling,callIgnored,callEnded,defult,callInProgress,t) {
  console.log('displaying call ......')
   let  p = 1;
   let itemz:any = [{geoaddress:"Marina Lagos Island Lagos", address:"FCMB Customer Care"}];
   //let profileModal = this.modalCtrl.create(CallpagePage, { scall:this, callInProgress: callInProgress,default :defult, callIgnored:callIgnored, callEnded:callEnded, isCalling:isCalling,p:p, item:itemz });
  // profileModal.present();
  this.navCtrl.push(CallpagePage, { scall:t, callInProgress: callInProgress,default :defult, callIgnored:callIgnored, callEnded:callEnded, isCalling:isCalling,p:p, item:itemz });

 }
 showmodal2(obj,isCalling,callIgnored,callEnded,defult,callInProgress ) {
  console.log('displaying call2 ......')

   let profileModal = this.modalCtrl.create(CallpagePage, { scall:this,   callInProgress: callInProgress, default:defult,  callIgnored:callIgnored, callEnded:callEnded, isCalling:isCalling, p:obj.p, item:obj.item });
   profileModal.present();
 }


};
