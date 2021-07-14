import { Component, OnInit } from '@angular/core';
import { FamilyIds } from './family-ids';
import { ValidateNested } from 'class-validator';
import { Store } from '@ngxs/store';
import { SetFamilyIds, FamilyIdsState} from './family-ids.state';
import { StatefulComponent } from 'app/common/stateful-component';

@Component({
  selector: 'gpf-family-ids',
  templateUrl: './family-ids.component.html',
  styleUrls: ['./family-ids.component.css'],
})
export class FamilyIdsComponent extends StatefulComponent implements OnInit {

  @ValidateNested()
  familyIds = new FamilyIds();

  constructor(protected store: Store) {
    super(store, FamilyIdsState, 'familyIds');
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.selectOnce(state => state.familyIdsState).subscribe(state => {
      // restore state
      this.familyIds.familyIds = state.familyIds.join('\n');
    });
  }

  setFamilyIds(familyIds: string) {
    const result = familyIds
      .split(/[,\s]/)
      .filter(s => s !== '');
    this.familyIds.familyIds = familyIds;
    this.store.dispatch(new SetFamilyIds(result));
  }
}
