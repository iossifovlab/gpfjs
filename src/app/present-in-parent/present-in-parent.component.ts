import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Validate, ValidateIf, Min, Max } from 'class-validator';
import { IsLessThanOrEqual } from '../utils/is-less-than-validator';
import { IsMoreThanOrEqual } from '../utils/is-more-than-validator';
import { SetNotEmpty } from '../utils/set.validators';
import { ComponentValidator } from 'app/common/component-validator';
import { selectPresentInParent, setPresentInParent } from './present-in-parent.state';
import { take } from 'rxjs';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'gpf-present-in-parent',
  templateUrl: './present-in-parent.component.html',
  styleUrls: ['./present-in-parent.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresentInParentComponent extends ComponentValidator implements OnInit {
  @ValidateIf((o: PresentInParentComponent) => o.selectedRarityType !== 'ultraRare' && o.rarityIntervalStart !== null)
  @Min(0) @Max(100)
  @IsLessThanOrEqual('rarityIntervalEnd')
  public rarityIntervalStart = 0;

  @ValidateIf((o: PresentInParentComponent) => o.selectedRarityType !== 'ultraRare' && o.rarityIntervalEnd !== null)
  @Min(0) @Max(100)
  @IsMoreThanOrEqual('rarityIntervalStart')
  public rarityIntervalEnd = 1;

  public presentInParentValues: Set<string> = new Set([
    'mother only', 'father only', 'mother and father', 'neither'
  ]);

  @Validate(SetNotEmpty, { message: 'Select at least one.' })
  public selectedValues: Set<string> = new Set();

  public rarityTypes: Set<string> = new Set([
    'all', 'rare', 'ultraRare', 'interval'
  ]);
  public selectedRarityType = '';
  @Input() public hasDenovo = false;
  @Input() public hasZygosity: boolean;

  public constructor(protected store: Store) {
    super(store, 'presentInParent', selectPresentInParent);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.store.select(selectPresentInParent).pipe(take(1)).subscribe(state => {
      if (!state.presentInParent.length) {
        if (this.hasDenovo) {
          this.selectedValues = new Set(['neither']);
        } else {
          this.selectedValues = cloneDeep(this.presentInParentValues);
        }
        this.updatePresentInParent(this.selectedValues);
      } else {
        // restore state
        this.selectedValues = new Set([...state.presentInParent]);
        this.selectedRarityType = state.rarity.rarityType;
        this.rarityIntervalStart = state.rarity.rarityIntervalStart;
        this.rarityIntervalEnd = state.rarity.rarityIntervalEnd;
        this.updateState();
      }
    });
  }

  public updatePresentInParent(newValues: Set<string>): void {
    this.selectedValues = newValues;
    if (newValues.size === 0) {
      // restore default rarity types
      this.rarityIntervalEnd = 1;
      this.rarityIntervalStart = 0;
      this.selectedRarityType = 'ultraRare';
    } else if (this.selectedValues.size === 1 && this.selectedValues.has('neither')) {
      // 'neither' does not allow for selecting a rarity type
      this.selectedRarityType = '';
    } else if (this.selectedRarityType === '') {
      // otherwise, set 'ultraRare' as default rarity type
      this.selectedRarityType = 'ultraRare';
    }
    this.updateState();
  }

  public updateRarityIntervalStart(newValue: number): void {
    this.rarityIntervalStart = newValue;
    this.updateState();
  }

  public updateRarityIntervalEnd(newValue: number): void {
    this.rarityIntervalEnd = newValue;
    this.updateState();
  }

  public updateRarityType(newValue: string): void {
    this.selectedRarityType = newValue;
    this.rarityIntervalEnd = 1;
    this.rarityIntervalStart = 0;
    this.updateState();
  }

  public updateState(): void {
    this.store.dispatch(setPresentInParent({
      presentInParent: {
        presentInParent: [...this.selectedValues],
        rarity: {
          rarityType: this.selectedRarityType,
          rarityIntervalStart: this.rarityIntervalStart,
          rarityIntervalEnd: this.rarityIntervalEnd,
        }
      }
    }));
  }
}
