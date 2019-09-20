import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestComponent  } from './test/test.component'
import { JwtAuth } from './jwt.auth';
import { Error404Component } from './error404/error404.component'
import { LoginComponent  } from './login/login.component'
import { JoinComponent } from './join/join.component';
import { MyinfoComponent } from './myinfo/myinfo.component';
import { ChangepwComponent } from './changepw/changepw.component';
import { DeleteidComponent } from './deleteid/deleteid.component';
import { CompanylistComponent } from './companylist/companylist.component';
import { CompanyinfoComponent } from './companyinfo/companyinfo.component';
import { CompanysearchComponent } from './companysearch/companysearch.component';

const routes: Routes = [
  {path:'test', component: TestComponent, pathMatch:'full'},
  {path:'', component: CompanylistComponent, pathMatch:'full', runGuardsAndResolvers: 'always'},
  {path:'cinfo', component: CompanyinfoComponent, pathMatch:'full'},
  {path:'search', component: CompanysearchComponent, pathMatch:'full', runGuardsAndResolvers: 'always'},
  {path:'login', component: LoginComponent, pathMatch:'full'},
  {path:'join', component: JoinComponent, pathMatch:'full'},
  {path:'myinfo', component: MyinfoComponent, pathMatch:'full', canActivate: [JwtAuth]},  // /MyAccount can be redirected via JwtAuth
  {path:'changepw', component: ChangepwComponent, pathMatch:'full', canActivate: [JwtAuth]},  // /MyAccount can be redirected via JwtAuth
  {path:'deleteid', component: DeleteidComponent, pathMatch:'full', canActivate: [JwtAuth]},  // /MyAccount can be redirected via JwtAuth
  {path:'bookmark', component: TestComponent, pathMatch:'full', canActivate: [JwtAuth]},  // /bookmark can be redirected via JwtAuth
  {path:'**', component: Error404Component},    // Any address except the above addresses
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
