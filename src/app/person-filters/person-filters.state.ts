import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';

export class SetFamilyFilters {
  public static readonly type = '[Genotype] Set familyFilters values';
  public constructor(public filters: object[]) {}
}

export class SetPersonFilters {
  public static readonly type = '[Genotype] Set personFilters values';
  public constructor(public filters: object[]) {}
}

export interface PersonFiltersModel {
  familyFilters: object[];
  personFilters: object[];
}

@State<PersonFiltersModel>({
  name: 'personFiltersState',
  defaults: {
    familyFilters: [],
    personFilters: [],
  },
})
@Injectable()
export class PersonFiltersState {
  @Action(SetFamilyFilters)
  public setFamilyFilters(ctx: StateContext<PersonFiltersModel>, action: SetFamilyFilters): void {
    ctx.patchState({
      familyFilters: [...action.filters],
      personFilters: ctx.getState().personFilters
    });
  }

  @Action(SetPersonFilters)
  public setPersonFilters(ctx: StateContext<PersonFiltersModel>, action: SetPersonFilters): void {
    ctx.patchState({
      familyFilters: ctx.getState().familyFilters,
      personFilters: [...action.filters]
    });
  }
}
