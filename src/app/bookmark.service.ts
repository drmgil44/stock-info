// stock API service
//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

import { Company } from './api.companyinfo';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private id;
  private keyword:string[]=["Open","P/E Ratio", "EPS","Yield","Dividend","P/E Current","Price to Sales Ratio","Price to Book Ratio","Price to Cash Flow Ratio","Total Debt to Enterprise Value","Net Margin","Net Income","Revenue","EPS (Basic)","EPS (Basic) Growth"];
  private keywordUnit:string[]=["$",  "",        "$",    "%",   "$",       "",               "",                "",                    "B",                        "",                               "",         "$B",         "$B",    "",            "%"   ];
  private keywordLen=15;
  private formula:string;

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
  ) {  }

  getFormula(formula: string){
    this.formula = formula;
  }

  splitFormula(){ // split formula to array

    //
  }

  convertValue(){ // change keyword to values
    // get values
    // getStockOverview, getStockProfile, getStockFinancials


    for(let i = 0;i<(this.keywordLen);i++){ // convert keyword unit to values
      if(this.keywordUnit[i]=="$"){

      }else if(this.keywordUnit[i]=="%"){

      }else if(this.keywordUnit[i]=="B" || this.keywordUnit[i]=="$B"){

      }
    }
  }

  calculate(){


  }


}
