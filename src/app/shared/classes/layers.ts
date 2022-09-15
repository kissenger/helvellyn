import { TsBoundingBox } from '../interfaces';



export class ActiveLayers {

  private _layers: Array<{layerId: string, bbox: TsBoundingBox}>;

  constructor() {
    this._layers = [];
  }

  public add(layerId: string, bbox: TsBoundingBox = null) {
    this._layers.push({layerId, bbox});
  }

  public clear() {
    this._layers = [];
    return [];
  }

  public remove(layerId: string) {
    return this._layers.filter( layer => layer.layerId !== layerId );
  }

  public get length() {
    return this._layers.length;
  }

  public get outerBoundingBox(): TsBoundingBox {
    return this._layers.reduce( (arr, layer) => [
      Math.min(arr[0], layer.bbox[0]),
      Math.min(arr[1], layer.bbox[1]),
      Math.max(arr[2], layer.bbox[2]),
      Math.max(arr[3], layer.bbox[3]) ],
      [180, 90, -180, -90] );
  //   return this._layers.reduce( (arr, layer) =>
  //     box,
  //     [180, 90, -180, -90] );
  }



  public get getAll() {
    return this._layers;
  }

  public get topLayer() {
    return this._layers[0];
  }

}
