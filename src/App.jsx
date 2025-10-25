import { useMemo, useState } from 'react';
import { Leaf } from 'lucide-react';
import HeroSpline from './components/HeroSpline';
import PlantForm from './components/PlantForm';
import PlantList from './components/PlantList';
import TaskPanel from './components/TaskPanel';

function App() {
  const [plants, setPlants] = useState(() => {
    // Seed with a few demo plants for UX
    const today = new Date();
    const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    return [
      {
        id: crypto.randomUUID(),
        name: 'Red Spider Lily',
        species: 'Lycoris radiata',
        location: 'Client A — Front Bed',
        lastWatered: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
        wateringIntervalDays: 3,
        notes: 'Prefers well-drained soil. Avoid overwatering.'
      },
      {
        id: crypto.randomUUID(),
        name: 'Boxwood Hedge',
        species: 'Buxus sempervirens',
        location: 'Client B — Perimeter',
        lastWatered: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
        wateringIntervalDays: 2,
        notes: 'Prune quarterly; monitor for leaf miners.'
      },
      {
        id: crypto.randomUUID(),
        name: 'Herb Planter',
        species: 'Mixed (Basil, Thyme, Mint)',
        location: 'Client C — Patio',
        lastWatered: iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)),
        wateringIntervalDays: 2,
        notes: 'Morning sun only; mint can spread.'
      }
    ];
  });
  const [editing, setEditing] = useState(null);

  const upsertPlant = (plant) => {
    setPlants((prev) => {
      const exists = prev.some((p) => p.id === plant.id);
      if (exists) return prev.map((p) => (p.id === plant.id ? plant : p));
      return [plant, ...prev];
    });
    setEditing(null);
  };

  const deletePlant = (id) => {
    setPlants((prev) => prev.filter((p) => p.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const markWatered = (id) => {
    const isoToday = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, lastWatered: isoToday } : p)));
  };

  const tasks = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

    return plants
      .map((p) => {
        const last = new Date(p.lastWatered + 'T00:00:00');
        const due = addDays(last, p.wateringIntervalDays || 3);
        const daysDiff = Math.ceil((due - startOfToday) / (1000 * 60 * 60 * 24));
        let status = 'healthy';
        if (daysDiff < 0) status = 'overdue';
        else if (daysDiff === 0 || daysDiff === 1) status = 'due-soon';
        return {
          id: p.id,
          name: p.name,
          location: p.location,
          dueDate: due,
          daysUntil: daysDiff,
          status
        };
      })
      .sort((a, b) => a.dueDate - b.dueDate);
  }, [plants]);

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-rose-50/70 border-b border-rose-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <Leaf size={20} />
            </div>
            <div>
              <div className="font-semibold tracking-tight">BloomOps</div>
              <div className="text-xs text-slate-500">Plant management for gardening teams</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <HeroSpline />

        <section className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur rounded-2xl border border-rose-100 shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Plants</h2>
                </div>
                <PlantList
                  plants={plants}
                  onEdit={setEditing}
                  onDelete={deletePlant}
                  onMarkWatered={markWatered}
                />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/70 backdrop-blur rounded-2xl border border-rose-100 shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Add or Edit Plant</h2>
                <PlantForm
                  key={editing?.id || 'new'}
                  initial={editing}
                  onCancel={() => setEditing(null)}
                  onSubmit={upsertPlant}
                />
              </div>
              <div className="bg-white/70 backdrop-blur rounded-2xl border border-rose-100 shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Watering</h2>
                <TaskPanel tasks={tasks} onMarkWatered={markWatered} />
              </div>
            </div>
          </div>
        </section>

        <footer className="max-w-7xl mx-auto px-4 py-12 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-rose-500" />
            <span>BloomOps — Helping gardens thrive.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
