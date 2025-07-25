import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'numberWithExp',
  standalone: false
})
export class NumberWithExpPipe extends DecimalPipe implements PipeTransform {
  public transform(value: string | number, digits?: string, component?: string): null;
  public transform(value: string | number, digits?: string, component?: string): string | number {
    const num = Number(value);
    if (isNaN(num)) {
      return value;
    }

    let digitArgs = digits.split('.');
    digitArgs = digitArgs[1].split('-');
    const minFractionDigits = Number(digitArgs[0]) || 0;
    const maxFractionDigits = Number(digitArgs[1]) || 3;

    if (num >= Math.pow(10, -maxFractionDigits) || num === 0.0) {
      const r = super.transform(num, digits);
      return component === 'enrichment'? r : parseFloat(r);
    } else {
      return num.toExponential(minFractionDigits);
    }
  }
}
