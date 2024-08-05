import { world } from "@minecraft/server";

export default class DB {
  static set(key, value) {
    return world.setDynamicProperty(key, value ? JSON.stringify(value) : null);
  }

  static get(key) {
    const data = world.getDynamicProperty(key);
    return typeof data !== "string" ? undefined : JSON.parse(data);
  }

  static has(key) {
    return world.getDynamicProperty(key) ?? false;
  }

  static forEach(callback) {
    this.entries().forEach((v, i, a) => callback(v[0], v[1], i, a));
  }

  static keys() {
    return world.getDynamicPropertyIds().map(f => f.slice(5));
  }

  static values() {
    let _values = [];
    world.getDynamicPropertyIds().forEach((v) => {
      const data = world.getDynamicProperty(v);
      _values.push(data ? JSON.parse(data.toString()) : undefined);
    });
    return _values;
  }

  static entries() {
    return world.getDynamicPropertyIds().map((v) => {
      const data = world.getDynamicProperty(v);
      return [v, data ? JSON.parse(data.toString()) : undefined];
    });
  }

  static size() {
    return world.getDynamicPropertyIds().length;
  }
  
  static clear() {
    world.clearDynamicProperties()
  }
}