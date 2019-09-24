// stock API service
//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

import { Company } from './api.companyinfo';
import { Stock } from './api.companyinfo';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private id;
  private keyword:string[]=["Open","P/E Ratio", "EPS","Yield","Dividend","P/E Current","Price to Sales Ratio","Price to Book Ratio","Price to Cash Flow Ratio","Total Debt to Enterprise Value","Net Margin","Net Income","Revenue","EPS (Basic)","EPS (Basic) Growth"];
  private keywordUnit:string[]=["$",  "",        "$",    "%",   "$",       "",               "",                "",                    "B",                        "",                               "",         "$B",         "$B",    "",            "%"   ];
  private bookmark:Company[];  // bookmark ticker
  private formula:string; // formula
  private valueArr:string[];  // formula string array to calculate
  private isValid:boolean = true; // is the formula valid?

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
  ) {  }

  getIsValid(){   // return isValid - to see if the formula is valid
    return this.isValid;
  }

  setFormula(formula: string, bookmark: Company[]){  // set formula and bookmarkService

    if(this.bookmark!=bookmark || this.formula!=formula){
      this.bookmark = bookmark;   // set bookmark
      this.formula = formula;   // set formula

      this.convertFormula();    // convert formula

      // convert name of the value to value
      for(let i=0;i<this.bookmark.length;i++){
        this.convertValue(i);
      }
    }
  }

  convertValue(index: number){  // convert name of value to vlaue
    let notvalid = 0; // to check if the formula is valid
    let bookmark:Company[] = this.bookmark;

    this.apiService.getFilteredStockInfo(bookmark[index].ticker).subscribe((stocks: Stock[])=>{ // get stock information

      if(this.getIsValid){  // if the formula is valid
        for(let i=0;i<this.valueArr.length;i++){
          for(let j=0;j<(stocks['length']);j++){
            if(this.valueArr[i]==stocks[j]['name']){  // if the nave of the value is the same
              this.valueArr[i]=stocks[j]['value'];  // convert name of value to value
              console.log(this.valueArr);
            }
          }
        }
      }

      for(let i=0;i<(this.valueArr.length);i++){  // check if the values are valid
        if(this.valueArr[i]=="n/a") notvalid++;
      }
      if(notvalid==0) {             // the formula is valid
        this.isValid=true;
      }else {                     // the formula is not valid
        this.isValid=false;
      }

      if(this.getIsValid){  // if the formula is valid
        for(let i = 0;i<(this.valueArr.length);i=i+2){ // convert keyword unit to values
          console.log(this.valueArr);
          if(this.valueArr[i].indexOf("$") !== -1){
            this.valueArr[i]=(this.valueArr[i].toString().replace("$",""))*1;
          }else if(this.valueArr[i].indexOf("%") !== -1){
            this.valueArr[i]=(this.valueArr[i].toString().replace("%",""))*0.01;
          }else if(this.valueArr[i].indexOf("B") !== -1){
            this.valueArr[i]=(this.valueArr[i].toString().replace("%",""))*1000000000;
          }else if(this.valueArr[i].indexOf("M") !== -1){
            this.valueArr[i]=(this.valueArr[i].toString().replace("%",""))*1000000;
          }else{
            this.valueArr[i]=(this.valueArr[i])*1;
          }
        }
      }

      console.log(this.valueArr);
    });

  }

  convertFormula(){  // split formula to array and convert formula to name of the value
    let notvalid = 0; // to check if the formula is valid

    let splitstr = this.formula.split(" ",50);  // split string
    console.log(splitstr);
    for(let i=0;i<splitstr.length;i++){ // consert formula to real value name
      for(let j=0;j<this.keyword.length;j++){
        if(splitstr[i]*1==j) {splitstr[i]=this.keyword[j];} // if the splitstr[] is number, change to keyword
        else if(splitstr[i]=="a") {splitstr[i]="+";}  // if splitstr[] is alphabet, change to math symbol
        else if(splitstr[i]=="b") {splitstr[i]="-";}
        else if(splitstr[i]=="c") {splitstr[i]="*";}
        else if(splitstr[i]=="d") {splitstr[i]="/";}
        else {notvalid++;}
      }
    }
    if(notvalid==0) {             // the formula is valid
      this.isValid=true;
    }else {                     // the formula is not valid
      this.isValid=false;
    }
    this.valueArr=splitstr;
    console.log(this.valueArr);
  }

  calculate(){


  }


}
