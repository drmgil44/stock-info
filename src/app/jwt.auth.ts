import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtAuth implements CanActivate{

  constructor(
    private router:Router,
    private jwtService:JwtService
  ){}

  canActivate():boolean{  // true - token is authenicated, false - token is not valid
    if(!this.jwtService.isAuthenicated()){  // if the token is not vaild
      console.log("invalid token");
      this.router.navigate(['login']);      // redirection to login
      return false;
    }
    return true;
  }
}
