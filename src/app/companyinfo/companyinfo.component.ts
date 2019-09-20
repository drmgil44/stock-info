import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  stocksFstr: string[]; // fixed stock financials values
  isresult:boolean = true; // hide table when there is no result
  msgalert:string;  // message

  constructor(
    private apiService: ApiService,
    private router: Router,
    private stockService:StockService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if(this.stockService.getTicker()) {
      this.selectedticker=this.stockService.getTicker();
      this.selectedcompany=this.stockService.getCompany();
      this.stocksO=this.route.snapshot.data['overview'];  // resolve
      this.stocksP=this.route.snapshot.data['profile']; // resolve
      this.getStockFinancials();

      if(this.stocksO==null) {  // no result
        this.isresult=false;
        this.msgalert="No result for this company :(";
      }
    }
    else this.router.navigate([""]); // rediect to company list

  }

  getStockFinancials(){ // get webscraping data
      this.apiService.getStockFinancials(this.selectedticker).subscribe((stocks: StockHistory[])=>{
        if(stocks!=null){
          for(let i = 0;i<(stocks['length']);i++){   // to replace '%amp;' to '&'
            stocks[i]['name']=stocks[i]['name'].toString().replace("&amp;","&");
          }
          this.stocksF = stocks;
        }
      });
  }
}
