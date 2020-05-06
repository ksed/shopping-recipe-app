import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective,
        DropdownDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective,
        DropdownDirective,
        CommonModule
    ],
    entryComponents: [AlertComponent]
})
export class SharedModule {}
