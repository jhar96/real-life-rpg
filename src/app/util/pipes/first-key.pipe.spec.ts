import {FirstKeyPipe} from "./first-key.pipe";
describe('FirstKeyPipe', () => {

  let pipe: FirstKeyPipe;

  beforeEach(() => {
    pipe = new FirstKeyPipe();
  });

  it('should return null if keys are empty', () => {
    const obj = {};
    const result = pipe.transform(obj);
    expect(result).toBe(null);
  });

  it('should return first key if keys exist', () => {
    const obj = { a: '1', b: '2', c: '3' };
    const result = pipe.transform(obj);
    expect(result).toBe('a');
  });

});
