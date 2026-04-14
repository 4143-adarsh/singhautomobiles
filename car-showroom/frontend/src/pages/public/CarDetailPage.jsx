import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { formatPrice, formatKm, getImageUrl, getOrdinal, formatDate } from '../../utils/helpers';
import { PageLoader } from '../../components/Loader';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await api.get(`/cars/${id}`);
        const data = res.data.data;
        setCar(data);
        setActiveImage(data.main_image);
      } catch (err) {
        if (err.response?.status === 404) setError('Car not found.');
        else setError('Failed to load car details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return <div className="pt-16"><PageLoader /></div>;
  if (error) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold text-white mb-2">{error}</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Back to Listings</button>
      </div>
    </div>
  );

  const allImages = [
    ...(car.main_image ? [car.main_image] : []),
    ...(car.gallery_images?.map(img => img.image_path || img) || []),
  ];

  const specs = [
    { label: 'Brand', value: car.brand },
    { label: 'Model', value: car.model },
    { label: 'Year', value: car.year },
    { label: 'Fuel Type', value: car.fuel_type },
    { label: 'Transmission', value: car.transmission },
    { label: 'Kilometers', value: formatKm(car.kilometers_driven) },
    { label: 'Owners', value: getOrdinal(car.number_of_owners) + ' Owner' },
    { label: 'Listed On', value: formatDate(car.created_at) },
  ];

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-300">{car.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image gallery */}
          <div>
            {/* Main image */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-800 mb-3">
              <img
                src={getImageUrl(activeImage)}
                alt={car.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://placehold.co/800x450/1e293b/475569?text=No+Image'; }}
              />
            </div>

            {/* Thumbnail row */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-orange-500' : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://placehold.co/80x56/1e293b/475569?text=x'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-white leading-tight">{car.title}</h1>
              <span className={car.status === 'Available' ? 'badge-available flex-shrink-0' : 'badge-sold flex-shrink-0'}>
                {car.status}
              </span>
            </div>

            <p className="text-4xl font-bold text-orange-500 font-display mb-6">
              {formatPrice(car.price)}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {specs.map(spec => (
                <div key={spec.label} className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-1">{spec.label}</p>
                  <p className="text-sm font-semibold text-white">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 mb-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Description</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3">
              {car.status === 'Available' ? (
                <Link to={`/inquiry/${car.id}`} className="btn-primary flex-1 text-center text-lg py-4">
                  🚗 Send Inquiry
                </Link>
              ) : (
                <div className="flex-1 text-center bg-slate-800 text-slate-400 py-4 rounded-xl border border-slate-700">
                  This car has been sold
                </div>
              )}
              <Link to="/" className="btn-secondary px-6">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
