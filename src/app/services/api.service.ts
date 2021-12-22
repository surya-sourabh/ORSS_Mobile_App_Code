import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  deviceState: string;
  constructor(private httpClient: HttpClient) {

  }



  ngOnInit() {

  }
  getData(): Observable<any> {
    return this.httpClient.get("http://192.168.4.1")
  }

  apiEndPoint = "http://192.168.4.1";


}