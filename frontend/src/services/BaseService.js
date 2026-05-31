// src/services/BaseService.js
// ABSTRACTION: Menyembunyikan detail localStorage dan event system
class BaseService {
  constructor(storageKey, EntityClass) {
    this.storageKey = storageKey;
    this.EntityClass = EntityClass;
    this._listeners = new Map(); // Event listeners untuk real-time
  }

  // ABSTRACTION: Method untuk mengambil semua data
  getAll() {
    const data = localStorage.getItem(this.storageKey);
    const items = data ? JSON.parse(data) : [];
    return items.map(item => new this.EntityClass(item));
  }

  // ABSTRACTION: Method untuk menyimpan semua data
  saveAll(items) {
    const jsonData = items.map(item => item.toJSON());
    localStorage.setItem(this.storageKey, JSON.stringify(jsonData));
    this._notify('data_changed', jsonData);
    return items;
  }

  // ABSTRACTION: Find by ID
  getById(id) {
    const items = this.getAll();
    return items.find(item => item.getId() === parseInt(id));
  }

  // ABSTRACTION: Create new entity
  async create(data) {
    const items = this.getAll();
    const newItem = new this.EntityClass(data);

    newItem.validate();

    items.unshift(newItem);
    this.saveAll(items);
    this._notify('item_created', newItem.toJSON());

    return newItem;
  }

  // ABSTRACTION: Update entity
  async update(id, data) {
    const items = this.getAll();
    const index = items.findIndex(item => item.getId() === parseInt(id));

    if (index === -1) throw new Error('Item not found');

    const updatedItem = new this.EntityClass({ ...items[index].toJSON(), ...data });
    updatedItem.validate();

    items[index] = updatedItem;
    this.saveAll(items);
    this._notify('item_updated', updatedItem.toJSON());

    return updatedItem;
  }

  // ABSTRACTION: Delete entity
  async delete(id) {
    const items = this.getAll();
    const filtered = items.filter(item => item.getId() !== parseInt(id));
    this.saveAll(filtered);
    this._notify('item_deleted', { id });
    return filtered;
  }

  // Event system untuk real-time (Observer Pattern)
  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this._listeners.has(event)) {
      const filtered = this._listeners.get(event).filter(cb => cb !== callback);
      this._listeners.set(event, filtered);
    }
  }

  _notify(event, data) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).forEach(callback => callback(data));
    }
  }
}

export default BaseService;