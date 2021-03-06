import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SortInfo } from '../../table.component';


@Component({
  selector: 'gpf-table-view-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class GpfTableHeaderComponent {
  @Input() columns: any;
  @Output() sortingInfoChange = new EventEmitter();
  @Input() sortingInfo: SortInfo;

  get subheadersCount() {
    if (this.columns.first) {
        const length = this.columns.first.headerChildren.length;
        return Array(length).fill(0).map((x, i) => i);
    }
    return [];
  }

  getWidth(column) {
    if (column.columnWidth) {
      return column.columnWidth;
    }
    return null;
  }
}
