import { TsGeometry } from './../../shared/interfaces';
import { TsPosition, TsCoordinate, TsFeature } from 'src/app/shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/shared/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(
    public map: MapService
  ) { }

  async ngOnInit() {
    await this.map.newMap();
  }

  async onNewPolyPress() {

    const feature: TsFeature = await this.map.drawPolygon();

    this.map.addPolygonSource({
      type: 'FeatureCollection',
      features: feature
    });

  }

}
