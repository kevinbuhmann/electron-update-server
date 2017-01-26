import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {
  parseYml(yml: string): { [index: string]: string } {
    let lines = yml
      .split('\n')
      .map(line => line.split(':').map(value => value.trim()))
      .map(line => ({ key: line[0], value: line[1] }));

    let result: { [index: string]: string } = { };

    for (let line of lines) {
      result[line.key] = line.value;
    }

    return result;
  }
}
