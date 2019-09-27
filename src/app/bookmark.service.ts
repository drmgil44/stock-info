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
  private keyword:string[]=["Open","P/E Ratio", "EPS","Yield","Dividend","P/E Current","Price to Sales Ratio","Price to Book Ratio","Price to Cash Flow Ratio","Total Debt to Enterprise Value","Net Margin","Net Income","Revenue","EPS (Basic)","EPS (Basic) Growth"];
  private keywordUnit:string[]=["$",  "",        "$",    "%",   "$",       "",               "",                "",                    "B",                        "",                               "",         "$B",         "$B",    "",            "%"   ];
  private bookmark:Company[];  // bookmark ticker
  private formula:string; // formula

  private formulaArr: any = []; // formula string array to calculate
  private isValid:boolean = true; // is the formula valid?
  private result:any = [];   // resulf of the formula

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
  ) {  }

  getIsValid(){   // return isValid - to see if the formula is valid
    return this.isValid;
  }


  setFormula(formula: string, bookmark: Company[]){  // set formula and bookmarkService

    if(this.bookmark!=bookmark  || this.formula!=formula){
      this.bookmark = bookmark;   // set bookmark
      this.formula = formula;   // set formula
      this.result = [];     // reset

      this.convertFormula();    // convert formula

      // convert name of the value to value
      for(let i=0;i<this.bookmark.length;i++){
        let ticker = this.bookmark[i].ticker;

        this.convertValue(ticker);

      }

    }
  }

  convertFormula(){  // split formula to array and convert formula to name of the value
    let notvalid = 0; // to check if the formula is valid

    let splitstr:any = this.formula.split(" ",50);  // split string
    //console.log(splitstr);
    for(let i=0;i<splitstr.length;i++){ // consert formula to real value
      if ( !isNaN(splitstr[i]*1)) {  // case :  number
          for(let j=0;j<this.keyword.length;j++){
            if(splitstr[i]*1==j) {splitstr[i]=this.keyword[j]; break;} // if the splitstr[] is number, change to keyword
          }
      }
    else if(splitstr[i]=="+" || splitstr[i]=="-" || splitstr[i]=="*" || splitstr[i]=="/" || splitstr[i]=="(" || splitstr[i]==")"){} // no change
      else {notvalid++;}

    }

    if(notvalid==0) {             // the formula is valid
      this.isValid=true;
    }else {                     // the formula is not valid
      this.isValid=false;
    }
    this.formulaArr=splitstr;
    console.log(this.formulaArr);

  }

  convertValue(ticker: string){  // convert name of value to vlaue
    let notvalid = 0; // to check if the formula is valid
    let valueArr:any = [];  // value array to calculate
    let result:number = null; // result of the calculation

    //console.log(ticker);
    this.apiService.getFilteredStockInfo(ticker).subscribe((stocks: Stock[])=>{ // get stock information

      if(this.getIsValid()){  // if the formula is valid
        for(let i=0;i<this.formulaArr.length;i++){
          if(this.formulaArr[i] != "+" && this.formulaArr[i] != "-" && this.formulaArr[i] != "/" && this.formulaArr[i] != "*" && this.formulaArr[i] != "(" && this.formulaArr[i] != ")"){
            for(let j=0;j<(stocks['length']);j++){
              if(this.formulaArr[i]==stocks[j]['name']){  // if the nave of the value is the same
                valueArr[i]=stocks[j]['value'];  // convert name of value to value
              }
            }
          }else{
            valueArr[i] = this.formulaArr[i];
          }
          //console.log(this.valueArr);
        }
      }

      for(let i=0;i<(valueArr.length);i++){  // check if the values are valid
        if(valueArr[i]=="n/a") notvalid++;
      }

      console.log(valueArr);

      if(notvalid==0){  // if the values are valid
        for(let i = 0;i<(valueArr.length);i++){ // convert value units to values

          if(valueArr[i] != "+" && valueArr[i] != "-" && valueArr[i] != "/" && valueArr[i] != "*" && valueArr[i] != "(" && valueArr[i] != ")"){

            if(valueArr[i].indexOf("$") !== -1 && valueArr[i].indexOf("B") == -1 && valueArr[i].indexOf("M") == -1 && valueArr[i].indexOf("K") == -1){ // if the unit is $, not including B or M or K
              valueArr[i]=(valueArr[i].toString().replace("$",""))*1;
            }else if(valueArr[i].indexOf("%") !== -1){   // if the unit is %
              valueArr[i]=(valueArr[i].toString().replace("%",""))*0.01;
            }else if(valueArr[i].indexOf("B") !== -1){   // if the unit is B
              valueArr[i]=(valueArr[i].toString().replace("$",""));
              valueArr[i]=(valueArr[i].toString().replace("B",""))*1000000000;
            }else if(valueArr[i].indexOf("M") !== -1){ // if the unit is M
              valueArr[i]=(valueArr[i].toString().replace("$",""));
              valueArr[i]=(valueArr[i].toString().replace("M",""))*1000000;
            }else if(valueArr[i].indexOf("K") !== -1){ // if the unit is K
              valueArr[i]=(valueArr[i].toString().replace("$",""));
              valueArr[i]=(valueArr[i].toString().replace("K",""))*1000;
            }else{
              valueArr[i]=(valueArr[i])*1;
            }
          }
        }
        //console.log(valueArr);
        result = this.calculate(valueArr); // calculate formula
      }


      for(let i=0; i<this.bookmark.length;i++){
        if(this.bookmark[i].ticker==ticker) {
          if(result!=null) this.result[i]=result; // save result of formula
          else this.result[i]="Not available";
        }
      }
      console.log(this.result);

    });

  }



  calculate(valueArr:any[]): number{  // Postfix calculator
    let postfix:any = [] ; // postfix expresstion

    // convert infix expression to postfix
    let stack:any = [] ; // stack
    for(let i=0; i<valueArr.length; i++){
      //console.log("expression: "+postfix+", stack: "+stack);

      if ( !isNaN(valueArr[i])) {  // case :  number
        postfix[postfix.length] =valueArr[i]; // save

      }else if(valueArr[i] == "("){  // case : (
        stack[stack.length] = valueArr[i]; // push in stack

      }else if(valueArr[i] == ")"){  // case : )
        for(let j=stack.length-1;j>=0;j--){
          if(stack[j]!="("){ postfix[postfix.length] = stack[j]; stack[j]=null; } // pop stack, save
          else {break;}
        }

      }else{                             // case : +, -, *, /
        stack[stack.length] = valueArr[i]; // push in stack
      }
    }

    if(stack.length){ // if math symbol is in stack
      for(let j=stack.length-1;j>=0;j--){
        if(stack[j]!="(" && stack[j]!=")" && stack[j]!=null){ postfix[postfix.length] = stack[j]; stack[j]=null; }  // pop stack, save
      }
    }
    //console.log(postfix);

    // caculate
    let stack2:any = [];
    let number1:number  = null;
    let number2:number  = null;
    for(let i=0; i<postfix.length; i++){
      if ( !isNaN(postfix[i])) {  // case :  number
        stack2[stack2.length] = postfix[i]; // push in stock
      }else{                    // case : math symbol
        for(let j=stack2.length-1;j>=0;j--){
          if (stack2[j]!=null){ // if it is not null
            if(number1==null){number1=stack2[j]; stack2[j]=null;}
            else {number2=stack2[j]; stack2[j]=null; break;}
          }
        }

        if(postfix[i]=="+")  stack2[stack2.length]= number2+number1;  // calculate
        else if(postfix[i]=="-")  stack2[stack2.length]= number2-number1;
        else if(postfix[i]=="*")  stack2[stack2.length]= number2*number1;
        else if(postfix[i]=="/")  stack2[stack2.length]= number2/number1;
        number1=null;
      }
      //console.log(postfix[i]+", stack2: {{ "+stack2+"}}");
    }


    return stack2[stack2.length-1];  // save calculation result to result
  }
}
