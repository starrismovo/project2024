function fontSize(res) {
    let clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}

function line0() {
  var myChart = echarts.init(document.getElementById('chart1'));
  var option = {
      grid: {
          left: "15%",
          top: "10%", // 调整顶部空间
          right: "3%",
          bottom: "15%" // 增加底部空间
      },
      tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {
          data: [
              "微型车",
              "厢型车",
              "大巴车",
              "敞篷车",
              "双门汽车",
              "商务车"
          ],
          top: '92%',
          textStyle: {
              color: '#0DCAD2'
          }
      },
      xAxis: {
          type: 'category',
          data: ["微型车", "厢型车", "大巴车", "敞篷车", "双门汽车", "商务车"],
          axisLabel: {
              show: true,
              interval: 0,
              color: '#fff',
              fontSize: 13
          }
      },
      yAxis: {
          type: 'value',
          axisLabel: {
              show: true,
              color: '#fff',
              fontSize: 14
          },
          splitLine: {
              show: true,
              lineStyle: {
                  color: 'rgba(255,255,255,0.1)'
              }
          }
      },
      series: [{
        type: 'bar',
        data: [
            {value: 35272, name: '微型车'},
            {value: 30324, name: '厢型车'},
            {value: 13491, name: '大巴车'},
            {value: 9609, name: '敞篷车'},
            {value: 7607, name: '双门汽车'},
            {value: 6482, name: '商务车'}
        ],
        barWidth: '40%',
        itemStyle: {
            normal: {
                color: function(params) {
                    var colorList = [
                        ['#14c8d4', '#00eaff'],
                        ['#00ffd8', '#00c6ff'],
                        ['#00ff9b', '#00c6ff'],
                        ['#89f7fe', '#66a6ff'],
                        ['#cd9cf2', '#66a6ff'],
                        ['#a8edea', '#fed6e3']
                    ];
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: colorList[params.dataIndex][0]
                    }, {
                        offset: 1,
                        color: colorList[params.dataIndex][1]
                    }]);
                },
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10,
                borderRadius: [5, 5, 0, 0]
            }
        },
        label: {
            show: true,
            position: 'top',
            color: '#fff',
            formatter: '{c}辆'
        },
        // 动画效果
        animation: true,
        animationDuration: 1300,
        animationEasing: 'cubicOut',
        animationDelay: function (idx) {
            return idx * 115;
        },
        animationDurationUpdate: 1000
    },
    // 添加水波纹效果
    {
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: [
            [0, 35272], [1, 30324], [2, 13491],
            [3, 9609], [4, 7607], [5, 6482]
        ],
        symbolSize: 10,
        showEffectOn: 'render',
        rippleEffect: {
            period: 3,
            scale: 3,
            brushType: 'stroke'
        },
        itemStyle: {
            normal: {
                color: '#fff',
                shadowBlur: 10,
                shadowColor: '#fff'
            }
        },
        silent: true
    }]
};

// 添加呼吸灯效果
let breathEffect = setInterval(() => {
    option.series[0].itemStyle.normal.shadowBlur = 
        10 + Math.sin(Date.now() / 500) * 5;
    myChart.setOption(option);
}, 50);


  myChart.setOption(option);
  // 清理定时器
    window.addEventListener("beforeunload", () => {
        clearInterval(breathEffect);
    });

    window.addEventListener("resize", function() {
        myChart.resize();
    });
}

line0();


//http://192.168.43.63:8080/factor/sale
// 异步获取后端数据

function calculateMovingAverage(data, windowSize) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const window = data.slice(start, i + 1);
      const average = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(average);
  }
  return result;
}

