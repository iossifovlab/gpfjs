import { createReducer, createAction, on, props, createFeatureSelector } from '@ngrx/store';
import { cloneDeep } from 'lodash';
export const initialState: string[] = [];

export const selectExpandedDatasets = createFeatureSelector<string[]>('expandedDatasets');

export const setExpandedDatasets = createAction(
  '[Genotype] Set expanded datasets',
  props<{ expandedDatasets: string[] }>()
);

export const resetExpandedDatasets = createAction(
  '[Errors] Reset expanded datasets',
);

export const expandedDatasetsReducer = createReducer(
  initialState,
  on(setExpandedDatasets, (state, {expandedDatasets}) => cloneDeep(expandedDatasets)),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(resetExpandedDatasets, (state) => cloneDeep(initialState)),
);
