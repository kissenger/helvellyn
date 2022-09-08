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
  public cancelPolySubscription: Subscription;

  constructor(
    public map: MapService,
    public data: DataService
  ) { }

  async ngOnInit() {
    await this.map.newMap();
  }

  async onNewPolyPress() {

    this.isNewPoly = true;

    const feature: TsFeature = await this.map.drawPolygon();

    this.map.addPolygonSource({
      type: 'FeatureCollection',
      features: feature
    });

  }

  cancelNewPoly(event) {
    console.log("gu")
    console.log(event)
    this.isNewPoly = false;
    this.map.cancelDrawPolygon();

  }

}
