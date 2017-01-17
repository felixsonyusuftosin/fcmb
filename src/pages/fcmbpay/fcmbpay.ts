import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import {Camera} from 'ionic-native';
import {Http, Headers, RequestOptions} from '@angular/http';
import { NativeStorage} from 'ionic-native';
import {FacedetectPage} from '../facedetect/facedetect';
/*
  Generated class for the Fcmbpay page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-fcmbpay',
  templateUrl: 'fcmbpay.html'
})
export class FcmbpayPage {
  error:boolean = false;
  erroraccount:boolean = false;
  errorpin:boolean = false;
  finalerror:boolean = false;
  registering:boolean = false;
  errorpinconfirm:boolean = false;
  disabled:boolean = true;
  accreg:boolean = false;

  verified:boolean = false;
  disabledverify:boolean = true;
  label:number = 0;
  submiting:boolean = false;
  imagedata:any;
  account:number;
  image1:any[];
  submittext:string = "Posting picture please wait..."
  frontpicture:boolean = false;
  public base64Image: string;
  pin:number;
  confirmpin:number;
  erroraccounttxt:string;
  errorpintxt:string;
  finalerrortxt:string;
  errorpinconfirmtxt:string;
  	public options: any = {
      onInit: (slides: any) => { this.swiper = slides; },
      onlyExternal:true
    };
    swiper: any;

  constructor(public navCtrl: NavController, private http:Http) {
this.image1 = [];
  this.getuser().then((dat)=>{
    if(dat) {
      this.account = dat.account;
      this.accreg = true;
    }
    else{
      this.accreg = false;
    }
  })
  .catch(err=>{
    console.log(err);
    this.accreg = false;
  })
  }
  reset(){
   this.account = null;   this.confirmpin = null; this.pin = null; this.erroraccounttxt = ""; this.verified = false; this.registering = false;  this.finalerrortxt = ""; this.errorpintxt = ""; this.errorpinconfirmtxt = "";
  }
  ionViewDidLoad() {
   
    console.log('Hello FcmbpayPage Page');
    this.account = null;   this.confirmpin = null; this.pin = null; this.erroraccounttxt = "";  this.errorpintxt = ""; this.errorpinconfirmtxt = "";
  }


saveuser() :Promise<any>{
return new Promise(resolve=>{  
 NativeStorage.getItem('accountinfo')
  .then(data=>{
      console.log("exists");
      resolve(true);
  })
 .catch(err => {
console.log("Saving account") 
  NativeStorage.setItem('accountinfo', {account:this.account})

  .then(()=>{
    console.log('Stored item!'+this.account);
    resolve(true);
  })
  .catch( error =>{ console.log('Error storing item'+ error);
  resolve(false)
  });
    }
  );
});
}
getuser():Promise<any>{
return new Promise(resolve=>{  
   NativeStorage.getItem('accountinfo')
  .then(data=>{
      resolve(data);
  })
    .catch(err => {console.log(err)
      resolve(false);  
    }
  );
});
};

  registerer(){
    if(this.account && this.pin && this.confirmpin  ){
    let th = this;
    this.registering = true;
    let headers = new Headers({
			'Content-Type':  'application/json',     
	 });
    if (! this.disabledverify){
      this.registering = true;
      
      let options = new RequestOptions({ headers: headers });
 
      let remote = 'https://fcmbpay.herokuapp.com/register/';
     let obj = { account:th.account, pin:th.pin};
     let data = JSON.stringify(obj);
     console.log(data);
      th.http.post(remote, data, options)
     .map(res => res.json())
      .subscribe(
      data => this.dosuccessreg(data),
      err => this.doerrorreg(err),
      () => console.log('Post Complete')
    );
    /*dev 
    let remote = 'https://fcmbpay.herokuapp.com/register/?account='+th.account+'&pin='+th.pin;
    console.log(remote, options)
    th.http.get(remote)
     .map(res => res.json())
      .subscribe(
      data => this.dosuccessreg(data),
      err => this.doerrorreg(err),
      () => console.log('Post Complete')
      );
   dev ends*/
    }
    //this.registering = false;
    }
   }
   dosuccessreg(data){
    this.registering = false;
     if (data.success){
        this.verified = true;
        this.finalerror = true;
        this.finalerrortxt =" Your account has being created, proceed to add Images for facial recognition";
        this.disabled = false;
        this.saveuser().then((data)=>{
         console.log(data)
        });
     }
     else{
       if(data.reason == 'exist'){
         this.verified = true;
          this.finalerror = true;
        this.finalerrortxt ="This account exists proceed to setup this device to use your account";
        this.disabled = false;
        this.saveuser().then(()=>{
          this.navCtrl.push(FacedetectPage, {account:this.account})
        })
         //this account exists redeem 
          }
       else{
         this.verified = false;
        this.finalerror = true;
        this.finalerrortxt ="Sorry Your account is not enabled for facial recognition transaction";

       }
     }

   }
   doerrorreg(data){
     this.registering = false;
     this.verified = false;
     this.finalerror = true;
     this.finalerrortxt ="Consult server administrator and report an error";
     console.log(data);
   }

  checknext(){
  if (this.account && isNaN(this.account) || !isFinite(this.account)){   
      this.si('account', 'Account number must be digits')
      return false;
     } else{this.si('de','');}
  
   try{
   if(this.account && this.account.toString().length < 10 || this.account.toString().length > 10 ){
     this.si('account', 'Check Your Account details must be your Nuban account')
     this.disabledverify = true;
     return false;
    } else{this.si('de','');}
   }catch(err){
     console.log(err);
   }
  try{
  if(this.pin && this.confirmpin && this.pin != this.confirmpin){
    this.si('confirmpin', 'Pin does not match');
    this.disabledverify = true;
     return false;
    } else{this.si('de','');}
  }
  catch(err){
    console.log(err)
  }
  try{
 if (this.pin && isNaN(this.pin) || !isFinite(this.pin) || this.pin && !isNaN(this.pin) && this.pin.toString().length > 4 ||this.pin && isNaN(this.pin) && this.pin.toString().length < 4 )   {
     this.si('pin', 'Pin must be digits and four characters long');
    this.disabledverify = true;
     return false;
   } else{this.si('de','');}
  }
   catch(err){
     console.log(err)
   }  
  if(this.account && this.pin && this.confirmpin)  {  
  this.si('de','');
  this.disabledverify = false;
  }


  }//checknext
  si(data, message){
   let th = this;
   switch(data){
    case 'pin':
      th.errorpin  = true;
      th.errorpintxt = message
      break;
    case 'confirmpin':
      th.errorpinconfirmtxt = message;
      th.errorpinconfirm  = true;  
      break;
     case 'account':
     th.erroraccounttxt = message;
     th.erroraccount = true;
      break;
 default:
       th.erroraccount   = false;
       th.errorpin  = false;
       th.errorpinconfirm  = false;  
     }
 }//si  data
   gotopicture() {
    this.swiper.slideTo(1, 500);
  }
   gotofinish() {
    this.swiper.slideTo(2, 500);
  }
  gotosignup(){
     this.swiper.slideTo(0, 500);
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
        this.imagedata = imageData;
        this.label = this.label + 1
        let obj:any = {}
        obj.picture = this.base64Image;
        obj.posted = false;
        obj.label = this.label;
        th.image1.push(obj );
        th.frontpicture= true;
       
    }, (err) => {
        console.log(err);
    });
  }
cancel(){
  this.base64Image = null;
  this.frontpicture = false;
}
closenav(){
  this.navCtrl.pop();
}
closenavparam(){
  this.navCtrl.push(FacedetectPage, {account:this.account})
}
submit(){
   this.submittext= "Posting picture please wait..."
 this.submiting = true;
 let th = this;
let headers = new Headers({
			'Content-Type':  'application/json'
	});
 let remote = 'https://fcmbpay.herokuapp.com/detect/'
 let options = new RequestOptions({ headers: headers });
 let obj = { content:'register', account:th.account, pin:th.pin,image:th.imagedata } ;
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
   
  if (data.success){ 
     this.submittext= "Picture posted successfully"  
    this.frontpicture = false;
    let lng = this.image1.length
    this.image1[lng - 1].posted = true;
    /*let im:any[] = this.image1.filter((sata)=>{ sata.picture ==  this.base64Image; })
    let da = im[0]
    da.posted = true;*/  
    if (this.image1.length > 4 ){
      this.frontpicture = true;
         this.gotofinish();
    } 
  }
  else{
     this.submittext= "picture was rejected."
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

btoBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
}
return new Blob(byteArrays, { type: contentType });
}

}
