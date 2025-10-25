import { useEffect, useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function PlantForm({ initial, onSubmit, onCancel }) {
  const todayIso = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), []);
  const [form, setForm] = useState(
    initial || {
      id: crypto.randomUUID(),
      name: '',
      species: '',
      location: '',
      lastWatered: todayIso,
      wateringIntervalDays: 3,
      notes: ''
    }
  );

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'wateringIntervalDays' ? Number(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ ...form, name: form.name.trim() });
    if (!initial) {
      setForm({
        id: crypto.randomUUID(),
        name: '',
        species: '',
        location: '',
        lastWatered: todayIso,
        wateringIntervalDays: 3,
        notes: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Plant Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g., Red Spider Lily"
            className="mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Species</label>
          <input
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="Lycoris radiata"
            className="mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Client name / bed"
            className="mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Last Watered</label>
            <input
              type="date"
              name="lastWatered"
              value={form.lastWatered}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Interval (days)</label>
            <input
              type="number"
              min={1}
              name="wateringIntervalDays"
              value={form.wateringIntervalDays}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          placeholder="Care tips, pests, fertilization, etc."
          className="mt-1 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 text-white px-3 py-2 hover:bg-rose-700 transition-colors"
        >
          <Plus size={16} /> {initial ? 'Save Changes' : 'Add Plant'}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-slate-700 hover:bg-rose-50"
          >
            <X size={16} /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}
