import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractModalComponent } from '@components/abstract/modal.abstract';
import { faCalendarPlus, faMagnifyingGlass, faPlusCircle, faTrash, faUtensilSpoon } from '@fortawesome/free-solid-svg-icons';
import { APIResp } from '@models/api-resp';
import { Day } from '@models/day';
import { Recipe } from '@models/recipe';
import { DayService } from '@services/day.service';
import { RecipeService } from '@services/recipe.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'modal-select-recipe',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './select-recipe.component.html',
  styleUrl: './select-recipe.component.scss'
})
export class SelectRecipeComponent extends AbstractModalComponent {

  searchText: string = '';

  day: Day;
  index: number;
  recipes: Array<Recipe> = [];

  @Output('requestCreateRecipeModal') requestCreateRecipeModal = new EventEmitter<any>();
  @Output('selectedRecipe') selectedRecipe = new EventEmitter<Recipe>();

  // Icons
  faCalendarPlus = faCalendarPlus;
  faPlusCircle = faPlusCircle;
  faMagnifyingGlass = faMagnifyingGlass;
  faTrash = faTrash;

  constructor(
    private dayService: DayService,
    private recipeService: RecipeService
  ) {
    super();
  }

  setData(day: Day, index: number): void {
    this.day = day;
    this.index = index;
  }

  override onOpen(): void {
    this.recipeService.getAll().subscribe((resp: APIResp) => {
      this.recipes = resp.data;
    });
  }

  openCreateRecipe(): void {
    this.close();
    this.requestCreateRecipeModal.emit();
  }

  selectRecipe(recipe: Recipe): void {
    this.day.recipes[this.index] = recipe;
    this.searchText = '';
    this.close();
    this.dayService.create(this.day).subscribe((resp: APIResp) => {
      this.day._id = resp.data._id;
    });
    console.log(this.day);
  }

  removeRecipe(recipe: Recipe): void {
    let i = 0, found = false;
    while (!found && i < this.recipes.length) {
      if (this.recipes[i]._id === recipe._id) found = true;
      else i++;
    }
    if (found) {
      this.recipeService.remove(recipe._id).subscribe();
      this.recipes.splice(i, 1);
    }

  }

  getRecipes(): Array<Recipe> {
    let recipes: Array<Recipe> = [];
    if (this.searchText.length === 0) {
      recipes = JSON.parse(JSON.stringify(this.recipes));
    } else {
      recipes = this.recipes.filter((recipe: Recipe) => {
        let ingIncludes = false, i = 0;
        while (!ingIncludes && i < recipe.ingredients.length) {
          if (recipe.ingredients[i].includes(this.searchText)) ingIncludes = true;
          else i++;
        }
        return recipe.title.includes(this.searchText) || ingIncludes;
      })
    }
    return recipes;
  }

}
