import React, { useState } from 'react';
import { Spinner } from './Loader';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'];
const CURRENT_YEAR = new Date().getFullYear();

export default function CarForm({ initialData = {}, onSubmit, loading, submitLabel = 'Save Car' }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    brand: initialData.brand || '',
    model: initialData.model || '',
    year: initialData.year || CURRENT_YEAR,
    fuel_type: initialData.fuel_type || 'Petrol',
    transmission: initialData.transmission || 'Manual',
    kilometers_driven: initialData.kilometers_driven || '',
    number_of_owners: initialData.number_of_owners || 1,
    price: initialData.price || '',
    description: initialData.description || '',
    status: initialData.status || 'Available',
  });
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.brand.trim()) errs.brand = 'Brand is required';
    if (!formData.model.trim()) errs.model = 'Model is required';
    if (!formData.price || formData.price <= 0) errs.price = 'Valid price required';
    if (formData.kilometers_driven === '') errs.kilometers_driven = 'Kilometers driven is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    if (mainImage) fd.append('main_image', mainImage);
    galleryImages.forEach(file => fd.append('gallery_images', file));
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Listing Title *</label>
            <input name="title" value={formData.title} onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="e.g. 2020 Maruti Swift VXI - Single Owner" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="label">Brand *</label>
            <input name="brand" value={formData.brand} onChange={handleChange}
              className={`input-field ${errors.brand ? 'border-red-500' : ''}`}
              placeholder="e.g. Maruti, Hyundai" />
            {errors.brand && <p className="text-red-400 text-xs mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="label">Model *</label>
            <input name="model" value={formData.model} onChange={handleChange}
              className={`input-field ${errors.model ? 'border-red-500' : ''}`}
              placeholder="e.g. Swift, Creta" />
            {errors.model && <p className="text-red-400 text-xs mt-1">{errors.model}</p>}
          </div>

          <div>
            <label className="label">Year *</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange}
              className="input-field" min="1990" max={CURRENT_YEAR + 1} />
          </div>

          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange}
              className={`input-field ${errors.price ? 'border-red-500' : ''}`}
              placeholder="e.g. 650000" min="0" />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
          </div>
        </div>
      </div>

      {/* Vehicle Specs */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Vehicle Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">Fuel Type *</label>
            <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="select-field">
              {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Transmission *</label>
            <select name="transmission" value={formData.transmission} onChange={handleChange} className="select-field">
              {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Kilometers Driven *</label>
            <input type="number" name="kilometers_driven" value={formData.kilometers_driven} onChange={handleChange}
              className={`input-field ${errors.kilometers_driven ? 'border-red-500' : ''}`}
              placeholder="e.g. 45000" min="0" />
            {errors.kilometers_driven && <p className="text-red-400 text-xs mt-1">{errors.kilometers_driven}</p>}
          </div>

          <div>
            <label className="label">Number of Owners *</label>
            <input type="number" name="number_of_owners" value={formData.number_of_owners} onChange={handleChange}
              className="input-field" min="1" max="10" />
          </div>

          <div>
            <label className="label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="select-field">
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            className="input-field resize-none" rows={4}
            placeholder="Describe the car's condition, features, history, etc." />
        </div>
      </div>

      {/* Images */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Images</h3>
        
        {initialData.main_image && (
          <div className="mb-4">
            <p className="label">Current Main Image</p>
            <img src={`/uploads/${initialData.main_image}`} alt="Current"
              className="w-40 h-28 object-cover rounded-lg border border-slate-700" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Main Image {!initialData.main_image && '*'}</label>
            <input type="file" accept="image/*"
              onChange={e => setMainImage(e.target.files[0])}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-medium file:cursor-pointer hover:file:bg-orange-600 cursor-pointer" />
            <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WEBP up to 5MB</p>
          </div>

          <div>
            <label className="label">Gallery Images (multiple)</label>
            <input type="file" accept="image/*" multiple
              onChange={e => setGalleryImages(Array.from(e.target.files))}
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white file:font-medium file:cursor-pointer hover:file:bg-slate-600 cursor-pointer" />
            <p className="text-xs text-slate-500 mt-1">Select up to 10 images</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
          {loading ? <><Spinner size="sm" /> Saving...</> : submitLabel}
        </button>
      </div>
    </form>
  );
}
