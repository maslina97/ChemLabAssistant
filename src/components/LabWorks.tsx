import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar as CalendarIcon, Plus, Trash2, Users, Beaker, FlaskConical, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export function LabWorks() {
  const { labWorks, inventory, addLabWork, removeLabWork } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [groupsCount, setGroupsCount] = useState('15');
  const [reagentsNeeded, setReagentsNeeded] = useState<{ inventoryId: string; amountPerGroup: number }[]>([]);
  const [equipmentNeeded, setEquipmentNeeded] = useState<{ name: string; amountPerGroup: number }[]>([]);

  const handleAddReagent = () => {
    setReagentsNeeded([...reagentsNeeded, { inventoryId: '', amountPerGroup: 0 }]);
  };

  const handleAddEquipment = () => {
    setEquipmentNeeded([...equipmentNeeded, { name: '', amountPerGroup: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !groupsCount) return;

    addLabWork({
      title,
      date: new Date(date).toISOString(),
      groupsCount: parseInt(groupsCount, 10),
      reagentsNeeded: reagentsNeeded.filter(r => r.inventoryId && r.amountPerGroup > 0),
      equipmentNeeded: equipmentNeeded.filter(e => e.name && e.amountPerGroup > 0),
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDate('');
    setGroupsCount('15');
    setReagentsNeeded([]);
    setEquipmentNeeded([]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <CalendarIcon size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Лабораторные работы</h2>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Запланировать работу</span>
        </button>
      </div>

      {/* Lab Works List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {labWorks.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <CalendarIcon size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">Нет запланированных работ</p>
            <p className="text-sm mt-1">Добавьте новую лабораторную работу для планирования.</p>
          </div>
        ) : (
          labWorks.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()).map(lab => (
            <div key={lab.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{lab.title}</h3>
                    <p className="text-sm text-indigo-600 font-medium mt-1">
                      {format(parseISO(lab.date), 'd MMMM yyyy', { locale: ru })}
                    </p>
                  </div>
                  <button
                    onClick={() => removeLabWork(lab.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-slate-600 text-sm font-medium">
                  <Users size={16} />
                  <span>{lab.groupsCount} групп(ы) / учеников</span>
                </div>
              </div>
              
              <div className="p-6 flex-1 space-y-6">
                {/* Reagents */}
                {lab.reagentsNeeded.length > 0 && (
                  <div>
                    <h4 className="flex items-center space-x-2 text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
                      <Beaker size={16} className="text-indigo-500" />
                      <span>Реактивы (всего)</span>
                    </h4>
                    <ul className="space-y-2">
                      {lab.reagentsNeeded.map((r, i) => {
                        const invItem = inventory.find(item => item.id === r.inventoryId);
                        const total = r.amountPerGroup * lab.groupsCount;
                        const isLow = invItem ? invItem.quantity < total : true;
                        
                        return (
                          <li key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="font-medium text-slate-700">{invItem?.name || 'Неизвестный реактив'}</span>
                            <div className="flex items-center space-x-3">
                              <span className={`font-semibold ${isLow ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {total} {invItem?.unit || 'ед.'}
                              </span>
                              {isLow && <span className="text-[10px] uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">Мало</span>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Equipment */}
                {lab.equipmentNeeded.length > 0 && (
                  <div>
                    <h4 className="flex items-center space-x-2 text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">
                      <FlaskConical size={16} className="text-indigo-500" />
                      <span>Оборудование (всего)</span>
                    </h4>
                    <ul className="space-y-2">
                      {lab.equipmentNeeded.map((e, i) => {
                        const total = e.amountPerGroup * lab.groupsCount;
                        return (
                          <li key={i} className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="font-medium text-slate-700">{e.name}</span>
                            <span className="font-semibold text-slate-600">{total} шт.</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Запланировать работу</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Название работы</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Например, Получение кислорода"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Дата проведения</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Количество групп/парт</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={groupsCount}
                      onChange={(e) => setGroupsCount(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Reagents Needed */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Реактивы (на 1 группу)</h4>
                  <button type="button" onClick={handleAddReagent} className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center space-x-1">
                    <Plus size={16} /> <span>Добавить</span>
                  </button>
                </div>
                
                {reagentsNeeded.length === 0 && (
                  <p className="text-sm text-slate-500 italic">Реактивы не добавлены</p>
                )}
                
                {reagentsNeeded.map((r, index) => (
                  <div key={index} className="flex space-x-3 items-start">
                    <select
                      required
                      value={r.inventoryId}
                      onChange={(e) => {
                        const newReagents = [...reagentsNeeded];
                        newReagents[index].inventoryId = e.target.value;
                        setReagentsNeeded(newReagents);
                      }}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="" disabled>Выберите со склада...</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.state === 'solution' ? `${item.concentration}%` : item.state === 'dry' ? 'сух.' : 'жидк.'})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="0.1"
                      step="0.1"
                      value={r.amountPerGroup || ''}
                      onChange={(e) => {
                        const newReagents = [...reagentsNeeded];
                        newReagents[index].amountPerGroup = parseFloat(e.target.value);
                        setReagentsNeeded(newReagents);
                      }}
                      placeholder="Кол-во"
                      className="w-24 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setReagentsNeeded(reagentsNeeded.filter((_, i) => i !== index))}
                      className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Equipment Needed */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Оборудование (на 1 группу)</h4>
                  <button type="button" onClick={handleAddEquipment} className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center space-x-1">
                    <Plus size={16} /> <span>Добавить</span>
                  </button>
                </div>
                
                {equipmentNeeded.length === 0 && (
                  <p className="text-sm text-slate-500 italic">Оборудование не добавлено</p>
                )}
                
                {equipmentNeeded.map((e, index) => (
                  <div key={index} className="flex space-x-3 items-start">
                    <input
                      type="text"
                      required
                      value={e.name}
                      onChange={(ev) => {
                        const newEq = [...equipmentNeeded];
                        newEq[index].name = ev.target.value;
                        setEquipmentNeeded(newEq);
                      }}
                      placeholder="Название (напр. Пробирка)"
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="number"
                      required
                      min="1"
                      value={e.amountPerGroup || ''}
                      onChange={(ev) => {
                        const newEq = [...equipmentNeeded];
                        newEq[index].amountPerGroup = parseInt(ev.target.value, 10);
                        setEquipmentNeeded(newEq);
                      }}
                      placeholder="Шт."
                      className="w-24 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setEquipmentNeeded(equipmentNeeded.filter((_, i) => i !== index))}
                      className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
