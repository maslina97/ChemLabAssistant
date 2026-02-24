import { useStore } from '../store/useStore';
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AlertCircle, CalendarClock, Beaker } from 'lucide-react';

export function Dashboard() {
  const { inventory, labWorks } = useStore();

  const today = new Date();
  const nextWeek = addDays(today, 7);

  const upcomingLabs = labWorks
    .filter(lab => {
      const labDate = parseISO(lab.date);
      return isAfter(labDate, today) && isBefore(labDate, nextWeek);
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const lowInventory = inventory.filter(item => {
    if (item.state === 'dry' && item.quantity < 50) return true;
    if (item.state === 'liquid' && item.quantity < 100) return true;
    if (item.state === 'solution' && item.quantity < 200) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Обзор</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Labs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <CalendarClock size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Ближайшие работы (7 дней)</h3>
          </div>
          
          {upcomingLabs.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет запланированных работ на ближайшую неделю.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingLabs.map(lab => (
                <li key={lab.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-800">{lab.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(parseISO(lab.date), 'd MMMM yyyy', { locale: ru })} • {lab.groupsCount} групп
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low Inventory Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Заканчивающиеся реактивы</h3>
          </div>
          
          {lowInventory.length === 0 ? (
            <p className="text-slate-500 text-sm">Все реактивы в достаточном количестве.</p>
          ) : (
            <ul className="space-y-3">
              {lowInventory.map(item => (
                <li key={item.id} className="flex justify-between items-center p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                  <div className="flex items-center space-x-3">
                    <Beaker size={18} className="text-rose-400" />
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.state === 'solution' ? `${item.concentration}% раствор` : item.state === 'dry' ? 'Сухое в-во' : 'Жидкость'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-rose-600">
                    {item.quantity} {item.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
