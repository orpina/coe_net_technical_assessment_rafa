import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(private http: HttpClient) { }

  private _url = "http://localhost:8080/api/users";

  getUsers(): Observable<any> {
    return this.http.get(`${this._url}`);
  }
}
