import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd   } from '@angular/router';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { StockService } from '../stock.service';

import { Company, CompanySearch } from '../api.companyinfo';

@Component({
  selector: 'app-companysearch',
  templateUrl: './companysearch.component.html',
  styleUrls: ['./companysearch.component.css']
})
export class CompanysearchComponent implements OnInit {
  navigationSubscription;

  companies: CompanySearch[] ;
  pnumber: number[] = [1,2,3,4,5]; // page number
  cnumber: number ;        // current page number
  minnumber: number=1;    // min page number
  islogin:boolean;        // false - hide bookmark
  searchStr:string=null;   // search word

  constructor(
    private router: Router,
    private apiService: ApiService,
    private jwtService:JwtService,
    private stockService:StockService,

  ) {
      // subscribe to the router events - storing the subscription
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });
  }

  ngOnInit() {
    this.islogin=this.jwtService.isAuthenicated();  // if token is authenicated
    this.cnumber=1;
    if(this.stockService.getSearch()!=null) this.searchStr=this.stockService.getSearch();
    this.getSearchResult(this.cnumber);
  }

  ngOnDestroy() { // unsubscribe
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

  setIslogin(islogin: boolean){ // for hiding bookmark button
    this.islogin=islogin;
  }

  setCompanis(){
  }

  getSearchResult(pnumber: number){
      if(this.searchStr!=null){
        this.apiService.getSearchResult(pnumber,this.searchStr).subscribe((cSearch: CompanySearch[])=>{
          console.log(cSearch);
          this.companies = cSearch;
          this.cnumber=pnumber;
          this.getPagenumber(); // refresh page number
      });
    }
  }

  getPagenumber(){  // get page number
      if(this.cnumber < this.minnumber+2){this.pnumber=[this.minnumber,this.minnumber+1,this.minnumber+2,this.minnumber+3,this.minnumber+4];}

    else {
      this.pnumber[0]=this.cnumber-2;
      this.pnumber[1]=this.cnumber-1;
      this.pnumber[2]=this.cnumber;
      this.pnumber[3]=this.cnumber+1;
      this.pnumber[4]=this.cnumber+2;
    }
  }

  getCompanyInfo(selectedticker,selectedcompany){ // save seleteced ticker to show company information
    this.stockService.setTicker(selectedticker);
    this.stockService.setCompany(selectedcompany);
    this.router.navigate(["cinfo"]); // rediect to company info
  }
  
  setBookmark(ticker){  // save bookmark
    this.islogin=this.jwtService.isAuthenicated();  // if token is authenicated
    if(this.islogin==true){ // if token is valid
      console.log();
    }else{   // if the token is not vaild
      alert("You need to log in first");
    }
  }
}
