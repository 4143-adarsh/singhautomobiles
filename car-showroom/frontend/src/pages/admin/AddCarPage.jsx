import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import CarForm from '../../components/CarForm';

export default function AddCarPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin/cars', { state: { toast: 'Car added successfully!' } });
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed to add car. Please try again.';
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Add New Vehicle</h2>
        <p className="text-slate-400 text-sm mt-1">Fill in the details to list a new car for sale.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <CarForm onSubmit={handleSubmit} loading={loading} submitLabel="Add Vehicle" />
    </div>
  );
}
