import { Solar, Lunar } from 'lunar-javascript';

// --- 基础数据字典 ---

const WUXING_ATTR = {
  '金': {
    body: '骨架大，皮肤白皙，声音响亮。',
    trait: '主义，性刚，情烈。',
    career: '金融、法律、汽车、五金',
    health: '呼吸系统、肺部、大肠'
  },
  '木': {
    body: '身形修长，发质好，手足细腻。',
    trait: '主仁，性直，情和。',
    career: '教育、出版、家具、园林',
    health: '肝胆、神经系统、四肢'
  },
  '水': {
    body: '圆脸，眼神灵活，肤色偏黑。',
    trait: '主智，性聪，情善。',
    career: '物流、贸易、航运、流动性行业',
    health: '肾脏、泌尿系统、血液'
  },
  '火': {
    body: '面色红润，上身宽阔，眼神锐利。',
    trait: '主礼，性急，情恭。',
    career: '互联网、能源、餐饮、演艺',
    health: '心脏、血液循环、眼目'
  },
  '土': {
    body: '敦厚结实，背圆腰阔，鼻大口方。',
    trait: '主信，性重，情厚。',
    career: '房地产、建筑、农业、仓储',
    health: '脾胃、消化系统、皮肤'
  }
};

const SHISHEN_MAP = {
  '比肩': '意志坚定，自尊心强，但易固执。',
  '劫财': '个性强，易冲动，好胜心切。',
  '食神': '温和多情，重视物质，有口福。',
  '伤官': '才华横溢，傲物气高，易犯口舌。',
  '偏财': '慷慨豪爽，善于交际，轻财重义。',
  '正财': '勤劳节俭，现实踏实，重视家庭。',
  '七杀': '豪侠好胜，刚毅果断，易走极端。',
  '正官': '正直负责，循规蹈矩，重视名誉。',
  '偏印': '精明干练，多才多艺，性格孤僻。',
  '正印': '仁慈端庄，聪明智慧，依赖心强。'
};

// --- 辅助函数 ---

const getGanWuxing = (gan) => {
  if (['甲', '乙'].includes(gan)) return '木';
  if (['丙', '丁'].includes(gan)) return '火';
  if (['戊', '己'].includes(gan)) return '土';
  if (['庚', '辛'].includes(gan)) return '金';
  if (['壬', '癸'].includes(gan)) return '水';
  return '';
};

const getZhiWuxing = (zhi) => {
  if (['寅', '卯'].includes(zhi)) return '木';
  if (['巳', '午'].includes(zhi)) return '火';
  if (['辰', '戌', '丑', '未'].includes(zhi)) return '土';
  if (['申', '酉'].includes(zhi)) return '金';
  if (['亥', '子'].includes(zhi)) return '水';
  return '';
};

// 模拟“身强身弱”判断 (简化版)
const checkStrength = (dayGan, monthZhi) => {
  const ganWx = getGanWuxing(dayGan);
  const zhiWx = getZhiWuxing(monthZhi);
  // 同我者为比劫，生我者为印枭 -> 身强
  // 克我者为官杀，我克者为财，我生者为食伤 -> 身弱
  // 这里简单判断：月令五行生助日干则为得令（偏强），否则失令（偏弱）
  const relations = {
    '木': { '木': '旺', '水': '相', '火': '休', '土': '囚', '金': '死' },
    '火': { '火': '旺', '木': '相', '土': '休', '金': '囚', '水': '死' },
    '土': { '土': '旺', '火': '相', '金': '休', '水': '囚', '木': '死' },
    '金': { '金': '旺', '土': '相', '水': '休', '木': '囚', '火': '死' },
    '水': { '水': '旺', '金': '相', '木': '休', '火': '囚', '土': '死' }
  };
  const status = relations[ganWx][zhiWx];
  return ['旺', '相'].includes(status) ? '身强' : '身弱';
};

// --- 核心生成逻辑 ---

