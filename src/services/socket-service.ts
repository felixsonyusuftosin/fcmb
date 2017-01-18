import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import {App} from "ionic-angular/index";
import { item } from '../models/item';
import { User } from './user-service';
import {Events} from 'ionic-angular';
import { Geolocation } from 'ionic-native';

import {models} from '../models/model';
import { NavController, ModalController } from 'ionic-angular';
import {Storage, SqlStorage} from 'ionic';
import { Network } from 'ionic-native';
import * as io from "socket.io-client";
import { NativeStorage} from 'ionic-native';
import { CallpagePage } from '../pages/callpage/callpage';
import { UsersPage } from '../pages/users/users';

import { Call } from './call-service';
//import {MyApp} from   '..app/app.component';
declare var require: any;
declare var cordova: any;
//let io = require('socket.io')(http);
@Injectable()
export class SocketService {
 public users:any[] = [];
public peer_id:any;
 public peer_phone:any;
public id:any;
user:User;
modal:CallpagePage;
callee:any;

caller:any;
contact:any;

username:string;
acceptreciever:boolean = false;
rejectreciever:boolean = false;
scanningreciever:boolean = false;
acceptuser:boolean = false;
rejectuser:boolean = false;
confirmationuser:boolean;
callInProgress:boolean;
callIgnored:boolean;
callEnded:boolean;
isCalling:boolean;
isDialling:boolean;
default:boolean;
socketObserver: any; 
socketService: any;
socket: any;
session:any;
phone:any;
constructor(private  modalCtrl:ModalController, public event:Events /*private navCtrl:NavController*/) {
this.callInProgress= false;
this.isDialling = false;
//if (this.users.length < 1){
//this.users = [];
//}
//this.initialize(0).then(()=>{console.log('initialized')})
this.callIgnored = false;
this.callEnded= false;
this.isCalling = false;
this.default = true;
this.socketService = Observable.create(observer => {
this.socketObserver = observer; 
 });
this.socket = io.connect('https://koler.herokuapp.com/', {reconnect: true});   
console.log(this.phone);
   if (NativeStorage){
   NativeStorage.getItem('User')
  .then(data=>{
    this.id = data.username; 
    this.phone = data.phone;
    this.socket.emit('login', {id: this.id, phone:this.phone});
    //this.socket.login({id:this.id, phone:this.id})    
  })
 .catch(err => {
   //this.navCtrl.push(UsersPage,{next:'chat'}); 
    this.id = 1 + Math.round(Math.random() * 34563) * 27880;   
     console.log(this.id+ " this is ur contact number");
     this.phone = this.id
     this.socket.emit('login', {id: this.id, phone:this.phone});
    });
   }
  else{
     this.id = 1 + Math.round(Math.random() * 34563) * 27880;   
     console.log(this.id+ " this is ur contact number");   
     this.phone = this.id;
     this.socket.emit('login', {id: this.id, phone:this.phone});
   }

 } 
 scansuccess(thisid, pr_id){
  this.acceptuser = false; this.rejectuser = false; this.confirmationuser = true;
   this.socket.emit('pay', {peer_id: pr_id, type:'scansuccess'});
 }
acceptedpay(thisid,  pr_id){
  this.acceptuser = true; this.rejectuser = false; this.confirmationuser = false;
   this.socket.emit('pay', {peer_id: pr_id, type:'accepted'});
 }
rejectedpay(thisid,  pr_id){
  this.acceptuser = false; this.rejectuser = true; this.confirmationuser = false;
   this.socket.emit('pay', {peer_id: pr_id, type:'rejected'});
 }
 emittransact(obj){
   this.event.publish('mobilepay', obj)
 }
 initialize2(peer_phone){
  this.peer_phone = peer_phone;
  this.peer_id = peer_phone;
 } 
 initialize(peer_phone):Promise<any>{
   let th = this;
  return new Promise(resolve=>{
   th.socket.on('connect', function(socket){
     console.log("Connected to soket");        
   });
  th.socket.on('currentusers',function(data){
    
    console.log(data); 
    console.log('data from koler');   
    let usero = data.filter((item)=>{
        return item.phone != th.id;
    });
    th.users = usero;
    //console.log(data);
    console.log(th.users);
     console.log('data from users');
  });
  this.socket.on('messageReceived', function(data){
   th.onMessageReceive(data, th ); 
  }); 
    this.socket.on('disconnect',function(data){
    console.log('userleft')
  });
  this.socket.on('login', function(data){ 
     this.socketObserver.next(()=>{
       console.log("logged in");
  });
  });   
   resolve(true);
     });
    
 }//initialize
showmodal(isCalling,callIgnored,callEnded,defult,callInProgress,isDialling){
  //this.initialize(this.peer_id).then(()=>{console.log('init')})
    let  p = 1;
   let itemz:any = [{geoaddress:"Marina Lagos Island Lagos", address:"FCMB Customer Care"}];
   let call = { scall:this, callInProgress: callInProgress,default :defult, callIgnored:callIgnored, callEnded:callEnded, isCalling:isCalling,isDialling:isDialling, p:p, item:itemz };
   this.event.publish('modalshow',call)
 }
 showmodalno(isCalling,callIgnored,callEnded,defult,callInProgress,id,peerid,isDialling){
   // this.initialize(this.peer_id).then(()=>{console.log('init')})
    let  p = 1;
   let itemz:any = [{geoaddress:"Marina Lagos Island Lagos", address:"FCMB Customer Care"}];
   let call = { scall:this, callInProgress: callInProgress,default :defult, callIgnored:callIgnored, callEnded:callEnded, isCalling:isCalling,isDialling:isDialling,p:p, item:itemz ,id:id,peer_id:peerid};
   this.event.publish('modalshow',call)
 }
 endmodal(){
   this.event.publish('modalend');
 }
  showmodal2(obj,isCalling,callIgnored,callEnded,defult,callInProgress,isDialling ) {
  // this.initialize(this.peer_id).then(()=>{console.log('init')})
  let th = this;
  console.log('displaying event push ......'+ obj); 
  console.log(obj);
   let call = { scall:this, callInProgress: callInProgress, default:defult,  callIgnored:callIgnored, callEnded:callEnded, isCalling:isCalling, p:obj.p, item:obj.item, isDialling:isDialling };
   this.event.publish('modalshow',call);
 }
   showmodal22(obj,isCalling,callIgnored,callEnded,defult,callInProgress , isDialling):Promise<any> {
   //this.initialize(this.peer_id).then(()=>{console.log('init')})
    return new Promise(resolve=>{
  console.log('displaying call2 ......'); 
   let call = { scall:this,   callInProgress: callInProgress, callIgnored:callIgnored, callEnded:callEnded, isCalling:isCalling, isDialling:isDialling, p:obj.p, item:obj.item };
    this.event.publish('modalshow',call);
    return true;
    });
 }
startCall(peerid, thisid){
  let th = this;
  this.id = thisid;
  this.peer_id=peerid;
  console.log(peerid +" is being called by "+ thisid);
  // th.initialize(peerid).then(()=>{
  // console.log('init');
 // })
  th.isCalling = false;
  th.callIgnored = false;
  th.default = false;
  th.isDialling = true;
  th.callInProgress = false;
  th.callEnded = false;
  th.socket.emit('sendMessage', { 'id': thisid, 'peer_id':peerid, type: 'call'});
  th.showmodalno(th.isCalling,th.callIgnored,th.callEnded,th.default,th.callInProgress,thisid,peerid,th.isDialling);
}
call(isInitiator, peer_phone, id,though){
let th = this;
  let config = {
    isInitiator: isInitiator,
      stun: {
        host:  "stun.stunprotocol.org:3478",
      },
     /* turn: {
        host: 'turn:numb.viagenie.ca',
        username: 'webrtc@live.com',
        password: 'muazkh'
      },*/
      streams: {
        audio: true,
        video: false
      }
  };
  if (isInitiator){
    console.log('caller went through');

  }
    if (!isInitiator){
    console.log('reciever went through');
    
  }
   //(<any>window).plugins.somePlugin.doSomething();
  //var session = new (<any>window).plugins.phonertc.Session(config);
let  session = new cordova.plugins.phonertc.Session(config);
 session.on('sendMessage', function(data){    
     th.socket.emit('sendMessage', {
      'id': id,
      'peer_id': peer_phone,
      'type': 'phonertc_handshake',
      'data': JSON.stringify(data)
    });
});
session.on('receiveMessage', function(data){    
      console.log('recieved')
});

 session.on('disconnect', function(){
    th.socket.emit('sendMessage', { 'id': th.id, 'peer_id': peer_phone, 'type': 'ignore' });
   // this.call_modal.hide();......call event to hkide the call
  // th.endmodal();
  });
 session.call();
  th.contact =session;  
}
ignore(){
  let th = this;
 if(JSON.stringify(this.contact) === '{}'){
    th.contact.disconnect();
    th.endmodal();
  }else{ 
    this.socket.emit('sendMessage', { 'id': th.id, 'peer_id': th.peer_id, 'type': 'ignore' });
     this.endmodal();
  }
};
closemodal(){
   this.endmodal()
};
end(){
  let th = this;
  th.contact.close();
  th.contact = {};
  th.socket.emit('sendMessage', { 'id': th.id, 'peer_id': th.peer_id, 'type': 'end' });
  th.callInProgress = false;
  th.callEnded = true;
  th.endmodal();
};
answer(id,peerid){
  let th = this;
  th.id = peerid;
  th.peer_phone = id;
  th.peer_id = id;
  //th.initialize(id).then(()=>{
   // console.log('init');
  //})
  console.log('this is the set up id' +id + 'this is the set up peerid'+ peerid + "this is global id"+ th.id + 'this is the global pid'+ this.peer_id)
  if(th.callInProgress){
    return;
    }
   th.isCalling =false;
  th.callInProgress = true; 
  th.isDialling = false;
  th.call(false,id,peerid,th);
  setTimeout(function(){
    th.socket.emit('sendMessage', { 'id': peerid, 'peer_id': id, 'type': 'answer' });
  }, 1500);
};

onMessageReceive(message, th){
  console.log('checking if message is recieved');
  //let call = new Call(this.app);
  let ev:Events = th.event;
  switch (message.type){
    case 'scansuccess':
    let obj = {acceptreciever:false,rejectreciever:false, scanningreciever:true}
    th.emittransact(obj);
     break;
    case 'accepted':
    let obj2 = {acceptreciever:true,rejectreciever:false, scanningreciever:false}
    th.emittransact(obj2)
     break;
     case 'rejected':
    let obj3 = {acceptreciever:false,rejectreciever:true, scanningreciever:false}
    th.emittransact(obj3) 
     break;
    case 'answer':
    th.callInProgress = true;
    th.isDialling = false;
    th.isCalling = false;
    th.default = false; 
    th.isCalling = false;
    th.call(true, message.id,message.peer_id,th);   
     break;
    case 'ignore':
      th.callInProgress = false;
      th.callIgnored = true;
      th.callEnded = false;
      th.default =true;
       th.isDialling = false;     
      th.endmodal();
    break;

    case 'phonertc_handshake':
      console.log(JSON.parse(message.data))
      console.log('hand shake message');
      th.contact.receiveMessage(JSON.parse(message.data));
    break;

    case 'call':          
      th.isCalling = true;
      th.callIgnored = false;
      th.callEnded = false;
      th.callInProgress = false;
      th.default = false;
      th.isDialling = false;
       th.isDialling = false;
      let isCalling = true;
      let callIgnored = false;
      let callEnded = false;
      let callInProgress = false;
      let defult = false;
      let isDialling = false;
      console.log("Callng right now...")   
      console.log(th);   
      th.showmodalno(isCalling,callIgnored,callEnded,defult,callInProgress,message.id,message.peer_id, isDialling);
      console.log('Presented Modal Cotrol ...');        
    break;
    case 'end':
      th.callInProgress = false;
      th.callEnded = true;
      th.callIgnored = false;
      th.isDialling = false;
      th.default = true;
     th.endmodal();
    break;

  }
};



  }



