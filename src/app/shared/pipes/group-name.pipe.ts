import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

@Pipe({
  name: 'groupName'
})
export class GroupNamePipe implements PipeTransform {

  
  constructor (private localStorage : LocalStorageService) {}

  transform(value: string): string {
    const groups = this.localStorage.getGroups();
    return groups[value];
  }

}
