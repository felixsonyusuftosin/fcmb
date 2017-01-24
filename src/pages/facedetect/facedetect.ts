import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {FcmbpayPage} from '../fcmbpay/fcmbpay';
import {RecievePage} from '../recieve/recieve';
import {ScannerPage} from '../scanner/scanner';
import { NativeStorage} from 'ionic-native';
/*
  Generated class for the Facedetect page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  
  selector: 'page-facedetect',
  templateUrl: 'facedetect.html'
})
export class FacedetectPage {
    accreg:boolean = false;
    account:number;
  constructor(public navCtrl: NavController,   navParams: NavParams) {
    try{
       let acc =  navParams.get('account')
        if (acc){
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
  });
        }
        }
    catch(err){
      console.log('no navigation parameters')
    }
  

  }

 ionViewDidLoad() {
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
signupfcmbpay(){
  this.navCtrl.push(FcmbpayPage);
}
recievepayment(){
  this.navCtrl.push(RecievePage, {account:this.account}); 
}
makepayment(){
  this.navCtrl.push(ScannerPage, {account:this.account});
}
saveuser(){
 NativeStorage.getItem('accountinfo')
  .then(data=>{
      console.log("exists");
  })
 .catch(err => {
console.log("Saving account") 
  NativeStorage.setItem('User', {account:this.account})
  .then(()=>{
    console.log('Stored item!'+this.account);
  })
  .catch( error =>{ console.log('Error storing item'+ error);
  });
    }
  );
}
logout(){
NativeStorage.remove('accountinfo')
.then(data=>{ 
  console.log(data) 
  this.accreg = false ;
  this.account = null;   
    })
   .catch(error=> {
     console.log(error)
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
}
close(){
  this.navCtrl.pop();
}
}