import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { AppComponent } from './app.component';

import { ApiService } from './api.service';
import { StockService } from './stock.service';
import { Stock, StockHistory } from './api.companyinfo';

@Injectable()
export class OverviewResolve implements Resolve<Stock[]> {  // get data for stock overview
  constructor(
    private stockService:StockService,
    private apiService: ApiService,
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    let selectedticker=this.stockService.getTicker();
    return   this.apiService.getStockOverview(selectedticker);
  }
}

@Injectable()
export class ProfileResolve implements Resolve<Stock[]> {  // get data for stock profile
  constructor(
    private stockService:StockService,
    private apiService: ApiService,
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    let selectedticker=this.stockService.getTicker();
    return   this.apiService.getStockProfile(selectedticker);
  }
}

@Injectable()
export class FinancialsResolve implements Resolve<StockHistory[]> {  // get data for stock financials
  constructor(
    private stockService:StockService,
    private apiService: ApiService,
  ) {}
  resolve(route: ActivatedRouteSnapshot) {
    let selectedticker=this.stockService.getTicker();
    return this.apiService.getStockFinancials(selectedticker);
  }
}
