import { ReagentCategory, ReagentState } from './reagents';

export type InorganicSubcategory = 
  | 'Кислоты'
  | 'Основания'
  | 'Оксиды'
  | 'Простые вещества'
  | 'Нитраты'
  | 'Карбонаты'
  | 'Сульфаты'
  | 'Хлориды'
  | 'Фосфаты'
  | 'Другие соли'
  | 'Разное';

export interface MandatoryReagent {
  id: string;
  name: string;
  category: ReagentCategory;
  subcategory?: InorganicSubcategory;
  defaultState: ReagentState;
  defaultUnit: 'g' | 'ml';
}

const rawList = [
  // Screenshot 1
  "Суперфосфат двойной гранулированный", "Фосфоритная мука", "Нефть", "Глицерин", "Спирт н-бутиловый",
  "Спирт изоамиловый", "Спирт изобутиловый", "Спирт этиловый", "Формалин 40 %", "Этиленгликоль",
  "Уксусно-этиловый эфир", "Кислота аминоуксусная", "Кислота муравьиная**", "Кислота олеиновая",
  "Кислота пальмитиновая", "Кислота стеариновая", "Кислота уксусная**", "Кислота щавелевая",
  "Д-глюкоза", "Метиламин гидрохлорид", "Сахароза", "Активированный уголь", "Вазелин",
  "Кальция карбид", "Кальция карбонат (мрамор)", "Парафин",
  // Screenshot 2
  "Аммония нитрат**", "Калия нитрат**", "Кальция нитрат", "Натрия нитрат**", "Серебра нитрат**",
  "Лакмоид", "Метиловый оранжевый", "Фенолфталеин", "Аммофос", "Карбамид", "Натриевая селитра",
  "Кальциевая селитра", "Калийная соль", "Сульфат аммония", "Суперфосфат гранулированный",
  // Screenshot 3
  "Калия моногидроортофосфат (калий фосфорнокислый двузамещенный)", "Натрия силикат 9-водный",
  "Натрия ортофосфат трехзамещенный 12-водный", "Натрия моногидроортофосфат (натрий фосфорнокислый двузамещенный) 12-водный",
  "Натрия дигидроортофосфат (натрий фосфорнокислый однозамещенный) 2-водный",
  "Калия ферро (II) гексацианид (калий железистосинеродистый)", "Калия ферро (III) гексационид (калий железосинеродистый)",
  "Калия роданид**", "Натрия ацетат 3-водный", "Свинца ацетат", "Калия перманганат (калий марганцевокислый)**",
  "Марганца (IV) оксид", "Марганца (II) сульфат 5-водный", "Марганца хлорид 4-водный", "Аммония дихромат**",
  "Калия дихромат**", "Хрома (III) хлорид 6-водный", "Алюминия нитрат**",
  // Screenshot 4
  "Калия сульфат", "Кобальта (II) сульфат", "Магния сульфат 7-водный", "Меди (II) сульфат безводный",
  "Меди (II) сульфат 5-водный", "Натрия сульфид", "Натрия сульфит", "Натрия сульфат 10-водный",
  "Натрия гидросульфат", "Никеля сульфат", "Цинка сульфат 7-водный", "Аммония карбонат",
  "Калия карбонат (поташ)", "Меди (II) карбонат основной", "Натрия карбонат 10-водный", "Натрия гидрокарбонат",
  // Screenshot 5
  "Магний (порошок)", "Магний (лента)", "Медь (гранулы, опилки)", "Цинк (гранулы)", "Кальций**",
  "Натрий (ампул)", "Сера** (порошок)", "Фосфор** красный", "Фосфора (V) оксид**", "Йод",
  "Алюминия хлорид", "Аммония хлорид", "Бария хлорид 2-водный", "Железа (III) хлорид 5-водный",
  "Калия йодид**", "Калия хлорид", "Кальция хлорид 6-водный", "Магния хлорид 6-водный", "Меди (II) хлорид",
  "Натрия бромид 6-водный", "Натрия фторид", "Натрия хлорид", "Цинка хлорид**", "Алюминия сульфат 18-водный",
  "Аммония сульфат", "Железа (II) сульфид", "Железа (II) сульфат 7-водный",
  // Screenshot 6
  "Кислота серная**", "Кислота соляная**", "Кислота азотная**", "Кислота ортофосфорная**", "Аммиак 25 %-й",
  "Бария гидроксид", "Калия гидроксид**", "Кальция гидроксид**", "Натрия гидроксид**", "Алюминия оксид",
  "Железа (III) оксид", "Кальция оксид**", "Магния оксид", "Меди (II) оксид (порошок)", "Цинка оксид",
  "Алюминий (гранулы)", "Алюминий (порошок)", "Железо восстановленное (порошок)"
];

