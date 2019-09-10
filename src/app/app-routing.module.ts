import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { Error404Component } from './error404/error404.component'
import { TestComponent  } from './test/test.component'
import { LoginComponent  } from './login/login.component'

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'test', component: TestComponent},
  {path:'login', component: LoginComponent},
  {path:'**', component: Error404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
