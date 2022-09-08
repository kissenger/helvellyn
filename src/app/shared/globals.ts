'use strict';
import { TsLineStyle, TsMapView } from 'src/app/shared/interfaces';

export const KM_TO_MILE = 0.6213711922;
export const M_TO_FT = 3.28084;
export const EXPORT_FILE_SIZE_LIMIT = 100000;
export const LONG_PATH_THRESHOLD = 1000;

// bootstrap responsive breakpoints
// https://getbootstrap.com/docs/5.0/layout/breakpoints/
export const BREAKPOINTS = {
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};

// lineStyles are defined here and on geoJSON - when specified locally they will override the geoJSON lineStyle
// export const overlayLineStyle = {lineWidth: 2, lineColour: 'blue', lineOpacity: 0.3};
export const routeLineStyle: TsLineStyle = {lineWidth: 4, lineColour: 'red', lineOpacity: 0.5};
export const overlayLineStyle: TsLineStyle = {lineWidth: 3, lineColour: 'red', lineOpacity: 0.3};
export const createRouteLineStyle: TsLineStyle = {lineWidth: 2, lineColour: 'red', lineOpacity: 1.0};
// export const routeReviewLineStyle: TsLineStyle = {lineWidth: 2, lineColour: 'red', lineOpacity: 1.0};

export const defaultMapView: TsMapView = {
    centre: {lat: 51.3471, lng: -2.2512},
    zoom: 11.5
};