// 使用最小二乘法计算趋势线
function calculateTrendLine(data) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  // 计算各项和
  for(let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
  }
  
  // 计算斜率和截距
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // 生成趋势线数据点
  const trendData = [];
  for(let i = 0; i < n; i++) {
      trendData.push(slope * i + intercept);
  }
  
  return trendData;
}
function normalizeToRange(data, targetData) {
  const maxTarget = Math.max(...targetData);
  const minTarget = Math.min(...targetData);
  const range = maxTarget - minTarget;
  
  return data.map(val => {
      return minTarget + (val - Math.min(...data)) / 
             (Math.max(...data) - Math.min(...data)) * range;
  });
}
async function fetchData() {
  try {
    const response = await fetch('public/data/sale.json');
    const data = await response.json();
    return data; // 假设后端返回的数据包含类似：{ regDate: [...], totalSales: [...] }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function line1() {
  var chartDom1 = document.querySelector("#barchart");
  if (!chartDom1) {
    console.error("Container #barchart not found!");
    return;
  }

  var myChart = echarts.init(chartDom1);

  // 获取后端数据
  const dataFromBackend = await fetchData();
  if (dataFromBackend) {
    var data1 = dataFromBackend.totalSales || mddatabox; // 后端数据，如果没有，使用默认数据
    var datedata2 = dataFromBackend.regDate || datedata2; // 后端月份数据，如果没有，使用默认月份数据

    var option1 = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
      },
      toolbox: {
        show: true,
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '4%',
        bottom: '0%',
        containLabel: true
      },
      legend: {
        data: ['销量', '趋势线'], // 设置图例标签
        top: '5%',  // 设置图例的位置
        left: 'center',  // 设置图例居中
        textStyle: {
          color: '#fff',  // 图例字体颜色
        }
      },
      xAxis: [{
        type: 'category',
        data: datedata2,
        axisLabel: {
          show: true,
          textStyle: { color: "#ebf8ac" }
        },
        axisLine: {
          lineStyle: { color: '#01FCE3' }
        },
      }],
      yAxis: [
        {
          type: 'value',
          name: '销量',
          axisLabel: {
            formatter: '{value} ',
            textStyle: { color: "#2EC7C9" }
          },
          axisLine: {
            lineStyle: { color: '#01FCE3' }
          },
        },
      ],
      series: [
        {
            name: '销量',
            type: 'bar',
            itemStyle: {
                normal: {
                    barBorderRadius: 5,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#00FFE3" },
                        { offset: 1, color: "#4693EC" }
                    ])
                }
            },
            data: data1,
            z: 1  // 设置柱状图层级
        },
        {
            name: '趋势线',
            type: 'line',
            smooth: true,
            lineStyle: { 
                color: '#FF5733',
                width: 2,
                opacity: 0.8  // 添加透明度
            },
            data: normalizeToRange(calculateTrendLine(data1), data1),
            symbol: 'none',
            z: 2,  // 设置趋势线层级
            yAxisIndex: 0  // 使用同一个y轴
        },
        {
            name: '移动平均',
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#FFD700',
                width: 2,
                type: 'dashed',
                opacity: 0.8  // 添加透明度
            },
            data: normalizeToRange(calculateMovingAverage(data1, 3), data1),
            symbol: 'none',
            z: 3  // 设置移动平均线层级
        }
    ]
    };

    myChart.setOption(option1);
  }

  // 监听窗口尺寸变化，自动调整图表大小
  window.addEventListener('resize', function () {
    myChart.resize();
  });
}

// 生成趋势线数据：简单地连接各点（线性趋势）
function generateTrendLineData(dates, sales) {
  const trendLineData = [];
  for (let i = 0; i < dates.length; i++) {
    trendLineData.push([dates[i], sales[i]]);
  }
  return trendLineData;
}

line1();



// 计算滚动平均
function calculateRollingAverage(data, windowSize) {
  var result = [];
  for (let i = 0; i < data.length; i++) {
    let start = Math.max(i - windowSize + 1, 0);
    let windowData = data.slice(start, i + 1);
    let average = windowData.reduce((sum, val) => sum + val, 0) / windowData.length;
    result.push(average);
  }
  return result;
}

line1();

