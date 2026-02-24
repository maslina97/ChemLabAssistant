import { useState } from 'react';
import { Calculator as CalcIcon, Droplets, FlaskConical, Scale } from 'lucide-react';

export function Calculator() {
  const [activeTab, setActiveTab] = useState<'mass' | 'molar' | 'volume' | 'hydrate'>('mass');

  // Mass Fraction State
  const [massSolution, setMassSolution] = useState<string>('');
  const [massFraction, setMassFraction] = useState<string>('');
  
  // Molar Fraction State
  const [massSoluteMolar, setMassSoluteMolar] = useState<string>('');
  const [molarMassSolute, setMolarMassSolute] = useState<string>('');
  const [massSolventMolar, setMassSolventMolar] = useState<string>('');
  const [molarMassSolvent, setMolarMassSolvent] = useState<string>('18.015');

  // Volume Fraction State
  const [volumeSolute, setVolumeSolute] = useState<string>('');
  const [volumeSolution, setVolumeSolution] = useState<string>('');

  // Hydrate State
  const [massAnhydrous, setMassAnhydrous] = useState<string>('');
  const [molarMassAnhydrous, setMolarMassAnhydrous] = useState<string>('');
  const [waterMolecules, setWaterMolecules] = useState<string>('');

  const calculateMass = () => {
    const mSol = parseFloat(massSolution);
    const w = parseFloat(massFraction);
    if (isNaN(mSol) || isNaN(w) || w <= 0 || w > 100) return null;
    const mSolute = (mSol * w) / 100;
    const mSolvent = mSol - mSolute;
    return { mSolute: mSolute.toFixed(2), mSolvent: mSolvent.toFixed(2) };
  };

  const calculateMolar = () => {
    const mSolute = parseFloat(massSoluteMolar);
    const mmSolute = parseFloat(molarMassSolute);
    const mSolvent = parseFloat(massSolventMolar);
    const mmSolvent = parseFloat(molarMassSolvent);
    if (isNaN(mSolute) || isNaN(mmSolute) || isNaN(mSolvent) || isNaN(mmSolvent) || mmSolute <= 0 || mmSolvent <= 0) return null;
    
    const nSolute = mSolute / mmSolute;
    const nSolvent = mSolvent / mmSolvent;
    const nTotal = nSolute + nSolvent;
    
    const xSolute = nSolute / nTotal;
    const xSolvent = nSolvent / nTotal;
    
    return { xSolute: xSolute.toFixed(4), xSolvent: xSolvent.toFixed(4) };
  };

  const calculateVolume = () => {
    const vSolute = parseFloat(volumeSolute);
    const vSolution = parseFloat(volumeSolution);
    if (isNaN(vSolute) || isNaN(vSolution) || vSolution <= 0 || vSolute > vSolution) return null;
    
    const phi = (vSolute / vSolution) * 100;
    return { phi: phi.toFixed(2) };
  };

  const calculateHydrate = () => {
    const mAnh = parseFloat(massAnhydrous);
    const mmAnh = parseFloat(molarMassAnhydrous);
    const nH2O = parseFloat(waterMolecules);
    if (isNaN(mAnh) || isNaN(mmAnh) || isNaN(nH2O)) return null;
    
    const mmWater = 18.015 * nH2O;
    const mmHydrate = mmAnh + mmWater;
    const mHydrate = (mAnh * mmHydrate) / mmAnh;
    return { mHydrate: mHydrate.toFixed(2), mmHydrate: mmHydrate.toFixed(2) };
  };

  const massResult = calculateMass();
  const molarResult = calculateMolar();
  const volumeResult = calculateVolume();
  const hydrateResult = calculateHydrate();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <CalcIcon size={28} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Калькулятор растворов</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('mass')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'mass' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Массовая доля
        </button>
        <button
          onClick={() => setActiveTab('molar')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'molar' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Мольная доля
        </button>
        <button
          onClick={() => setActiveTab('volume')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'volume' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Объемная доля
        </button>
        <button
          onClick={() => setActiveTab('hydrate')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'hydrate' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Кристаллогидраты
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        {activeTab === 'mass' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-slate-700 mb-6 border-b border-slate-100 pb-4">
              <FlaskConical size={20} className="text-indigo-500" />
              <h3 className="text-lg font-semibold">Приготовление раствора по массовой доле</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Масса раствора (г)</label>
                <input
                  type="number"
                  value={massSolution}
                  onChange={(e) => setMassSolution(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 200"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Массовая доля (%)</label>
                <input
                  type="number"
                  value={massFraction}
                  onChange={(e) => setMassFraction(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 15"
                />
              </div>
            </div>

            {massResult && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-4">Результат</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Scale size={16} />
                      <span className="text-xs font-medium uppercase">Масса в-ва</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{massResult.mSolute} <span className="text-base font-normal text-slate-500">г</span></p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Droplets size={16} />
                      <span className="text-xs font-medium uppercase">Масса воды</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{massResult.mSolvent} <span className="text-base font-normal text-slate-500">г</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'molar' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-slate-700 mb-6 border-b border-slate-100 pb-4">
              <FlaskConical size={20} className="text-indigo-500" />
              <h3 className="text-lg font-semibold">Расчет мольной доли</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-800">Растворенное вещество</h4>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Масса (г)</label>
                  <input
                    type="number"
                    value={massSoluteMolar}
                    onChange={(e) => setMassSoluteMolar(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Например, 10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Молярная масса (г/моль)</label>
                  <input
                    type="number"
                    value={molarMassSolute}
                    onChange={(e) => setMolarMassSolute(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Например, 58.5 (NaCl)"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-slate-800">Растворитель</h4>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Масса (г)</label>
                  <input
                    type="number"
                    value={massSolventMolar}
                    onChange={(e) => setMassSolventMolar(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Например, 100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Молярная масса (г/моль)</label>
                  <input
                    type="number"
                    value={molarMassSolvent}
                    onChange={(e) => setMolarMassSolvent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="18.015 (Вода)"
                  />
                </div>
              </div>
            </div>

            {molarResult && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-4">Результат</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <CalcIcon size={16} />
                      <span className="text-xs font-medium uppercase">Доля в-ва (χ)</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{molarResult.xSolute}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Droplets size={16} />
                      <span className="text-xs font-medium uppercase">Доля р-ля (χ)</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{molarResult.xSolvent}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'volume' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-slate-700 mb-6 border-b border-slate-100 pb-4">
              <Droplets size={20} className="text-indigo-500" />
              <h3 className="text-lg font-semibold">Расчет объемной доли</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Объем растворенного в-ва (мл)</label>
                <input
                  type="number"
                  value={volumeSolute}
                  onChange={(e) => setVolumeSolute(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 50"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Объем раствора (мл)</label>
                <input
                  type="number"
                  value={volumeSolution}
                  onChange={(e) => setVolumeSolution(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 500"
                />
              </div>
            </div>

            {volumeResult && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-4">Результат</h4>
                <div className="bg-white p-4 rounded-lg shadow-sm max-w-xs">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <CalcIcon size={16} />
                    <span className="text-xs font-medium uppercase">Объемная доля (φ)</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{volumeResult.phi} <span className="text-base font-normal text-slate-500">%</span></p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hydrate' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-slate-700 mb-6 border-b border-slate-100 pb-4">
              <Droplets size={20} className="text-indigo-500" />
              <h3 className="text-lg font-semibold">Пересчет на кристаллогидрат</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Масса безводной соли (г)</label>
                <input
                  type="number"
                  value={massAnhydrous}
                  onChange={(e) => setMassAnhydrous(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 10"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Молярная масса б/в соли</label>
                <input
                  type="number"
                  value={molarMassAnhydrous}
                  onChange={(e) => setMolarMassAnhydrous(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 159.6 (CuSO4)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Молекул воды (n)</label>
                <input
                  type="number"
                  value={waterMolecules}
                  onChange={(e) => setWaterMolecules(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 5"
                />
              </div>
            </div>

            {hydrateResult && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-4">Результат</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Scale size={16} />
                      <span className="text-xs font-medium uppercase">Масса гидрата</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{hydrateResult.mHydrate} <span className="text-base font-normal text-slate-500">г</span></p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <CalcIcon size={16} />
                      <span className="text-xs font-medium uppercase">М.м. гидрата</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{hydrateResult.mmHydrate} <span className="text-base font-normal text-slate-500">г/моль</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
