
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
import { TsCoordinate, TsFeature, TsBoundingBox, TsMapType } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';
// import * as MapboxDraw from 'mapbox-gl-draw';
import * as MapboxDraw from "@mapbox/mapbox-gl-draw";
import { DataService } from './data.service';
import { ActiveLayers } from 'src/app/shared/classes/layers';

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
  public layers = new ActiveLayers();
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
    public http: HttpService,
    public data: DataService,
  ) {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(this.mapboxToken);
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

        this.tsMap.on('moveend', (event) => {
          console.log(this.getMapBounds())
          this.data.mapBoundsEmitter.emit( this.getMapBounds() );
        });
      }


      this.tsMap.once('load', () => {
        resolve(this.tsMap);
        this.data.mapBoundsEmitter.emit(this.getMapBounds());
      });

    });

  }

  public getMapBounds() {
    const mapBounds = this.tsMap.getBounds();
    return<TsBoundingBox> [mapBounds.getSouthWest().lng, mapBounds.getSouthWest().lat, mapBounds.getNorthEast().lng, mapBounds.getNorthEast().lat];
  }



  drawPolygon() {
    return new Promise<TsFeature>((res, rej) => {
      this.tsMap.addControl(this.drawInstance);
      this.tsMap.once('draw.create', (e) => {
        res(e.features);
      });
    })
  }

  removeDrawnPolygon() {
    this.tsMap.removeControl(this.drawInstance);
  }

  // polygon is a single TsFeature
  addPolygons(polys: any) {

    const layerId = 'polygons';
    console.log(polys);
    // this.layers.add(layerId);
    this.tsMap.addSource(layerId, {type: 'geojson', data: polys});

    // Line layer bounding the polygon
    this.tsMap.addLayer({
      id: layerId + 'line',
      type: 'line',
      source: layerId,
      paint: {'line-color':
          ['get', 'displayColour',
            [ 'at',
              ['-', ['length', ['get', 'status']], 1],
            ['get', 'status'] ]
          ],
        'line-width': 1
      }
    });

    // Fill layer
    this.tsMap.addLayer({
      id: layerId + 'fill',
      type: 'fill',
      source: layerId,
      paint: { 'fill-color':
                ['get', 'displayColour',
                  [ 'at',
                    ['-', ['length', ['get', 'status']], 1],
                  ['get', 'status'] ]
                ],
              'fill-opacity': 0.1
             }
    });

    // Label layer
    this.tsMap.addLayer({
      id: layerId + 'symbol',
      type: 'symbol',
      source: layerId,
      layout: {'text-field':
                ['get', 'polygonName'],
               'text-anchor': 'center'
              }
    });

  }

  removePolygons(layerId: string) {
    if (this.tsMap.getLayer(layerId + 'line')) {
      this.tsMap.removeLayer(layerId + 'line');
    }
    if (this.tsMap.getLayer(layerId + 'fill')) {
      this.tsMap.removeLayer(layerId + 'fill');
    }
    if (this.tsMap.getLayer(layerId + 'symbol')) {
      this.tsMap.removeLayer(layerId + 'symbol');
    }
    if (this.tsMap.getSource(layerId)) {
      this.tsMap.removeSource(layerId);
    }

  }


}
