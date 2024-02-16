import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, property: string): any[] {
    if (!items || !searchTerm || !property) return items;
    return items.filter(item => item[property].toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
