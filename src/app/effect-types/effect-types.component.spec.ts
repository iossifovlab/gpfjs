import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EffectTypesComponent } from './effect-types.component';
import { EffecttypesColumnComponent } from './effect-types-column.component';
import { ALL, CODING, GENOTYPE_BROWSER_INITIAL_VALUES, LGDS, NONSYNONYMOUS, UTRS } from './effect-types';
import { of } from 'rxjs';
import { addEffectType, effectTypesReducer, removeEffectType, setEffectTypes } from './effect-types.state';
import { Store, StoreModule } from '@ngrx/store';

describe('EffectTypesComponent', () => {
  let component: EffectTypesComponent;
  let fixture: ComponentFixture<EffectTypesComponent>;
  let store: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EffectTypesComponent,
        EffecttypesColumnComponent,
      ],
      imports: [StoreModule.forRoot({effectTypes: effectTypesReducer})],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EffectTypesComponent);
    component = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    store = TestBed.inject(Store);
    jest.spyOn(store, 'select').mockReturnValue(of(['value1', 'value2', 'value3']));
    jest.spyOn(store, 'dispatch').mockImplementation();

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    component.ngOnInit();

    const expectedEffectTypes = new Set(['value1', 'value2', 'value3']);
    expect(component.selectedEffectTypes).toStrictEqual(expectedEffectTypes);

    component.ngOnInit();
  });

  it('should get effect types from state', () => {
    jest.spyOn(store, 'select').mockReturnValueOnce(of(GENOTYPE_BROWSER_INITIAL_VALUES));
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();

    expect(component.selectedEffectTypes).toStrictEqual(GENOTYPE_BROWSER_INITIAL_VALUES);

    expect(dispatchSpy).not.toHaveBeenCalledWith();
  });

  it('should initialize button groups', () => {
    component.effectTypesButtons = undefined;
    component['initButtonGroups']();
    const expectedMap = new Map();
    expectedMap
      .set('ALL', ALL)
      .set('NONE', new Set())
      .set('LGDS', LGDS)
      .set('CODING', CODING)
      .set('NONSYNONYMOUS', NONSYNONYMOUS)
      .set('UTRS', UTRS);
    expect(component.effectTypesButtons).toStrictEqual(expectedMap);
  });

  it('should update variant types', () => {
    component.selectedEffectTypes = undefined;
    component['store'] = { dispatch: () => null } as never;
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
    const mockSet = new Set(['value1', 'value2', 'value3']);

    component.setEffectTypes(mockSet);

    expect(component.selectedEffectTypes).toStrictEqual(mockSet);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, setEffectTypes({ effectTypes: [...mockSet]}));
  });

  it('should effect type change', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.selectedEffectTypes = new Set();

    component.onEffectTypeChange({checked: true, effectType: 'effectType1'});
    expect(component.selectedEffectTypes).toStrictEqual(new Set(['effectType1']));
    expect(dispatchSpy).toHaveBeenCalledWith(addEffectType({effectType: 'effectType1'}));

    component.onEffectTypeChange({checked: true, effectType: 'effectType2'});
    expect(component.selectedEffectTypes).toStrictEqual(new Set(['effectType1', 'effectType2']));
    expect(dispatchSpy).toHaveBeenCalledWith(addEffectType({effectType: 'effectType2'}));


    component.onEffectTypeChange({checked: false, effectType: 'effectType1'});
    expect(component.selectedEffectTypes).toStrictEqual(new Set(['effectType2']));
    expect(dispatchSpy).toHaveBeenCalledWith(removeEffectType({effectType: 'effectType1'}));


    component.onEffectTypeChange({checked: false, effectType: 'effectType1'});
    expect(component.selectedEffectTypes).toStrictEqual(new Set(['effectType2']));
    expect(dispatchSpy).toHaveBeenCalledWith(removeEffectType({effectType: 'effectType1'}));


    component.onEffectTypeChange({checked: true, effectType: 'effectType2'});
    expect(component.selectedEffectTypes).toStrictEqual(new Set(['effectType2']));
    expect(dispatchSpy).toHaveBeenCalledWith(addEffectType({effectType: 'effectType2'}));


    component.onEffectTypeChange({checked: false, effectType: 'effectType2'});
    expect(component.selectedEffectTypes).toStrictEqual(new Set([]));
    expect(dispatchSpy).toHaveBeenCalledWith(removeEffectType({effectType: 'effectType2'}));


    component.onEffectTypeChange({checked: false, effectType: 'effectType2'});
    expect(component.selectedEffectTypes).toStrictEqual(new Set([]));
    expect(dispatchSpy).toHaveBeenCalledWith(removeEffectType({effectType: 'effectType2'}));
  });

  it('should not modify original effect group values', () => {
    const initial = new Set(['testEffect']);
    component.setEffectTypes(initial);
    component.onEffectTypeChange({effectType: 'newTestEffect', checked: true});
    // component has properly selected new effect
    expect(component.selectedEffectTypes).toStrictEqual(new Set(['testEffect', 'newTestEffect']));
    // but the original set is not modified
    expect(initial).toStrictEqual(new Set(['testEffect']));
  });

  it('should select LGDs button group', () => {
    const setEffectTypesSpy = jest.spyOn(component, 'setEffectTypes');

    component.selectButtonGroup('LGDS');

    expect(setEffectTypesSpy).toHaveBeenCalledWith(new Set([
      'frame-shift',
      'nonsense',
      'splice-site',
      'no-frame-shift-newStop',
    ]));
  });
});
