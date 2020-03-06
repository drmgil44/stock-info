import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { StockService } from '../stock.service';
import { BookmarkService } from '../bookmark.service';

import { Company, Stock } from '../api.companyinfo';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {
  navigationSubscription; // for subscription

  // ------------------------------------------ graph
  public barChartOptions: ChartOptions = {
   responsive: true,
   // We use these empty structures as placeholders for dynamic theming.
   scales: { xAxes: [{}], yAxes: [{}] },
   plugins: {
     datalabels: {
       anchor: 'end',
       align: 'end',
     }
   }
 };
 public barChartLabels: Label[] = [];
 public barChartType: ChartType = 'bar';
 public barChartLegend = true;
 public barChartPlugins = [pluginDataLabels];

 public barChartData: ChartDataSets[] = [
   { data: [], label: '2015' },
   { data: [], label: '2016' },
   { data: [], label: '2017' },
   { data: [], label: '2018' },
   { data: [], label: '2019' }
 ];

 //--------------------------------------------------------

  private maxformula:number = 100; // maximum length of formula
  blist:Company[];  // Bookmark list
  formula:string;

  private keyword:string[]=["Open","P/E Ratio", "EPS","Yield","Dividend","P/E Current","Price to Sales Ratio","Price to Book Ratio","Price to Cash Flow Ratio","Total Debt to Enterprise Value","Net Margin","Net Income","Revenue","  EPS (Basic)1","EPS (Basic) Growth"];
  private keywordUnit:string[]=["$",  "",        "$",    "%",   "$",       "",               "",                "",                    "B",                        "",                               "",         "$B",         "$B",    "",            "%"   ];
  private formulaArr: any = []; // formula string array to calculate
  private isValid:boolean = true; // is the formula valid?
  // graph
  data2015:number[] = [];  // graph  value
  data2016:number[] = [];  // graph  value
  data2017:number[] = [];  // graph  value
  data2018:number[] = [];  // graph  value
  data2019:number[] = [];  // graph  value
  // information table
  result:any = [];   // resulf of the formula
  dataeps:any[] = []; // EPS persent change (2019-2015)/2019*100
  dataReco:any[] = []; // Recommendation
  msgalert:string = ''; // alert
  isResult:boolean = false; // if the formula result exists


  constructor(
    private router: Router,
    private apiService: ApiService,
    private jwtService: JwtService,
    private stockService:StockService,
    private bookmarkService:BookmarkService,
    private route: ActivatedRoute,

  ) {
    // Reload data  with same URL
    // subscribe to the router events - storing the subscription
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
    // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
          this.ngOnInit();

        }
    });
  }

  ngOnInit() {
    this.blist=this.route.snapshot.data['bookmark'];  // resolve

    for(let i=0; i<this.blist.length; i++){ // graph label
        this.barChartLabels[i]=this.blist[i].ticker;
    }

    this.getFormula();  // get formula
  }

  ngOnDestroy() { // unsubscribe
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

  deleteBookmark(selectedticker){ // remove bookmark
    let currentdata= this.jwtService.decodeData();
    this.apiService.deleteBookmark(currentdata['id'],selectedticker).subscribe((result: string)=>{
      if(result['status']=="deleted") { this.router.navigate(["bookmark"]);} // rediect
    });

  }

  sendEmail(){  // send information to eamil
    let currentdata= this.jwtService.decodeData();
    let value:any =[];
    let bookmark_max = 5;
    for(let i=0;i<bookmark_max;i++){  // loop until the number of bookmark maximum
      if(this.result[i]!=null) value[i]=this.result[i]; // save result
      else value[i]=null;
    }
    this.apiService.sendEmail(currentdata['id'],value[0],value[1],value[2],value[3],value[4]).subscribe((emailresult: string)=>{
      console.log(emailresult);
      this.msgalert = emailresult['message'];
    })
  }

  getFormula(){  // get formula
    let currentdata= this.jwtService.decodeData();
    this.apiService.getFormula(currentdata['id']).subscribe((result: string)=>{
      if(result['formula']!=null) {
        // change alphabet to math symbol
        result['formula']=result['formula'].toString().replace("a","+");
        result['formula']=result['formula'].toString().replace("b","-");
        result['formula']=result['formula'].toString().replace("c","*");
        result['formula']=result['formula'].toString().replace("d","/");

        this.formula = result['formula'];
      }else this.formula="";


      this.calculateFormula();  // calculate formula
      //this.bookmarkService.setFormula(result['formula'],this.blist);
    })
  }

  setFormula(form){ // save formula
    let currentdata= this.jwtService.decodeData();
    let formulastr=this.formula;
    // change math symbol to alphabet
    formulastr=formulastr.toString().replace("+","a");
    formulastr=formulastr.toString().replace("-","b");
    formulastr=formulastr.toString().replace("*","c");
    formulastr=formulastr.toString().replace("/","d");

    if(formulastr.length<this.maxformula){
      this.apiService.setFormula(currentdata['id'],formulastr).subscribe((result: string)=>{
        console.log(result);
        if(result['status']=="saved" || result['status']=="updated") { this.router.navigate(["bookmark"]);} // rediect
      });
    }else{
      console.log("exceed maximum length");
      //this.router.navigate(["bookmark"]);
    }
  }

  getCompanyInfo(selectedticker,selectedcompany){ // save seleteced ticker to show company information
    this.stockService.setTicker(selectedticker);
    this.stockService.setCompany(selectedcompany);
    this.router.navigate(["cinfo"]); // rediect to company info
  }


  //------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------

  getIsValid(){   // return isValid - to see if the formula is valid
    return this.isValid;
  }


  calculateFormula(){  // set formula and bookmarkService
    this.result = [];     // reset
    this.convertFormula();    // convert formula

    // convert name of the value to value
    for(let i=0;i<this.blist.length;i++){
      let ticker = this.blist[i].ticker;
      this.convertValue(ticker);

      if(i==this.blist.length-1){
        this.isResult=true;

        ///------------------------- graph
        this.barChartData[0].data = this.data2015;
        this.barChartData[1].data = this.data2016;
        this.barChartData[2].data = this.data2017;
        this.barChartData[3].data = this.data2018;
        this.barChartData[4].data = this.data2019;
        ///---------------------------------
        console.log(this.barChartData);
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
    //console.log(this.formulaArr);

  }

  convertValue(ticker: string){  // convert name of value to vlaue
    let notvalid = 0; // to check if the formula is valid
    let valueArr:any = [];  // value array to calculate
    let result:number = null; // result of the calculation
    let graphArr:any = [];  // value for graph
    let recoArr:any = []; // value for Recommendation


    //console.log(ticker);
    this.apiService.getFilteredStockInfo(ticker).subscribe((stocks: Stock[])=>{ // get stock information
      if(stocks==null) notvalid++;
      //console.log(stocks);
      if(this.getIsValid() && notvalid==0){  // if the formula is valid
        for(let i=0;i<this.formulaArr.length;i++){
          if(this.formulaArr[i] != "+" && this.formulaArr[i] != "-" && this.formulaArr[i] != "/" && this.formulaArr[i] != "*" && this.formulaArr[i] != "(" && this.formulaArr[i] != ")"){
            for(let j=0;j<(stocks['length']);j++){
              if(this.formulaArr[i]==stocks[j]['name']){  // if the name of the value is the same
                valueArr[i]=stocks[j]['value'];  // convert name of value to value
              }

              // Recommendation
              if(stocks[j]['name']=="P/E Current"){
                recoArr[0]=stocks[j]['value']*1;
              }else if(stocks[j]['name']=="EPS (Basic) Growth"){
                let temp=stocks[j]['value'];
                temp=temp.toString().replace("%","");
                recoArr[1]=temp*1;
              }
              //console.log(recoArr);

              //////----------------------------- graph value
              if(stocks[j]['name']=="  EPS (Basic)1"){  // graph value
                graphArr[0]=stocks[j]['value']*1;
              }else if(stocks[j]['name']=="  EPS (Basic)2"){  // graph value
                graphArr[1]=stocks[j]['value']*1;
              }else if(stocks[j]['name']=="  EPS (Basic)3"){  // graph value
                graphArr[2]=stocks[j]['value']*1;
              }else if(stocks[j]['name']=="  EPS (Basic)4"){  // graph value
                graphArr[3]=stocks[j]['value']*1;
              }else if(stocks[j]['name']=="  EPS (Basic)5"){  // graph value
                graphArr[4]=stocks[j]['value']*1;
              }
              //console.log(graphArr);
              ////////-------------------------------------------
            }
          }else{
            valueArr[i] = this.formulaArr[i];
          }
          //console.log(valueArr);
        }
      }

      for(let i=0;i<(valueArr.length);i++){  // check if the values are valid
        if(valueArr[i]=="n/a") notvalid++;
      }

      //console.log(valueArr);


      if(notvalid==0){  // if the values are valid
        for(let i = 0;i<(valueArr.length);i++){ // convert value units to values

          if(valueArr[i] != "+" && valueArr[i] != "-" && valueArr[i] != "/" && valueArr[i] != "*" && valueArr[i] != "(" && valueArr[i] != ")"){

            if(valueArr[i].indexOf("$") !== -1 && valueArr[i].indexOf("B") == -1 && valueArr[i].indexOf("M") == -1 && valueArr[i].indexOf("K") == -1){ // if the unit is $, not including B or M or K
              valueArr[i]=(valueArr[i].toString().replace(",",""));
              valueArr[i]=(valueArr[i].toString().replace("$",""))*1;
            }else if(valueArr[i].indexOf("%") !== -1){   // if the unit is %
              valueArr[i]=(valueArr[i].toString().replace(",",""));
              valueArr[i]=(valueArr[i].toString().replace("%",""))*0.01;
            }else if(valueArr[i].indexOf("B") !== -1){   // if the unit is B
              valueArr[i]=(valueArr[i].toString().replace(",",""));
              valueArr[i]=(valueArr[i].toString().replace("$",""));
              valueArr[i]=(valueArr[i].toString().replace("B",""))*1000000000;
            }else if(valueArr[i].indexOf("M") !== -1){ // if the unit is M
              valueArr[i]=(valueArr[i].toString().replace(",",""));
              valueArr[i]=(valueArr[i].toString().replace("$",""));
              valueArr[i]=(valueArr[i].toString().replace("M",""))*1000000;
            }else if(valueArr[i].indexOf("K") !== -1){ // if the unit is K
              valueArr[i]=(valueArr[i].toString().replace(",",""));
              valueArr[i]=(valueArr[i].toString().replace("$",""));
              valueArr[i]=(valueArr[i].toString().replace("K",""))*1000;
            }else{
              valueArr[i]=(valueArr[i].toString().replace(",",""));
              valueArr[i]=(valueArr[i])*1;
            }
          }
        }
        //console.log(valueArr);
        result = this.calculate(valueArr); // calculate formula
        result = result - ((result * 10000)%10)/10000;  // cut value 0.001
        //console.log(((result * 1000)%10)/1000);
      }

      for(let i=0; i<this.blist.length;i++){
        if(this.blist[i].ticker==ticker) {
          if(result!=null) {
            this.result[i]=result;  // save result of formula
            this.dataeps[i]=(graphArr[0]-graphArr[4])/graphArr[0]*100; // get EPS persent change (2019-2015)/2019*100

            let temp=recoArr[0]/recoArr[1];
            if(temp>0) {
              this.dataReco[i] = "Under ("+temp+")";
            }else{
              this.dataReco[i] = "Over ("+temp+")";
            }
          } else {
            this.result[i]="Not available";
          }
          ///------------------------------------graph
          this.data2015[i]=graphArr[4];
          this.data2016[i]=graphArr[3];
          this.data2017[i]=graphArr[2];
          this.data2018[i]=graphArr[1];
          this.data2019[i]=graphArr[0];
          ///-------------------------------------
        }
      }
      //console.log(this.result);
    });
  }



  calculate(valueArr:any[]): number{  // Postfix calculator
    let postfix:any = [] ; // postfix expresstion

    // convert infix expression to postfix
    let stack:any = [] ; // stack
    for(let i=0; i<valueArr.length; i++){
      if ( !isNaN(valueArr[i])) {  // case :  number
        postfix[postfix.length] =valueArr[i]; // save

      }else if(valueArr[i] == "("){  // case : (
        stack[stack.length] = valueArr[i]; // push in stack

      }else if(valueArr[i] == ")"){  // case : )
        for(let j=stack.length-1;j>=0;j--){
          if(stack[j]!="("){ postfix[postfix.length] = stack[j]; stack[j]=null; } // pop stack, save
          else {stack[j]=null; break;}
        }

      }else{                             // case : +, -, *, /
        stack[stack.length] = valueArr[i]; // push in stack
      }
      //console.log("expression: "+postfix+", stack: "+stack);
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
