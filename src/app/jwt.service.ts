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

  constructor(
    private router:Router,
    private jwtHelperService:JwtHelperService
  ) { }

  // JWT related function
  setToken(token: string){  // set token to localStorage
    localStorage.setItem(this.TOKEN_NAME,token);
  }

  getToken(){ // set token from localStorage
    return localStorage.getItem(this.TOKEN_NAME);
  }

  removeToken(){  // remove token from local storage
    localStorage.removeItem(this.TOKEN_NAME);
  }

  decodeToken(token:string):string{ // decode token
    return this.jwtHelperService.decodeToken(token);
  }

  decodeData():string{ // decode data from token
    const token :string= this.getToken();
    if(token!='null'){
      let dtoken:string= this.decodeToken(token); // decode token
      return dtoken['data'];  // return only data from token
    }else{
      return 'null';
    }
  }

  isTokenExpired(token:string):boolean{ // check if the token is expired
    return this.jwtHelperService.isTokenExpired(token);
  }

  isAuthenicated():boolean{ // check if the token is valid
    const token :string= this.getToken();
    return token!='null'? !this.isTokenExpired(token):false;
  }

  logout():void{  // logout
    this.removeToken();
  }

}
