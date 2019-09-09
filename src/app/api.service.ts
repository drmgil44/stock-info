import { Injectable } from '@angular/core';
import {HttpClinet} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private HttpClinet: HttpClinet) { }
}
