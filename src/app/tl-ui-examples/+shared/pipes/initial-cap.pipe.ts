import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialCap'
})
export class InitialCapPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    let InitialLetter = value[0];
    let remainings = value.substring(1);
    return InitialLetter.toUpperCase() + remainings.toLowerCase();
  }

}
