import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TaskQuery } from '../models/task-query.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { TaskModel } from '../models/task.model';
import { SnackBarService } from '../../../shared/services/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {
  constructor(
    private http: HttpClient,
    private snackbarService: SnackBarService) { }

  // private _url = "http://localhost:8080/api/tasks";
  private _url = "https://localhost:7189/api/tasks";

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(`${this._url}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbarService.displayError(`An error ocurred fetching the tasks. ${err.status === 400 ? err.error : ''}`);
          throw err;
        })
      );
  }

  getPaginated<T>(query: TaskQuery): Observable<PaginatedResponse<T>> {
    return this.http.post<PaginatedResponse<T>>(`${this._url}/get-paginated`, query)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbarService.displayError(`An error ocurred fetching the tasks. ${err.status === 400 ? err.error : ''}`);
          throw err;
        })
      );
  }

  add(taskItem: TaskModel): Observable<TaskModel> {
    return this.http.post<TaskModel>(this._url, taskItem)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbarService.displayError(`An error ocurred saving the task. ${err.status === 400 ? err.error : ''}`);
          throw err;
        })
      );
  }
}
