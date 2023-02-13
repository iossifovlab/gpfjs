import { Component, OnChanges, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { UniqueFamilyVariantsFilterState, SetUniqueFamilyVariantsFilter } from './unique-family-variants-filter.state';
import { Validate, IsDefined } from 'class-validator';
import { StatefulComponent } from '../common/stateful-component';
import { DatasetsService } from 'app/datasets/datasets.service';

@Component({
  selector: 'gpf-unique-family-variants-filter',
  templateUrl: './unique-family-variants-filter.component.html',
  styleUrls: ['./unique-family-variants-filter.component.css']
})
export class UniqueFamilyVariantsFilterComponent extends StatefulComponent implements OnChanges, OnInit {
  @Validate(IsDefined, {message: 'Must have a boolean value.'})
  private enabled = false;

  public constructor(protected store: Store, public datasetService: DatasetsService) {
    super(store, UniqueFamilyVariantsFilterState, 'uniqueFamilyVariantsFilter');
  }

  public ngOnChanges(): void {
    this.store.selectOnce(UniqueFamilyVariantsFilterState).subscribe(state => {
      this.enabled = state.uniqueFamilyVariantsFilter;
    });
  }

  public ngOnInit(): void {
    // restore state
    this.store.selectOnce(UniqueFamilyVariantsFilterState).subscribe(state => {
      this.filterValue = state.uniqueFamilyVariants;
    });
  }

  public get filterValue(): boolean {
    return this.enabled;
  }

  public set filterValue(value: boolean) {
    this.enabled = value;
    this.store.dispatch(new SetUniqueFamilyVariantsFilter(this.enabled));
  }
}