//
//http://192.168.43.63:8080/factor/mileage
function line2() {
  var chartDom = document.getElementById('scatterchart');
  var myChart = echarts.init(chartDom);
  
  // 定义数据请求函数
  async function fetchData() {
    try {
      const response = await fetch('public/data/mileage.json', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('网络请求失败');
      }
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('数据请求失败:', error);
    }
  }

  // 处理数据并设置到图表配置项的函数
  function setChartData(rawData) {
    const seriesData = [];
    rawData.forEach(item => {
      const kilometer = parseFloat(item.kilometer);
      const avgPrice = item.avgPrice / 10000;  // 将价格单位转换为万元，假设原数据单位是元，可按需调整
      seriesData.push([kilometer, avgPrice]);
    });

    // 计算趋势线数据
    const trendLineData = calculateTrendLine(seriesData);

    const option = {
      backgroundColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(0,17,70,0.3)' },
        { offset: 1, color: 'rgba(0,10,30,0.3)' }
    ]),
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
        formatter: '行驶里程: {b} km<br/>价格: {c} 万元'
      },
      grid: {
        top: '15%',  // 调整这个值，图表会向上移动
        left: '3%',
        right: '15%',
        bottom: '5%',
        containLabel: true,
        show: false
      },
      xAxis: {
        type: 'value',
        name: '行驶里程 (km)',
        axisLabel: { formatter: '{value}' },
        axisLine: {
          lineStyle: { color: '#01FCE3' }
        },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        name: '价格 (万元)',
        nameTextStyle: {
            color: '#01FCE3',
            fontSize: 14
        },
        axisLabel: { 
            formatter: '{value}',
            color: '#01FCE3'
        },
        axisLine: {
            lineStyle: { color: '#01FCE3' }
        },
        splitLine: { show: false }
    },
      series: [
        {
          symbol: 'circle',
          symbolSize: function (value) {
            // 将散点大小增大
            return Math.sqrt(value[1]) * 9;  // 适当增加缩放比例，调整为更大的散点
          },
          data: seriesData,
          type: 'scatter',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#00FFE3' },
                { offset: 1, color: '#4693EC' }
              ]),
              opacity: 0.8, // 设置透明度，避免点重叠
              shadowColor: '#aaa', // 添加阴影效果，增加层次感
              shadowBlur: 10 // 阴影模糊度
            },
            emphasis: {
              opacity: 1,
              shadowBlur: 20
          }
          },
          animationDelay: function (idx) {
            return idx * 10; // 设置动画延时，使点逐个出现
          },
          animationDuration: 1500,
          animationEasing: 'cubicOut'
        },
        {
          data: trendLineData,
          type: 'line',
          smooth: true,
          lineStyle: { 
            color: 'rgba(255,87,51,0.6)',
                    width: 2,
                    shadowColor: 'rgba(255,87,51,0.3)',
                    shadowBlur: 10
          },
          symbol: 'none',  // 不显示数据点
          animationDuration: 2000, // 设置动画时长
        }
      ]
    };

    myChart.setOption(option);
  }

  // 简单的线性回归算法，返回趋势线数据
  function calculateTrendLine(data) {
    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point[0], 0);
    const sumY = data.reduce((sum, point) => sum + point[1], 0);
    const sumXY = data.reduce((sum, point) => sum + point[0] * point[1], 0);
    const sumX2 = data.reduce((sum, point) => sum + point[0] * point[0], 0);
    
    // 计算回归系数
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // 根据数据范围生成趋势线的坐标点
    const minX = Math.min(...data.map(point => point[0]));
    const maxX = Math.max(...data.map(point => point[0]));
    
    const trendLine = [];
    for (let x = minX; x <= maxX; x++) {
      const y = slope * x + intercept;
      trendLine.push([x, y]);
    }
    
    return trendLine;
  }

  // 调用数据请求函数获取数据
  fetchData();

  // 监听窗口大小变化，自动调整图表大小
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

// 调用函数生成图表
line2();




//上1

