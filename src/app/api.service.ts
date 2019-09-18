// RESTful API service
// connecting MySQL

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt'; //JWT Helper
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { Policy } from './policy';
import { Login, Join, User, UserPw } from './api.userinfo';
import { Company, Stock, StockHistory } from './api.companyinfo';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  PHP_API_SERVER = "http://127.0.0.1:80/angular-php-app/backend";

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService,
    private jwtHelperService:JwtHelperService
  ) { }

  setToken(token: string){  // set Jwt token
    this.jwtService.setToken(token);
  }

  readPolicies(): Observable<Policy[]>{ // test
      return this.httpClient.get<Policy[]>(`${this.PHP_API_SERVER}/api/test/read.php`);
  }

  createPolicy(policy: Policy): Observable<Policy>{ // test
      return this.httpClient.post<Policy>(`${this.PHP_API_SERVER}/api/test/create.php`, policy);
  }

  updatePolicy(policy: Policy){ // test
      return this.httpClient.put<Policy>(`${this.PHP_API_SERVER}/api//test/update.php`, policy);
  }

  deletePolicy(id: number){ // test
      return this.httpClient.delete<Policy>(`${this.PHP_API_SERVER}/api/test/delete.php/?id=${id}`);
  }

  tryLogin(login: Login): Observable<string>{ // Login -  check if the id and password is valid to login
      return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/login.php`, login).pipe(tap(res=> this.setToken(res['token'])))
  }

  createAccount(join: Join): Observable<string>{ // Sign up - create new account
      return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/join.php`, join);
  }

  editAccount(user: User): Observable<string>{  // My Account - Edit My account
    return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/editAccount.php`, user);
  }

  deleteAccount(userpw: UserPw): Observable<string>{  // My Account - Delete Account
    return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/deleteIdOrChangePw.php`, userpw);
  }

  changePassword(userpw: UserPw): Observable<string>{ // My Account - Change Password
    return this.httpClient.post<string>(`${this.PHP_API_SERVER}/api/deleteIdOrChangePw.php`, userpw);
  }

  getCompanyList(pnumber: number): Observable<Company[]>{ // get Company list response upon page number
      return this.httpClient.get<Company[]>(`${this.PHP_API_SERVER}/api/companyList.php/?pnumber=${pnumber}`);
  }

  getStockOverview(ticker: string): Observable<Stock[]>{ //get stock overview values
      return this.httpClient.get<Stock[]>(`${this.PHP_API_SERVER}/webscraper/webscraper_overview.php/?ticker=${ticker}`);
  }

  getStockProfile(ticker: string): Observable<Stock[]>{ //get stock profile values
      return this.httpClient.get<Stock[]>(`${this.PHP_API_SERVER}/webscraper/webscraper_profile.php/?ticker=${ticker}`);
  }

  getStockFinancials(ticker: string): Observable<StockHistory[]>{ //get stock financial values
      return this.httpClient.get<StockHistory[]>(`${this.PHP_API_SERVER}/webscraper/webscraper_financials.php/?ticker=${ticker}`);
  }
}
