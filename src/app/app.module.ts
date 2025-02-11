import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { DataManagementService } from './services/data-management.service.service';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { TabsPage } from './tabs/tabs.page';
import { EditUserComponent } from './user/edit/edit-group.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { GroupComponent } from './group/group.component';
import { CreateGroupComponent } from './group/create-group/create-group.component';
import { FriendUserComponent } from './user/friend-user/friend-user.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { ListGroupComponent } from './group/list-group/list-group.component';
import { ActivitiesComponent } from './activity/activities/activities.component';
import { CreateActivityComponent } from './activity/create-activity/create-activity.component';
import { BalanceComponent } from './balance/balance.component';
import { ChatComponent } from './chat/chat.component';
import { FeedBackComponent } from './feed-back/feed-back.component';
import { FeedBackCreateComponent } from './feed-back/feed-back-create/feed-back-create.component';





@NgModule({
  declarations: [AppComponent,RegisterComponent, LoginComponent, EditUserComponent,GroupComponent, CreateGroupComponent,FriendUserComponent,
    ListUserComponent,ListGroupComponent,ActivitiesComponent,CreateActivityComponent,BalanceComponent,ChatComponent,FeedBackComponent,FeedBackCreateComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token')
      }
    })
  ],
  providers:[
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DataManagementService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true }
  
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
