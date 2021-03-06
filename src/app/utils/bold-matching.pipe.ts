import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'boldMatching'})
export class BoldMatchingPipe implements PipeTransform {
  transform(input: string, match: string): string {
    if (!match ||  match.length === 0) {
      return input;
    }

    const re = new RegExp('(' + this.escapeRegExp(match) + ')', 'ig');
    return input.replace(re, '<b>$1</b>');
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
