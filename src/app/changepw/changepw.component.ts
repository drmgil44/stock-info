import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { UserPw } from '../api.userinfo';

@Component({
  selector: 'app-changepw',
  templateUrl: './changepw.component.html',
  styleUrls: ['./changepw.component.css']
})
export class ChangepwComponent implements OnInit {
  pwinfo: UserPw = {id: null, password: null, npassword: null};
  msgalert: String = null;
  private minPW: number = 4;

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
  ) { }

  ngOnInit() {
    let currentdata= this.jwtService.decodeData();
    this.pwinfo.id = currentdata['id'];
  }

  changePassword(form){
    if(this.pwinfo.id!=null && this.pwinfo.password!=null && this.pwinfo.npassword!=null){
      if(this.pwinfo.password.length>=this.minPW){
        this.apiService.changePassword(this.pwinfo).subscribe((result: string)=>{ // change password
          console.log(result);
          if(result['status']=='changed'){  // if password is changed
            this.msgalert="Change saved";
          }else if(result['status']=='error'){  // if password doesn't match
            this.msgalert="Curret Password is not matched";
          }else{  // unexprected error from DB
            this.msgalert="Sorry, unexprected error occured. Please try it again";
          }
          this.pwinfo.password = null;
          this.pwinfo.npassword = null;
        });
      }else{
        this.msgalert="Password must be at least four letter";
      }

    }

  }

}
