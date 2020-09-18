import { Pipe, PipeTransform } from '@angular/core';
import Project from '../models/project.model';

@Pipe({
  name: 'favorites'
})
export class FavoriteProjectsPipe implements PipeTransform {
  transform(projects: Project[]) {
    return projects.filter(p => p.favorite);
  }
}
