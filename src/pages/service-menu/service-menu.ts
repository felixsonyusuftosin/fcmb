import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {BranchesListPage} from '../branches-list/branches-list'
import {FormPage} from '../form/form'
import { UsersPage } from '../users/users';
//import {CallpagePage} from '../callpage/callpage';
import {Events} from 'ionic-angular';
import {  ModalController } from 'ionic-angular';
import { FacedetectPage } from '../facedetect/facedetect';
/*
  Generated class for the ServiceMenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-service-menu',
  templateUrl: 'service-menu.html'
})
export class ServiceMenuPage {

  constructor(public navCtrl: NavController, public ModalCtrl:ModalController, public event:Events) {}

  ionViewDidLoad() {
    console.log('Hello ServiceMenuPage Page');
  }
gotofacedetect(){
  this.navCtrl.push(FacedetectPage);
}
gotobrancheslist(){
  this.navCtrl.push(BranchesListPage);
}
gotouserspage(){
  this.navCtrl.push(UsersPage,{next:'chat'}); 
}
gotoform(){
  this.navCtrl.push(FormPage);
}
}
