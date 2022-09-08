import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-new-polygon',
  templateUrl: './new-polygon.component.html',
  styleUrls: ['./new-polygon.component.css']
})
export class NewPolygonComponent implements OnInit {

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();

  constructor(
    // public data: DataService
  ) { }

  ngOnInit() {
    console.log("wefew");
  }

  onCancelPress() {
    console.log("biuo");
    this.notifyParent.emit('pants');
  }

}
