import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  public transform(value: string, limit: number, ellipsis = '...'): string {
    return value.length > limit ? value.substring(0, limit) + ellipsis : value;
  }
}
