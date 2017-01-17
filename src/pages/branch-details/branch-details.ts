import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Data} from '../../services/data-service';
import {NavParams} from 'ionic-angular';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { Slides } from 'ionic-angular';
import {FormPage} from '../form/form';
import { ModalController } from 'ionic-angular';
import {CallpagePage} from '../callpage/callpage';
import { PlotToMapPage} from '../plot-to-map/plot-to-map';
import { UsersPage } from '../users/users';
import {SocketService} from '../../services/socket-service';
import {Call} from '../../services/call-service';
import {Events} from 'ionic-angular';
/*
  Generated class for the BranchDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-branch-details',
  templateUrl: 'branch-details.html'
})
export class BranchDetailsPage {
    p:any;
    preitems:any;
    frontpage:any;
    item:any[];
   slideOptions = {
     autoplay:3000,
     load:true,
     pager:true,
     speed:1000

    };
  constructor(public navCtrl: NavController, private dt:Data, public call:Call, public ss:SocketService, public event:Events,public modalCtrl:ModalController,  navParams: NavParams, private  sanitizer:DomSanitizer) {
    this.p = navParams.get('p');
     this.item = dt.preitems.filter(it=>{ return it._id == this.p; });
        this.frontpage = this.item[0].imageurl;
        console.log(this.frontpage); 
        console.log(this.item);
        console.log('this is item');

    }

  ionViewDidLoad() {
  /* this.event.subscribe('modalshow', (obj)=>{
      console.log('This is the subscribed events');
     console.log(obj);    
     let objo = obj[0]; 
    let profileModal = this.modalCtrl.create(CallpagePage,objo);
    profileModal.present();
    });*/
    console.log('Hello BranchDetailsPage Page');
  }
  fillitup(item){
    this.frontpage = item;       

    }
    begincall(){
      console.log(this.item);
      this.ss.showmodal2({"p":this.p, "item":this.item}, false,false,false,true,false,false);
       //console.log('displaying call2 ......')
       //this.navCtrl.push(CallpagePage, { call:this.sservice, callInProgress: this.ss.callInProgress, callIgnored:this.ss.callIgnored, callEnded:this.ss.callEnded, isCalling:this.ss.isCalling, p: this.p, item:this.item });
       //let profileModal = this.ss.modalCtrl.create(CallpagePage, {  call:this.sservice ,callInProgress: this.ss.callInProgress, callIgnored:this.ss.callIgnored, callEnded:this.ss.callEnded, isCalling:this.ss.isCalling, p: this.p, item:this.item });
        //profileModal.present();
    }
    gotomappage(){
       this.navCtrl.push( PlotToMapPage,{"p":this.p, "item":this.item}); 
    }
    gotoform(){
  this.navCtrl.push(FormPage);
}
    callIT(passedNumber){
    console.log(passedNumber);
    //You can add some logic here
     //window.location = passedNumber;
    }
    gotomap(p1){
      //this.navCtrl.push(PlotToMapPage,{p:p1, preitems:this.preitems});
    }
    sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}
}
