import {Pipe} from "@angular/core";
@Pipe({
  name: 'first'
})
export class FirstKeyPipe {
  transform(obj) {
    const keys = Object.keys(obj);
    if (keys && keys.length > 0) {
      return keys[0];
    }
    return null;
  }
}
