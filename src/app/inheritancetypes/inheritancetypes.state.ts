import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';

export class SetInheritanceTypes {
  public static readonly type = '[Genotype] Set inheritanceType values';
  public constructor(public inheritanceTypes: Set<string>) {}
}

export interface InheritancetypesModel {
  inheritanceTypes: string[];
}

@State<InheritancetypesModel>({
  name: 'inheritancetypesState',
  defaults: {
    inheritanceTypes: []
  },
})
@Injectable()
export class InheritancetypesState {
  @Action(SetInheritanceTypes)
  public setInheritanceTypes(ctx: StateContext<InheritancetypesModel>, action: SetInheritanceTypes): void {
    ctx.patchState({
      inheritanceTypes: [...action.inheritanceTypes]
    });
  }
}