function line3() {
  var myChart = echarts.init(document.querySelector(".line3"));

  // 定义指标
  const indicators = [
      { name: '价格', max: 100 },
      { name: '车龄', max: 100 },
      { name: '行驶里程', max: 100 },
      { name: '配置评分', max: 100 },
      { name: '品牌保值率', max: 100 }
  ];

  // 车辆数据
  const data = [
      {
          value: [47.5, 4.5, 4.8, 9.6, 57.4], // 福特 F-150
          name: '福特 F-150'
      },
      {
          value: [9.28, 3, 10, 7.4, 61.6], // 本田 思域
          name: '本田 思域'
      },
      {
          value: [49.9, 2.5, 11, 8.9, 71.2], // 宝马 X5
          name: '宝马 X5'
      },
      {
          value: [17.8, 7, 8.4, 8.1, 57.5], // 雪佛兰 科迈罗
          name: '雪佛兰 科迈罗'
      },
      {
          value: [17.6, 6, 10, 8.8, 59.1], // 奥迪 A6
          name: '奥迪 A6'
      }
  ];

  // 数据标准化（将每个指标映射到 0-100）
  const normalizedData = data.map(car => {
      return {
          name: car.name,
          value: [
              (car.value[0] / 50) * 100, // 价格（假设 50 是最大价格）
              (10 - car.value[1]) * 10, // 车龄（假设 10 年为最大，越新分越高）
              (15 - car.value[2]) * 10, // 行驶里程（假设 15 万公里为最大，越少分越高）
              (car.value[3] / 10) * 100, // 配置评分（满分 10）
              car.value[4] // 品牌保值率原值即为分数
          ]
      };
  });

  // 雷达图配置
  const option = {
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.6)',
          borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {
          data: normalizedData.map(car => car.name),
          orient: 'vertical', // 垂直排列
          left: '5%', // 靠左
          textStyle: {
              color: '#ffffff'
          }
      },
      radar: {
          indicator: indicators,
          radius: '65%',
          center: ['60%', '45%'],
          splitLine: {
              lineStyle: {
                  color: '#adf3e6' // 设置网格线颜色
              }
          },
          axisLine: {
              lineStyle: {
                  color: '#adf3e6' // 设置轴线颜色
              }
          }
      },
      series: [
          {
              name: '综合性价比',
              type: 'radar',
              data: normalizedData,
              areaStyle: {
                  opacity: 0.2 // 设置雷达图区域填充透明度
              },
              lineStyle: {
                  width: 2 // 设置雷达图边线宽度
              }
          }
      ]
  };

  myChart.setOption(option);

  // 自适应
  window.addEventListener("resize", function () {
      myChart.resize();
  });
}

line3();




//
//http://192.168.43.63:8080/factor/platbox
function line4() {
  $.when(
    $.get('public/data/platbox.json'), // 使用你的后端接口
    $.getScript('https://fastly.jsdelivr.net/npm/echarts-simple-transform/dist/ecSimpleTransform.min.js') // 引入 ECharts 简单变换库
  ).done(function (res) {
    var chartDom = document.querySelector('.con_f.line4'); // 获取对应的容器
    var myChart = echarts.init(chartDom); // 初始化 ECharts 实例
    run(res[0], myChart); // 将从后端返回的数据和 ECharts 实例传递给 run 方法
  });

  function run(_rawData, myChart) {
    // 注册ecSimpleTransform聚合转换
    echarts.registerTransform(ecSimpleTransform.aggregate);

    // 后端返回的数据
    var backendData = _rawData; // 直接使用从后端返回的 _rawData

    // 处理数据，将数据格式转换为 ECharts 箱线图要求的格式

    // 配置 ECharts 图表选项
    var option = {
      dataset: [
        {
          id: 'raw',
          source: backendData  // 使用从后端返回的数据
        },
        {
          id: 'income_aggregate',
          fromDatasetId: 'raw',
          transform: [
            {
              type: 'ecSimpleTransform:aggregate',
              config: {
                resultDimensions: [
                  { name: 'min', from: 'min', method: 'min' },
                  { name: 'Q1', from: 'q1', method: 'min' },
                  { name: 'median', from: 'median', method: 'median' },
                  { name: 'Q3', from: 'q3', method: 'max' },
                  { name: 'max', from: 'max', method: 'max' },
                  { name: 'brands', from: 'brands' }
                ],
                groupBy: 'brands'  // 根据品牌进行分组
              }
            }
          ]
        }
      ],
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: 'rgba(0,0,0,0.6)',
          borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
          axisPointer: {
              type: 'shadow'
          }
      },
      xAxis: {
        name: 'Price',
        nameLocation: 'right',
        nameGap: 30,
        scale: true,
        min:10000,
        max:100000,
      boundaryGap: [0, '5%'],  // 设置一些边距
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          color: '#adf3e6', // 设置标签文字颜色
          // fontSize: 12 // 可选：调整字体大小
      },
        data: backendData.map(function(item) { return item.brands; })  // 使用品牌名称作为 Y 轴
      },
      grid: {
        top: 10,
        bottom: 80,
        left:90
      },
      dataZoom: [
        {
          type: 'slider',  // 设置为滑动条类型
          show: true,  // 确保显示
          start: 0,  // 初始显示范围的起点
          end: 100,  // 初始显示范围的终点
          height: 20,  // 设置高度
          bottom: 35,  // 设置位置
          xAxisIndex: [0],  // 绑定到x轴
          zoomLock: false  // 允许自由缩放
        },
        {
          type: 'inside',  // 设置为内部缩放
          show: true,  // 确保显示
          start: 0,
          end: 100,
          xAxisIndex: [0],  // 绑定到x轴
          zoomLock: false  // 允许自由缩放
        }
      ],
      series: [
        {
          name: 'boxplot',
          type: 'boxplot',
          datasetId: 'income_aggregate',
          itemStyle: {
            color: '#b8c5f2'
          },
          encode: {
            x: ['min', 'Q1', 'median', 'Q3', 'max'],
            y: 'brands',
            itemName: ['brands'],
            tooltip: ['min', 'Q1', 'median', 'Q3', 'max']
          }
        }
      ]
    };

    // 设置 ECharts 配置项并渲染图表
    myChart.setOption(option);

    // 监听窗口大小变化，保持图表响应式
    window.addEventListener("resize", function() {
      myChart.resize();
    });
  }
}

