import { Recipe } from '@models/recipe';

export class Day {
  _id: string;
  date: Date;
  label: string;
  recipes: Array<Recipe | null>;
}
