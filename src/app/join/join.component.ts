import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';
import { Join } from '../api.userinfo';


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  newjoin: Join = {id: null, password: null, name:null};
  msgalert: String = null;

  constructor(
    private apiService: ApiService,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  tryjoin(form){
      this.apiService.createAccount(this.newjoin).subscribe((result: string)=>{
        console.log(result);
        if(result['status']=='join'){ // if Join successful
          this.router.navigate(["login"]);
        }else if(result['status']=='error'){  // if duplicated id exists
          this.msgalert="Sorry, the ID is aleady taken. Please use different ID";
        }else {      // unexprected error
          this.msgalert="Sorry, unexprected error occured. Please try it again";
        }
      });
  }
}
