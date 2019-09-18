import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  companies: Company[];
  pnumber: number[] = [1,2,3,4,5]; // page number
  cnumber: number ;        // current page number
  maxnumber=4267;         // max page number
  minnumber=1;            // min page number
  islogin:boolean;        // false - hide bookmark

  constructor(
    private router: Router,
    private apiService: ApiService,
    private jwtService:JwtService,
    private stockService:StockService,
  ) { }

  ngOnInit() {
    this.islogin=this.jwtService.isAuthenicated();  // if token is authenicated
    this.cnumber=this.minnumber;   // reset page number
    this.getCompanyList(this.cnumber);
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
    if(this.cnumber < this.minnumber+2){this.pnumber=[this.minnumber,this.minnumber+1,this.minnumber+2,this.minnumber+3,this.minnumber+4];}
    else if(this.cnumber > this.maxnumber-2){this.pnumber=[this.maxnumber-4,this.maxnumber-3,this.maxnumber-2,this.maxnumber-1,this.maxnumber];}
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
