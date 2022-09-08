import { TsGeometry } from './../interfaces';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class MapService {

//   constructor() { }
// }

import * as globals from 'src/app/shared/globals';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { TsCoordinate, TsFeature, TsFeatureCollection, TsBoundingBox, TsMapType } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
// import * as MapboxDraw from 'mapbox-gl-draw';
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";

@Injectable({
  providedIn: 'root'
})

export class MapService {

  private mapboxToken: string = environment.MAPBOX_TOKEN;
  private mapboxStyles = {
    terrain: environment.MAPBOX_STYLE_TERRAIN,
    satellite: environment.MAPBOX_STYLE_SATELLITE
  };
  public isDev = !environment.production;

  private drawInstance = new MapboxDraw({
    displayControlsDefault: false,
    controls: {},
    defaultMode: 'draw_polygon'
  });

  // private drawInstance: MapboxDraw;

  public tsMap: mapboxgl.Map;
  private mapDefaultType: TsMapType = 'terrain';
  private padding = {
    wideScreen: {top: 50, left: 50, bottom: 50, right: 300},
    narrowScreen: {top: 10, left: 10, bottom: 10, right: 10}
  };
  public mouseoverPopup: mapboxgl.Popup;


  constructor(
    public http: HttpService
  ) {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(this.mapboxToken);
    // this.windowWidth = this.screenSize.width;
    // this.screenSize.resize.subscribe( (newWidth: {width: number, height: number}) => {
    //   this.windowWidth = newWidth.width;
    // });
  }

  get context() {
    return this.tsMap;
  }

  newMap(startPosition?: TsCoordinate, startZoom?: number, boundingBox?: TsBoundingBox) {

    // setting the center and zoom here prevents flying animation - zoom gets over-ridden when the map bounds are set below
    return new Promise<mapboxgl.Map>( (resolve, reject) => {

      let mapCentre: TsCoordinate;
      let mapZoom: number;

      if ( startPosition ) {
        // if location is provided, use that (zoom not needed as map will resize when path is added)
        mapCentre = startPosition;
        mapZoom = startZoom ? startZoom : globals.defaultMapView.zoom;

      } else {
        // otherwise fall back to default values
        mapCentre = globals.defaultMapView.centre;
        mapZoom = globals.defaultMapView.zoom;

      }



      if (!mapboxgl.supported()) {

        alert('Your browser does not support Mapbox GL');

      } else {

        this.tsMap = new mapboxgl.Map({
          container: 'map',
          style: this.mapboxStyles[this.mapDefaultType],
          center: mapCentre,
          zoom: mapZoom
        });
        this.tsMap.doubleClickZoom.disable();
        // if ( boundingBox ) {
        //   this.bounds = boundingBox;
        // }


      }

    });

  }

  drawPolygon() {

    return new Promise<TsFeature>((res, rej) => {

      this.tsMap.addControl(this.drawInstance);

      this.tsMap.once('draw.create', (e) => {
        this.tsMap.removeControl(this.drawInstance);
        res(e.features);


      });
    })


  }

  // adds a polygon and deletes the MapboxDraw poygon if the id is supplied
  addPolygonSource(data) {

    console.log(data);
    const layerId = data.features[0].id;
    console.log(layerId);

    this.tsMap.addSource(layerId, {type: 'geojson', data});
    this.tsMap.addLayer({
      id: layerId,
      type: 'line',
      source: layerId,
      paint: {
        'line-color': '#000',
        'line-width': 3
      }
    });


  }

}
