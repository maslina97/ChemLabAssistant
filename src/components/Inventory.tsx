import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ReagentState } from '../data/reagents';
import { MANDATORY_REAGENTS } from '../data/mandatoryReagents';
import { Beaker, Plus, Search, Trash2, X, Edit2 } from 'lucide-react';

export function Inventory() {
  const { inventory, addInventoryItem, removeInventoryItem, updateInventoryItem } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomReagent, setIsCustomReagent] = useState(false);
  
  // Add Form State
  const [selectedReagentId, setSelectedReagentId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<'inorganic' | 'organic'>('inorganic');
  const [quantity, setQuantity] = useState('');
  const [state, setState] = useState<ReagentState>('dry');
  const [concentration, setConcentration] = useState('');
  const [location, setLocation] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inorganicReagents = MANDATORY_REAGENTS.filter(r => r.category === 'inorganic').sort((a, b) => a.name.localeCompare(b.name));
  const organicReagents = MANDATORY_REAGENTS.filter(r => r.category === 'organic').sort((a, b) => a.name.localeCompare(b.name));

  const inorganicBySubcategory = inorganicReagents.reduce((acc, r) => {
    const sub = r.subcategory || 'Разное';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(r);
    return acc;
  }, {} as Record<string, typeof inorganicReagents>);

  const subcategories = Object.keys(inorganicBySubcategory).sort();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    let reagentName = '';
    let category: 'inorganic' | 'organic' = 'inorganic';
    let reagentId = '';

    if (isCustomReagent) {
      if (!customName) return;
      reagentName = customName;
      category = customCategory;
      reagentId = `custom_${Date.now()}`;
    } else {
      const reagent = MANDATORY_REAGENTS.find(r => r.id === selectedReagentId);
      if (!reagent) return;
      reagentName = reagent.name;
      category = reagent.category;
      reagentId = reagent.id;
    }

    if (!quantity) return;

    addInventoryItem({
      reagentId: reagentId,
      name: reagentName,
      category: category,
      state: state,
      quantity: parseFloat(quantity),
      unit: state === 'dry' ? 'g' : 'ml',
      concentration: state === 'solution' ? parseFloat(concentration) : undefined,
      location: location || undefined,
    });

    setIsAddModalOpen(false);
    // Reset form
    setSelectedReagentId('');
    setCustomName('');
    setIsCustomReagent(false);
    setQuantity('');
    setState('dry');
    setConcentration('');
    setLocation('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <Beaker size={28} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Склад реактивов</h2>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Добавить реактив</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredInventory.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Beaker size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">Склад пуст</p>
            <p className="text-sm mt-1">Добавьте реактивы, чтобы начать учет.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Название</th>
                  <th className="p-4">Состояние</th>
                  <th className="p-4">Количество</th>
                  <th className="p-4">Место хранения</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.category === 'inorganic' ? 'Неорганика' : 'Органика'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.state === 'dry' ? 'bg-amber-100 text-amber-800' :
                        item.state === 'liquid' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.state === 'dry' ? 'Сухое' : item.state === 'liquid' ? 'Жидкость' : `Раствор ${item.concentration}%`}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {item.quantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {item.location || '—'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => removeInventoryItem(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Добавить реактив</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Type Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsCustomReagent(false)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    !isCustomReagent ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Из списка (Пост. №75)
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomReagent(true)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    isCustomReagent ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Свой реактив
                </button>
              </div>

              {!isCustomReagent ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Реактив</label>
                  <select
                    required
                    value={selectedReagentId}
                    onChange={(e) => {
                      setSelectedReagentId(e.target.value);
                      const r = MANDATORY_REAGENTS.find(x => x.id === e.target.value);
                      if (r) setState(r.defaultState);
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled>Выберите реактив...</option>
                    <optgroup label="Органические">
                      {organicReagents.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </optgroup>
                    {subcategories.map(sub => (
                      <optgroup key={sub} label={`Неорганические: ${sub}`}>
                        {inorganicBySubcategory[sub].map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Название реактива</label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Например, Сульфат лития"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Категория</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as 'inorganic' | 'organic')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="inorganic">Неорганика</option>
                      <option value="organic">Органика</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Состояние</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value as ReagentState)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="dry">Сухое вещество</option>
                    <option value="liquid">Чистая жидкость</option>
                    <option value="solution">Раствор</option>
                  </select>
                </div>
                
                {state === 'solution' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Концентрация (%)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      value={concentration}
                      onChange={(e) => setConcentration(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Например, 10"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Количество ({state === 'dry' ? 'г' : 'мл'})
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Например, 500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Место хранения</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Шкаф 1, Полка 2"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
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
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
