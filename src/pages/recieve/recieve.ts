import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { DomSanitizer} from '@angular/platform-browser';
import {FacedetectPage} from '../facedetect/facedetect';
declare var require: any;

/*
  Generated class for the Recieve page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-recieve',
  templateUrl: 'recieve.html'


})
export class RecievePage {
   	public options: any = {
      onInit: (slides: any) => { this.swiper = slides; },
      onlyExternal:true
    };
    swiper: any;
    price:number;
    tag:any;
    pic:any;
    errorprice:boolean = false;
    errorpricetxt:string;
    paystat:string;
    paystatboo:boolean = false;
    nocost:boolean = true;
    disabled:boolean = true;
    account:number;
    finalerror:boolean = false;
    finalerrortxt:string;

  constructor(public navCtrl: NavController,  navParams: NavParams,private sanitizer: DomSanitizer ) {
    this.account =  navParams.get('account');
  }
   reset(){
     this.errorpricetxt = ""; this.paystat = ""; this.paystatboo = false; this.finalerrortxt = ""; this.nocost = true; this.price = null;  this.nocost = true; this.errorprice = false;
   }
   checknext(){
      if (this.price && isNaN(this.price) || !isFinite(this.price)){   
      this.errorprice = true;
      this.nocost = true;
      this.errorpricetxt = "Cost must be writtien only in digits"
      this.disabled = true;
      return false;
     } else{
      this.errorprice = false;
      this.errorpricetxt = "";
      this.disabled = false;
      this.nocost = false;
      let picd = "https://api.qrserver.com/v1/create-qr-code/?data="+this.price+"&amp;size=100x100";
      this.pic = this.sanitizer.bypassSecurityTrustUrl(picd);
     
   
      return true;
      }
   }
   gotopbar(){
     this.swiper.slideTo(1, 500);
   }
    gotocbar(){
     this.swiper.slideTo(0, 500);
   }
  ionViewDidLoad() {
    console.log('Hello RecievePage Page');
    this.reset();
  }
closenav(){
  this.navCtrl.pop();
}
closenavparam(){
  this.navCtrl.push(FacedetectPage, {account:this.account})
}
}
