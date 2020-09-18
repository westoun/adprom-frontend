import { Pipe, PipeTransform } from '@angular/core';
import Project from '../models/project.model';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  transform(str: string, amount: number) {
    if (str.length <= amount) {
      return str;
    }
    return str.slice(0, amount) + '...';
  }
}
