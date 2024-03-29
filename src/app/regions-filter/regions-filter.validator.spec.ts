import { waitForAsync } from '@angular/core/testing';
import { RegionsFilterValidator } from './regions-filter.validator';
import { ValidationArguments } from 'class-validator';

describe('RegionsFilterValidator', () => {
  let component: RegionsFilterValidator;

  beforeEach(waitForAsync(() => {
    component = new RegionsFilterValidator();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if regions filter input is valid for hg19', () => {
    const args = {object: {genome: 'hg19',}} as ValidationArguments;

    expect(component.validate('', args)).toBeNull();
    expect(component.validate('   ', args)).toBe(false);
    expect(component.validate('false', args)).toBe(false);

    expect(component.validate('0', args)).toBe(true);
    expect(component.validate('14', args)).toBe(true);
    expect(component.validate('X', args)).toBe(true);
    expect(component.validate('Y', args)).toBe(true);

    expect(component.validate('  X:76710815 ', args)).toBe(true);
    expect(component.validate('  Y:76710815 ', args)).toBe(true);
    expect(component.validate('  9:76710815 ', args)).toBe(true);
    expect(component.validate('  9:76710815-76710830 ', args)).toBe(true);
    expect(component.validate('10:113,141,317', args)).toBe(true);
    expect(component.validate('10:113,141,317-113,141,318 ', args)).toBe(true);
    expect(component.validate('  9:76710815-76710830 \n11:10169163-10169314  ' +
      '\n\n\n12:50344524-50352664', args)).toBe(true);
    expect(component.validate('  9:76710815-76710830, X:10169163-10169314, Y:50344524-50352664', args)).toBe(true);
    expect(component.validate('  9:76710815-76710830, 11:10169163-10169314, 12:50344524-50352664', args)).toBe(true);
    expect(component.validate('  9:76710815-76710830, 11:10169,163-10169,314,12:50344524-50352664', args)).toBe(true);
    expect(component.validate('  9:76710,815-76710830, 11:10,169,163-10169,314,12:50344524-50352664', args)).toBe(true);

    expect(component.validate('  9:76710833-76710830 ', args)).toBe(false);
    expect(component.validate('  9:76710833-76710830:320-345 ', args)).toBe(false);
    expect(component.validate('  9:76710833-76710\n830:320-345 ', args)).toBe(false);
    expect(component.validate('  9:76710833-76710830+12:420-345 ', args)).toBe(false);

    expect(component.validate('23', args)).toBe(false);
    expect(component.validate('9:', args)).toBe(false);
    expect(component.validate('X12', args)).toBe(false);
    expect(component.validate('Y1', args)).toBe(false);
    expect(component.validate('chr9:76710815-76710830 ', args)).toBe(false);
    expect(component.validate('  9:76710815-76710830, 11:10169,163-101693,14,12:50344524-50352664', args)).toBe(false);
    expect(component.validate('  9:76710815-76710830, 11:10169,163-101,69314,12:50344524-50352664', args)).toBe(false);
    expect(component.validate('  9:76710815-76710830, 11:10169,163-101,69314,,12:50344524-50352664', args)).toBe(false);
  });

  it('should check if regions filter input is valid for hg38', () => {
    const args = {object: {genome: 'hg38',}} as ValidationArguments;

    expect(component.validate('', args)).toBeNull();
    expect(component.validate('   ', args)).toBe(false);
    expect(component.validate('false', args)).toBe(false);

    expect(component.validate('chr0', args)).toBe(true);
    expect(component.validate('chr17', args)).toBe(true);
    expect(component.validate('chrX', args)).toBe(true);
    expect(component.validate('chrY', args)).toBe(true);

    expect(component.validate('  chrX:76710815 ', args)).toBe(true);
    expect(component.validate('  chrY:76710815 ', args)).toBe(true);
    expect(component.validate('  chr9:76710815 ', args)).toBe(true);
    expect(component.validate('  chr9:76710815-76710830 ', args)).toBe(true);
    expect(component.validate('chr10:113,141,317', args)).toBe(true);
    expect(component.validate('chr10:113,141,317-113,141,318 ', args)).toBe(true);
    expect(component.validate('chr9', args)).toBe(true);
    expect(component.validate('  chr9:76710815-76710830 \nchr11:10169163-10169314  ' +
      '\nchr12:50344524-50352664', args)).toBe(true);

    expect(component.validate('  chr9:76710815-76710830 , chrX:10169163-10169314,  ' +
      'chrY:50344524-50352664', args)).toBe(true);

    expect(component.validate('  chr9:76710815-76710830, ' +
      'chr11:10169,163-10169,314,chr12:50344524-50352664', args)).toBe(true);

    expect(component.validate('  chr9:76710,815-76710830, ' +
      'chr11:10,169,163-10169,314,chr12:50344524-50352664', args)).toBe(true);

    expect(component.validate('  chr9:76710815-76710830 \n11:10169163-10169314  ' +
      '\nchr12:50344524-50352664', args)).toBe(false);

    expect(component.validate('  chr9:76710844-76710830 ', args)).toBe(false);
    expect(component.validate('chr23', args)).toBe(false);
    expect(component.validate('chr9:', args)).toBe(false);
    expect(component.validate('chrX12', args)).toBe(false);
    expect(component.validate('chrY1', args)).toBe(false);
    expect(component.validate('9:76710815-76710830 ', args)).toBe(false);

    expect(component.validate('chr9:76710815-76710830, ' +
      'chr11:10169,163-101693,14,chr12:50344524-50352664', args)).toBe(false);

    expect(component.validate('chr9:76710815-76710830, ' +
      '11:10169,163-101,69314,12:50344524-50352664', args)).toBe(false);

    expect(component.validate('  chr9:76710815-76710830, ' +
      'chr11:10169,163-101,69314,,chr12:50344524-50352664', args)).toBe(false);
  });
});
