// JWT service
// control JWToken

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'; //JWT Helper
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  TOKEN_NAME = "jwt_token";

  constructor(private router:Router, private jwtHelperService:JwtHelperService) { }

  // JWT related function
  setToken(token: string){
    localStorage.setItem(this.TOKEN_NAME,token);
  }

  getToken(){
    return localStorage.getItem(this.TOKEN_NAME);
  }

  removeToken(){
    localStorage.removeItem(this.TOKEN_NAME);
  }

  isAuthenicated():boolean{
    const token :string= this.getToken();
    return token!='null'? !this.isTokenExpired(token):false;
  }

  isTokenExpired(token:string):boolean{
    return this.jwtHelperService.isTokenExpired(token);
  }

  logout():void{
    this.removeToken();
  }

}
