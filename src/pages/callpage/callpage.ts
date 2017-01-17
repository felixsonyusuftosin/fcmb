import { Component, Inject, Injectable } from '@angular/core';
import { NavController, ModalController , ViewController, NavParams} from 'ionic-angular';
import {Call} from '../../services/call-service';
import {SocketService} from '../../services/socket-service';
import {Events} from 'ionic-angular';
//export * from '../../services/call-service';
//export * from '../../services/socket-service';
/*
  Generated class for the Callpage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-callpage',
  templateUrl: 'callpage.html'
})
@Injectable()
export class CallpagePage {
   callInProgress:boolean;
   callIgnored:boolean;
   callEnded:boolean;
   notproduction:boolean;
   isCalling:boolean;
   isDialling:boolean;
   default:boolean;
   call:any;
    p:any;
    id:number;
    peer_id:number;
    scall:any;
    item:any;
  constructor(public ss:SocketService,public navCtrl: NavController, public event:Events, public modalCtrl: ModalController,private navParams: NavParams,public viewCtrl: ViewController) {
   this.notproduction = true;
   this.callInProgress = navParams.get('callInProgress');
   this.callIgnored = navParams.get('callIgnored');
   this.callEnded = navParams.get('callEnded');
   this.isCalling = navParams.get('isCalling');
   this.default =  navParams.get('default');
   this.isDialling = navParams.get('isDialling')
   //console.log( this.callInProgress+ " callInProgress"+this.callIgnored+ " callIgnored"+this.callEnded +" callEnded"+  this.isCalling+" isCalling"+this.default+ " default")
   
   try{
   this.p = navParams.get('p');
   let itemz = navParams.get('item');
   let dd = navParams.get('call');

   
   //this.scall = navParams.get('scall');
   this.call = ss;
   this.scall = ss;   
   //console.log(this.scall);
   this.item = itemz[0];
   }
   catch(err){
     console.log(err + " nlo item");
   }
   try{
 this.id = navParams.get('id');
 this.peer_id= navParams.get('peer_id')
   }
      catch(err){
     console.log(err + " nlo id");
   }
  }
  
  ionViewDidLoad() {
  console.log('Hello CallpagePage Page');
   this.event.subscribe('modalend',()=>{
      this.viewCtrl.dismiss();
    });
  }
 dismiss() {  
    this.viewCtrl.dismiss();
 }
}
