import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestComponent  } from './test/test.component'
import { JwtAuth } from './jwt.auth';
import { Error404Component } from './error404/error404.component'
import { HomeComponent } from './home/home.component';
import { LoginComponent  } from './login/login.component'
import { JoinComponent } from './join/join.component';

const routes: Routes = [
  {path:'', component: HomeComponent, pathMatch:'full'},
  {path:'test', component: TestComponent, pathMatch:'full'},
  {path:'login', component: LoginComponent, pathMatch:'full'},
  {path:'join', component: JoinComponent, pathMatch:'full'},
  {path:'bookmark', component: HomeComponent, pathMatch:'full', canActivate: [JwtAuth]},  // /bookmark can be redirected via JwtAuth
  {path:'**', component: Error404Component},    // Any address except the above addresses
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
