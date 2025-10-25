import Spline from '@splinetool/react-spline';
import { Sprout } from 'lucide-react';

export default function HeroSpline() {
  return (
    <section className="relative">
      <div className="h-[520px] sm:h-[560px] md:h-[600px] w-full">
        <Spline
          scene="https://prod.spline.design/Tu-wEVxfDuICpwJI/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rose-50/40 via-rose-50/20 to-rose-50"></div>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-rose-100 px-3 py-1 text-rose-600 text-sm">
            <Sprout size={16} />
            <span>Minimal. Floral. Serene.</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900">
            Plant management software for gardening companies
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Organize plant inventories, track watering schedules, and keep client sites thriving with an elegant, easy workflow.
          </p>
        </div>
      </div>
    </section>
  );
}
