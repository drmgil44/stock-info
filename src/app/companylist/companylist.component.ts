import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { StockService } from '../stock.service';

import { Company } from '../api.companyinfo';

@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})
export class CompanylistComponent implements OnInit {
  navigationSubscription;

  companies: Company[];
  pnumber: number[] = [1,2,3,4,5]; // page number
  isPnumber:boolean[] = [true,true,true,true,true,true,true]; // hide invalid page number - 5 page numbers, previous page, next page
  cnumber: number ;        // current page number
  maxnumber=4267;         // max page number
  minnumber=1;            // min page number
  islogin:boolean;        // false - hide bookmark

  constructor(
    private router: Router,
    private apiService: ApiService,
    private jwtService:JwtService,
    private stockService:StockService,
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
    this.islogin=this.jwtService.isAuthenicated();  // if token is authenicated
    this.cnumber=this.minnumber;   // reset page number
    this.getCompanyList(this.cnumber);
  }

  ngOnDestroy() { // unsubscribe
    if (this.navigationSubscription) {
       this.navigationSubscription.unsubscribe();
    }
  }

  setIslogin(islogin: boolean){ // for hiding bookmark button
    this.islogin=islogin;
  }

  getCompanyList(pnumber: number){ // get company list from DB
    if(pnumber>=this.minnumber && pnumber<=this.maxnumber){  // when the page is valid
      this.apiService.getCompanyList(pnumber).subscribe((companies: Company[])=>{
        this.companies = companies;
        this.cnumber=pnumber;
        this.getPagenumber(); // refresh page number
        console.log(pnumber);
      })
    }
  }

  getPagenumber(){  // get page number
    let startpage = (this.cnumber-(this.cnumber%5)); // get start page
    if(this.cnumber%5!=0) startpage=startpage+1;
    else startpage=startpage-4;

    for(let i=0; i<5; i++){ // get page numbers
      if(startpage+i<=this.maxnumber) { // it is not last page
        this.pnumber[i]=startpage+i;
        this.isPnumber[i]=true;
      }else{ // it is last page
        this.isPnumber[i]=false;
      }
    }

    if(this.pnumber[0]==this.minnumber) this.isPnumber[5]=false;  // it's first page - hide previous page button
    else this.isPnumber[5]=true;

    if(this.pnumber[0]+4>=this.maxnumber) this.isPnumber[6]=false; // it's last page - hide next page button
    else this.isPnumber[6]=true;
  }

  getCompanyInfo(selectedticker,selectedcompany){ // save seleteced ticker to show company information
    this.stockService.setTicker(selectedticker);
    this.stockService.setCompany(selectedcompany);
    this.router.navigate(["cinfo"]); // rediect to company info
  }


  setBookmark(ticker){  // save bookmark
    this.islogin=this.jwtService.isAuthenicated();  // if token is authenicated
    if(this.islogin==true){ // if token is valid
      let currentdata= this.jwtService.decodeData();  // get id from jwt
      this.apiService.setBookmark(currentdata['id'],ticker).subscribe((result: String)=>{ // save saveBookmark

        console.log(result);
      })
    }else{   // if the token is not vaild
      this.router.navigate(["login"]); // rediect to login
    }
  }

}
