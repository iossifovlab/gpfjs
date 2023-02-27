import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { GpfTableColumnComponent } from 'app/table/component/column.component';
import { SortInfo } from '../../table.component';

@Component({
  selector: 'gpf-table-view-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpfTableHeaderComponent {
  @Input() public columns: any;
  @Output() public sortingInfoChange = new EventEmitter();
  @Input() public sortingInfo: SortInfo;

  public get subheadersCount(): number[] {
    if (this.columns.first) {
      const length: number = this.columns.first.headerChildren.length;
      return Array(length).fill(0).map((x, i) => i);
    }
    return [];
  }

  public getMaxWidth(column): number {
    if (column.columnMaxWidth) {
      return column.columnMaxWidth;
    }
  }

  public getWidth(column: GpfTableColumnComponent): string {
    let width: string;
    if (column === null) {
      width = null;
    } else if (column.columnWidth) {
      width = column.columnWidth;
    }
    return width;
  }
}
