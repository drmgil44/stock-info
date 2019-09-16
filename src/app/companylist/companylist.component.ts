import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { Company } from '../api.companyinfo';

@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})
export class CompanylistComponent implements OnInit {
  companies: Company[];
  pnumber: number[] = [1,2,3,4,5]; // page number
  cnumber: number ; // current page number
  maxnumber=4755; // max page number
  minnumber=1;  // min page number
  islogin:boolean;  // false - hide bookmark

  constructor(private apiService: ApiService, private jwtService:JwtService) { }

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
        console.log(this.companies);
        this.cnumber=pnumber;
        this.getPagenumber(); // refresh page number
      })
    }
  }

  getPagenumber(){  // get page number
    if(this.cnumber < this.minnumber+2){this.pnumber=[1,2,3,4,5];}
    else if(this.cnumber > this.maxnumber-2){this.pnumber=[4751,4752,4753,4754,4755];}
    else {
      this.pnumber[0]=this.cnumber-2;
      this.pnumber[1]=this.cnumber-1;
      this.pnumber[2]=this.cnumber;
      this.pnumber[3]=this.cnumber+1;
      this.pnumber[4]=this.cnumber+2;
    }
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
