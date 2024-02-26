
import { BehaviorSubject, Observable,  catchError, tap, throwError } from 'rxjs';
import {  HttpClient } from '@angular/common/http';
import { environment } from '../enviroments/enviroment';
import { Injectable } from '@angular/core';
import { Users } from 'src/models/models';


@Injectable({
  providedIn: 'root',
})
export class ApiService{
  private users: BehaviorSubject<Users> = new BehaviorSubject<Users>({ users: [] });
  constructor(private http: HttpClient) {}

  getUsers(): Observable<Users> {
    return this.http.get<Users>(`${environment.url}/task1`).pipe(
      tap(data => this.users.next(data)),
      catchError(error => {
        console.error('Error fetching clients:', error);
        return throwError(error);
      })
    );
  };
}
