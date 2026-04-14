import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function useCounter(target, duration = 2000) {
  const [count, setCount] = React.useState(0);
  const [started, setStarted] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  React.useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return [count, ref];
}

function StatCounter({ value, suffix = '', label, icon }) {
  const [count, ref] = useCounter(value);
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500/30 transition-colors group">
      <div className="text-3xl">{icon}</div>
      <div className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <p className="text-slate-400 text-sm text-center">{label}</p>
    </div>
  );
}

function TeamCard({ name, role, exp, emoji, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl ${color} border-2 border-slate-700 group-hover:border-orange-500/50 transition-colors`}>
        {emoji}
      </div>
      <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{name}</h3>
      <p className="text-orange-400 text-sm font-medium mt-1">{role}</p>
      <p className="text-slate-500 text-xs mt-2">{exp} experience</p>
    </div>
  );
}

function TimelineItem({ year, title, desc, last }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500/50 flex items-center justify-center flex-shrink-0">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
        </div>
        {!last && <div className="w-0.5 flex-1 bg-slate-800 mt-2 mb-0" />}
      </div>
      <div className="pb-8">
        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">{year}</span>
        <h4 className="text-white font-semibold mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h4>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-slate-900 hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-white font-medium text-sm pr-4">{q}</span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center transition-transform duration-300 ${open ? 'rotate-180 border-orange-500' : ''}`}>
          <svg className={`w-3 h-3 ${open ? 'text-orange-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 bg-slate-900/50">
          <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

function AwardBadge({ icon, title, year }) {
  return (
    <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-orange-500/30 transition-colors">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-white text-sm font-semibold">{title}</p>
        <p className="text-slate-500 text-xs">{year}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-16">

      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0d1520] to-slate-950" />
        <div className="absolute top-10 right-[15%] w-72 h-72 bg-orange-500/8 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 left-[10%] w-56 h-56 bg-blue-500/5 rounded-full blur-[70px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-400 text-sm font-medium">Established 2015 · Chhapra, Bihar</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Singh Automobiles</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Bihar's most trusted destination for quality pre-owned vehicles. For nearly a decade, we have been helping thousands of families drive home their dream car — safely, transparently, and affordably.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link to="/" className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30">
              Browse Our Cars
            </Link>
            <Link to="/contact" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCounter value={2500} suffix="+" label="Cars Sold Successfully" icon="🚗" />
          <StatCounter value={9} suffix="+" label="Years of Experience" icon="📅" />
          <StatCounter value={4800} suffix="+" label="Happy Customers" icon="😊" />
          <StatCounter value={98} suffix="%" label="Customer Satisfaction" icon="⭐" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Our Mission</h2>
            <p className="text-slate-400 leading-relaxed">
              To make quality pre-owned cars accessible to every family in Bihar and beyond. We believe buying a second-hand car should be as transparent, safe, and exciting as buying a new one — without the new-car price tag.
            </p>
            <div className="mt-6 space-y-2">
              {['No hidden charges, ever', 'Full vehicle history provided', 'Honest condition reporting', 'Post-sale support guaranteed'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="text-4xl mb-4">🔭</div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Our Vision</h2>
            <p className="text-slate-400 leading-relaxed">
              To become India's most trusted regional pre-owned car marketplace — where every transaction is backed by integrity, every car is backed by inspection, and every customer is backed by genuine after-sales care.
            </p>
            <div className="mt-6 space-y-2">
              {['Expand to 10 cities by 2026', 'Launch digital RC transfer', '1-hour test drive booking', 'EMI financing partnerships'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>How We Work</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every car goes through our rigorous 6-step process before it reaches you</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', icon: '🔍', title: 'Source', desc: 'We source cars from verified individual sellers, banks, and fleet operators.' },
              { step: '02', icon: '🔧', title: 'Inspect', desc: '150-point multi-technician inspection covering engine, body, electrics and documents.' },
              { step: '03', icon: '📋', title: 'Verify', desc: 'Full RC check, insurance history, loan clearance, and court record verification.' },
              { step: '04', icon: '✨', title: 'Refurbish', desc: 'Minor repairs, deep cleaning, and touch-ups done to bring cars to best condition.' },
              { step: '05', icon: '🏷️', title: 'Price', desc: 'Fair market price set using real transaction data — never inflated.' },
              { step: '06', icon: '🤝', title: 'Deliver', desc: 'Paperwork, RC transfer, and support handled by our team end-to-end.' },
            ].map((item) => (
              <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:border-orange-500/30 hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-xs font-bold text-orange-500/60 mb-2 tracking-widest">STEP {item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-bold text-sm mb-2 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Why Choose Singh Automobiles?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">We are not just a car dealership — we are your long-term automotive partner</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: '🛡️', title: '7-Day Return Policy', desc: 'Not happy with your purchase? Return it within 7 days, no questions asked. Full refund guaranteed.' },
            { icon: '📄', title: 'Free RC Transfer', desc: 'We handle the entire RC transfer process — from NOC to new RC — completely free of charge.' },
            { icon: '💳', title: 'Easy EMI Options', desc: 'Tie-ups with 15+ banks and NBFCs. Get financing at low interest rates with minimal documentation.' },
            { icon: '🔬', title: '150-Point Inspection', desc: 'Every car is checked across 150 parameters by certified mechanics before listing.' },
            { icon: '📞', title: '1-Year Free Support', desc: 'Our after-sales team is available for 1 full year for any support, advice, or assistance.' },
            { icon: '🚗', title: 'Test Drive At Home', desc: 'Book a test drive and we will bring the car to your doorstep. Try before you buy, hassle-free.' },
          ].map(item => (
            <div key={item.title} className="flex gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/30 hover:bg-slate-900/80 transition-all duration-300 group">
              <div className="text-3xl flex-shrink-0 mt-1">{item.icon}</div>
              <div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-orange-400 transition-colors">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Our Story</h2>
            <p className="text-slate-400">From a small showroom to Bihar's leading pre-owned car brand</p>
          </div>
          <TimelineItem year="2015" title="The Beginning" desc="Founded by Pintu Singh with just 5 cars and a rented lot in Shyam Chowk, Chhapra. The idea was simple: sell honest, inspected cars at fair prices." />
          <TimelineItem year="2017" title="First Milestone" desc="Crossed 100 cars sold. Expanded the showroom at Shyam Chowk. Hired our first team of certified mechanics for in-house inspection." />
          <TimelineItem year="2019" title="Digital Transformation" desc="Launched our first website. Online inquiries grew 300% in the first year. Introduced the 150-point inspection certificate for every vehicle." />
          <TimelineItem year="2021" title="Pandemic Resilience" desc="Introduced doorstep test drives and home delivery during COVID. Became one of the few dealerships to grow during the lockdown period." />
          <TimelineItem year="2023" title="Bank Tie-Ups" desc="Signed financing partnerships with SBI, HDFC, ICICI and 12 other lenders. Customers can now get same-day loan approvals." />
          <TimelineItem year="2024" title="Today" desc="Over 2,500 cars sold, 4,800+ happy customers, and a team of 25 professionals. Proudly serving Chhapra, Patna, Muzaffarpur, and Gaya." last />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Meet Our Team</h2>
          <p className="text-slate-400">Passionate automotive experts dedicated to your perfect purchase</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <TeamCard name="Pintu Singh" role="Founder & Owner" exp="15+ years" emoji="👨‍💼" color="bg-orange-500/20" />
          <TeamCard name="Priya Singh" role="Head of Sales" exp="10+ years" emoji="👩‍💼" color="bg-blue-500/20" />
          <TeamCard name="Anil Sharma" role="Chief Inspector" exp="12+ years" emoji="🔧" color="bg-emerald-500/20" />
          <TeamCard name="Kavita Devi" role="Finance Manager" exp="8+ years" emoji="👩‍💻" color="bg-purple-500/20" />
        </div>
      </section>

      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Awards & Recognition</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AwardBadge icon="🏆" title="Best Used Car Dealer — Bihar" year="Auto Excellence Awards 2023" />
            <AwardBadge icon="🥇" title="Top Rated on JustDial" year="5 Stars — 2022 & 2023" />
            <AwardBadge icon="⭐" title="Google Trusted Business" year="4.8 Stars · 1,200+ Reviews" />
            <AwardBadge icon="🎖️" title="Consumer Trust Award" year="Bihar Chamber of Commerce 2022" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Customers Say</h2>
          <p className="text-slate-400">Real stories from real buyers</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Amit Verma', city: 'Chhapra', car: 'Hyundai Creta 2020', rating: 5, review: 'Best car buying experience I have ever had. The inspection report was incredibly detailed. I bought a Creta and it has been running flawlessly for 8 months. No surprises, no hidden costs. Highly recommend Singh Automobiles!' },
            { name: 'Sunita Gupta', city: 'Muzaffarpur', car: 'Maruti Swift 2019', rating: 5, review: 'As a woman buying a car alone, I was nervous. But the team made me feel completely comfortable. They explained every detail, let me take a long test drive, and helped with the loan. Got my Swift at a great price.' },
            { name: 'Rohit Jha', city: 'Gaya', car: 'Honda City 2021', rating: 5, review: 'Drove 80km from Gaya to buy here and it was worth every km. The Honda City was exactly as described online. RC transfer was done in 2 weeks. Outstanding service from the whole team.' },
          ].map(t => (
            <div key={t.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.review}"</p>
              <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.city} · Bought: {t.car}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/40 border-y border-slate-800 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know before buying</p>
          </div>
          <div className="space-y-3">
            <FAQItem q="How do I know if a car history is clean?" a="We provide a full vehicle history report with every car including number of owners, accident history, service records, insurance claims, hypothecation status, and blacklist check from government databases. This report is free and given before purchase." />
            <FAQItem q="Can I negotiate the price?" a="Absolutely. Our listed prices are fair market rates but there is always room for negotiation. Come visit our showroom and our sales team will work with you to find a mutually agreeable price." />
            <FAQItem q="Do you offer test drives?" a="Yes! Test drives are available Monday to Saturday from 9 AM to 6 PM at our showroom in Shyam Chowk, Chhapra. For premium cars, we also offer doorstep test drives within Chhapra city. Call us to book your slot." />
            <FAQItem q="How long does the RC transfer take?" a="RC transfer is done within 15-21 working days after payment. We handle all paperwork — Form 29, Form 30, insurance transfer, NOC if required. You do not need to visit any RTO office yourself." />
            <FAQItem q="What financing options are available?" a="We have tie-ups with SBI, HDFC Bank, ICICI Bank, Axis Bank, Mahindra Finance, and 10+ other lenders. You can get up to 80% financing with tenures from 12 to 60 months. Same-day approval is possible for salaried individuals." />
            <FAQItem q="Is there a warranty on used cars?" a="We offer a free 3-month engine and gearbox warranty on all cars under 3 years old. Extended warranty packages of 1 or 2 years are also available for purchase at affordable rates." />
            <FAQItem q="Can I sell my car to Singh Automobiles?" a="Yes! We buy used cars at competitive prices. Visit our showroom with your car and documents for a free evaluation. We give on-the-spot quotes and process payments within 24 hours if you agree." />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto relative">
            Browse our entire collection or visit our showroom at Shyam Chowk, Chhapra. Our team is ready to help you every step of the way.
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative">
            <Link to="/" className="bg-white text-orange-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors shadow-xl">
              Browse All Cars
            </Link>
            <Link to="/contact" className="bg-orange-700/50 border border-orange-400/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-orange-700 transition-colors backdrop-blur">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}