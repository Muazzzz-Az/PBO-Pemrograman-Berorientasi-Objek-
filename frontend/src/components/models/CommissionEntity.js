// src/models/CommissionEntity.js
import BaseEntity from './BaseEntity';

class CommissionEntity extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this._title = data.title || '';
    this._category = data.category || '';
    this._description = data.description || '';
    this._priceFrom = data.priceFrom || 0;
    this._priceTo = data.priceTo || null;
    this._turnaround = data.turnaround || '7-14 days';
    this._slots = data.slots || 5;
    this._slotsLeft = data.slotsLeft || data.slots || 5;
    this._revisions = data.revisions || 2;
    this._isOpen = data.isOpen !== undefined ? data.isOpen : true;
    this._coverImage = data.coverImage || '';
    this._sampleImages = data.sampleImages || [];
    this._includes = data.includes || [];
    this._hasMusic = data.hasMusic || false;
    this._musicFile = data.musicFile || '';
    this._terms = data.terms || '';
    this._artistId = data.artistId || null;
    this._artistName = data.artistName || '';
  }

  // Getters
  getTitle() { return this._title; }
  getCategory() { return this._category; }
  getDescription() { return this._description; }
  getPriceFrom() { return this._priceFrom; }
  getPriceTo() { return this._priceTo; }
  getTurnaround() { return this._turnaround; }
  getSlots() { return this._slots; }
  getSlotsLeft() { return this._slotsLeft; }
  getRevisions() { return this._revisions; }
  isOpen() { return this._isOpen; }
  getCoverImage() { return this._coverImage; }
  getSampleImages() { return this._sampleImages; }
  getIncludes() { return this._includes; }
  hasMusic() { return this._hasMusic; }
  getMusicFile() { return this._musicFile; }
  getTerms() { return this._terms; }
  getArtistId() { return this._artistId; }
  getArtistName() { return this._artistName; }

  // Setters with business logic (Encapsulation)
  setTitle(title) { this._title = title; this.updateTimestamp(); }
  setPriceFrom(price) { this._priceFrom = price; this.updateTimestamp(); }
  setOpen(isOpen) { this._isOpen = isOpen; this.updateTimestamp(); }

  decreaseSlot() {
    if (this._slotsLeft > 0) {
      this._slotsLeft--;
      this.updateTimestamp();
    }
    return this._slotsLeft;
  }

  // Polymorphism: Implementasi validate
  validate() {
    if (!this._title) throw new Error('Title is required');
    if (!this._category) throw new Error('Category is required');
    if (!this._priceFrom || this._priceFrom <= 0) throw new Error('Valid price is required');
    return true;
  }

  // Polymorphism: Implementasi toJSON
  toJSON() {
    return {
      id: this._id,
      title: this._title,
      category: this._category,
      description: this._description,
      priceFrom: this._priceFrom,
      priceTo: this._priceTo,
      turnaround: this._turnaround,
      slots: this._slots,
      slotsLeft: this._slotsLeft,
      revisions: this._revisions,
      isOpen: this._isOpen,
      coverImage: this._coverImage,
      sampleImages: this._sampleImages,
      includes: this._includes,
      hasMusic: this._hasMusic,
      musicFile: this._musicFile,
      terms: this._terms,
      artistId: this._artistId,
      artistName: this._artistName,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  getPriceRange() {
    if (this._priceTo && this._priceTo > this._priceFrom) {
      return `Rp ${this._priceFrom.toLocaleString('id-ID')} - Rp ${this._priceTo.toLocaleString('id-ID')}`;
    }
    return `Rp ${this._priceFrom.toLocaleString('id-ID')}`;
  }
}

export default CommissionEntity;