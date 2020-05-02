import { Component } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent {

  constructor(private recipeStorage: DataStorageService) {}

  onSaveData() { this.recipeStorage.storeRecipes(); }

  onFetchData() { this.recipeStorage.fetchRecipes().subscribe(); }
}
