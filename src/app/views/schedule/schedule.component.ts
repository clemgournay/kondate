import { Component, ViewChild } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import moment, { Moment } from 'moment';
import 'moment/locale/ja';

import { faCalendarPlus, faCamera, faChevronLeft, faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';

import { SharedModule } from '@shared/shared.module';

import { CreateRecipeComponent } from '@components/modals/create-recipe/create-recipe.component';
import { SelectRecipeComponent } from '@components/modals/select-recipe/select-recipe.component';

import { FindItemByPropValue } from '@utils/array';

import { Day } from '@models/day';
import { DayService } from '@services/day.service';
import { APIResp } from '@models/api-resp';

import { RecipeService } from '@services/recipe.service';


@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    SharedModule,
    SelectRecipeComponent,
    CreateRecipeComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

  today: Moment;

  weekdays: Array<string> = [];

  days: Array<Day> = [];

  @ViewChild('selectRecipeModal') selectRecipeModal: SelectRecipeComponent;
  @ViewChild('createRecipeModal') createRecipeModal: CreateRecipeComponent;

  // Icons
  faCalendarPlus = faCalendarPlus;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrash = faTrash;
  faCamera = faCamera;

  constructor(
    private dayService: DayService,
    private recipeService: RecipeService
  ) {
    moment.locale('ja');
    this.today = moment();
    this.weekdays = moment.weekdays();
    this.buildWeek();
    this.getDays();
  }

  buildWeek(): void {
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const day = this.today.clone().weekday(i);

      this.days.push({
        _id: 'new',
        label: this.weekdays[i],
        date: day.toDate(),
        recipes: [null, null, null]
      });

    }
  }

  getDays(): void {
    const startDate = this.today.clone().weekday(0).toDate();
    const endDate = this.today.clone().weekday(6).toDate();
    this.dayService.getPeriod(startDate, endDate).subscribe(async (resp: APIResp) => {
      console.log('[DAYS]', resp.data);
      const days = resp.data;

      const recipeIDs = [];
      for (let day of days) {
        for (let recipeID of day.recipes) {
          if (recipeID && recipeIDs.indexOf(recipeID) === -1) recipeIDs.push(recipeID);
        }
      }

      const recipes$ = this.recipeService.getByIDs(recipeIDs);
      const recipeResp: APIResp = await lastValueFrom(recipes$);
      const recipes = recipeResp.data;

      for (let day of this.days) {
        const targetYear = day.date.getFullYear();
        const targetMonth = day.date.getMonth();
        const targetDay = day.date.getDay();

        let i = 0, found = false;
        while (!found && i < days.length) {
          const date = new Date(days[i].date);
          const year = date.getFullYear();
          const month = date.getMonth();
          const dateDay = date.getDay();
          if (year === targetYear && month == targetMonth && dateDay === targetDay) found = true;
          else i++;
        }

        if (found) {
          const targetDay = days[i];
          day._id = targetDay._id;
          console.log('FOUND TARGET DAY', targetDay);
          let index = 0;
          for (let recipeID of targetDay.recipes) {
            if (recipeID) {
              const recipe = FindItemByPropValue(recipes, '_id', recipeID);
              day.recipes[index] = recipe;
            }
            index++;
          }
        }
      }
      console.log('[SCHEDULE]', this.days);
    });
  }

  openSelectRecipeModal(day: Day, index: number): void {
    console.log(day, index);
    this.selectRecipeModal.setData(day, index);
    this.selectRecipeModal.open();
  }

  openCreateRecipe(): void {
    this.createRecipeModal.open();
  }

  removeRecipe(day: Day, i: number) {
    day.recipes[i] = null;
    this.dayService.removeRecipe(day._id, i).subscribe();
  }

  getStartDate(): Date {
    const date = this.today.clone().weekday(0);
    return date.toDate();
  }

  getEndDate(): Date {
    const date = this.today.clone().weekday(6);
    return date.toDate();
  }

  prevWeek(): void {
    this.today = this.today.clone().weekday(0).subtract(7, 'days');
    this.buildWeek();
    this.getDays();
  }

  nextWeek(): void {
    this.today = this.today.clone().weekday(0).add(7, 'days');
    this.buildWeek();
    this.getDays();
  }

}
