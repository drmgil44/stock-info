// stock API service
//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Stock, StockHistory } from './api.companyinfo';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private ticker=null;  // selected ticker
  private company=null; // selected company
  private searchStr=null  // search input
  
  constructor(
    private apiService: ApiService,
  ) { }

  setTicker(selectedticker){  this.ticker = selectedticker;  }
  setCompany(selectedcompany){  this.company = selectedcompany;  }
  setSearch(searchStr){  this.searchStr = searchStr;  }
  getTicker(){  return this.ticker;  }
  getCompany(){  return this.company;  }
  getSearch(){  return this.searchStr;  }

}
