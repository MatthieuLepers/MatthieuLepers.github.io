export type EntityData = object;

export default abstract class AbstractEntity<T extends EntityData> {
  constructor(public data: T, ignoreMapping = [] as string[]) {
    Object.keys(data).forEach((key) => {
      if (!ignoreMapping.includes(key)) {
        Object.defineProperty(this, key, {
          get: () => this.data[key as keyof T],
          set: (val) => { this.data[key as keyof T] = val; },
        });
      }
    });
  }
}
