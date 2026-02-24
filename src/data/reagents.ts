export type ReagentCategory = 'inorganic' | 'organic';
export type ReagentState = 'dry' | 'liquid' | 'solution';

export interface PredefinedReagent {
  id: string;
  name: string;
  category: ReagentCategory;
  defaultState: ReagentState;
  defaultUnit: 'g' | 'ml';
}

export const PREDEFINED_REAGENTS: PredefinedReagent[] = [
  // Inorganic Acids
  { id: 'h2so4', name: 'Серная кислота', category: 'inorganic', defaultState: 'liquid', defaultUnit: 'ml' },
  { id: 'hcl', name: 'Соляная кислота', category: 'inorganic', defaultState: 'liquid', defaultUnit: 'ml' },
  { id: 'hno3', name: 'Азотная кислота', category: 'inorganic', defaultState: 'liquid', defaultUnit: 'ml' },
  { id: 'h3po4', name: 'Ортофосфорная кислота', category: 'inorganic', defaultState: 'liquid', defaultUnit: 'ml' },
  
  // Bases
  { id: 'naoh', name: 'Гидроксид натрия', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'koh', name: 'Гидроксид калия', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'caoh2', name: 'Гидроксид кальция', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'nh3_aq', name: 'Аммиак (водный раствор)', category: 'inorganic', defaultState: 'solution', defaultUnit: 'ml' },
  
  // Salts
  { id: 'cuso4', name: 'Сульфат меди(II)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'cuso4_5h2o', name: 'Медный купорос (CuSO4·5H2O)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'bacl2', name: 'Хлорид бария', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'agno3', name: 'Нитрат серебра', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'kmno4', name: 'Перманганат калия', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'k2cr2o7', name: 'Дихромат калия', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'nacl', name: 'Хлорид натрия', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'na2co3', name: 'Карбонат натрия', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'nahco3', name: 'Гидрокарбонат натрия', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  
  // Metals & Non-metals
  { id: 'fe', name: 'Железо (опилки)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'zn', name: 'Цинк (гранулы)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'cu', name: 'Медь (стружка)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'mg', name: 'Магний (лента)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 's', name: 'Сера (порошок)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'i2', name: 'Йод (кристаллический)', category: 'inorganic', defaultState: 'dry', defaultUnit: 'g' },
  
  // Other Inorganic
  { id: 'h2o2', name: 'Пероксид водорода', category: 'inorganic', defaultState: 'solution', defaultUnit: 'ml' },
  
  // Organic
  { id: 'ethanol', name: 'Этанол', category: 'organic', defaultState: 'liquid', defaultUnit: 'ml' },
  { id: 'acetic_acid', name: 'Уксусная кислота', category: 'organic', defaultState: 'liquid', defaultUnit: 'ml' },
  { id: 'glycerin', name: 'Глицерин', category: 'organic', defaultState: 'liquid', defaultUnit: 'ml' },
  { id: 'glucose', name: 'Глюкоза', category: 'organic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'sucrose', name: 'Сахароза', category: 'organic', defaultState: 'dry', defaultUnit: 'g' },
  { id: 'starch', name: 'Крахмал', category: 'organic', defaultState: 'dry', defaultUnit: 'g' },
  
  // Indicators
  { id: 'phenolphthalein', name: 'Фенолфталеин', category: 'organic', defaultState: 'solution', defaultUnit: 'ml' },
  { id: 'methyl_orange', name: 'Метиловый оранжевый', category: 'organic', defaultState: 'solution', defaultUnit: 'ml' },
  { id: 'litmus', name: 'Лакмус', category: 'organic', defaultState: 'solution', defaultUnit: 'ml' },
];