export const MANDATORY_REAGENTS: MandatoryReagent[] = rawList.map((name, index) => {
  const cleanName = name.replace(/\*\*/g, '').trim();
  
  // Basic heuristic for category and state
  let category: ReagentCategory = 'inorganic';
  let defaultState: ReagentState = 'dry';
  let defaultUnit: 'g' | 'ml' = 'g';

  const lowerName = cleanName.toLowerCase();
  
  // Organic heuristics
  if (lowerName.includes('спирт') || lowerName.includes('эфир') || lowerName.includes('глицерин') || 
      lowerName.includes('формалин') || lowerName.includes('этиленгликоль') || lowerName.includes('нефть') ||
      lowerName.includes('глюкоза') || lowerName.includes('сахароза') || lowerName.includes('парафин') ||
      lowerName.includes('вазелин') || lowerName.includes('ацетат') || lowerName.includes('олеиновая') ||
      lowerName.includes('пальмитиновая') || lowerName.includes('стеариновая') || lowerName.includes('уксусная') ||
      lowerName.includes('щавелевая') || lowerName.includes('аминоуксусная') || lowerName.includes('муравьиная') ||
      lowerName.includes('фенолфталеин') || lowerName.includes('метиловый оранжевый') || lowerName.includes('лакмоид') ||
      lowerName.includes('карбамид') || lowerName.includes('метиламин') || lowerName.includes('уголь')) {
    category = 'organic';
  }

  // Liquid heuristics
  if (lowerName.includes('спирт') || lowerName.includes('эфир') || lowerName.includes('глицерин') || 
      lowerName.includes('формалин') || lowerName.includes('этиленгликоль') || lowerName.includes('нефть') ||
      (lowerName.includes('кислота') && !lowerName.includes('аминоуксусная') && !lowerName.includes('пальмитиновая') && !lowerName.includes('стеариновая') && !lowerName.includes('щавелевая')) ||
      lowerName.includes('%-й')) {
    defaultState = 'liquid';
    defaultUnit = 'ml';
  }

  // Solution heuristics
  if (lowerName.includes('%')) {
    defaultState = 'solution';
    defaultUnit = 'ml';
  }

  let subcategory: InorganicSubcategory | undefined;

  if (category === 'inorganic') {
    if (lowerName.includes('кислота')) subcategory = 'Кислоты';
    else if (lowerName.includes('гидроксид') || lowerName.includes('аммиак')) subcategory = 'Основания';
    else if (lowerName.includes('оксид')) subcategory = 'Оксиды';
    else if (lowerName.includes('нитрат') || lowerName.includes('селитра')) subcategory = 'Нитраты';
    else if (lowerName.includes('карбонат') || lowerName.includes('поташ')) subcategory = 'Карбонаты';
    else if (lowerName.includes('сульфат') || lowerName.includes('гидросульфат')) subcategory = 'Сульфаты';
    else if (lowerName.includes('хлорид')) subcategory = 'Хлориды';
    else if (lowerName.includes('фосфат') || lowerName.includes('аммофос')) subcategory = 'Фосфаты';
    else if (lowerName.includes('бромид') || lowerName.includes('фторид') || lowerName.includes('йодид') || lowerName.includes('иодид') || lowerName.includes('сульфид') || lowerName.includes('сульфит') || lowerName.includes('силикат') || lowerName.includes('гексацианид') || lowerName.includes('гексационид') || lowerName.includes('роданид') || lowerName.includes('дихромат') || lowerName.includes('соль') || lowerName.includes('карбид')) subcategory = 'Другие соли';
    else if (['магний', 'медь', 'цинк', 'кальций', 'натрий', 'сера', 'фосфор', 'йод', 'алюминий', 'железо'].some(el => lowerName.startsWith(el)) && !lowerName.includes('оксид') && !lowerName.includes('хлорид') && !lowerName.includes('сульф') && !lowerName.includes('нитрат') && !lowerName.includes('карбонат') && !lowerName.includes('фосфат') && !lowerName.includes('карбид')) subcategory = 'Простые вещества';
    else subcategory = 'Разное';
  }

  return {
    id: `mand_${index}`,
    name: cleanName,
    category,
    subcategory,
    defaultState,
    defaultUnit
  };
});
