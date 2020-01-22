//RESTfull API service
//connecting to web server in Raspberry PI

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaspberrypiService {
  PHP_API_SERVER = "http://192.168.0.19/angular-pi-app";  // Static IP address for web server in Raspberry PI

  constructor(
    private httpClient: HttpClient
  ) { }

  sendStringToPI(str1: string, str2:string): Observable<string>{ // send strings to Raspberry PI server
      return this.httpClient.get<string>(`${this.PHP_API_SERVER}/display_lcd.php/?str1=${str1}&str2=${str2}`);
  }
}
