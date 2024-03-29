import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EffecttypesColumnComponent } from './effect-types-column.component';

describe('EffecttypesColumnComponent', () => {
  let component: EffecttypesColumnComponent;
  let fixture: ComponentFixture<EffecttypesColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EffecttypesColumnComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EffecttypesColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check effect type', () => {
    const emitSpy = jest.spyOn(component.effectTypeEvent, 'emit');
    component.effectTypesLabels = new Set(['label1', 'label2', 'label3']);

    component.checkEffectType('label0', true);
    component.checkEffectType('label0', false);
    component.checkEffectType('label4', true);
    component.checkEffectType('label4', false);
    expect(emitSpy).not.toHaveBeenCalled();

    component.checkEffectType('label1', true);
    component.checkEffectType('label1', false);
    component.checkEffectType('label2', true);
    component.checkEffectType('label2', false);
    component.checkEffectType('label3', true);
    component.checkEffectType('label3', false);
    expect(emitSpy.mock.calls).toEqual([ // eslint-disable-line
      [{ effectType: 'label1', checked: true }],
      [{ effectType: 'label1', checked: false }],
      [{ effectType: 'label2', checked: true }],
      [{ effectType: 'label2', checked: false }],
      [{ effectType: 'label3', checked: true }],
      [{ effectType: 'label3', checked: false }],
    ]);
  });
});
