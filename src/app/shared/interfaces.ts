

/**
 * Map display options
 */

import { StringMap } from "@angular/compiler/src/compiler_facade_interface";

export interface TsLineStyle {
    lineWidth?: number;
    lineColour?: string;
    lineOpacity?: number;
}

export interface TsMapView {
  centre: TsCoordinate;
  zoom: number;
}
export type TsMapType = 'terrain' | 'satellite';

export interface TsCoordinate {
  lat: number;
  lng: number;
}

/**
 * User details
 */
export interface TsUser {
  userName: string;
  homeLngLat?: TsCoordinate;
  isHomeLocSet?: boolean;
  email: string;
  password?: string;
  _id?: string;
}

/**
 * GeoJSON Definition
 * Largely stolen from here: ...\node_modules\@types\geojson\index.d.ts
 * But adapted to ensure we get geoJSON formed in the correct manner from the back-end
 * Also see spec: https://tools.ietf.org/html/rfc7946
 */


 export interface TsFeatureCollection {
  type: 'FeatureCollection';
  features: TsFeature[];
  // bbox?: TsBoundingBox;
}

export interface TsFeature {
  // bbox?: TsBoundingBox;
  id?: string; // mapbox
  type: 'Feature';
  geometry: TsGeometry;
  properties: TsProperties | null;
}

// TsPosition provides a position as array of numbers in format [lng, lat]
export type TsPosition = number[];

export type TsGeometry = TsPoint | TsLineString | TsPolygon;

// TsPoint defines a point in geoJSON format
export interface TsPoint{
  type: 'Point';
  coordinates: TsPosition;
}

// TsLineString defines a line in geoJSON format
export interface TsLineString {
  type: 'LineString';
  coordinates: TsPosition[];
}

// TsLineString defines a line in geoJSON format
export interface TsPolygon{
  type: 'Polygon';
  coordinates: TsPosition[];
}

// TsBoundingBox provides a boundingbox array in the form [minLng, minLat, maxLng, maxLng]
export type TsBoundingBox = [number, number, number, number];





interface TsProperties {
  createdByUserId: string,
  createdByUserName: string,
  creationDate: Date,
  polygonName: string,

  status: [TsPolygonStatus]
}

interface TsPolygonStatus {
  timestamp: Date,
  userId: string,
  userName: string,
  status: string,
  displayColour: string,
}

