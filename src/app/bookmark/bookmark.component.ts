import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { StockService } from '../stock.service';
import { BookmarkService } from '../bookmark.service';

import { Company } from '../api.companyinfo';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {
  navigationSubscription;

  blist:Company[];  // Bookmark list
  formula:string;
  private maxformula:number = 100; // maximum length of formula

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

    this.getFormula();
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

  getFormula(){  // get formula
    let currentdata= this.jwtService.decodeData();
    this.apiService.getFormula(currentdata['id']).subscribe((result: string)=>{
      if(result['formula']!=null) this.formula = result['formula'];
      else this.formula="";
      this.bookmarkService.setFormula(result['formula'],this.blist);
    })
  }

  setFormula(form){ // save formula
    let currentdata= this.jwtService.decodeData();
    if(this.formula.length<this.maxformula){
      this.apiService.setFormula(currentdata['id'],this.formula).subscribe((result: string)=>{
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
}
