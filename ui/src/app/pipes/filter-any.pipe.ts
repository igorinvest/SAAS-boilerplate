import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAny'
})
export class FilterAnyPipe implements PipeTransform {

    transform(items: any[], fieldName: string, fieldValue: string): any[] {
      return items.filter(item => item[fieldName] === fieldValue);
    }

}
