import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonFilterComponent } from './person-filter.component';
import { Store, StoreModule } from '@ngrx/store';
import { MeasureHistogram } from 'app/measures/measures';
import { CategoricalHistogram, NumberHistogram } from 'app/utils/histogram-types';
import { MeasureHistogramState } from 'app/person-filters-selector/measure-histogram.state';
import { resetErrors, setErrors } from 'app/common/errors.state';

describe('PersonFilterComponent', () => {
  let component: PersonFilterComponent;
  let fixture: ComponentFixture<PersonFilterComponent>;
  let store: Store;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [PersonFilterComponent],
      imports: [StoreModule.forRoot()],
    }).compileComponents();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(PersonFilterComponent);
    component = fixture.componentInstance;

    component.selectedMeasure = new MeasureHistogram(
      'm1',
      new NumberHistogram([1, 2], [4, 5], 'larger1', 'smaller1', 7, 11, true, true),
      ''
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categorical histogram of a selected measure', () => {
    const switchCategoricalHistogramViewSpy = jest.spyOn(component, 'switchCategoricalHistogramView');

    component.selectedMeasure = new MeasureHistogram(
      'm1',
      new CategoricalHistogram(
        [
          {name: 'name1', value: 10},
          {name: 'name2', value: 20},
          {name: 'name3', value: 30},
          {name: 'name4', value: 40},
          {name: 'name5', value: 50},
        ],
        ['name1', 'name2', 'name3', 'name4', 'name5'],
        'large value descriptions',
        'small value descriptions',
        true,
        0,
        10
      ),
      ''
    );

    component.ngOnInit();

    expect(switchCategoricalHistogramViewSpy).not.toHaveBeenCalled();
  });

  it('should calculate number of bars to display', () => {
    const switchCategoricalHistogramViewSpy = jest.spyOn(component, 'switchCategoricalHistogramView');

    component.selectedMeasure = new MeasureHistogram(
      'm1',
      new CategoricalHistogram(
        [
          {name: 'name1', value: 10},
          {name: 'name2', value: 20},
          {name: 'name3', value: 30},
          {name: 'name4', value: 40},
          {name: 'name5', value: 50},
        ],
        ['name1', 'name2', 'name3', 'name4', 'name5'],
        'large value descriptions',
        'small value descriptions',
        true,
        0,
        null,
        40
      ),
      ''
    );

    component.ngOnInit();

    expect(switchCategoricalHistogramViewSpy).not.toHaveBeenCalled();
  });

  it('should open categorical dropdown selector when bars are over the limit', () => {
    const switchCategoricalHistogramViewSpy =
      jest.spyOn(component, 'switchCategoricalHistogramView').mockImplementation();

    component.selectedMeasure = new MeasureHistogram(
      'm1',
      new CategoricalHistogram(
        [
          {name: 'name1', value: 10},
          {name: 'name2', value: 20},
          {name: 'name3', value: 30},
          {name: 'name4', value: 40},
          {name: 'name5', value: 50},
        ],
        ['name1', 'name2', 'name3', 'name4', 'name5'],
        'large value descriptions',
        'small value descriptions',
        true,
        0,
        30
      ),
      ''
    );

    component.ngOnInit();

    expect(switchCategoricalHistogramViewSpy).toHaveBeenCalledWith('dropdown selector');
  });

  it('should update range start', () => {
    const updateStateEmitSpy = jest.spyOn(component.updateState, 'emit').mockImplementation();

    const localStateMock: MeasureHistogramState = {
      histogramType: 'continuous',
      measure: 'm1',
      rangeStart: 0,
      rangeEnd: 0,
      values: [],
      categoricalView: null,
      roles: null
    };
    component.localState = localStateMock;
    component.updateRangeStart(5);
    expect(component.localState.rangeStart).toBe(5);
    expect(updateStateEmitSpy).toHaveBeenCalledWith(localStateMock);
  });

  it('should update range end', () => {
    const updateStateEmitSpy = jest.spyOn(component.updateState, 'emit').mockImplementation();

    const localStateMock: MeasureHistogramState = {
      histogramType: 'continuous',
      measure: 'm1',
      rangeStart: 0,
      rangeEnd: 0,
      values: [],
      categoricalView: null,
      roles: null
    };
    component.localState = localStateMock;

    component.updateRangeEnd(10);
    expect(component.localState.rangeEnd).toBe(10);
    expect(updateStateEmitSpy).toHaveBeenCalledWith(localStateMock);
  });

  it('should get domain min and max of continuous histogram', () => {
    expect(component.domainMin).toBe(4);
    expect(component.domainMax).toBe(5);
  });

  it('should update categorical values', () => {
    const updateStateEmitSpy = jest.spyOn(component.updateState, 'emit').mockImplementation();

    const localStateMock: MeasureHistogramState = {
      histogramType: 'categorical',
      measure: 'm1',
      rangeStart: null,
      rangeEnd: null,
      values: ['val1', 'val2'],
      categoricalView: 'range selector',
      roles: null
    };
    component.localState = localStateMock;

    component.replaceCategoricalValues(['val3', 'val4']);
    expect(component.localState.values).toStrictEqual(['val3', 'val4']);
    expect(updateStateEmitSpy).toHaveBeenCalledWith(localStateMock);
  });

  it('should switch categorical histogram view to click selector and reset state', () => {
    const updateStateEmitSpy = jest.spyOn(component.updateState, 'emit').mockImplementation();

    const localStateMock: MeasureHistogramState = {
      histogramType: 'categorical',
      measure: 'm1',
      rangeStart: null,
      rangeEnd: null,
      values: ['val1', 'val2'],
      categoricalView: 'range selector',
      roles: null
    };
    component.localState = localStateMock;

    component.switchCategoricalHistogramView('click selector');
    expect(component.localState.values).toStrictEqual([]);
    expect(updateStateEmitSpy).toHaveBeenCalledWith(localStateMock);
  });

  it('should switch categorical histogram view to dropdown selector and reset state', () => {
    const updateStateEmitSpy = jest.spyOn(component.updateState, 'emit').mockImplementation();

    const localStateMock: MeasureHistogramState = {
      histogramType: 'categorical',
      measure: 'm1',
      rangeStart: null,
      rangeEnd: null,
      values: ['val1', 'val2'],
      categoricalView: 'range selector',
      roles: null
    };
    component.localState = localStateMock;

    component.switchCategoricalHistogramView('click selector');
    expect(component.localState.values).toStrictEqual([]);
    expect(updateStateEmitSpy).toHaveBeenCalledWith(localStateMock);
  });

  it('should switch categorical histogram view to range selector and reset state', () => {
    const updateStateEmitSpy = jest.spyOn(component.updateState, 'emit').mockImplementation();

    component.selectedMeasure = new MeasureHistogram(
      'm1',
      new CategoricalHistogram(
        [
          {name: 'name1', value: 10},
          {name: 'name2', value: 20},
          {name: 'name3', value: 30},
          {name: 'name4', value: 40},
          {name: 'name5', value: 50},
        ],
        ['name1', 'name2', 'name3', 'name4', 'name5'],
        'large value descriptions',
        'small value descriptions',
        true,
        0,
        30
      ),
      ''
    );

    const localStateMock: MeasureHistogramState = {
      histogramType: 'categorical',
      measure: 'm1',
      rangeStart: null,
      rangeEnd: null,
      values: ['val1', 'val2'],
      categoricalView: 'click selector',
      roles: null
    };
    component.localState = localStateMock;

    component.switchCategoricalHistogramView('range selector');
    expect(component.localState.values).toStrictEqual(['name1', 'name2', 'name3', 'name4', 'name5']);
    expect(updateStateEmitSpy).toHaveBeenCalledWith(localStateMock);
  });

  it('should switch categorical histogram view to the same view and should not reset current state', () => {
    const updateStateEmitSpy = jest.spyOn(component.updateState, 'emit').mockImplementation();

    const localStateMock: MeasureHistogramState = {
      histogramType: 'categorical',
      measure: 'm1',
      rangeStart: null,
      rangeEnd: null,
      values: ['val1', 'val2'],
      categoricalView: 'range selector',
      roles: null
    };
    component.localState = localStateMock;

    component.switchCategoricalHistogramView('range selector');
    expect(component.localState.values).toStrictEqual(['val1', 'val2']);
    expect(updateStateEmitSpy).not.toHaveBeenCalledWith(localStateMock);
  });

  it('should validate state by checking measure in family fitlers', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();

    component.isFamilyFilters = true;

    const localStateMock: MeasureHistogramState = {
      histogramType: 'categorical',
      measure: null,
      rangeStart: null,
      rangeEnd: null,
      values: ['val1, val2'],
      categoricalView: 'range selector',
      roles: null
    };
    component.initialState = localStateMock;
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(setErrors({
      errors: {
        componentId: 'familyFilters: m1', errors: ['Empty pheno measures are invalid.']
      }
    }));
  });

  it('should reset error state for family filters if validation is successful', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();

    component.isFamilyFilters = false;

    const localStateMock: MeasureHistogramState = {
      histogramType: 'continuous',
      measure: 'm1',
      rangeStart: 7,
      rangeEnd: 10,
      values: [],
      categoricalView: null,
      roles: null
    };
    component.initialState = localStateMock;
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(resetErrors({componentId: 'personFilters: m1'}));
  });

  it('should update list of selected roles and trigger histogram update', () => {
    const updateHistogramSpy = jest.spyOn(component.updateHistogram, 'emit');

    const localStateMock: MeasureHistogramState = {
      histogramType: 'continuous',
      measure: 'm1',
      rangeStart: 7,
      rangeEnd: 10,
      values: [],
      categoricalView: null,
      roles: null
    };
    component.localState = localStateMock;

    const roles = ['mom', 'dad'];
    component.replaceSelectedRoles(roles);
    expect(component.localState.roles).toStrictEqual(roles);
    expect(updateHistogramSpy).toHaveBeenCalledWith({ measureId: 'm1', roles: roles });
  });

  it('should save null to state when selected roles are empty list', () => {
    const updateHistogramSpy = jest.spyOn(component.updateHistogram, 'emit');

    const localStateMock: MeasureHistogramState = {
      histogramType: 'continuous',
      measure: 'm1',
      rangeStart: 7,
      rangeEnd: 10,
      values: [],
      categoricalView: null,
      roles: ['mom', 'dad']
    };
    component.localState = localStateMock;

    const roles: string[] = [];
    component.replaceSelectedRoles(roles);
    expect(component.localState.roles).toStrictEqual([]);
    expect(updateHistogramSpy).toHaveBeenCalledWith({ measureId: 'm1', roles: null });
  });

  it('should dispatch histogram errors to state in family fitlers', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();

    component.isFamilyFilters = true;

    const localStateMock: MeasureHistogramState = {
      histogramType: 'continuous',
      measure: 'm1',
      rangeStart: 7,
      rangeEnd: 10,
      values: [],
      categoricalView: null,
      roles: ['mom', 'dad']
    };
    component.localState = localStateMock;

    component.setHistogramValidationErrors(['Please select at least one value.']);
    expect(component.histogramErrors).toStrictEqual(['Please select at least one value.']);

    expect(dispatchSpy).toHaveBeenCalledWith(setErrors({
      errors: {
        componentId: 'familyFilters: m1', errors: ['Please select at least one value.']
      }
    }));
  });

  it('should dispatch histogram errors and person filter errors to state in family fitlers', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockImplementation();

    component.isFamilyFilters = true;

    const localStateMock: MeasureHistogramState = {
      histogramType: 'continuous',
      measure: null,
      rangeStart: 7,
      rangeEnd: 10,
      values: [],
      categoricalView: null,
      roles: ['mom', 'dad']
    };
    component.localState = localStateMock;

    component.setHistogramValidationErrors(['Please select at least one value.']);

    expect(dispatchSpy).toHaveBeenCalledWith(setErrors({
      errors: {
        componentId: 'familyFilters: m1', errors: [
          'Please select at least one value.',
          'Empty pheno measures are invalid.'
        ]
      }
    }));
  });
});
