import { Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TaskPanel({ tasks, onMarkWatered }) {
  return (
    <ul className="space-y-3">
      {tasks.slice(0, 6).map((t) => {
        const isOverdue = t.status === 'overdue';
        const isSoon = t.status === 'due-soon';
        return (
          <li key={t.id} className="rounded-xl border border-rose-100 bg-white p-3">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${isOverdue ? 'text-rose-600' : isSoon ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isOverdue ? <AlertTriangle size={18} /> : <Calendar size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{t.name}</div>
                <div className="text-sm text-slate-600 truncate">{t.location || 'Unassigned location'}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {isOverdue && `Overdue by ${Math.abs(t.daysUntil)} day(s)`}
                  {!isOverdue && t.daysUntil === 0 && 'Due today'}
                  {!isOverdue && t.daysUntil === 1 && 'Due tomorrow'}
                  {!isOverdue && t.daysUntil > 1 && `Due in ${t.daysUntil} day(s)`}
                </div>
              </div>
              <button
                onClick={() => onMarkWatered(t.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 px-2.5 py-1.5 text-xs hover:bg-emerald-100"
              >
                <CheckCircle2 size={14} /> Complete
              </button>
            </div>
          </li>
        );
      })}
      {tasks.length === 0 && (
        <li className="text-sm text-slate-500">No upcoming tasks.</li>
      )}
    </ul>
  );
}
