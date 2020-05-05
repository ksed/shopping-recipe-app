import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  
  constructor(private recipeStorage: DataStorageService, private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe( user => { this.isAuthenticated = !!user; } );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSaveData() { this.recipeStorage.storeRecipes(); }

  onFetchData() { this.recipeStorage.fetchRecipes().subscribe(); }

  onLogout() { this.authService.logout(); }
}