// 调用函数来执行绘制图表逻辑
line4();





var app = {};

var chartDom = document.getElementById('scatterPlotContainer');
var myChart1 = echarts.init(chartDom);
var option;

const indices = {
  name: 0,
  group: 1,
  id: 8
};
const schema = [
  { name: 'name', index: 0 },
  { name: 'group', index: 1 },
  { name: 'mileage', index: 2, text: '行驶里程(km)' },
  { name: 'enginePower', index: 3, text: '发动机功率(hp)' },
  { name: 'salesPerTenThousand', index: 6, text: '销量(万辆)' },
  { name: 'pricePerK', index: 7, text: '价格(千元)' }
];
const axisColors = {
  xAxisLeft: '#2A8339',
  xAxisRight: '#367DA6',
  yAxisTop: '#A68B36',
  yAxisBottom: '#BD5692'
};
const colorBySchema = {};
const fieldIndices = schema.reduce(function (obj, item) {
  obj[item.name] = item.index;
  return obj;
}, {});
const groupCategories = [];
const groupColors = [];
let data;
// zlevel 为 1 的层开启尾迹特效
myChart1.getZr().configLayer(1, {
  motionBlur: true
});
function normalizeData(originData) {
  let groupMap = {};
  
  // 转换数据格式为数组格式
  const formattedData = originData.map(item => [
    item.name,
    item.group,
    item.mileage,
    item.enginePower,
    item.fuelType,
    item.bodyType,
    item.salesPerTenThousand,
    item.pricePerK,
    item.id
  ]);

  formattedData.forEach(function(row) {
    let groupName = row[indices.group];
    if (!groupMap.hasOwnProperty(groupName)) {
      groupMap[groupName] = 1;
    }
  });

  formattedData.forEach(function(row) {
    // 只转换数值类型的数据
    [2, 3, 6, 7].forEach(index => {
      row[index] = parseFloat(row[index]) || 0;
    });
  });

  for (let groupName in groupMap) {
    if (groupMap.hasOwnProperty(groupName)) {
      groupCategories.push(groupName);
    }
  }

  let hStep = Math.round(300 / (groupCategories.length - 1));
  for (let i = 0; i < groupCategories.length; i++) {
    groupColors.push(echarts.color.modifyHSL('#5A94DF', hStep * i));
  }

  return formattedData;
}
function makeAxis(dimIndex, id, name, nameLocation) {
  const axisColor = axisColors[id.split('-')[dimIndex]];
  const schemaItem = schema.find(item => item.name === name);
  colorBySchema[name] = axisColor;
  return {
    id: id,
    name: schemaItem ? schemaItem.text : name,
    nameLocation: nameLocation,
    nameGap: nameLocation === 'middle' ? 30 : 10,
    gridId: id,
    splitLine: { show: false },
    axisLine: {
      lineStyle: {
        color: axisColor
      }
    },
    axisLabel: {
      color: axisColor,
      formatter: function(value) {
        return value.toLocaleString();
      }
    },
    axisTick: {
      lineStyle: {
        color: axisColor
      }
    }
  };
}

