import {Routes} from '@angular/router';
import {FocusComponent} from "./focus/focus.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'focus/:id', component: FocusComponent
  }
];
