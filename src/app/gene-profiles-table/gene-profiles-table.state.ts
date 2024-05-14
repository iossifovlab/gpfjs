import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';

export class SetGeneProfilesTabs {
  public static readonly type = '[Genotype] Set gene profiles tabs';
  public constructor(
    public openedTabs: Set<string>
  ) {}
}
export class SetGeneProfilesSearchValue {
  public static readonly type = '[Genotype] Set gene profiles search value';
  public constructor(
    public searchValue: string
  ) {}
}
export class SetGeneProfilesHighlightedRows {
  public static readonly type = '[Genotype] Set gene profiles highlighted table rows';
  public constructor(
    public highlightedRows: Set<string>
  ) {}
}

export class SetGeneProfilesSortBy {
  public static readonly type = '[Genotype] Set gene profiles sorting element';
  public constructor(
    public sortBy: string
  ) {}
}

export class SetGeneProfilesOrderBy {
  public static readonly type = '[Genotype] Set gene profiles sort order';
  public constructor(
    public orderBy: string
  ) {}
}

export class SetGeneProfilesHeader {
  public static readonly type = '[Genotype] Set gene profiles config';
  public constructor(
    public headerLeaves: string[]
  ) {}
}

export interface GeneProfilesModel {
    openedTabs: Set<string>;
    searchValue: string;
    highlightedRows: Set<string>;
    sortBy: string;
    orderBy: string;
    headerLeaves: string[];
}

@State<GeneProfilesModel>({
  name: 'geneProfilesState',
  defaults: {
    openedTabs: new Set<string>(),
    searchValue: '',
    highlightedRows: new Set<string>(),
    sortBy: '',
    orderBy: 'desc',
    headerLeaves: []
  },
})
@Injectable()
export class GeneProfilesState {
  @Action(SetGeneProfilesTabs)
  public setGeneProfilesTabs(
    ctx: StateContext<GeneProfilesModel>,
    action: SetGeneProfilesTabs
  ): void {
    ctx.patchState({
      openedTabs: action.openedTabs
    });
  }

  @Action(SetGeneProfilesSearchValue)
  public setGeneProfilesSearchValue(
    ctx: StateContext<GeneProfilesModel>,
    action: SetGeneProfilesSearchValue
  ): void {
    ctx.patchState({
      searchValue: action.searchValue
    });
  }

  @Action(SetGeneProfilesHighlightedRows)
  public setGeneProfilesHighlightedRows(
    ctx: StateContext<GeneProfilesModel>,
    action: SetGeneProfilesHighlightedRows
  ): void {
    ctx.patchState({
      highlightedRows: action.highlightedRows
    });
  }

  @Action(SetGeneProfilesSortBy)
  public setGeneProfilesSortBy(
    ctx: StateContext<GeneProfilesModel>,
    action: SetGeneProfilesSortBy
  ): void {
    ctx.patchState({
      sortBy: action.sortBy
    });
  }

  @Action(SetGeneProfilesOrderBy)
  public setGeneProfilesOrderBy(
    ctx: StateContext<GeneProfilesModel>,
    action: SetGeneProfilesOrderBy
  ): void {
    ctx.patchState({
      orderBy: action.orderBy
    });
  }

  @Action(SetGeneProfilesHeader)
  public setGeneProfilesConfig(
    ctx: StateContext<GeneProfilesModel>,
    action: SetGeneProfilesHeader
  ): void {
    ctx.patchState({
      headerLeaves: action.headerLeaves
    });
  }
}