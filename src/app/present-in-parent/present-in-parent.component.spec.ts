import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { PresentInParentComponent } from './present-in-parent.component';
import { SetPresentInParentValues } from './present-in-parent.state';

describe('PresentInParentComponent', () => {
  let component: PresentInParentComponent;
  let fixture: ComponentFixture<PresentInParentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PresentInParentComponent],
      imports: [NgxsModule.forRoot([], {developmentMode: true})],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(PresentInParentComponent);
    component = fixture.componentInstance;
    component['store'] = {
      selectOnce() {
        return of({
          presentInParent: ['value1', 'value2'],
          rarityType: 'rarityType',
          rarityIntervalStart: 'fakeStartNumber',
          rarityIntervalEnd: 'fakeEndNumber',
        });
      },
      dispatch() {}
    } as any;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should restore state on init', () => {
    component.ngOnInit();
    expect(component.selectedValues).toStrictEqual(new Set(['value1', 'value2']));
    expect(component.selectedRarityType).toBe('rarityType');
    expect(component.rarityIntervalStart).toBe('fakeStartNumber' as any);
    expect(component.rarityIntervalEnd).toBe('fakeEndNumber' as any);
  });

  it('should update rarity interval start', () => {
    component.rarityIntervalStart = undefined;
    component.rarityIntervalEnd = undefined;
    const updateStateSpy = jest.spyOn(component, 'updateState');

    component.updateRarityIntervalStart('fakeStartNumber' as any);
    expect(component.rarityIntervalStart).toBe('fakeStartNumber' as any);
    expect(component.rarityIntervalEnd).toBeUndefined();
    expect(updateStateSpy).toHaveBeenCalled();
  });

  it('should update rarity interval end', () => {
    component.rarityIntervalStart = undefined;
    component.rarityIntervalEnd = undefined;
    const updateStateSpy = jest.spyOn(component, 'updateState');

    component.updateRarityIntervalEnd('fakeEndNumber' as any);
    expect(component.rarityIntervalEnd).toBe('fakeEndNumber' as any);
    expect(component.rarityIntervalStart).toBeUndefined();
    expect(updateStateSpy).toHaveBeenCalled();
  });

  it('should update rarity type', () => {
    component.rarityIntervalStart = 0;
    component.rarityIntervalEnd = 2;
    const updateStateSpy = jest.spyOn(component, 'updateState');

    component.updateRarityType('rare');
    expect(component.selectedRarityType).toBe('rare');
    expect(component.rarityIntervalStart).toBe(0);
    expect(component.rarityIntervalEnd).toBe(1);
    expect(updateStateSpy).toHaveBeenCalledTimes(1);

    component.updateRarityIntervalStart(1.23);
    expect(updateStateSpy).toHaveBeenCalledTimes(2);

    component.updateRarityType('ultraRare');
    expect(component.selectedRarityType).toBe('ultraRare');
    expect(component.rarityIntervalStart).toBe(0);
    expect(component.rarityIntervalEnd).toBe(1);
    expect(updateStateSpy).toHaveBeenCalledTimes(3);
  });

  it('should update state', () => {
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');

    component.updateState();
    expect(dispatchSpy).toHaveBeenCalledWith(new SetPresentInParentValues(
      new Set(['value1', 'value2']),
      'rarityType',
      'fakeStartNumber' as any,
      'fakeEndNumber' as any,
    ));
  });
});
