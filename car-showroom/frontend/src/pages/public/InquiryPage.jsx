import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import { Spinner } from '../../components/Loader';

export default function InquiryPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', city: '', message: '',
  });

  useEffect(() => {
    if (carId) {
      api.get(`/cars/${carId}`).then(r => setCar(r.data.data)).catch(() => {});
    }
  }, [carId]);

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      await api.post('/inquiries', {
        ...formData,
        car_id: carId || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to submit inquiry.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center p-4">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Inquiry Submitted!</h2>
          <p className="text-slate-400 mb-6">
            Thank you for your interest! Our team will contact you shortly at <strong className="text-white">{formData.email}</strong>.
          </p>
          <div className="flex gap-3">
            {carId && <Link to={`/cars/${carId}`} className="btn-secondary flex-1 text-center">View Car</Link>}
            <Link to="/" className="btn-primary flex-1 text-center">Browse More</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <Link to={carId ? `/cars/${carId}` : '/'} className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1 mb-4">
            ← Back
          </Link>
          <h1 className="section-title">Send Inquiry</h1>
          <p className="text-slate-400">Fill in your details and we'll get back to you within 24 hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {apiError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6 text-sm">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input name="full_name" value={formData.full_name} onChange={handleChange}
                      className={`input-field ${errors.full_name ? 'border-red-500' : ''}`}
                      placeholder="John Doe" />
                    {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+91 70915 91501" />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="label">City *</label>
                    <input name="city" value={formData.city} onChange={handleChange}
                      className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                      placeholder="Mumbai, Delhi..." />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className="label">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange}
                    className="input-field resize-none" rows={4}
                    placeholder="Any specific questions about the car, preferred time for viewing, etc." />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                  {loading ? <><Spinner size="sm" /> Submitting...</> : '🚗 Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>

          {/* Car summary card */}
          <div>
            {car ? (
              <div className="card overflow-hidden sticky top-24">
                <div className="aspect-video bg-slate-800">
                  <img src={getImageUrl(car.main_image)} alt={car.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = 'https://placehold.co/400x250/1e293b/475569?text=No+Image'; }} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{car.title}</h3>
                  <p className="text-orange-400 font-bold text-xl">{formatPrice(car.price)}</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-400">
                    <p>📅 {car.year} · ⛽ {car.fuel_type}</p>
                    <p>⚙️ {car.transmission}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6">
                <h3 className="font-semibold text-white mb-3">General Inquiry</h3>
                <p className="text-slate-400 text-sm">You're submitting a general inquiry. Our team will help you find the right car.</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-orange-500">📞</span> Call us anytime
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-orange-500">⚡</span> Quick response guaranteed
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-orange-500">✅</span> No pressure, just help
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
