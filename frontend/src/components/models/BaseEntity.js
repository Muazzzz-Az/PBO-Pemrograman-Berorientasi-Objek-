// src/models/BaseEntity.js
// ENCAPSULATION: Semua data dibungkus dalam class dengan getter/setter
class BaseEntity {
  constructor(data = {}) {
    this._id = data.id || Date.now();
    this._createdAt = data.createdAt || new Date().toISOString();
    this._updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Getters (Encapsulation)
  getId() { return this._id; }
  getCreatedAt() { return this._createdAt; }
  getUpdatedAt() { return this._updatedAt; }

  // Setters with validation (Encapsulation)
  updateTimestamp() {
    this._updatedAt = new Date().toISOString();
  }

  // Abstract methods (akan diimplementasikan child class)
  validate() { throw new Error('Must implement validate()'); }
  toJSON() { throw new Error('Must implement toJSON()'); }

  // Polymorphism-ready method
  getSummary() {
    return { id: this._id, createdAt: this._createdAt };
  }
}

export default BaseEntity;