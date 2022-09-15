
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './main/header/header.component';
import { MapComponent } from './main/map/map.component';
import { FeedComponent } from './main/feed/feed.component';
import { DetailsComponent } from './main/map/details/details.component';
import { NewPolygonComponent } from './main/map/new-polygon/new-polygon.component';

import { HttpService } from './shared/services/http.service';
import { MapService } from './shared/services/map.service';
import { DataService } from './shared/services/data.service';
import { GeoJsonPipe } from './shared/pipes/geojson.pipe';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    MapComponent,
    FeedComponent,
    DetailsComponent,
    GeoJsonPipe,
    NewPolygonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    HttpService,
    MapService,
    DataService,
    HttpClientModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
