import { Component } from '@angular/core';
import { faBowlFood, faCamera, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

import { SharedModule } from '@shared/shared.module';

import { AbstractModalComponent } from '@components/abstract/modal.abstract';

import { Ingredient } from '@models/ingredient';
import { Recipe } from '@models/recipe';
import { IngredientService } from '@services/ingredient.service';
import { APIResp } from '@models/api-resp';
import { lastValueFrom } from 'rxjs';
import { RecipeService } from '@services/recipe.service';

@Component({
  selector: 'modal-create-recipe',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.scss'
})
export class CreateRecipeComponent extends AbstractModalComponent {

  recipeTitle: string = '';
  photo: string = '';
  ingredientSearch: string = '';
  ingredients: Array<Ingredient> = [];
  selectedIngredients: Array<Ingredient> = [];

  // Icons
  faBowlFood = faBowlFood;
  faCamera = faCamera;
  faFloppyDisk = faFloppyDisk;

  constructor(
    private ingredientService: IngredientService,
    private recipeService: RecipeService

  ) {
    super();
  }

  override onOpen(): void {
    this.ingredientService.getAll().subscribe((resp: APIResp) => {
      this.ingredients = resp.data;
    });
  }

  changedPhoto(e: any) {
    const files = e.target.files;
    console.log(files);
  }

  createRecipe(): void {
    if (this.recipeTitle !== '' && this.selectedIngredients.length > 0) {
      let ingredients: Array<string> = [];
      for (let ingredient of this.selectedIngredients) ingredients.push(ingredient.name);
      const recipe: Recipe = {
        _id: 'new',
        title: this.recipeTitle,
        ingredients
      };
      if (this.photo) recipe.photo = this.photo;
      this.recipeService.create(recipe).subscribe();
      this.selectedIngredients = [];
      this.recipeTitle = '';
      this.photo = '';
      this.close();
    }
  }

  async onKeydown(e: KeyboardEvent): Promise<void> {
    switch (e.key) {
      case 'Enter':
        const ingredient$ = this.ingredientService.create(this.ingredientSearch);
        const resp: APIResp = await lastValueFrom(ingredient$);
        const ingredient = resp.data;
        this.ingredients.push(ingredient);
        this.selectIngredient(this.ingredients[this.ingredients.length - 1]);
        break;
    }
  }

  selectIngredient(ingredient: Ingredient): void {
    let i = 0, found = false;
    while (!found && i < this.ingredients.length) {
      if (this.ingredients[i].id === ingredient.id) found = true;
      else i++;
    }
    if (found) {
      this.selectedIngredients.push(ingredient);
      this.ingredients.splice(i, 1);
    }
    this.ingredientSearch = '';
  }

  removeIngredient(i: number): void {
    const ingredient: Ingredient = this.selectedIngredients[i];
    this.ingredients.push(ingredient);
    this.selectedIngredients.splice(i, 1);
  }

  getIngredients(): Array<Ingredient> {
    let ingredients: Array<Ingredient> = [];
    if (this.ingredientSearch.length === 0) {
      ingredients = JSON.parse(JSON.stringify(this.ingredients));
    } else {
      ingredients = this.ingredients.filter((ingredient: Ingredient) => {
        return ingredient.name.startsWith(this.ingredientSearch);
      });
    }
    ingredients.slice(0, 5);
    return ingredients;
  }

}
