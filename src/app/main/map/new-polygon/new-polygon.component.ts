import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-new-polygon',
  templateUrl: './new-polygon.component.html',
  styleUrls: ['./new-polygon.component.css']
})
export class NewPolygonComponent implements OnInit {

  @Input() notifyDrawingComplete: string;
  @Output() notifySubmit: EventEmitter<any> = new EventEmitter();
  @Output() notifyCancel: EventEmitter<any> = new EventEmitter();

  public polyName: string = '';
  // public enableSubmit: boolean = false;

  constructor(
  ) { }

  ngOnInit() {
  }

  enableSubmit() {
    return (this.notifyDrawingComplete === 'false' || this.polyName.length === 0);
  }

  onSubmit() {
    this.notifySubmit.emit(this.polyName);
  }

  onCancel() {
    this.notifyCancel.emit();
  }

}
