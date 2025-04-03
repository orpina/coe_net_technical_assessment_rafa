import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {
  constructor(private http: HttpClient) { }

  private _url = "http://localhost:8080/api/tasks";

  getTasks(): Observable<any> {
    return this.http.get(`${this._url}`);
  }
}
