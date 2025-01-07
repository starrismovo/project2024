const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../public/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const carBrands = {
  '大众': ['朗逸', '速腾', '帕萨特', '迈腾', '高尔夫'],
  '丰田': ['卡罗拉', '凯美瑞', 'RAV4', '雷凌', '普拉多'],
  '本田': ['雅阁', '思域', 'CR-V', '飞度', '缤智'],
  '日产': ['轩逸', '天籁', '奇骏', '逍客', '骐达'],
  '别克': ['英朗', '君威', '昂科威', '威朗', '君越'],
  '现代': ['领动', '索纳塔', '途胜', '伊兰特', '胜达'],
  '福特': ['福克斯', '蒙迪欧', '翼虎', '锐际', '探险者'],
  '奔驰': ['C级', 'E级', 'A级', 'GLC', 'GLA'],
  '宝马': ['3系', '5系', 'X1', 'X3', 'X5'],
  '奥迪': ['A4L', 'A6L', 'Q5L', 'Q3', 'A3']
};

const vehicleGroups = ['SUV', '轿车', '跑车', 'MPV'];
const fuelTypes = ['汽油', '柴油', '混动', '纯电'];
const bodyTypes = ['两厢', '三厢', 'SUV', 'MPV', '跑车'];
const years = ['2018', '2019', '2020', '2021', '2022'];

function generateData() {
  let data = [];
  const brands = Object.keys(carBrands);
  
  for (let i = 0; i < 4000; i++) {
    // 随机选择品牌和对应车型
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const models = carBrands[brand];
    const model = models[Math.floor(Math.random() * models.length)];
    
    // 根据品牌定义基础价格区间
    let basePrice;
    if (['奔驰', '宝马', '奥迪'].includes(brand)) {
      basePrice = Math.floor(Math.random() * 300) + 250; // 25-55万
    } else {
      basePrice = Math.floor(Math.random() * 150) + 100; // 10-25万
    }
    
    // 根据年份调整价格和里程
    const year = years[Math.floor(Math.random() * years.length)];
    const yearIndex = years.indexOf(year);
    const depreciation = (5 - yearIndex) * 0.1; // 每年折旧10%
    const finalPrice = Math.floor(basePrice * (1 - depreciation));
    
    // 里程数与年份相关
    const baseMileage = Math.floor(Math.random() * 20000) + 5000;
    const mileage = baseMileage * (5 - yearIndex);

    data.push({
      name: `${brand} ${model}`,
      year: year,
      group: vehicleGroups[Math.floor(Math.random() * vehicleGroups.length)],
      mileage: mileage,
      enginePower: Math.floor(Math.random() * 200) + 100,
      fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
      bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
      salesPerTenThousand: Math.floor(Math.random() * 50) + 10,
      pricePerK: finalPrice,
      brand: brand,
      model: model,
      id: i + 1
    });
  }
  return data;
}

// 写入到文件
const outputPath = path.join(dataDir, 'vehicle_data.json');
const data = generateData();
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`数据已生成并保存到: ${outputPath}`);
