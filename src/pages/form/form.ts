import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Validators, FormBuilder } from '@angular/forms';
import {CallpagePage} from '../callpage/callpage';
import {Events} from 'ionic-angular';
import {  ModalController } from 'ionic-angular';
/*
  Generated class for the Form page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-form',
  templateUrl: 'form.html'
})
export class FormPage {
  accounttypesavings:any[] = [{
    name: 'Domiciliary Savings', value:`Zero daily balance, opening balance of $100, Earn interest with limited monthly withdrawals (interest will be forfeited after 3 withdrawals),Use your MasterCard or Visa debit card for worldwide ATM withdrawals and online transactions,Safe and convenient 24/7 online and mobile banking with Zenith Bank Online and Zenith Bank Mobile`},
    {name:'Zenith Bank  Korrect', value:`The Zenith Bank Korrect account is a sub-account linked to your current or savings account. You are required to save a minimum of N5000 every month for four years, however you may open multiple accounts if you wish to save more. At the end of the program, the accumulated amount is deposited in your primary account and you can use your funds to achieve your goal. What’s more, 25 lucky customers will stand a chance to win cash prizes of up to N1million in a quarterly draw`,
    },{name:'Zenith Bank silver Savings', value:`A unique savings account that offers benefits of a current account and pays higher interest on balances
Account opening and minimum balance of N20,000 Tiered interest rate of up to 5.6% Daily minimum operating balance of N20,000 Safe and convenient 24/7 online and mobile banking with Zenith Bank Online and Zenith Bank Mobile
Use your MasterCard, Visa or Verve debit cards for nationwide ATM withdrawals and online transactions Cheque/ Dividend warrants deposit`},     
{name:'Zenith Bank Kids', value:`A savings account designed to help parents save for children between 0 and 12 years.Open an account with just N2,500Daily minimum operating balance of N1,000 Earn interest with limited monthly withdrawals (interest will be forfeited after 3 withdrawals)
`},{name:'Zenith Bank teens',value:`A savings account designed for teenagers between 13 and 17 years. Account opening balance of N2,500 Daily minimum operating balance of N1,000 Earn interest with limited monthly withdrawals (interest will be forfeited after 3 withdrawals)`} ,
{name:'Zenith Bank vibe',value:`A savings account designed for young people between 18 and 28 years. Open an account with just N2,500 Earn interest with limited monthly withdrawals (interest will be forfeited after 3 withdrawals)
Daily minimum operating balance of N1,000 Maximum daily operating balance of N1,000,000  Use your MasterCard debit card for worldwide ATM withdrawals and online transactions Safe and convenient 24/7 online and mobile banking with Zenith Bank Online and Zenith Bank Mobile `}
,{name:'Zenith Bank goal', value:` The Zenith Bank Goal account is a goal-oriented savings account that allows you to achieve a Million naira target through a simple structured savings plan. Start saving from as little as N15,000 monthly and you can earn up to 7.3% interest on your savings. All you have to do is have a Zenith Bank  Bank current or savings account and choose from one of five savings plans.`}]; 
 
  accounttypecurrent:any[] = [{name:'Basic Current', value:`A flexible current account to meet your everyday banking needs Open an account with just N5,000 Use your MasterCard, Visa or Verve debit cards for worldwide ATM withdrawals and online transactions
Safe and convenient 24/7 online and mobile banking with Zenith Bank Mobile and Zenith Bank Online SMS, email alerts and monthly statements`},
  {name: 'Zenith Bank silver Current', value:`With the Zenith Bank Silver Current account, you can get concession on your account maintenance fees and other benefits when you increase your deposit. Open an account with just N50,000
Daily minimum operating balance of N50,000 Free account maintenance fees if minimum balance is maintained Use your MasterCard, Visa or Verve debit cards for worldwide ATM withdrawals and online transactions
Platinum MasterCard available for qualifying customers Safe and convenient 24/7 online and mobile banking with Zenith Bank Online and Zenith Bank Mobile `}, 
  {name: 'Payroll Plus Current',value:`A customised account for salary earners with the flexibility of an overdraft facility, zero maintenance fee, and access to personal loans..
Get an overdraft or salary advance No minimum operating balance Free MasterCard, Visa or Verve debit card for worldwide ATM withdrawals and online transactions Safe and convenient 24/7 online and mobile banking with Zenith Bank Online and Zenith Bank Mobile `},
 { name:'Domicilary Account',value:`   A foreign currency denominated account that allows you transact in US Dollars, Euros and Pounds.Open an account with just 100USD, 100GBP or 100 Euros Use your MasterCard debit card for worldwide ATM withdrawals and online transactions Pay school fees, medical bills, and other overseas expenses ` }];
  type:boolean = false;
  subtypecurrent:boolean = false;
  explain:boolean = false;
  explaintext:string;
  explainheader:string;
  venue:string;
  subtypesavings:boolean = false;
  bio:boolean = false;
  contact:boolean = false;
  picture:boolean = false;
  finals:boolean = false;
   todo:any;
  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public ModalCtrl:ModalController, public event:Events ) {}

  ionViewDidLoad() {
    /*this.event.subscribe('modalshow', (obj)=>{
    let profileModal = this.ModalCtrl.create(CallpagePage,obj);
   profileModal.present();

    });*/
    console.log('Hello FormPage Page');
    this.type = true;
    this.todo = this.formBuilder.group({
      title: ['', Validators.required],
      firstName: [''],
      lastName:[''],
      bvn:[''],
      address:['']
    });
  }
  poppage(){
    this.navCtrl.pop()
  }
typer(r){
this.type = false;
if (r == 1){
this.subtypesavings = true;
 this.venue = "savings"
}
else{
this.subtypecurrent = true;
 this.venue = "current"
}
}
typeb(ev){
  console.log(ev);
 this.subtypesavings = false; 
 this.subtypecurrent = false;
this.explaintext = ev.value;
this.explainheader = ev.name;
this.explain = true;
}
biol(){
  this.explain = false;
  this.finals = true;
 
  
}
close(){
  this.explain = false;
  if (this.venue == "savings"){
 this.subtypesavings = true; 
 this.subtypecurrent = false;
  }
  else{
  this.subtypesavings = false; 
 this.subtypecurrent = true;
  }
}



}
