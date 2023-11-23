import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ILoginResponse } from '../interfaces/internalapi/ilogin-response';
@Injectable({
  providedIn: 'root'
})
export class InternalApiService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${environment.INTERNAL_API_URL}api/auth/login`, { username, password });
  }
}
