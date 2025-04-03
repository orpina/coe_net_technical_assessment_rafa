import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TaskQuery } from '../models/task-query.model';
import { PaginatedResponse } from '../../../shared/models/paginated-response.model';
import { TaskModel } from '../models/task.model';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksApiService {
  constructor(
    private http: HttpClient,
    private snackbarService: SnackBarService) { }

  private _url = environment.connections.api.assessmentApi;
  private _endpoint = "tasks";

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(`${this._url}${this._endpoint}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbarService.displayError(`An error ocurred fetching the tasks. ${err.status === 400 ? err.error : ''}`);
          throw err;
        })
      );
  }

  getPaginated<T>(query: TaskQuery): Observable<PaginatedResponse<T>> {
    return this.http.post<PaginatedResponse<T>>(`${this._url}${this._endpoint}/get-paginated`, query)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbarService.displayError(`An error ocurred fetching the tasks. ${err.status === 400 ? err.error : ''}`);
          throw err;
        })
      );
  }

  add(taskItem: TaskModel): Observable<TaskModel> {
    return this.http.post<TaskModel>(`${this._url}${this._endpoint}`, taskItem)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbarService.displayError(`An error ocurred saving the task. ${err.status === 400 ? err.error : ''}`);
          throw err;
        })
      );
  }

  complete(id: number): Observable<boolean> {
    return this.http.put<boolean>(`${this._url}${this._endpoint}/${id}`, {})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.snackbarService.displayError(`An error ocurred completing the task. ${err.status === 400 ? err.error : ''}`);
          throw err;
        })
      );
  }
}
