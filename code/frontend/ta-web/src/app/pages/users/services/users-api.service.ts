import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { UserModel } from '../models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(
    private http: HttpClient,
    private snackbarService: SnackBarService) { }

  private _url = environment.connections.api.assessmentApi;
  private _endpoint = "users";

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this._url}${this._endpoint}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        this.snackbarService.displayError(`An error ocurred fetching the users. ${err.status === 400 ? err.error : ''}`);
        throw err;
      })
    );
  }
}
