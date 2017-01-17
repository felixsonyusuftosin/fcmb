import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import {User} from '../../services/user-service'
import {SocketService} from '../../services/socket-service';
import {NavParams} from 'ionic-angular';
import {ChatPage} from '../chat/chat'
import { NativeStorage} from 'ionic-native';
import {CallpagePage} from '../callpage/callpage';
import {Events} from 'ionic-angular';
import {  ModalController } from 'ionic-angular';
/*
  Generated class for the Users page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersPage {
  //userservice:User;
  registered:boolean = true;
  user:any;
  zone: NgZone;
  next:any;
  success:boolean = false;
  socketHost:string;
  username:string;
  password:string;
  notregistered:boolean;
  signup:boolean = false;
  signin:boolean;
  recognize:boolean = false;
  constructor(public navCtrl: NavController, public userservice:User, navParams: NavParams,public socket: SocketService, public ModalCtrl:ModalController, public event:Events) {
    this.next = navParams.get('next');
    NativeStorage.getItem('User')
  .then(data=>{
      if (this.next == "chat"){
        this.poppage();
        this.navCtrl.push(ChatPage); 
    }
  })
 .catch(err => {
    console.log('not registered')
    }
  );
 
   //  this.socket = io(this.url);
  console.log("this is registersation status " + this.registered);
  this.notregistered = true;
  this.signin = false;
  /*this.socketHost = "http://201.209.104.33::4000";
     this.socket.socketService.subscribe(event => {
        console.log('message received from server... ', event);
        if (event.category === 'login'){
          this.zone.run(() => {
            this.success = true;     
          });
        }
      }); //end of subscribe
      */
   try{
  this.user =  this.userservice.getuser();
    if (this.user){
    this.registered = true;
    }
   else{
     this.registered = false;
    };
  }catch(err){
    console.log(err)
    this.user = false;
    //this.registered = false;
  }
  }


  ionViewDidLoad() {
     /*this.event.subscribe('modalshow', (obj)=>{
    let profileModal = this.ModalCtrl.create(CallpagePage,obj);
   profileModal.present();

    });*/
  }
  poppage(){
    this.navCtrl.pop();
  }
  signingin(){    
  this.notregistered = false;
  this.signin = true;
  this.signup = false;
  console.log(this.signin);
  console.log(this.notregistered);
  }
   signingup(){    
  this.notregistered = false;
  this.signin = false;
  this.signup = true;
  console.log(this.signup);
  console.log(this.notregistered);
  }

  reregister(){
    this.signin = false; this.notregistered = true;
  }
gotonext(){
        if (this.next == "chat"){
        this.navCtrl.push(ChatPage); 
    }
}
/*login(){
if(this.username != "" && this.password != ""){
  this.socket.sendMessage(this.username, this.password);       
  // console.log('emitting: ');
}

  }*/

}
