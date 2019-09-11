import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtAuth implements CanActivate{

  constructor(private router:Router, private jwtService:JwtService){}

  canActivate():boolean{
    if(!this.jwtService.isAuthenicated()){
      console.log("invalid token");
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
