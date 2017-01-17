import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { mapObject } from '../../services/map-service';
import {OnInit} from '@angular/core';
import { NavParams} from 'ionic-angular';
import {BranchDetailsPage} from '../branch-details/branch-details';
import * as Leaflet from "leaflet";
import {  ModalController } from 'ionic-angular';
import {ServiceMenuPage} from '../service-menu/service-menu'
import {Http} from "@angular/http";
import { NgZone, ViewChild} from "@angular/core";
import {CallpagePage} from '../callpage/callpage';
import {Events} from 'ionic-angular';


@Component({
  selector: 'page-plot-to-map',
  templateUrl: 'plot-to-map.html'
})
export class PlotToMapPage   {  

   active:boolean = false;
    p:any;
    preitems:any[];
    public mapobj:mapObject;
    googleLayer: any;
    //public item:any[];
    img1:string;
    item:any[];
    img2:string;
    img3:string;
    distance:string;
    address:string;
    phone:string;
    results:boolean = false;
    frontpage:any;
    constructor(public navCtrl: NavController, navParams: NavParams,public ModalCtrl:ModalController, public event:Events) {
             this.p = navParams.get('p');
             this.item = navParams.get('item');

             this.img1 = this.item[0].imageurl;
             this.img2 = this.item[0].imageurl1;
             this.img3 = this.item[0].imageurl4;
             this.distance = this.item[0].distance;
             this.address = this.item[0].address;
             this.phone = this.item[0].phone;           
             this.results = false;

    }
 toggleresults(){
     if (this.results){
          this.results = false;
     }
     else{
         this.frontpage = this.item[0].imageurl4;
         this.results = true;
     }
 }   
ionViewWillEnter(){

}
    fillitup(item){
      this.frontpage = item;       

    }

    

  ionViewDidLoad() {
      let th = this;
    try{
      this.mapobj.resetmap();
    }
    catch(err){
      console.log(err);
    }
    window.setTimeout(function() {
    th.mapobj = new mapObject();
    th.mapobj.invalidate();
    console.log(th.item);  
    th.mapobj.watchandmark();
    th.mapobj.locatepoint(th.p,th.item);
   }, 1000); 

    }
showroutes(){
 this.mapobj.routeandmark(); 
 this.active = true;
 
}
removeroutes(){
    this.mapobj.removeroutes();
}
    gotoBranchDetailPage() {
        this.navCtrl.push(BranchDetailsPage);
    }

}
