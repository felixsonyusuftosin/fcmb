import { Component } from '@angular/core';
import { NavController, ModalController , ViewController, NavParams} from 'ionic-angular';
import {UsersPage} from '../users/users'
import { NativeStorage} from 'ionic-native';
import {CallpagePage} from '../callpage/callpage';
import {Events} from 'ionic-angular';
/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public viewCtrl: ViewController, public ModalCtrl:ModalController, public event:Events) {


  }

  ionViewDidLoad() {
    console.log('Hello ChatPage Page');
    /*this.event.subscribe('modalshow', (obj)=>{
    let profileModal = this.ModalCtrl.create(CallpagePage,obj);
   profileModal.present();

    });*/
  }

    showModal() {
    const modal =this.modalCtrl.create(UsersPage);
    modal.present(modal);
  }
  dismiss(){
      this.viewCtrl.dismiss();
  }

}
