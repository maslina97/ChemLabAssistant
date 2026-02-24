import { useState } from 'react';
import { Calculator as CalcIcon, Droplets, FlaskConical, Scale } from 'lucide-react';

export function Calculator() {
  const [activeTab, setActiveTab] = useState<'mass' | 'molarity' | 'volume'>('mass');

  // Mass Fraction State
  const [massSolution, setMassSolution] = useState<string>('');
  const [massFraction, setMassFraction] = useState<string>('');
  const [useHydrate, setUseHydrate] = useState(false);
  const [molarMassAnhydrous, setMolarMassAnhydrous] = useState<string>('');
  const [waterMolecules, setWaterMolecules] = useState<string>('');
  
  // Molarity State
  const [volumeSolutionMolarity, setVolumeSolutionMolarity] = useState<string>('');
  const [molarity, setMolarity] = useState<string>('');
  const [molarMassSolute, setMolarMassSolute] = useState<string>('');

  // Volume Fraction State
  const [volumeSolute, setVolumeSolute] = useState<string>('');
  const [volumeSolution, setVolumeSolution] = useState<string>('');

  const calculateMass = () => {
    const mSol = parseFloat(massSolution);
    const w = parseFloat(massFraction);
    if (isNaN(mSol) || isNaN(w) || w <= 0 || w > 100) return null;
    
    const mSolute = (mSol * w) / 100;
    
    if (useHydrate) {
      const mmAnh = parseFloat(molarMassAnhydrous);
      const nH2O = parseFloat(waterMolecules);
      if (isNaN(mmAnh) || isNaN(nH2O) || mmAnh <= 0 || nH2O <= 0) return null;
      
      const mmWater = 18.015 * nH2O;
      const mmHydrate = mmAnh + mmWater;
      const mHydrate = (mSolute * mmHydrate) / mmAnh;
      const mSolvent = mSol - mHydrate;
      
      return { 
        mSolute: mHydrate.toFixed(2), 
        mSolvent: mSolvent.toFixed(2),
        isHydrate: true
      };
    }
    
    const mSolvent = mSol - mSolute;
    return { mSolute: mSolute.toFixed(2), mSolvent: mSolvent.toFixed(2), isHydrate: false };
  };

  const calculateMolarity = () => {
    const vSol = parseFloat(volumeSolutionMolarity);
    const c = parseFloat(molarity);
    const mmSolute = parseFloat(molarMassSolute);
    
    if (isNaN(vSol) || isNaN(c) || isNaN(mmSolute) || vSol <= 0 || c <= 0 || mmSolute <= 0) return null;
    
    // m = C * V(in L) * Mw
    const mSolute = c * (vSol / 1000) * mmSolute;
    
    return { mSolute: mSolute.toFixed(2) };
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
  const molarityResult = calculateMolarity();
  const volumeResult = calculateVolume();

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
          onClick={() => setActiveTab('molarity')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'molarity' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Молярная концентрация
        </button>
        <button
          onClick={() => setActiveTab('volume')}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'volume' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Объемная доля
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

            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useHydrate}
                  onChange={(e) => setUseHydrate(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-slate-700 font-medium">Учитывать кристаллогидрат</span>
              </label>
              
              {useHydrate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Молярная масса б/в соли</label>
                    <input
                      type="number"
                      value={molarMassAnhydrous}
                      onChange={(e) => setMolarMassAnhydrous(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Например, 159.6 (CuSO4)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Молекул воды (n)</label>
                    <input
                      type="number"
                      value={waterMolecules}
                      onChange={(e) => setWaterMolecules(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="Например, 5"
                    />
                  </div>
                </div>
              )}
            </div>

            {massResult && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-4">Результат</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-500 mb-1">
                      <Scale size={16} />
                      <span className="text-xs font-medium uppercase">{massResult.isHydrate ? 'Масса гидрата' : 'Масса в-ва'}</span>
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

        {activeTab === 'molarity' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-slate-700 mb-6 border-b border-slate-100 pb-4">
              <FlaskConical size={20} className="text-indigo-500" />
              <h3 className="text-lg font-semibold">Расчет молярной концентрации</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Объем раствора (мл)</label>
                <input
                  type="number"
                  value={volumeSolutionMolarity}
                  onChange={(e) => setVolumeSolutionMolarity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 1000"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Молярность (М, моль/л)</label>
                <input
                  type="number"
                  value={molarity}
                  onChange={(e) => setMolarity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Например, 1"
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

            {molarityResult && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-semibold text-indigo-800 uppercase tracking-wider mb-4">Результат</h4>
                <div className="bg-white p-4 rounded-lg shadow-sm max-w-xs">
                  <div className="flex items-center space-x-2 text-slate-500 mb-1">
                    <Scale size={16} />
                    <span className="text-xs font-medium uppercase">Масса в-ва</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{molarityResult.mSolute} <span className="text-base font-normal text-slate-500">г</span></p>
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


      </div>
    </div>
  );
}
