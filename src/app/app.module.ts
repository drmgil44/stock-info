import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';

import { ChartsModule } from 'ng2-charts';

import { TestComponent } from './test/test.component';
import { JwtAuth } from './jwt.auth';
import { Error404Component } from './error404/error404.component';
import { LoginComponent } from './login/login.component';
import { JoinComponent } from './join/join.component';
import { MyinfoComponent } from './myinfo/myinfo.component';
import { ChangepwComponent } from './changepw/changepw.component';
import { DeleteidComponent } from './deleteid/deleteid.component';
import { CompanylistComponent } from './companylist/companylist.component';
import { CompanyinfoComponent } from './companyinfo/companyinfo.component';
import { CompanysearchComponent } from './companysearch/companysearch.component';
import { BookmarkComponent } from './bookmark/bookmark.component';

import { OverviewResolve, ProfileResolve, FinancialsResolve } from './companyinfo.resolve';
import { BookmarkResolve } from './bookmark.resolve';


export function tokenGetter(){  // JWT toekn getter
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    TestComponent,
    LoginComponent,
    JoinComponent,
    MyinfoComponent,
    ChangepwComponent,
    DeleteidComponent,
    CompanylistComponent,
    CompanyinfoComponent,
    CompanysearchComponent,
    BookmarkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200', 'localhost:80'],
        blacklistedRoutes: ['']
      }
    })
  ],
  providers: [JwtAuth, OverviewResolve, ProfileResolve, FinancialsResolve, BookmarkResolve],
  bootstrap: [AppComponent]
})
export class AppModule { }
