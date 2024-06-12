import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})

export class IngredientService {

  baseURL: string = `${environment.apiURL}/ingredients`;

  constructor(
    private http: HttpClient
  ) {

  }

  getAll(): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  create(name: string): Observable<any> {
    const data = {name};
    return this.http.post<Observable<any>>(`${this.baseURL}/`, data).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

}