function makeSeriesData(xLeftOrRight, yTopOrBottom) {
  return data.map(function (item, idx) {
    const schemaX = app.config[xLeftOrRight];
    const schemaY = app.config[yTopOrBottom];
    return [
      item[fieldIndices[schemaX]],
      item[fieldIndices[schemaY]],
      item[1],
      item[0],
      schemaX,
      schemaY,
      idx // 6
    ];
  });
}
function makeSeries(xLeftOrRight, yTopOrBottom) {
  let id = xLeftOrRight + '-' + yTopOrBottom;
  return {
    zlevel: 1,
    type: 'scatter',
    name: 'nutrients',
    xAxisId: id,
    yAxisId: id,
    symbolSize: 8,
    emphasis: {
      itemStyle: {
        color: '#fff'
      }
    },
    data: makeSeriesData(xLeftOrRight, yTopOrBottom)
  };
}
function makeDataZoom(opt) {
  return Object.assign(
    {
      type: 'slider',
      filterMode: 'empty',
      realtime: false
    },
    opt
  );
}
function tooltipFormatter(params) {
  let resultHTML = [];
  params.forEach(function(item) {
    const data = item.data;
    const schemaX = schema.find(s => s.name === data[4]);
    const schemaY = schema.find(s => s.name === data[5]);
    
    resultHTML.push(
      `<div style="margin: 10px 0">
        <b>${data[3]}</b><br/>
        ${schemaX.text}: ${data[0].toLocaleString()}<br/>
        ${schemaY.text}: ${data[1].toLocaleString()}<br/>
        类型: ${data[2]}
      </div>`
    );
  });
  return resultHTML.join('');
}
function getOption(_data) {
  let gridWidth = '38%';
  let gridHeight = '32%';
  let gridLeft = 80;
  let gridRight = 45;
  let gridTop = 65;
  let gridBottom = 80;
  return {
    tooltip: {
      trigger: 'none',
      padding: [10, 20, 10, 20],
      backgroundColor: 'rgba(0,0,0,0.7)',
      transitionDuration: 0,
      extraCssText: 'width: 300px; white-space: normal',
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      position: function (pos, _params, _el, _elRect, size) {
        let obj = {};
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 60;
        obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 20;
        return obj;
      },
      formatter: tooltipFormatter
    },
    axisPointer: {
      show: true,
      snap: true,
      lineStyle: {
        type: 'dashed'
      },
      label: {
        show: true,
        margin: 6,
        backgroundColor: '#556',
        color: '#fff'
      },
      link: [
        {
          xAxisId: ['xAxisLeft-yAxisTop', 'xAxisLeft-yAxisBottom']
        },
        {
          xAxisId: ['xAxisRight-yAxisTop', 'xAxisRight-yAxisBottom']
        },
        {
          yAxisId: ['xAxisLeft-yAxisTop', 'xAxisRight-yAxisTop']
        },
        {
          yAxisId: ['xAxisLeft-yAxisBottom', 'xAxisRight-yAxisBottom']
        }
      ]
    },
    
    xAxis: [
      makeAxis(0, 'xAxisLeft-yAxisTop', '行驶里程', 'middle'),
      makeAxis(0, 'xAxisLeft-yAxisBottom', '价格', 'middle'),
      makeAxis(0, 'xAxisRight-yAxisTop', '功率', 'middle'),
      makeAxis(0, 'xAxisRight-yAxisBottom', '功率', 'middle')
    ],
    yAxis: [
      makeAxis(1, 'xAxisLeft-yAxisTop', '/k元', 'end'),
      makeAxis(1, 'xAxisLeft-yAxisBottom', '/万辆', 'end'),
      makeAxis(1, 'xAxisRight-yAxisTop', '/k元', 'end'),
      makeAxis(1, 'xAxisRight-yAxisBottom', '/万辆', 'end')
    ],
    
    grid: [
      {
        id: 'xAxisLeft-yAxisTop',
        left: gridLeft,
        top: gridTop,
        width: gridWidth,
        height: gridHeight
      },
      {
        id: 'xAxisLeft-yAxisBottom',
        left: gridLeft,
        bottom: gridBottom,
        width: gridWidth,
        height: gridHeight
      },
      {
        id: 'xAxisRight-yAxisTop',
        right: gridRight,
        top: gridTop,
        width: gridWidth,
        height: gridHeight
      },
      {
        id: 'xAxisRight-yAxisBottom',
        right: gridRight,
        bottom: gridBottom,
        width: gridWidth,
        height: gridHeight
      }
    ],
    //滚轴的代码
    dataZoom: [
      makeDataZoom({
        width: gridWidth,
        height: 25,
        left: gridLeft,
        bottom: 10,
        xAxisIndex: [0, 1]
      }),
      makeDataZoom({
        width: gridWidth,
        height: 25,
        right: gridRight,
        bottom: 10,
        xAxisIndex: [2, 3]
      }),
      makeDataZoom({
        orient: 'vertical',
        width: 25,
        height: gridHeight,
        left: 10,
        top: gridTop,
        yAxisIndex: [0, 2]
      }),
      makeDataZoom({
        orient: 'vertical',
        width: 25,
        height: gridHeight,
        left: 10,
        bottom: gridBottom,
        yAxisIndex: [1, 3]
      })
    ],
    visualMap: [
      {
        show: false,
        type: 'piecewise',
        categories: groupCategories,
        dimension: 2,
        inRange: {
           color: ['#d94e5d','#eac736','#50a3ba']
          
        },
        outOfRange: {
          color: ['#E3F3FF']
        },
        top: 20,
        textStyle: {
          color: '#fff'
        },
        realtime: false
      }
    ],
    series: [
      makeSeries('xAxisLeft', 'yAxisTop'),
      makeSeries('xAxisLeft', 'yAxisBottom'),
      makeSeries('xAxisRight', 'yAxisTop'),
      makeSeries('xAxisRight', 'yAxisBottom')
    ],
    animationThreshold: 5000,
    progressiveThreshold: 5000,
    animationEasingUpdate: 'cubicInOut',
    animationDurationUpdate: 2000
  };
}
const fieldNames = schema
  .map(function (item) {
    return item.name;
  })
  .slice(2);
