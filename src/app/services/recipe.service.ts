import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Recipe } from '@models/recipe';


@Injectable({
  providedIn: 'root',
})

export class RecipeService {

  baseURL: string = `${environment.apiURL}/recipes`;

  constructor(
    private http: HttpClient
  ) {

  }

  getAll(): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  getByIDs(idlist: Array<string> = []): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/?ids=${idlist.join(',')}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  create(recipe: Recipe): Observable<any> {
    return this.http.post<Observable<any>>(`${this.baseURL}/`, recipe).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  remove(recipeID: string): Observable<any> {
    return this.http.delete<Observable<any>>(`${this.baseURL}/${recipeID}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

}
