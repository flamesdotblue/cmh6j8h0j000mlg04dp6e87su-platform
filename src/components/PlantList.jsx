import { useMemo, useState } from 'react';
import { Calendar, Edit, Search, Trash2, Droplet, Filter } from 'lucide-react';

function statusFor(plant) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const last = new Date(plant.lastWatered + 'T00:00:00');
  const due = new Date(last.getFullYear(), last.getMonth(), last.getDate() + (plant.wateringIntervalDays || 3));
  const days = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: 'Overdue', tone: 'text-rose-700 bg-rose-100', days };
  if (days <= 1) return { label: 'Due soon', tone: 'text-amber-700 bg-amber-100', days };
  return { label: 'Healthy', tone: 'text-emerald-700 bg-emerald-100', days };
}

export default function PlantList({ plants, onEdit, onDelete, onMarkWatered }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('due');

  const view = useMemo(() => {
    let list = plants.filter((p) =>
      [p.name, p.species, p.location].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase())
    );

    if (filter !== 'all') {
      list = list.filter((p) => {
        const s = statusFor(p);
        if (filter === 'overdue') return s.label === 'Overdue';
        if (filter === 'due') return s.label === 'Due soon';
        if (filter === 'healthy') return s.label === 'Healthy';
        return true;
      });
    }

    list.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'location') return (a.location || '').localeCompare(b.location || '');
      // sort by due date ascending
      const sa = statusFor(a).days;
      const sb = statusFor(b).days;
      return sa - sb;
    });

    return list;
  }, [plants, q, filter, sort]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search plants, species, locations"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-lg border border-rose-200 bg-white pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Filter size={16} className="text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-rose-200 bg-white px-2 py-2 text-sm"
            >
              <option value="all">All</option>
              <option value="overdue">Overdue</option>
              <option value="due">Due soon</option>
              <option value="healthy">Healthy</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-slate-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-rose-200 bg-white px-2 py-2 text-sm"
            >
              <option value="due">Sort by due</option>
              <option value="name">Sort by name</option>
              <option value="location">Sort by location</option>
            </select>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-rose-100">
        {view.map((p) => {
          const s = statusFor(p);
          const nextDate = new Date(new Date(p.lastWatered + 'T00:00:00').getTime() + (p.wateringIntervalDays || 3) * 86400000);
          const nextDateStr = nextDate.toLocaleDateString();
          return (
            <li key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`text-xs px-2 py-1 rounded-full ${s.tone}`}>{s.label}</div>
                  <div className="font-medium truncate">{p.name}</div>
                  {p.species && <div className="text-sm text-slate-500 truncate">— {p.species}</div>}
                </div>
                <div className="text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                  {p.location && <span>Location: {p.location}</span>}
                  <span>Interval: {p.wateringIntervalDays}d</span>
                  <span>Last watered: {new Date(p.lastWatered + 'T00:00:00').toLocaleDateString()}</span>
                  <span>Next: {nextDateStr}</span>
                </div>
                {p.notes && <div className="text-sm text-slate-500 mt-1 line-clamp-2">{p.notes}</div>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onMarkWatered(p.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 px-3 py-2 text-sm hover:bg-emerald-100"
                >
                  <Droplet size={16} /> Mark watered
                </button>
                <button
                  onClick={() => onEdit(p)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-sm hover:bg-rose-50"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </li>
          );
        })}
        {view.length === 0 && (
          <li className="py-8 text-center text-slate-500">No plants match your search.</li>
        )}
      </ul>
    </div>
  );
}
