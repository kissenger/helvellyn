import { EventEmitter, Injectable } from '@angular/core';
// import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  public cancelPolygonEmitter = new EventEmitter();

}
