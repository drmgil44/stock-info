import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { AppComponent } from './app.component';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Company } from './api.companyinfo';

@Injectable()
export class BookmarkResolve implements Resolve<Company[]> {  // get data for bookmark
  constructor(
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    let currentdata= this.jwtService.decodeData();
    return   this.apiService.getBookmark(currentdata['id']);
  }
}
