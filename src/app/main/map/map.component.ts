import { TsGeometry } from './../../shared/interfaces';
import { TsPosition, TsCoordinate, TsFeature } from 'src/app/shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public isNewPoly = false;
  public isDrawingComplete:boolean = false;
  public cancelPolySubscription: Subscription;
  private polyFeature: TsFeature;

  constructor(
    public map: MapService,
    public data: DataService
  ) { }

  async ngOnInit() {
    await this.map.newMap();
  }

  // When user initiates new polygon, enable the new polygin component, and initiate draw
  // when draw is complete, let the child component know that button can be submitted
  async onNewPolyPress() {
    this.isDrawingComplete = false;
    this.isNewPoly = true;
    this.polyFeature = await this.map.drawPolygon();
    this.isDrawingComplete = true;
  }

  cancelNewPoly() {
    this.isNewPoly = false;
    this.map.removeDrawnPolygon();
  }

  confirmNewPoly(polyName: string) {
    this.isNewPoly = false;
    this.map.removeDrawnPolygon();
    this.map.addPolygonSource({
      type: 'FeatureCollection',
      features: this.polyFeature
    });
  }
}
