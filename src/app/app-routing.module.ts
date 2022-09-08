import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './main/feed/feed.component';
import { MainComponent } from './main/main.component';
import { MapComponent } from './main/map/map.component';


const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'prefix'},
  { path: '', component: MainComponent,
    children: [
      { path: 'map', component: MapComponent},
      { path: 'feed', component: FeedComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
