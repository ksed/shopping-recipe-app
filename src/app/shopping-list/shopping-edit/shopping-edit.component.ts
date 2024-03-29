import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient-model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({ name: this.editedItem.name, amount: this.editedItem.amount });
      }
    );
  }

  ngOnDestroy() { this.subscription.unsubscribe(); }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else if (form.valid) {
      this.slService.addIngredient(newIngredient);
    }
    this.onClearForm();
  }

  onClearForm() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDeleteItem() {
    if (this.editMode) {
      this.slService.removeIngredient(this.editedItemIndex);
    }
    this.onClearForm();
  }

}
