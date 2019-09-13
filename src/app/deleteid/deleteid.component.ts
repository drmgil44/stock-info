import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { UserPw } from '../api.userinfo';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-deleteid',
  templateUrl: './deleteid.component.html',
  styleUrls: ['./deleteid.component.css']
})
export class DeleteidComponent implements OnInit {
  deleteinfo: UserPw = {id: null, password: null, npassword: null};
  msgalert: String = null;

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private appComponent:AppComponent,
    private router: Router,
  ) { }

  ngOnInit() {
    let currentdata= this.jwtService.decodeData();
    this.deleteinfo.id = currentdata['id'];
  }

  deleteAccount(form){
    this.apiService.deleteAccount(this.deleteinfo).subscribe((result: string)=>{  // delete Account
      console.log(result['status']);
      if(result['status']=='deleted'){  // if account is deleted
        this.msgalert="Deleted Account";
        this.router.navigate([""]);    // redirect to home
        this.appComponent.setIslogin(false); // hide My Account menu
        this.jwtService.removeToken();
      }else if(result['status']=='error'){  // if password doesn't match
        this.msgalert="Curret Password is not matched";
      }else{  // unexprected error from DB
        this.msgalert="Sorry, unexprected error occured. Please try it again";
      }
    });
  }

}
