import { ContentChildren, Component, QueryList } from '@angular/core';
import { GpfTableSubheaderComponent } from './subheader.component';

@Component({
  selector: 'gpf-table-header',
  template: '',
})
export class GpfTableContentHeaderComponent extends GpfTableSubheaderComponent {
  @ContentChildren(GpfTableSubheaderComponent) subcolumnsChildren: QueryList<GpfTableSubheaderComponent>;
}
