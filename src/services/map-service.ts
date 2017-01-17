import { Injectable } from '@angular/core';
import * as Leaflet from "leaflet";
//import '../../www/buid/js/leaflet-bing-layer'
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {NavController, NavParams} from 'ionic-angular';
import { item } from '../models/items';
import { Geolocation } from 'ionic-native';
declare var require: any;
declare var L: any;
declare var grappHopper:any;
var Pulse = require('leaflet-pulse-icon');
var Routing = require('leaflet-routing-machine');
var bing = require('leaflet-bing-layer');
@Injectable()
export  class mapObject{
options:any = {'bingMapsKey':'ArF6yfeaiYnFPFZkitxCH-BRJutAw1J-K2iRu9HEVzqrhdTwn_Md_PenY4sR5U8i','imagerySet':'Road' }
map:Leaflet.Map;
//bingLayer:any =   L.tileLayer.bing(this.options);
//graphopper = L.Routing.graphHopper('5f4ee7ea-7e82-4acb-bc70-0b7350238863'); 
zoomTo:boolean = false;
extent:any = [];
featuregroup:any;
routes:any;
currentlat:any;
watch:any;
public distance:number;
routingparams:Observable<any>;
public time:number;
routingstat:boolean;

public literature:any[];
lat:number = 0;
lng:number = 0;
latwatch:number = 0;
lngwatch:number = 0;
fromlat:number = 0;
fromlng:number = 0;
tolat:number = 0;
tolng:number = 0;
bounds:any;
geoj:any;
pulsingIcon :any;
locationMarker:Leaflet.Marker;	
latwatch2:number = 0;
lngwatch2:number = 0;
queryAPIurl =  'http://isemgeospatials.com';
extentCount:number = 0;
id:string;
navCtrl:NavController;
navParams: NavParams;
zoomControl:boolean = false;

//layers:any[] = [{'Google street': this.bingLayer}];
frontLayer:Leaflet.TileLayer = Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'ISEM 2016;',
//maxZoom: 31,
   id: 'isem',
    accessToken: 'sk.eyJ1IjoiaXNlbSIsImEiOiJjaXVmanVqeHAwMDFpMnpveXphcm0waGhwIn0.9b5X9VzIkAmWU_DEj_-fFQ'
});

//frontLayer:any = new Leaflet.Google('ROADMAP');
view:any =Leaflet.latLng([6.5008625, 3.3835314]);
zoom:number = 11;
previousextent:boolean = false;
 p:any;
preitems:any;
constructor(){
//var map:Leaflet.Map;
this.map = Leaflet.map('map', {zoomControl:false,fadeAnimation:true,zoomAnimation:true, inertia:true}).setView(this.view, this.zoom);
this.map.addLayer(this.frontLayer); 
this.map.addControl(Leaflet.control.zoom({position: 'bottomright'}))
this.map.invalidateSize(null);
var map = this.map  
this.watch =Geolocation.watchPosition({enableHighAccuracy:false, timeout:12000})

//this.p = this.navParams.get('p');
//this.preitems = this.navParams.get('preitems');
}
invalidate(){
var th = this  
window.setTimeout(function() {
  th.map.invalidateSize({animate:true});  
   }, 3000); 


}

    zoomend() {

    }




/*searchall(address:string):Observable<item[]>{
      return this.http.get(`${this.queryAPIurl}/?address=${address}`) 
      .map(res => <item[]>(res.json().items))  
}*/

