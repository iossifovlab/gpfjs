import {
  Component, AfterViewInit, Input,
  ViewChildren, ViewContainerRef, QueryList
} from '@angular/core';
import { PedigreeCounter } from '../variant-reports';
import {
  CommonReportsPedigreeCellComponent
} from '../common-reports-pedigree-cell/common-reports-pedigree-cell.component';

@Component({
  selector: '[gpf-common-reports-row]',
  templateUrl: './common-reports-row.component.html'
})
export class CommonReportsRowComponent implements AfterViewInit {
  @Input() public pedigreeGroup: PedigreeCounter[];
  @ViewChildren('gpfPedigreeHost', {read: ViewContainerRef}) public gpfPedigreeHost: QueryList<ViewContainerRef>;

  public constructor() { }

  public ngAfterViewInit(): void {
    const hosts = this.gpfPedigreeHost.toArray();
    for (let i = 0; i < this.pedigreeGroup.length; i++) {
      setTimeout(() => {
        this.createPedigree(hosts[i], this.pedigreeGroup[i]);
      }, 1);
    }
  }

  private createPedigree(viewContainerRef: ViewContainerRef, pedigree: PedigreeCounter): void {
    const component = viewContainerRef.createComponent(CommonReportsPedigreeCellComponent);
    component.instance.pedigree = pedigree;
  }
}
