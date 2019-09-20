import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { User } from '../api.userinfo';

@Component({
  selector: 'app-myinfo',
  templateUrl: './myinfo.component.html',
  styleUrls: ['./myinfo.component.css']
})
export class MyinfoComponent implements OnInit {
  editinfo: User = {id: null, password: null, name:null, email:null};
  msgalert: String = null;

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService
  ) { }

  ngOnInit() {
    let currentdata= this.jwtService.decodeData();
    this.editinfo.id = currentdata['id'];
    this.editinfo.name = currentdata['name'];
    this.editinfo.email = currentdata['email'];
  }

  editAccount(form){
    if(this.editinfo.password!=null){
      this.apiService.editAccount(this.editinfo).subscribe((token: string)=>{ // change infomration
        console.log(token['message']);
        if(token['message']=='changed'){  // if infomration is changed
          this.apiService.setToken(token['token']); // change token (name, email)
          this.msgalert="Change saved";
        }else if(token['message']=='denied'){  // if password doesn't match
          this.msgalert="Curret Password is not matched or the email is aleardy used";
        }else{  // unexprected error from DB
          this.msgalert="Sorry, unexprected error occured. Please try it again";
        }
        this.editinfo.password = null;
      });
    }

  }

}
