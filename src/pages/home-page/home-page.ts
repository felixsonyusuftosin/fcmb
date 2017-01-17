import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {  ModalController, ViewController} from 'ionic-angular';
import { Data } from '../../services/data-service';
import { User } from '../../services/user-service';
import {ServiceMenuPage} from '../service-menu/service-menu'
import {Http} from "@angular/http";
import {CallpagePage} from '../callpage/callpage';
import {Events} from 'ionic-angular';
import { NgZone, ViewChild} from "@angular/core";
 import * as io from 'socket.io-client';
 import { Call } from  '../../services/call-service';
import {SocketService} from '../../services/socket-service';

@Component({
  selector: 'page-home-page',
  templateUrl: 'home-page.html',   
})
export class HomePagePage {  
  active1:boolean = true;
  active2:boolean = false;
  active3:boolean = false;
  active4:boolean = false;
modal:CallpagePage;
  socketHost: string;
  constructor(  http: Http, public navCtrl: NavController, public event:Events, public ModalCrl:ModalController, public dt:Data, public user:User, private call:Call, private socket: SocketService, private viewCtrl:ViewController ) {
   this.dt.initDB();
  
  this.dt. getseconddoc();
  this.user =  new User(http);
   console.log(this.dt.items);
    this.socket.initialize(0).then(dd=>{
    //this.call = new Call(this.socket, ModalCrl);
    console.log('initialized from home')
     })
     .catch(err=>{
       console.log(err);
     });
  // this.socketHost = "http://localhost:3000";
  }

  ionViewDidLoad() { 
  //  this.event.publish('modalend');

     this.event.subscribe('modalshow', (obj)=>{
      console.log(obj)
      let objo = obj;
    let profileModal = this.ModalCrl.create(CallpagePage,objo);
     profileModal.present();
    });


  }
  servicemenu(){
      this.navCtrl.push(ServiceMenuPage);

    }



}
