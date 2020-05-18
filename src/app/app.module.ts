import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TeamsComponent} from './teams/teams.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SpielweiseComponent} from './spielweise/spielweise.component';
import { StartContainerComponent } from './start/start.container.component';
import { Store } from './state/store';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'start',
    component: StartContainerComponent
  },
  {
    path: 'jass',
    component: TeamsComponent
  },
  {
    path: 'spielweise',
    component: SpielweiseComponent
  },
  { path: '',
    redirectTo: '/jass',
    pathMatch: 'full'
  }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TeamsComponent,
    SpielweiseComponent,
    StartContainerComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [Store],
  bootstrap: [AppComponent]
})
export class AppModule { }
