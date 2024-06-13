import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Day } from '@models/day';


@Injectable({
  providedIn: 'root',
})

export class DayService {

  baseURL: string = `${environment.apiURL}/days`;

  constructor(
    private http: HttpClient
  ) {

  }

  getPeriod(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get<Observable<any>>(`${this.baseURL}/?start=${startDate.toISOString()}&end=${endDate.toISOString()}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  removeRecipe(dayID: string, index: number): Observable<any> {
    return this.http.delete<Observable<any>>(`${this.baseURL}/${dayID}/recipes/${index}`).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

  create(day: Day): Observable<any> {
    const data: any = {date: day.date, recipes: []};
    for (let recipe of day.recipes) {
      if (recipe) {
        data.recipes.push(recipe._id);
      } else {
        data.recipes.push(null);
      }
    }
    return this.http.post<Observable<any>>(`${this.baseURL}/`, data).pipe(
      catchError(e => throwError(() => new Error(e)))
    )
  }

}
