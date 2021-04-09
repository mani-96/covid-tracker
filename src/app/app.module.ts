import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import "@angular/common/locales/global/en-IN";
import { StateComponent } from './state/state.component';
import { HttpCallInterceptor } from './http-call.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "en-IN" },
    {provide: HTTP_INTERCEPTORS, useClass: HttpCallInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
