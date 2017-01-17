import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import {  ViewChild } from '@angular/core';
import {  MenuController, Nav } from 'ionic-angular';
import { HomePagePage } from '../pages/home-page/home-page';
import {Data} from '../services/data-service';
import { User } from  '../services/user-service';
import {Http, Headers} from '@angular/http';
import { Call } from  '../services/call-service';
import * as io from "socket.io-client";
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html',
   providers: [Data, User],
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  // make HelloIonicPage the root (or first) page
  rootPage: any = HomePagePage;
  pages: Array<{title: string, component: any}>;
  constructor(
    public platform: Platform,
    public menu: MenuController,
    private dt:Data,
    public http:Http,
    private user:User,
   public call:Call,
  // public socket: SocketService
    //private chat:Chat,

  ) {
    
    dt = new Data();
    user = new User(http);
    //this.socket = new SocketService()
    this.initializeApp(); 

    // set our app's pages
    this.pages = [
      //{ title: 'Hello Ionic', component: HelloIonicPage },
      { title: 'Home', component: HomePagePage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}