import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JwtAuth } from './jwt.auth';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './error404/error404.component'
import { TestComponent  } from './test/test.component'
import { LoginComponent  } from './login/login.component'

const routes: Routes = [
  {path:'', component: HomeComponent, pathMatch:'full'},
  {path:'test', component: TestComponent, pathMatch:'full'},
  {path:'login', component: LoginComponent, pathMatch:'full'},
  {path:'bookmark', component: HomeComponent, pathMatch:'full', canActivate: [JwtAuth]},
  {path:'**', component: Error404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
