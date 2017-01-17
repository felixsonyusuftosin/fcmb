import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ServiceMenuPage } from '../pages/service-menu/service-menu';
//import { ListPage } from '../pages/list/list';
import { HomePagePage } from '../pages/home-page/home-page';
import { ForumPage } from '../pages/forum/forum';
//import { NavController, ModalController , ViewController, NavParams} from 'ionic-angular';
import {Data} from '../services/data-service';
import { PlotToMapPage} from '../pages/plot-to-map/plot-to-map';
//import {Chat} from '../services/chat-service';
import { Safe } from  '../models/pipe';
import { User } from  '../services/user-service';
import {BranchesListPage} from '../pages/branches-list/branches-list';
import { BranchDetailsPage } from '../pages/branch-details/branch-details';
import { UsersPage } from '../pages/users/users'; 
import { FacedetectPage } from '../pages/facedetect/facedetect';
import { FcmbpayPage } from '../pages/fcmbpay/fcmbpay';
import { FormPage } from '../pages/form/form';
import { Slides } from 'ionic-angular';
import { ChatPage } from '../pages/chat/chat';
import { SocketService } from  '../services/socket-service';
import { CallpagePage } from '../pages/callpage/callpage';
import { ScannerPage } from '../pages/scanner/scanner';
import { RecievePage } from '../pages/recieve/recieve';
import { Call } from  '../services/call-service';
import { mapObject} from  '../services/map-service';

@NgModule({
  declarations: [
    MyApp,
   // HelloIonicPage,
    ItemDetailsPage,
    //ListPage,
    HomePagePage,
    RecievePage,

    ServiceMenuPage,
    ForumPage,
    ScannerPage,
    FcmbpayPage,
    UsersPage,
     PlotToMapPage,
    BranchesListPage,
    Safe,
    ChatPage,
    BranchDetailsPage,
    FormPage,
    CallpagePage ,
    FacedetectPage

  ],
  imports: [
    IonicModule.forRoot(MyApp),
  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    //HelloIonicPage,
    ItemDetailsPage,
   // ListPage,
    ServiceMenuPage,
    ForumPage,
    HomePagePage,
    FcmbpayPage,
    BranchesListPage,
    ScannerPage,
    BranchDetailsPage,
    RecievePage,
    FormPage,
     PlotToMapPage,
     ChatPage,
    UsersPage,
    CallpagePage ,
    FacedetectPage

  ],
  providers: [Data, User, Call, SocketService, mapObject, {provide: ErrorHandler, useClass: IonicErrorHandler} ]
  

})
export class AppModule {}

