import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import CarForm from '../../components/CarForm';
import { PageLoader } from '../../components/Loader';
import { getImageUrl } from '../../utils/helpers';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [deletingImg, setDeletingImg] = useState(null);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then(r => setCar(r.data.data))
      .catch(() => setFetchError('Car not found.'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await api.put(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin/cars');
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed.';
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGalleryImage = async (imgId) => {
    if (!window.confirm('Delete this image?')) return;
    setDeletingImg(imgId);
    try {
      await api.delete(`/cars/${id}/images/${imgId}`);
      setCar(prev => ({
        ...prev,
        gallery_images: prev.gallery_images.filter(img => img.id !== imgId),
      }));
    } catch (err) {
      alert('Failed to delete image');
    } finally {
      setDeletingImg(null);
    }
  };

  if (fetching) return <PageLoader />;
  if (fetchError) return (
    <div className="text-center py-20">
      <p className="text-red-400">{fetchError}</p>
      <button onClick={() => navigate('/admin/cars')} className="btn-primary mt-4">Back to Cars</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Edit Vehicle</h2>
        <p className="text-slate-400 text-sm mt-1 truncate">{car.title}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Current gallery images */}
      {car.gallery_images && car.gallery_images.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Gallery Images</h3>
          <div className="flex flex-wrap gap-3">
            {car.gallery_images.map(img => (
              <div key={img.id} className="relative group">
                <img
                  src={getImageUrl(img.image_path)}
                  alt="Gallery"
                  className="w-24 h-16 object-cover rounded-lg border border-slate-700"
                  onError={e => { e.target.src = 'https://placehold.co/96x64/1e293b/475569?text=img'; }}
                />
                <button
                  onClick={() => handleDeleteGalleryImage(img.id)}
                  disabled={deletingImg === img.id}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  {deletingImg === img.id ? '...' : '×'}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2">Hover over images to delete them. New gallery images will be added alongside existing ones.</p>
        </div>
      )}

      <CarForm initialData={car} onSubmit={handleSubmit} loading={loading} submitLabel="Update Vehicle" />
    </div>
  );
}
