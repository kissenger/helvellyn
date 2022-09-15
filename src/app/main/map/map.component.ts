import { HttpService } from './../../shared/services/http.service';
import { TsBoundingBox, TsGeometry } from './../../shared/interfaces';
import { TsPosition, TsCoordinate, TsFeature, TsFeatureCollection } from 'src/app/shared/interfaces';
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
  // private tsMap: mapboxgl.Map;
  private polyFeature: TsFeature;
  private bounds: TsBoundingBox;
  private httpSubscription: Subscription;
  private mapUpdateSubscription: Subscription;

  constructor(
    public map: MapService,
    public http: HttpService,
    public data: DataService
  ) { }

  async ngOnInit() {

    this.mapUpdateSubscription = this.data.mapBoundsEmitter.subscribe( async (bounds: TsBoundingBox) => {
      this.bounds = bounds;
      await this.updatePolygons(bounds);
    })

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

  newPolyCancelled() {
    this.isNewPoly = false;
    this.map.removeDrawnPolygon();
  }

  newPolyConfirmed(polygonName: string) {
    this.isNewPoly = false;
    const now = new Date(Date.now());
    const createdByUserId = '000';
    const createdByUserName = 'tbc';

    this.map.removeDrawnPolygon();

    let polygon: TsFeature = this.polyFeature[0];

    //colours will be:
    // black = no status
    // red = no passable or passible only with great diffculty, inconveinece
    // amber = passable but inconvenient or suboptimal eg missing path, very muddy, cows in field etc
    // green = well marked, good condition, no obstacles
    polygon.properties = {
      createdByUserId,
      createdByUserName,
      creationDate: new Date(Date.now()),
      polygonName,
      status: [{
        timestamp: new Date(Date.now()),
        userId: createdByUserId,
        userName: createdByUserName,
        status: 'New polygon created',
        displayColour: 'blue'
      }]
    }
    delete polygon.id;

    // this.map.addPolygonSource(this.polyFeature[0]);
    // this.http.savePolygon(polygon);

    this.httpSubscription = this.http.savePolygon(polygon).subscribe(
      async (result) => {
        await this.updatePolygons(this.bounds);
      },
      (error) => {
        // Expect failure if self-intersecting polygon is created
        console.log(error)
        alert(error.error.myMessage);
        console.log(error.error.systemMessage) }
    );

  }

  updatePolygons(bbox: TsBoundingBox) {

    return new Promise<void>((res, rej) => {

      this.http.getPolygonsInBbox(bbox)
        .subscribe( (polys) => {
          this.map.removePolygons('polygons');
          this.map.addPolygons({type: 'FeatureCollection', features: polys});
          res();
        });

    });
  }


  ngOnDestroy() {
    if ( this.httpSubscription) { this.httpSubscription.unsubscribe(); }
    if ( this.mapUpdateSubscription) { this.mapUpdateSubscription.unsubscribe(); }
  }

}
