import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(
    private http: HttpClient,
    private snackbarService: SnackBarService) { }

  // private _url = "http://localhost:8080/api/users";
  private _url = "https://localhost:7189/api/users";

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this._url}`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        this.snackbarService.displayError(`An error ocurred fetching the users. ${err.status === 400 ? err.error : ''}`);
        throw err;
      })
    );
  }
}
