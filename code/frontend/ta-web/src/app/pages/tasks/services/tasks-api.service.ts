import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TaskQuery } from '../models/task-query.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { TaskModel } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {
  constructor(private http: HttpClient) { }

  // private _url = "http://localhost:8080/api/tasks";
  private _url = "https://localhost:7189/api/tasks";

  getTasks(): Observable<any> {
    return this.http.get(`${this._url}`);
  }

  getPaginated<T>(query: TaskQuery): Observable<PaginatedResponse<T>> {
    return this.http.post<PaginatedResponse<T>>(`${this._url}/get-paginated`, query);
  }

  add(taskItem: TaskModel): Observable<any> {
    return this.http.post(this._url, taskItem)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      );
  }
}
