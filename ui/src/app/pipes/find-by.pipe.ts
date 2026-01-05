import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findBy'
})
export class FindByPipe implements PipeTransform {

    transform(items: any[], fieldName: string, fieldValue: string): any[] {
      return items.find(item => item[fieldName] === fieldValue);
    }

}
