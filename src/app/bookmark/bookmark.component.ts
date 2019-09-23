import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { ApiService } from '../api.service';
import { StockService } from '../stock.service';

import { Company } from '../api.companyinfo';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {
  blist:Company[];  // Bookmark list

  constructor(
    private router: Router,
    private apiService: ApiService,
    private stockService:StockService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.blist=this.route.snapshot.data['bookmark'];  // resolve
  }

  deleteBookmark(){ // remove bookmark 

  }

  getCompanyInfo(selectedticker,selectedcompany){ // save seleteced ticker to show company information
    this.stockService.setTicker(selectedticker);
    this.stockService.setCompany(selectedcompany);
    this.router.navigate(["cinfo"]); // rediect to company info
  }
}
