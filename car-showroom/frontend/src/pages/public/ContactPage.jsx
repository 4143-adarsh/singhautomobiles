import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner } from '../../components/Loader';

function InfoCard({ icon, title, lines, link, linkLabel }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-3 group-hover:text-orange-400 transition-colors">{title}</h3>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <p key={i} className="text-slate-400 text-sm">{line}</p>
        ))}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
          {linkLabel}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}

function HoursRow({ day, hours, isToday }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-800 last:border-0">
      <span className={`text-sm font-medium ${isToday ? 'text-orange-400' : 'text-slate-300'}`}>
        {isToday && <span className="inline-block w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 mb-0.5 animate-pulse" />}
        {day}
      </span>
      <span className={`text-sm ${isToday ? 'text-orange-400 font-semibold' : 'text-slate-400'}`}>{hours}</span>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', city: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = 'Required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid email required';
    if (!formData.phone.trim()) errs.phone = 'Required';
    if (!formData.city.trim()) errs.city = 'Required';
    if (!formData.message.trim()) errs.message = 'Please write a message';
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
      await api.post('/inquiries', formData);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to send. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0d1520] to-slate-950" />
        <div className="absolute top-0 right-[20%] w-64 h-64 bg-orange-500/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Open Today · 9:00 AM to 7:00 PM</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Touch</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have a question about a car? Want to book a test drive? Need help with financing? We are here for you — call, email, or just walk in.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon="📞" title="Call Us"
            lines={['+91 70915 91501', '+91 70915 91501', 'Mon to Sat: 9AM to 7PM', 'Sun: 10AM to 5PM']}
            link="tel:+917091591501" linkLabel="Call Now" />
          <InfoCard icon="📧" title="Email Us"
            lines={['info@singhautomobiles.in', 'sales@singhautomobiles.in', 'We reply within 2 hours', 'Mon to Sat only']}
            link="mailto:info@singhautomobiles.in" linkLabel="Send Email" />
          <InfoCard icon="📍" title="Visit Showroom"
            lines={['Shyam Chowk', 'Chhapra, Bihar', 'Bihar 841301', 'India']}
            link="https://maps.google.com/?q=Shyam+Chowk+Chhapra+Bihar" linkLabel="Get Directions" />
          <InfoCard icon="💬" title="WhatsApp"
            lines={['+91 70915 91501', 'Send car photos and queries', 'Quick replies guaranteed', 'Available 8AM to 9PM']}
            link="https://wa.me/917091591501" linkLabel="Chat on WhatsApp" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800">
              <h3 className="text-white font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Our Location</h3>
              <p className="text-slate-400 text-sm mt-1">Shyam Chowk, Chhapra, Bihar 841301</p>
            </div>
            <div className="relative" style={{ height: '380px' }}>
              <iframe
                title="Singh Automobiles Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3588.5!2d84.7406!3d25.7762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398bde7f0b30a555%3A0x65bb9e53bdbec2b0!2sChhapra%2C%20Bihar!5e0!3m2!1sen!2sin!4v1709000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale"
              />
              <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">Singh Automobiles · Shyam Chowk</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Business Hours</h3>
            <HoursRow day="Monday" hours="9:00 AM to 7:00 PM" isToday={today === 'Monday'} />
            <HoursRow day="Tuesday" hours="9:00 AM to 7:00 PM" isToday={today === 'Tuesday'} />
            <HoursRow day="Wednesday" hours="9:00 AM to 7:00 PM" isToday={today === 'Wednesday'} />
            <HoursRow day="Thursday" hours="9:00 AM to 7:00 PM" isToday={today === 'Thursday'} />
            <HoursRow day="Friday" hours="9:00 AM to 7:00 PM" isToday={today === 'Friday'} />
            <HoursRow day="Saturday" hours="9:00 AM to 7:00 PM" isToday={today === 'Saturday'} />
            <HoursRow day="Sunday" hours="10:00 AM to 5:00 PM" isToday={today === 'Sunday'} />
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-emerald-400 text-sm font-medium">Open Now</p>
              <p className="text-slate-400 text-xs mt-1">Walk in or call us for immediate assistance</p>
            </div>
            <div className="mt-6">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">Follow Us</p>
              <div className="flex gap-2">
                {[
                  { label: 'FB', color: 'bg-blue-600', href: '#' },
                  { label: 'IG', color: 'bg-pink-600', href: '#' },
                  { label: 'YT', color: 'bg-red-600', href: '#' },
                  { label: 'WA', color: 'bg-green-600', href: 'https://wa.me/917091591501' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`${s.color} w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity`}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Send Us a Message</h2>
            <p className="text-slate-400">Fill in the form and our team will get back to you within 2 hours</p>
          </div>

          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
              <p className="text-slate-400 mb-6">
                Thanks <strong className="text-white">{formData.full_name}</strong>! Our team will reach you at <strong className="text-white">{formData.phone}</strong> within 2 hours.
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl transition-all">Browse Cars</Link>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ full_name: '', email: '', phone: '', city: '', message: '' }); }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl transition-all">
                  Send Another
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              {apiError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 text-sm">{apiError}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                    <input name="full_name" value={formData.full_name} onChange={handleChange}
                      className={`w-full bg-slate-800 border ${errors.full_name ? 'border-red-500' : 'border-slate-700'} text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder-slate-500 text-sm`}
                      placeholder="Your full name" />
                    {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      className={`w-full bg-slate-800 border ${errors.phone ? 'border-red-500' : 'border-slate-700'} text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder-slate-500 text-sm`}
                      placeholder="+91 70915 91501" />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder-slate-500 text-sm`}
                      placeholder="your@email.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your City *</label>
                    <input name="city" value={formData.city} onChange={handleChange}
                      className={`w-full bg-slate-800 border ${errors.city ? 'border-red-500' : 'border-slate-700'} text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder-slate-500 text-sm`}
                      placeholder="Chhapra, Patna, Muzaffarpur..." />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4}
                    className={`w-full bg-slate-800 border ${errors.message ? 'border-red-500' : 'border-slate-700'} text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder-slate-500 text-sm resize-none`}
                    placeholder="Tell us what you are looking for — budget, preferred car type, any specific model, or any questions..." />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 text-base">
                  {loading ? <><Spinner size="sm" /> Sending...</> : '📨 Send Message'}
                </button>
                <p className="text-center text-slate-500 text-xs">
                  Or call us directly at <a href="tel:+917091591501" className="text-orange-400 hover:text-orange-300">+91 70915 91501</a>
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>We Serve These Cities</h2>
          <p className="text-slate-400">Our sales and delivery team operates across Bihar</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {['Chhapra', 'Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Motihari', 'Nalanda', 'Samastipur', 'Begusarai', 'Hajipur'].map((city, i) => (
            <div key={city} className={`text-center py-3 px-2 rounded-xl border text-sm transition-colors ${i === 0 ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'}`}>
              {i === 0 ? city + ' ★' : city}
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-4">★ Main Showroom Location</p>
      </section>

    </div>
  );
}