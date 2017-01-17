import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Data} from '../../services/data-service'
import { BranchDetailsPage } from '../../pages/branch-details/branch-details';
import {CallpagePage} from '../callpage/callpage';
import {Events} from 'ionic-angular';
import {  ModalController } from 'ionic-angular';
/*
  Generated class for the BranchesList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-branches-list',
  templateUrl: 'branches-list.html'
  
})
export class BranchesListPage {
public items:any[];
public preitems:any[];
empty:boolean;
//dt:Data
vis:boolean;
noresult:boolean = false;
  constructor(public navCtrl: NavController, public ModalCtrl:ModalController, public event:Events,  public dt:Data) {
    console.log(dt.items)
  }

  ionViewDidLoad() {
    /*this.event.subscribe('modalshow', (obj)=>{
    let profileModal = this.ModalCtrl.create(CallpagePage,obj);
   profileModal.present();

    });*/
    console.log('Hello BranchesListPage Page');
  }
setFilteredItems() { 
        this.preitems = this.dt.filterItems("", this.dt.items);        
    }
gotoBranchDetailsPage(p1){
console.log(p1);
this.navCtrl.push(BranchDetailsPage,{p:p1});
}
 search(searchEvent) {
    let term:string = searchEvent.target.value;  
    this.dt.items = this.dt.preitems; 
    this.dt.items.sort(function (a, b) {
    if (a.distance > b.distance) {
                        return 1;
                           }
                 if (a.distance < b.distance) {
                  return -1;
                     }
                 // a must be equal to b
                 return 0;
                   });
     this.dt.items = this.dt.filterItems(term, this.dt.items);
    if(this.dt.items.length < 1 ) {
      this.noresult = true;
      }
    else{
       this.noresult = false;
      }
    
   }

}