export const calculateFortune = (year, month, day, hour, minute = 0, gender = 1) => {
  // gender: 1男 0女
  const solar = Solar.fromYmdHms(parseInt(year), parseInt(month), parseInt(day), parseInt(hour), parseInt(minute), 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  
  // 获取运势，gender: 1男 0女 (lunar-javascript 1为男, 0为女)
  const yun = eightChar.getYun(gender === 1 ? 1 : 0);

  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const monthZhi = eightChar.getMonthZhi();
  const ganWx = getGanWuxing(dayGan);
  const strength = checkStrength(dayGan, monthZhi);

  // 1. 命主八字排盘
  const basicInfo = {
    solar: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${solar.getHour()}点${solar.getMinute()}分`,
    bazi: `${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${eightChar.getTime()}`,
    wuxing: `${eightChar.getYearWuXing()} ${eightChar.getMonthWuXing()} ${eightChar.getDayWuXing()} ${eightChar.getTimeWuXing()}`,
    dayMaster: `${dayGan}${ganWx}（生于${monthZhi}月，${strength}）`,
    gender: gender === 1 ? '男命' : '女命'
  };

  // 2. 核心命局解析
  const coreAnalysis = generateCoreAnalysis(eightChar, dayGan, ganWx, strength);

  // 3. 一生运势关键节点
  const milestones = generateMilestones(yun, eightChar, gender);

  // 4. 婚姻感情
  const marriage = generateMarriage(eightChar, gender);

  // 5. 终极论断
  const verdict = generateVerdict(eightChar, milestones);

  return {
    basic: basicInfo,
    core: coreAnalysis,
    milestones: milestones,
    marriage: marriage,
    verdict: verdict
  };
};

const generateCoreAnalysis = (eightChar, dayGan, ganWx, strength) => {
  const attr = WUXING_ATTR[ganWx];
  
  // 模拟格局判断
  const patterns = [
    `日主${dayGan}${ganWx}，生于${eightChar.getMonthZhi()}月，${strength === '身强' ? '得令而旺' : '失令而弱'}。`,
    strength === '身强' ? `喜用神宜取克泄耗（官杀、食伤、财），忌印比。` : `喜用神宜取生扶（印枭、比劫），忌克泄。`,
    `年柱${eightChar.getYearGan()}透出，月令${eightChar.getMonthZhi()}为根基。`
  ];

  // 模拟具体断语
  const specifics = [
    `格局特点：${ganWx}气${strength === '身强' ? '充盈' : '不足'}，${strength === '身强' ? '需有制化方能成材' : '需有生扶方能立世'}。`,
    `性格特征：${attr.trait} ${SHISHEN_MAP['比肩']}`, // 简单拼接
    `体貌特征：${attr.body} ${strength === '身弱' ? '气色稍显暗沉，需补气血。' : '精神饱满，目光有神。'}`
  ];

  return {
    patterns: patterns,
    specifics: specifics,
    body: attr.body
  };
};

const generateMilestones = (yun, eightChar, gender) => {
  const daYunList = yun.getDaYun();
  const milestones = {
    study: [],
    career: []
  };

  // 遍历大运
  const daYuns = daYunList.slice(0, 6); // 取前6步大运，通常覆盖到70-80岁
  
  daYuns.forEach((dy, index) => {
    const startYear = dy.getStartYear();
    const endYear = dy.getEndYear();
    const ganZhi = dy.getGanZhi();
    const gan = ganZhi.substring(0, 1);
    const zhi = ganZhi.substring(1, 2);
    const dyWx = getGanWuxing(gan);
    
    const ageRange = `${dy.getStartAge()}-${dy.getEndAge()}岁`;
    const period = `${startYear}-${endYear}`;
    const title = `${gan}${zhi}大运（${period}）`;

    let content = "";
    
    // 根据大运五行和日主五行关系生成“伪”断语
    const dayGan = eightChar.getDayGan();
    const dayWx = getGanWuxing(dayGan);
    
    if (dyWx === dayWx) {
      content = `比劫帮身运。${dayWx === '火' ? '兄弟朋友助力大，但也易因义气破财。' : '自信心增强，利于合作创业。'}`;
    } else if ((dayWx === '木' && dyWx === '火') || (dayWx === '火' && dyWx === '土') || (dayWx === '土' && dyWx === '金') || (dayWx === '金' && dyWx === '水') || (dayWx === '水' && dyWx === '木')) {
      content = `食伤泄秀运。才华发挥，利于学业、技艺提升，但需防口舌是非。`;
    } else if ((dayWx === '木' && dyWx === '土') || (dayWx === '火' && dyWx === '金') || (dayWx === '土' && dyWx === '水') || (dayWx === '金' && dyWx === '木') || (dayWx === '水' && dyWx === '火')) {
      content = `财星当令运。财运亨通，男命利于婚恋，事业上有实质性收益。`;
    } else {
      content = `官杀克身运。压力较大，但也是掌权晋升的好时机，需注意身体健康。`;
    }

    // 挑选流年 (模拟)
    // getLiuNian() 返回本大运十年的流年列表
    const liuNianList = dy.getLiuNian();
    if (liuNianList && liuNianList.length > 2) {
      const notableLiuNian = liuNianList[2]; // 取第3年
      const notableYear = notableLiuNian.getYear();
      const lnGanZhi = notableLiuNian.getGanZhi();
      const liuNianGan = lnGanZhi.substring(0, 1);
      const liuNianZhi = lnGanZhi.substring(1, 2);
      
      content += `\n  · ${notableYear}${lnGanZhi}年：${['甲','丙','戊','庚','壬'].includes(liuNianGan) ? '岁运并临，变动较大' : '运势平稳，稳中求进'}。`;
    }

    if (dy.getStartAge() < 22) {
      milestones.study.push({ title, content });
    } else {
      milestones.career.push({ title, content });
    }
  });

  return milestones;
};

const generateMarriage = (eightChar, gender) => {
  const dayZhi = eightChar.getDayZhi();
  const spouseStar = gender === 1 ? '正财' : '正官'; // 简易版
  
  const spouseDesc = {
    '子': '聪明机灵，身材娇小，肤色偏黑。',
    '丑': '敦厚老实，顾家，但略显固执。',
    '寅': '身材高大，正直善良，有进取心。',
    '卯': '秀气端庄，温柔体贴，人缘好。',
    '辰': '聪明有才，但个性较强，喜自由。',
    '巳': '热情开朗，心思细腻，爱打扮。',
    '午': '性急热情，长相出众，异性缘好。',
    '未': '温和谦让，行事谨慎，重感情。',
    '申': '聪明好动，反应快，口才好。',
    '酉': '皮肤白皙，注重仪表，有洁癖。',
    '戌': '忠诚可靠，朴实无华，能吃苦。',
    '亥': '温和善良，感性多情，易心软。'
  };

  return {
    spouse: `日支妻宫坐【${dayZhi}】，配偶${spouseDesc[dayZhi]}`,
    timing: `预计在${['午','未'].includes(dayZhi) ? '26-28' : '28-32'}岁左右成婚概率较大。`,
    quality: `夫妻宫${['子','午','卯','酉'].includes(dayZhi) ? '为桃花地，感情丰富但也易生波折' : '为四库地，感情稳定平淡'}。`
  };
};

const generateVerdict = (eightChar, milestones) => {
  const dayGan = eightChar.getDayGan();
  const ganWx = getGanWuxing(dayGan);
  
  return {
    wealth: `一生财运${['甲','乙','丙'].includes(dayGan) ? '起伏较大，中年后富足' : '细水长流，晚年积蓄丰厚'}。`,
    contradiction: `命局核心在于${ganWx}气是否流通，需防${ganWx === '水' ? '土' : ganWx === '火' ? '水' : '金'}运克制太过。`,
    advice: `建议向${ganWx === '木' ? '东' : ganWx === '火' ? '南' : ganWx === '金' ? '西' : ganWx === '水' ? '北' : '中'}方发展，从事${WUXING_ATTR[ganWx].career}相关行业。`
  };
};



