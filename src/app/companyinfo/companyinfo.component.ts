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
  stocksFstr: string[];

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
    else this.router.navigate([""]); // rediect to company list

  }

  getStockOverview(){
      this.apiService.getStockOverview(this.selectedticker).subscribe((stocks: Stock[])=>{
        this.stocksO = stocks;
      });
  }

  getStockProfile(){
      this.apiService.getStockProfile(this.selectedticker).subscribe((stocks: Stock[])=>{
        this.stocksP=stocks;
      });
  }

  getStockFinancials(){
      this.apiService.getStockFinancials(this.selectedticker).subscribe((stocks: StockHistory[])=>{
        console.log(stocks);
        for(let i = 0;i<(stocks['length']);i++){   // to replace '%amp;' to '&'
          stocks[i]['name']=stocks[i]['name'].toString().replace("&amp;","&");
        }
        this.stocksF = stocks;
      });
  }
}