/*watchposition(){
  let th = this;
  let watch =Geolocation.watchPosition({enableHighAccuracy:false, timeout:4000})
  watch.subscribe(data=>{      
      th.latwatch = data.coords.latitude;
      th.lngwatch = data.coords.longitude;
  },erro=>{
      console.log(erro)
  });

}//watchposition*/

  watchandmark(){    
    let th = this;
    let map = th.map;
    th.watch.subscribe(data=>{
    th.latwatch2 = data.coords.latitude;
    th.lngwatch2 = data.coords.longitude;
    console.log('watch lat '+data.coords.latitude+'watch long '+data.coords.longitude);
    let lln:Leaflet.LatLng =Leaflet.latLng(data.coords.latitude,data.coords.longitude);    
    this.pulsingIcon = L.icon.pulse({iconSize:[18,18],color:'green'});
    /*if (th.locationMarker){
    try{map.removeLayer(th.locationMarker);}
     catch(err){console.log('no location marker');}
     th.locationMarker.setIcon(null);
    };
    th.locationMarker  = new Leaflet.Marker(lln,{icon: th.pulsingIcon});*/	
    if (!th.map.hasLayer(th.locationMarker)){	
    th.locationMarker  =  Leaflet.marker(lln,{icon: th.pulsingIcon});		
	//th.map.addLayer(th.locationMarker);
    }
    else{
       th.locationMarker.setLatLng(lln);
       th.locationMarker.fire('drag');
       th.locationMarker.fire('dragend');
       th.locationMarker.fire('moveend');
    }
	
    th.featuregroup = Leaflet.featureGroup([th.locationMarker, th.geoj]).addTo(th.map);
   // th.map.addLayer(th.featuregroup);
    th.bounds = th.featuregroup.getBounds();
    th.map.fitBounds(th.featuregroup.getBounds(), {});    
    //map.panTo(lln);
  },erro=>{
      console.log(erro);
  });
   
  }//watchandmark
    routeandmark(){    
    let th = this;
    let map = th.map;
    //let watch =Geolocation.watchPosition({enableHighAccuracy:false, timeout:4000})
    //th.watch.subscribe(data=>{
    /*th.fromlat = th.latwatch2;
    th.fromlng = th.lngwatch2;
    console.log('watch route lat '+th.fromlat+'watch route long '+th.fromlng);
    let lln:Leaflet.LatLng = new Leaflet.LatLng(th.fromlat, th.fromlng);    
    this.pulsingIcon = L.icon.pulse({iconSize:[10,10],color:'green'});
    if (th.locationMarker){
    try{map.removeLayer(th.locationMarker);}
     catch(err){console.log('no location marker');}
     th.locationMarker.setIcon(null);
    }
    th.locationMarker  = new Leaflet.Marker(lln,{icon: th.pulsingIcon});					
	map.addLayer(th.locationMarker);    
	map.panTo(lln);*/
    th.routing();
  /*},erro=>{
      console.log(erro);
  });*/
   
  }//watchandmark
locatepoint(p,list:any[]){
    let th = this;
    let map = th.map;
    let layergroup = Leaflet.featureGroup();
    //let geoj:Leaflet.Marker;
   //let theobj =  list.filter(itm=>{ return itm._id = p; }); 
    let theobj = list; 
   let lat = parseFloat(list[0].easting);
   let lng = parseFloat(list[0].northing);
   this.tolat = lat;
   this.tolng = lng;
   console.log(list[0].easting)
    console.log('lat'+lat+'long'+lng);
   let geojsonMarkerOptions = {className:'divicon' , html :'<div class = " full-height  in rounded mm gt"  style = "width:100%;"></div> '};
   var latlng =Leaflet.latLng(lat,lng);
    var divmarker =   Leaflet.divIcon(geojsonMarkerOptions);
   // console.log(divmarker);
   this.geoj = Leaflet.marker(latlng, {icon:divmarker});   

}//locatepoint
resetmap(){
this.invalidate()
let map = this.map;
try{map.removeLayer(this.pulsingIcon);}
catch(err){console.log(err);}
try{map.removeLayer(this.featuregroup);}
catch(err){console.log(err);}
try{map.removeLayer(this.locationMarker);	}
catch(err){console.log(err);}
this.removeroutes();

};
removeroutes(){
let map = this.map;
let routes = this.routes;
try{	
map.removeControl(this.routes);
this.routes.spliceWaypoints(0, 2);	
this.routes = null;
}
catch(err){
console.log('No control');	
}	
};
/*resetroutes(newroutes){
	this.setWaypoints(newroutes);	
};*/
addcontrol(){
let map = this.map;
let routes = this.routes;
 map.addControl(routes);
}

addroutes(){
let map = this.map;
let routes = this.routes;
this.removeroutes();
map.addControl(routes);	
}

routing(){
let th = this;
let tolat = this.tolat;
let tolng = this.tolng;
let fromlat = this.fromlat;
let fromlng = this.fromlng;
let map = this.map;
let newroute = false;
let distance;
let time;	
//let ro =  L.Routing.graphHopper('5f4ee7ea-7e82-4acb-bc70-0b7350238863'); 
try{		
map.removeControl(th.routes);
th.routes = null;
}
catch(err){
console.log('No control');	
}   
 try{	
  th.routes.spliceWaypoints(0, 2);
	th.routes = null;
}
 catch(err){
	console.log('err');
 }	
th.routes =new L.Routing.control({
    waypoints: [
    L.latLng(th.latwatch2 ,th.lngwatch2),
    L.latLng(th.tolat, th.tolng)
            ],
	//router: this.graphopper,
	position:'bottomleft',
    routeWhileDragging:true,
    fitSelectedRoutes:true,	
    collapsible:true,
	show:false
	}).addTo(map);	
	map.invalidateSize({animate:true}); 
    th.routes.hide();  
    th.routes.on('routesfound', function(e){
    th.distance = parseFloat(((e.routes[0].summary.totalDistance) * 0.001).toFixed(2)) ;
    th.time = parseFloat(((e.routes[0].summary.totalTime) * 0.016667).toFixed(2));

    th.literature = [];
    th.literature = e.routes[0].instructions
    console.log(th.literature);
	//th.loadvalues();
	
   });
     console.log(this.distance + "Distance is");
     console.log(this.time + "time is");	
   
}



}