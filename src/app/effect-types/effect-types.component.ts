import { Component, OnInit, Input } from '@angular/core';
import { EffectTypes, CODING, NONCODING, CNV, ALL, LGDS, NONSYNONYMOUS, UTRS } from './effect-types';
import { ValidateNested } from 'class-validator';
import { Store } from '@ngxs/store';
import {
  EffecttypesState, AddEffectType, RemoveEffectType, SetEffectTypes, EffectTypeModel
} from './effect-types.state';
import { StatefulComponent } from 'app/common/stateful-component';

@Component({
  selector: 'gpf-effect-types',
  templateUrl: './effect-types.component.html',
  styleUrls: ['./effect-types.component.css'],
})
export class EffectTypesComponent extends StatefulComponent implements OnInit {
  @Input() public variantTypes: Set<string> = new Set();

  public codingColumn: Set<string> = CODING;
  public nonCodingColumn: Set<string> = NONCODING;
  public cnvColumn: Set<string> = CNV;

  @ValidateNested()
  public effectTypes = new EffectTypes();
  public effectTypesButtons: Map<string, Set<string>>;

  public constructor(protected store: Store) {
    super(store, EffecttypesState, 'effectTypes');
    this.initButtonGroups();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.store.selectOnce(EffecttypesState).subscribe(state => {
      const effectTypes = (state as EffectTypeModel).effectTypes;
      if (effectTypes.length) {
        for (const effectType of effectTypes) {
          this.onEffectTypeChange({checked: true, effectType: effectType});
        }
      } else {
        this.selectInitialValues();
      }
    });
  }

  public selectInitialValues(): void {
    this.selectButtonGroup('LGDS');
  }

  private initButtonGroups(): void {
    this.effectTypesButtons = new Map<string, Set<string>>();
    this.effectTypesButtons.set('ALL', new Set(ALL));
    this.effectTypesButtons.set('NONE', new Set());
    this.effectTypesButtons.set('LGDS', new Set(LGDS));
    this.effectTypesButtons.set('CODING', new Set(CODING));
    this.effectTypesButtons.set('NONSYNONYMOUS', new Set(NONSYNONYMOUS));
    this.effectTypesButtons.set('UTRS', new Set(UTRS));
  }

  public selectButtonGroup(groupId: string): void {
    const effectTypes: Set<string> = this.effectTypesButtons.get(groupId);
    this.setEffectTypes(effectTypes);
  }

  public setEffectTypes(effectTypes: Set<string>): void {
    this.effectTypes.selected = new Set(effectTypes);
    this.store.dispatch(new SetEffectTypes(this.effectTypes.selected));
  }

  public onEffectTypeChange(value: {checked: boolean; effectType: string}): void {
    if (value.checked && !this.effectTypes.selected.has(value.effectType)) {
      this.effectTypes.selected.add(value.effectType);
      this.store.dispatch(new AddEffectType(value.effectType));
    } else if (!value.checked && this.effectTypes.selected.has(value.effectType)) {
      this.effectTypes.selected.delete(value.effectType);
      this.store.dispatch(new RemoveEffectType(value.effectType));
    }
  }
}
