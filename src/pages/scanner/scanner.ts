import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import {Camera} from 'ionic-native';
import {FacedetectPage} from '../facedetect/facedetect';
import {Http, Headers, RequestOptions} from '@angular/http';
/*
  Generated class for the Scanner page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html'
})
export class ScannerPage {
  account:number;
  base64Image:any;
  stat:boolean;
  frontpicture:boolean = false;
  submiting:boolean = false;
  pin:number;
  imagedata:any;
  submittext:string;
  public options: any = {
      onInit: (slides: any) => { this.swiper = slides; },
      onlyExternal:true
    };
    swiper: any;

  constructor(public navCtrl: NavController,private http:Http, navParams: NavParams) {
    this.account =  navParams.get('account');
  }

  ionViewDidLoad() {
    console.log('Hello ScannerPage Page');
  }
reset(){
  this.submittext = ""; this.imagedata; this.pin = null; this.submiting = false; this.frontpicture = false; this.base64Image = null; 
}
closenav(){
  this.navCtrl.pop();
}
   gotoslide2() {
    this.swiper.slideTo(1, 500);
  }
   gotoslide3() {
    this.swiper.slideTo(2, 500);
  }
  gotoslide1(){
     this.swiper.slideTo(0, 500);
  }
  closenavparam(){
  this.navCtrl.push(FacedetectPage, {account:this.account})
}
takePicture(){
    let th = this;
       
    Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        quality:80,
        targetWidth: 300,
        allowEdit:false,
        correctOrientation:true,
        cameraDirection:1,
        targetHeight: 300
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.frontpicture = true;
        this.imagedata = imageData;
    }, (err) => {
        console.log(err);
    });
  }


submit(){
   this.submittext= "Verifying your account please wait..."
   this.submiting = true;
 let th = this;
let headers = new Headers({
			'Content-Type':  'application/json'
	});
 let remote = 'https://fcmbpay.herokuapp.com/detect/'
 let options = new RequestOptions({ headers: headers });
 let obj = { content:'detect',  account:th.account,image:th.imagedata } ;
 let data = JSON.stringify(obj);
 //let data1 = 'json='
 //let remotedata = remote + '?content=register&account='+th.account+'&pin='+th.pin+'&image='+th.imagedata
  th.http.post(remote, data, options)
     .map(res => res.json())
      .subscribe(
      data => this.dosuccess(data),
      err => this.doerror(err),
      () => console.log('Post Complete')
    );
}
dosuccess(data){
   this.submiting = false; 
   console.log(data);  
  if (data.success){ 
    this.stat = true; 
    console.log(data.confidence);
    this.submittext= "account Verified !!!"        
    if (this.stat){
       this.frontpicture = true;
        this.gotoslide2();
    } 
  }
  else{
     this.submittext= "Your face was not recognized, Redeem imge if you feel this was in error"
     this.frontpicture = false;
     console.log(data.reason);
  }
}
doerror(err){
   this.submittext= "Something hapened could not post"
   this.frontpicture = false;
   this.submiting = false;
  console.log(err)
}



















}
