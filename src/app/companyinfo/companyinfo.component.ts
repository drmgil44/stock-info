import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppComponent } from '../app.component';

import { ApiService } from '../api.service';
import { StockService } from '../stock.service';
import { Stock, StockHistory } from '../api.companyinfo';


@Component({
  selector: 'app-companyinfo',
  templateUrl: './companyinfo.component.html',
  styleUrls: ['./companyinfo.component.css']
})
export class CompanyinfoComponent implements OnInit {
  selectedticker; // ticker name
  selectedcompany; // company name
  stocksO:Stock[]; // stock overview values
  stocksP:Stock[]; // stock profile values
  stocksF:StockHistory[]; // stock financials values

  constructor(
      private apiService: ApiService,
    private router: Router,
    private stockService:StockService,
  ) { }

  ngOnInit() {
    if(this.stockService.getTicker()) {
      this.selectedticker=this.stockService.getTicker();
      this.selectedcompany=this.stockService.getCompany();
      this.getStockOverview();
      this.getStockProfile();
      this.getStockFinancials();
    }
    //else this.router.navigate([""]); // rediect to company list

  }

  getStockOverview(){
      this.apiService.getStockOverview(this.selectedticker).subscribe((stocks: Stock[])=>{
        console.log(stocks);
        this.stocksO = stocks;
      });
  }

  getStockProfile(){
      this.apiService.getStockProfile(this.selectedticker).subscribe((stocks: Stock[])=>{
        console.log(stocks);
        this.stocksP = stocks;
      });
  }

  getStockFinancials(){
      this.apiService.getStockFinancials(this.selectedticker).subscribe((stocks: StockHistory[])=>{
        console.log(stocks);
        this.stocksF = stocks;
      });
  }
}
