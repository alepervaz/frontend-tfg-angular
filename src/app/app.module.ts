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
import { EditComponent } from './user/edit/edit.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';




@NgModule({
  declarations: [AppComponent,RegisterComponent, LoginComponent, EditComponent],
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