app.config = {
  xAxisLeft: 'mileage',           // 左侧X轴显示里程
  yAxisTop: 'pricePerK',         // 上方Y轴显示价格
  xAxisRight: 'enginePower',      // 右侧X轴显示功率
  yAxisBottom: 'salesPerTenThousand',  // 下方Y轴显示销量
  onChange: function () {
    if (data) {
      colorBySchema[app.config.xAxisLeft] = axisColors.xAxisLeft;
      colorBySchema[app.config.xAxisRight] = axisColors.xAxisRight;
      colorBySchema[app.config.yAxisTop] = axisColors.yAxisTop;
      colorBySchema[app.config.yAxisBottom] = axisColors.yAxisBottom;
      myChart1.setOption({
        xAxis: [
          {
            name: app.config.xAxisLeft
          },
          {
            name: app.config.xAxisLeft
          },
          {
            name: app.config.xAxisRight
          },
          {
            name: app.config.xAxisRight
          }
        ],
        yAxis: [
          {
            name: app.config.yAxisTop
          },
          {
            name: app.config.yAxisBottom
          },
          {
            name: app.config.yAxisTop
          },
          {
            name: app.config.yAxisBottom
          }
        ],
        series: [
          {
            data: makeSeriesData('xAxisLeft', 'yAxisTop')
          },
          {
            data: makeSeriesData('xAxisLeft', 'yAxisBottom')
          },
          {
            data: makeSeriesData('xAxisRight', 'yAxisTop')
          },
          {
            data: makeSeriesData('xAxisRight', 'yAxisBottom')
          }
        ]
      });
    }
  }
};

app.configParameters = {
  xAxisLeft: {
    options: fieldNames
  },
  xAxisRight: {
    options: fieldNames
  },
  yAxisTop: {
    options: fieldNames
  },
  yAxisBottom: {
    options: fieldNames
  }
};
// 加载数据并应用到图表
fetch('public/data/vehicle_data.json')
  .then(response => response.json())
  .then(originData => {
    data = normalizeData(originData).slice(0, 1000);
    myChart1.setOption(getOption(data));
  });
  // 跟随窗口大小改变
window.addEventListener('resize', function () {
  myChart1.resize();
});




