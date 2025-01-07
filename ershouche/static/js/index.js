function fontSize(res) {
    let clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}


// 模拟每个年份的数据
const yearData = {
    1997: { volume: 500, amount: 200000, transactions: 300, age: 6 },
    1998: { volume: 600, amount: 250000, transactions: 350, age: 5 },
    1999: { volume: 700, amount: 300000, transactions: 400, age: 4 },
    // ... 添加更多年份数据
    2023: { volume: 1500, amount: 1000000, transactions: 900, age: 3 }
};

// 获取下拉选择器和显示数据的元素
const yearSelect = document.getElementById("yearSelect");
const volumeSpan = document.getElementById("volume");
const amountSpan = document.getElementById("amount");
const transactionsSpan = document.getElementById("transactions");
const ageSpan = document.getElementById("age");
//http://192.168.43.63:8080/market/trade
async function fetchYearData(year) {
    try {
        const response = await fetch("public/data/left1.json"); // 获取完整数据集
        if (!response.ok) {
            throw new Error("请求失败，状态码：" + response.status);
        }

        const allData = await response.json(); // 解析 JSON 数据
        if (allData[year]) {
            return allData[year]; // 返回指定年份的数据
        } else {
            throw new Error("所选年份数据不存在！");
        }
    } catch (error) {
        console.error("获取年份数据失败：", error);
        alert("数据加载失败，请稍后再试！");
        return null;
    }
}
// 更新数据的函数
async function updateData(year) {
    const data = await fetchYearData(year); // 从后端获取数据
    if (data) {
        volumeSpan.innerText = data.volume || 0;          // 交易量
        amountSpan.innerText = data.amount || 0;          // 成交金额
        transactionsSpan.innerText = data.transactions || 0; // 交易次数
        ageSpan.innerText = data.age || 0;                // 二手车车龄
    }
}

// 初始化页面时加载默认年份的数据
updateData(yearSelect.value);

// 监听下拉框变化事件
yearSelect.addEventListener("change", function () {
    const selectedYear = this.value; // 获取选中的年份
    updateData(selectedYear);        // 更新数据
});


function line1() {
    var myChart = echarts.init(document.querySelector(".line1"));
    const updateFrequency = 2000;  // 每次更新的时间间隔
    
    // 从后端请求数据
    fetch('public/data/left2.json')
        .then(response => response.json())
        .then(carData => {
            // 数据转换成 ECharts 格式
            const rawData = transformData(carData);

            // 提取年份列表
            const years = [...new Set(rawData.map(item => item[2]))].sort();
            let currentIndex  = 0;
            
            
             // 生成柔和蓝色系的颜色
            function generateBlueColor(index) {
    // 基础的浅蓝色 RGB（可以调整基准色调）
    const baseColor = [173, 216, 230];  // 浅蓝色的RGB

    // 控制颜色变化的幅度
    const variation = (index * 5) % 40;  // 控制色彩变化的幅度（小幅度）

    // 柔和的蓝色调变化，RGB值控制在一定范围内
    const r = Math.max(173, baseColor[0] + variation);  // R值不能小于173，保持浅蓝色调
    const g = Math.min(216, baseColor[1] - variation);  // G值不低于173，保持冷静的蓝色调
    const b = Math.max(200, baseColor[2] - variation);  // B值适当偏移，保持柔和

    // 返回柔和的蓝色
    return `rgb(${r}, ${g}, ${b})`;
            }


            // ECharts 配置项
            const option = {
                grid: { top: 8, bottom: 35, left: 82, right: 80,height: '80%' },
                xAxis: { max: 'dataMax' },
                dataset: {
                    source: rawData.filter(item => item[2] === years[currentIndex])
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    
                    axisLabel: {
                        show: true,
                        interval: 0, 
                        fontSize: 12,
                        formatter: '{value}',
                        // 动态设置 yAxis 标签颜色
                        color: function(value, index) {
                            return generateBlueColor(index);  // 使用generateBlueColor为每个标签设置颜色
                        },
                        
                    },
                    nameGap: 12  // 这个属性可以微调标签和柱子之间的距离 
                },
                series: [
                    {
                        realtimeSort: true,
                        seriesLayoutBy: 'column',
                        type: 'bar',
                        barWidth: 10,
                        barCategoryGap: '40%', 
                        encode: { x: 1, y: 0 }, // x:销量, y:品牌
                        label: {
                            show: true,
                            position: 'right',
                            valueAnimation: true,
                            fontSize: 16
                        },
                        itemStyle: {
                            color: function(params) {
                                return generateBlueColor(params.dataIndex);  // 根据索引为每个柱子设置不同的颜色
                            },
                        // 不加阴影
                
                        }
                    }
                ],
                graphic: {
                    elements: [
                        {
                            type: 'text',
                            right: 75,
                            bottom: 40,
                            style: {
                                text: years[currentIndex],
                                font: 'bolder 60px monospace',
                                fill: 'rgba(222, 178, 178, 0.4)'
                            }
                        }
                    ]
                },
                animationDurationUpdate: updateFrequency,
                animationEasingUpdate: 'linear'
            };

            // 设置初始图表
            myChart.setOption(option);

            // 循环播放年份
            function loopYears() {
                setTimeout(function () {
                    currentIndex = (currentIndex + 1) % years.length; // 循环索引
                    updateYear(years[currentIndex]);
                    loopYears(); // 递归调用，继续循环
                }, updateFrequency);
            }

            loopYears(); // 开始播放

            // 更新年份数据
            function updateYear(year) {
                // 更新数据源
                option.dataset.source = rawData.filter(item => item[2] === year);

                // 更新Y轴标签，确保标签动态变化
                const brandsForYear = rawData.filter(item => item[2] === year).map(item => item[0]);
                option.yAxis.data = brandsForYear;

                option.graphic.elements[0].style.text = year;
                myChart.setOption(option);
            }

            

            // 数据转换函数，将 JSON 转为 ECharts 格式
            function transformData(jsonData) {
                const result = [["Brand", "Sales", "Year"]];
                Object.keys(jsonData).forEach(brand => {
                    const sales = jsonData[brand].sales;
                    Object.keys(sales).forEach(year => {
                        result.push([brand, sales[year], parseInt(year)]);
                    });
                });
                
                return result;
            }

            // 窗口大小变化时重置图表大小
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        })
        .catch(error => {
            console.error("请求数据失败:", error);
        });
}

line1();
//http://192.168.43.63:8080/market/wordCloud
//
function line2() {
    var myChart = echarts.init(document.querySelector("#bubbleWordCloud"));
    console.log("Chart container dimensions:", myChart.getDom().offsetWidth, myChart.getDom().offsetHeight);
    // 定义品牌链接映射
    const brandUrls = {
        '福特': 'https://www.ford.com',
        '宝马': 'https://www.bmw.com',
        '梅赛德斯-奔驰': 'https://www.mercedes-benz.com',
        '雪佛兰': 'https://www.chevrolet.com',
        '保时捷': 'https://www.porsche.com',
        '奥迪': 'https://www.audi.com',
        '丰田': 'https://www.toyota.com',
        '雷克萨斯': 'https://www.lexus.com',
        '吉普': 'https://www.jeep.com',
        '路虎': 'https://www.landrover.com',
        '日产': 'https://www.nissan-global.com',
        '凯迪拉克': 'https://www.cadillac.com',
        'GMC': 'https://www.gmc.com',
        'RAM': 'https://www.ramtrucks.com',
        '道奇': 'https://www.dodge.com'
    };    
    // 数据请求函数
    async function fetchData() {
        try {
            const response = await fetch('public/data/wordCloud.json', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
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

    // 设置图表数据
    function setChartData(data) {
        // 自定义字体大小计算
        function getFontSize(countRange) {
            return Math.max(20, Math.min(countRange / 20 + 8, 30));
        }

        // 自定义气泡大小计算
        function getSymbolSize(countRange) {
            return Math.max(10, Math.min(countRange / 2, 50));
        }

        // 均匀分布气泡
        const numBubbles = data.length;
        const spacing = 100 / numBubbles;  // 控制气泡之间的间隔，按百分比分布

        // 生成初始气泡数据
        let bubbleData = data.map(function (item, index) {
            // 计算每个气泡的坐标，均匀分布
            const xPosition = (index * spacing) % 100; // x 坐标，按间隔分布
            const yPosition = Math.random() * 80 + 9; // y 坐标随机分布，确保气泡在可视范围内

            return {
                name: item.brand,
                value: [
                    xPosition,  // x 坐标
                    yPosition,  // y 坐标
                    item.quantity
                ],
                label: {
                    show: true,
                    formatter: '{b}',
                    fontSize: getFontSize(item.quantity),
                    color: '#fff',
                    position: 'inside',
                },
                itemStyle: {
                    color: 'rgba(173, 216, 230, 0.5)', // 浅蓝色背景
                    borderColor: 'rgba(135, 206, 235, 0.8)', // 边框为浅蓝色
                    borderWidth: 3,
                    shadowBlur: 15,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                }
            };
        });

        // ECharts 配置项
        const option2 = {
            xAxis: {
                show: false,
            },
            yAxis: {
                show: false,
            },
            grid: {
                top: '5%',
                bottom: '5%',
                left: '5%',
                right: '5%',
            },
            series: [
                {
                    type: 'scatter',
                    data: bubbleData,
                    symbolSize: function (val) {
                        return getSymbolSize(val[2]);
                    },
                    z: 2,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            color: '#FFD700',
                            formatter: function (params) {
                                return params.data.name + ': 销量 ' + params.data.value[2]; // 显示品牌的销量
                            },
                        },
                        itemStyle: {
                            borderColor: '#FFD700',
                            borderWidth: 2,
                            opacity: 1,
                        },
                        symbolSize: function (val) {
                            return getSymbolSize(val[2]) * 1.5; // 鼠标悬停时气泡放大
                        },
                    },
                    animationEasing: 'easeInOutQuad', // 设置动画缓动效果
                    animationDuration: 5000, // 设置动画持续时间
                },
            ],
        };

        
        // 设置点击事件监听
        myChart.on('click', function(params) {
            if (params.componentType === 'series') {
                const brandName = params.name;  // 获取点击的品牌名
                const url = brandUrls[brandName];
                if (url) {
                    window.open(url, '_blank');  // 在新窗口打开链接
                }
            }
        });
        // 修改 series 配置，添加鼠标样式
        option.series[0].itemStyle.cursor = 'pointer';  // 添加鼠标指针样式

        // 设置图表配置
        myChart.setOption(option2);
        // 窗口大小变化时自适应
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    // 调用 fetchData 函数获取数据
    fetchData();
}

line2();








// 初始化两个图表，确保只创建一次
var myChart1 = echarts.init(document.getElementById('pieChart1'));
var myChart2 = echarts.init(document.getElementById('pieChart2'));

// 价格图表的配置项
var option1 = {
    title: { },
    tooltip: {
        trigger: 'item',
        formatter: function(params) {
            if (params.data) {
                const currentData = myChart1.getOption().series[0].data;
                const total = currentData.reduce((sum, item) => sum + item.value, 0);
                const percent = ((params.value / total) * 100).toFixed(1);
                return `${params.name}<br/>数量: ${params.value}<br/>占比: ${percent}%`;
            }
            return '暂无数据';
        },
        backgroundColor: 'rgba(0,0,0,0.6)',
          borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
          axisPointer: {
              type: 'shadow'
          }
    },
    legend: { 
        orient: 'vertical', 
        left: 'left',
        textStyle: {
            color: '#ffffff'  // 设置图例文字颜色为白色
        }
     },
    series: [
        {
            name: '企业来源',
            type: 'pie',
            radius: '70%',
            center: ['60%', '50%'],  // 第一个值是饼图的水平位置，第二个值是垂直位置,让饼图向右移
            data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
            ],
            label: {
                show: true,  // 显示标签
                textStyle: {
                    color: '#ffffff',  // 标签字体颜色
                    shadowColor: 'none',  // 移除阴影颜色
                    shadowBlur: 0  // 去掉阴影模糊
                }
            },
            itemStyle: {
                color: function (params) {
                    const colors = ['#1E90FF', '#00BFFF', '#5F9EA0', '#4682B4', '#87CEFA', '#6495ED'];
                    return colors[params.dataIndex % colors.length];
                }
            }  
        }
    ]
};

var option2 = {
    title: { },
    tooltip: {
        trigger: 'item',
        formatter: function(params) {
            if (params.data) {
                const currentData = myChart2.getOption().series[0].data;
                const total = currentData.reduce((sum, item) => sum + item.value, 0);
                const percent = ((params.value / total) * 100).toFixed(1);
                return `${params.name}<br/>数量: ${params.value}<br/>占比: ${percent}%`;
            }
            return '暂无数据';
        },
        backgroundColor: 'rgba(0,0,0,0.6)',
          borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
          axisPointer: {
              type: 'shadow'
          }
    },
    legend: { 
        orient: 'vertical', 
        left: 'left',
        textStyle: {
            color: '#ffffff'  // 设置图例文字颜色为白色
        }
     },
    series: [
        {
            name: '',
            type: 'pie',
            radius: ['35%', '70%'],
            center: ['60%', '50%'],
            data: [
            ],
            label: {
                show: true,  // 显示标签
                textStyle: {
                    color: '#ffffff',  // 标签字体颜色
                    shadowColor: 'none',  // 移除阴影颜色
                    shadowBlur: 0  // 去掉阴影模糊
                }
            },
            itemStyle: {
                color: function (params) {
                    const colors = ['#60A3BC','#4A69BD', '#6A89CC', '#82CCDD',  '#546DE5', '#833471'];
                    return colors[params.dataIndex % colors.length];
                }
            }
        }
    ]
};

// 默认显示企业饼图
myChart1.setOption(option1);
myChart2.setOption(option2);
// 在初始化图表后添加轮播功能
function startCarousel(chart, option) {
    let currentIndex = -1;
    // 确保数据存在
    if (!option.series[0].data || option.series[0].data.length === 0) {
        console.warn('No data available for carousel');
        return;
    }
    
    const dataLen = option.series[0].data.length;
    
    // 清除可能存在的旧定时器
    if (chart._carouselTimer) {
        clearInterval(chart._carouselTimer);
    }
    
    chart._carouselTimer = setInterval(() => {
        // 取消之前高亮的图形
        chart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
        
        currentIndex = (currentIndex + 1) % dataLen;
        
        // 高亮当前图形
        chart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
        
        // 显示 tooltip
        chart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: currentIndex
        });
    }, 2000);
}

// 向后端请求数据并更新图表
function fetchDataFromBackend1() {
    // 发送 GET 请求到后端接口，假设这是第一个图表的接口
    //http://192.168.43.63:8080/market/price
    fetch('public/data/price.json')  
        .then(response => response.json())  // 解析 JSON 响应
        .then(data => {
            console.log('Received data for 价格 from backend:', data);
            // 假设返回的数据为数组，直接映射为图表数据
            const updatedData1 = data.map(item => ({
                value: item.countRange,  // 使用 countRange 作为值
                name: item.priceRange  // 使用 priceRange 作为名称
            }));
        
            // 更新第一个图表数据
            myChart1.setOption({
                series: [{
                    data: updatedData1
                }]
            });
            // 启动轮播
            startCarousel(myChart1, option1);

        })
        .catch(error => {
            console.error('Error fetching data for 企业饼图:', error);
        });
}
fetchDataFromBackend1();

// 向后端请求数据并更新图表
function fetchDataFromBackend2() {
    // 发送 GET 请求到后端接口  
    //http://192.168.43.63:8080/market/fuel
    fetch('public/data/fuel.json')  // 后端的 API 地址
        .then(response => response.json())  // 解析 JSON 响应
        .then(data => {
            console.log('Received data from backend:', data);
            // 假设返回的数据为数组，直接映射为图表数据
            const updatedData2 = data.map(item => ({
                value: item.quantity,  // 使用 countRange 作为值
                name: item.fuelTypeName  // 使用 fuelType 作为名称
            }));
            
            // 更新图表数据
            myChart2.setOption({
                series: [{
                    data: updatedData2
                }]
            });
            // 启动轮播
            // 确保数据加载完成后启动轮播
            setTimeout(() => {
                startCarousel(myChart2, {
                    series: [{
                        data: updatedData2
                    }]
                });
            }, 100);

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// 调用函数获取数据
fetchDataFromBackend2();

// 切换图表显示的函数
function line3(type) {
    console.log(type); // 查看传入的类型
    // 获取两个饼图容器
    var pieChart1 = document.getElementById('pieChart1');
    var pieChart2 = document.getElementById('pieChart2');
    // 获取按钮
    var qiyeBtn = document.getElementById('qiyeBtn');
    var nongchanBtn = document.getElementById('nongchanBtn');

    // 根据按钮点击切换显示
    if (type === 'qiye') {
        pieChart1.style.display = 'block'; // 显示企业饼图
        pieChart2.style.display = 'none';  // 隐藏农产品饼图
        myChart1.resize(); // 确保企业饼图在容器中重新适应大小

        // 高亮按钮
        qiyeBtn.classList.add('active'); // 企业码按钮高亮
        nongchanBtn.classList.remove('active'); // 移除农产品按钮的高亮
    } else if (type === 'nongchan') {
        pieChart2.style.display = 'block'; // 显示农产品饼图
        pieChart1.style.display = 'none';  // 隐藏企业饼图
        myChart2.resize(); // 确保农产品饼图在容器中重新适应大小

        // 高亮按钮
        nongchanBtn.classList.add('active'); // 农产品码按钮高亮
        qiyeBtn.classList.remove('active'); // 移除企业按钮的高亮
    }
}

// 在窗口大小变化时调整图表大小
window.addEventListener("resize", function () {
    myChart1.resize();
    myChart2.resize();
});


line3('qiye')


//趋势图
function line4() {
    var myChart = echarts.init(document.getElementById('barchart'));
     //左二json http://192.168.43.63:8080/market/orders
    // 向后端请求数据并更新图表
    fetch('public/data/right2.json')  // 后端的 API 地址
        .then(response => response.json())
        .then(data => {
            console.log('Received data from backend:', data);
    

    // 处理返回的数据，将其转换为图表所需的格式
    const years = [...new Set(data.map(item => item.regDate))]; // 获取所有年份
    const priceRanges = [...new Set(data.map(item => item.priceRange))]; // 获取所有价格区间

    // 准备各年份的 countRange 数据
    const seriesData = priceRanges.map(priceRange => {
        return {
            name: priceRange,
            type: 'line',
            data: years.map(year => {
                const entry = data.find(item => item.regDate === year && item.priceRange === priceRange);
                return entry ? entry.countRange : 0; // 如果没有数据，返回 0
            })
        };
    });

    // 图表配置
    const option = {
        grid: {
            left: '10%',
            right: '10%',
            top: '15%',
            bottom: '15%'
        },
        title: {},
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.6)',
          borderColor: '#00FFE3',
            textStyle: { color: '#fff' },
          axisPointer: {
              type: 'cross'
          }
        },
        legend: {
            data: priceRanges,
            textStyle: {
                color: '#ffffff',  // 设置图例文字颜色为白色
                fontSize: 10 
            }
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                axisLine: {
                    lineStyle: {
                        color: '#adf3e6'
                    }
                },
                data: years // X 轴显示年份
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: "#adf3e6"
                    
                },
                scale: true,
                name: '销量',
                nameTextStyle: {
                    color: '#adf3e6',  // 设置 Y 轴名称的颜色
                    padding: [0, 0, 0, 20] 
                },
                
                nameGap: 3, 
                max: Math.max(...data.map(item => item.countRange)) + 100, // 设置最大值为数据中的最大值
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: seriesData // 动态生成的多个系列
    };

    // 设置初始选项
    myChart.setOption(option);

    // 模拟数据动态更新
    // setInterval(function () {
    //     let axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');
    //     data.shift();
    //     data.push(Math.round(Math.random() * 1000)); // 新的价格数据
    //     data2.shift();
    //     data2.push(+(Math.random() * 100 + 10).toFixed(1)); // 新的订单数数据
    //     categories.shift();
    //     categories.push(axisData); // 新的时间数据
    //     // categories2.shift();
    //     // categories2.push(categories2[categories2.length - 1] + 1); // 新的索引

    //     myChart.setOption({
    //         xAxis: [
    //             {
    //                 data: categories
    //             },
    //             // {
    //             //     data: categories2
    //             // }
    //         ],
    //         series: [
    //             {
    //                 data: data
    //             },
    //             {
    //                 data: data2
    //             }
    //         ]
    //     });
    // }, 2100);

    // 自适应
    window.addEventListener("resize", function () {
        myChart.resize();
    });
})
.catch(error => {
    console.error('Error fetching data:', error);
});
}

line4();

// 初始化漏斗图容器
var funnelChart = echarts.init(document.getElementById('funnelChart'));

// 原始数据
var rawData = [
    { value: 25899, name: '燃油类型' },
    { value: 67193, name: '车身类型' },
    { value: 117603, name: '变速箱' },
    
    { value: 150000, name: '交易记录' }
];

// 计算总和
var totalValue = rawData.reduce(function (sum, item) {
    return sum + item.value;
}, 0);

// 按占比转换数据
var formattedData = rawData.map(function (item) {
    return {
        name: item.name,
        value: ((item.value / totalValue) * 100).toFixed(2), // 计算百分比并保留两位小数
        rawValue: item.value // 保留原始数值用于显示
    };
});

// 新的图表配置项
var option = {
    title: {},
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            // 显示原始数值和占比
            return `${params.name}：${params.data.rawValue} (占比 ${params.value}%)`;
        },
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderColor: '#00FFE3',
          textStyle: { color: '#fff' },
        axisPointer: {
            type: 'shadow'
        } 
    },
    legend: {
        data: formattedData.map(item => item.name),
        textStyle: {
            color: '#ffffff' // 设置图例文字颜色为白色
        }
    },
    series: [
        {
            name: '占比漏斗图',
            type: 'funnel',
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            width: '100%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending', // 按降序排序
            gap: 4, // 各层级之间的间距
            label: {
                show: true,
                position: 'inside',
                formatter: '{b}' // 显示名称和占比百分比
            },
            labelLine: {
                length: 10,
                lineStyle: {
                    width: 1,
                    type: 'solid'
                }
            },
            itemStyle: {
                borderColor: 'none',
                borderWidth: 1
            },
            emphasis: {
                label: {
                    fontSize: 20,
                    fontWeight: 'bold'
                }
            },
            data: formattedData // 使用计算后的占比数据
        }
    ]
};

// 渲染漏斗图
funnelChart.setOption(option);

// 响应式处理
window.addEventListener('resize', function () {
    funnelChart.resize();
});

//地图
document.addEventListener("DOMContentLoaded", function () {
    const listItems = document.querySelectorAll(".main_m_f ul li");
    const tooltip = document.getElementById("tooltip");
    let currentIndex = 0;
    let carouselTimer = null; // 轮播定时器
    let pauseTimer = null; // 暂停定时器
    let isPaused = false;     // 防止暂停函数重复调用

    // 地图区域划分
    const regionGroups = {
        华南: ["广东", "广西", "海南"],
        华东: ["上海", "江苏", "浙江", "安徽", "福建", "江西", "山东"],
        华北: ["北京", "天津", "河北", "山西", "内蒙古"],
        华中: ["河南", "湖北", "湖南"],
        西南: ["四川", "云南", "贵州", "西藏", "重庆"],
        西北: ["陕西", "甘肃", "青海", "宁夏", "新疆"],
        东北: ["辽宁", "吉林", "黑龙江"]
    };

    // 区域数据：四个维度
    const regionData = {
        华南: {
            orders: 21.69, 
            totalPrice: 14.2, 
            customers: 21.6, 
            growth: -1.2,
            predictedOrders: 23.19, 
            predictedTotalPrice: 14.3, 
            predictedCustomers: 23.0, 
            predictedGrowth: 1.16
        },
        华东: {
            orders: 43.1, 
            totalPrice: 28.3, 
            customers: 42.9, 
            growth: -5.14,
            predictedOrders: 46.29, 
            predictedTotalPrice: 28.6, 
            predictedCustomers: 46.1, 
            predictedGrowth: 1.12
        },
        华中: {
            orders: 23.49, 
            totalPrice: 15.4, 
            customers: 23.2, 
            growth: 0.84,
            predictedOrders: 25.59, 
            predictedTotalPrice: 15.8, 
            predictedCustomers: 25.5, 
            predictedGrowth: 1.32
        },
        华北: {
            orders: 21.00, 
            totalPrice: 13.8, 
            customers: 19.9, 
            growth: -2.84,
            predictedOrders: 21.61, 
            predictedTotalPrice: 13.3, 
            predictedCustomers: 21.3, 
            predictedGrowth: -4.48
        },
        西南: {
            orders: 24.07, 
            totalPrice: 15.8, 
            customers: 23.9, 
            growth: -5.17,
            predictedOrders: 25.38, 
            predictedTotalPrice: 15.7, 
            predictedCustomers: 25.0, 
            predictedGrowth: -0.91
        },
        西北: {
            orders: 7.64, 
            totalPrice: 5.0, 
            customers: 4.8, 
            growth: -6.22,
            predictedOrders: 8.15, 
            predictedTotalPrice: 5.1, 
            predictedCustomers: 4.9, 
            predictedGrowth: -1.65
        },
        东北: {
            orders: 11.80, 
            totalPrice: 7.8, 
            customers: 7.3, 
            growth: 3.08,
            predictedOrders: 11.45, 
            predictedTotalPrice: 7.1, 
            predictedCustomers: 6.8, 
            predictedGrowth: 1.93
        }
    };
    
    const echartsMap = echarts.init(document.getElementById("mapChart"));
    const data = [
        { name: "辽宁", value: 77 },
        { name: "吉林", value: 42 },
        { name: "黑龙江", value: 72 },
        { name: "四川", value: 81 },
        { name: "湖北", value: 47 },
        { name: "福建", value: 67 },
        { name: "广东", value: 66 },
        { name: "湖南", value: 92 },
        { name: "上海", value: 95 },
        { name: "江苏", value: 91 },
        { name: "浙江", value: 94 },
        { name: "北京", value: 91 },
        { name: "河南", value: 100 },
        {"name": "河北", "value": 70},
        {"name": "内蒙古", "value": 11},
        {"name": "江西", "value": 23},
        {"name": "贵州", "value": 45},
        {"name": "云南", "value": 36},
        {"name": "西藏", "value": 9},
        {"name": "陕西", "value": 21},
        {"name": "甘肃", "value": 54},
        {"name": "青海", "value": 48},
        {"name": "宁夏", "value": 36},
        {"name": "新疆", "value": 24},
        {"name": "广西", "value": 68},
        {"name": "海南", "value": 99},
        {"name": "台湾", "value": 88}
    ];

    echartsMap.setOption({
        // tooltip: {
        //     trigger: "item",
        //     formatter: (params) => {
        //         return params.name + " : " + (params.value || "无数据");
        //     }
        // },
        visualMap: {
            show: false,
            inRange: { color: ["#f2faff", "#3a73b8", "#2B32B2"] }
        },
        geo: {
            map: "china",
            roam: false, //开启鼠标缩放和漫游
			zoom: 1.2, //地图缩放级别
		    selectedMode: false, //选中模式：single | multiple
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
            layoutCenter: ["50%", "50%"],
            layoutSize: "100%"
        },
        series: [
            {
                type: "map",
                geoIndex: 0,
                data: data
            }
        ]
    });

    // 高亮地图和更新面板
    function highlightRegion(regionName) {
        const provinces = regionGroups[regionName] || [];
        const regionInfo = regionData[regionName] || { orders: 0, totalPrice: 0, customers: 0, growth: 0 };

        // 高亮地图
        echartsMap.dispatchAction({ type: "downplay" }); // 清除高亮
        provinces.forEach(province => {
            echartsMap.dispatchAction({ type: "highlight", name: province });
        });

        // 更新数字面板（四个维度）
        updateNumberPanel(regionInfo);

        if (tooltip) {
            tooltip.innerText = `${regionName} - 订单数: ${regionInfo.orders}, 总价格: ${regionInfo.totalPrice}元`;
        }
        
        // 更新tooltip
        tooltip.innerText = `${regionName} - 订单数: ${regionInfo.orders}, 总价格: ${regionInfo.totalPrice}元`;
    }

    // 更新数字面板函数
    function updateNumberPanel(regionInfo) {
        const regionPanels = document.querySelectorAll(".main_m_t .item1");

        regionPanels[0].querySelector("span[data-value]").textContent = regionInfo.orders; // 订单数
        regionPanels[1].querySelector("span[data-value]").textContent = regionInfo.totalPrice; // 总价格
        regionPanels[2].querySelector("span[data-value]").textContent = regionInfo.customers; // 客户数
        regionPanels[3].querySelector("span[data-value]").textContent = regionInfo.growth + "%"; // 增长率

       // 第二行更新（预测值）
    // 第二行更新（预测值）和箭头
    const panels = [
        { index: 0, actualValue: regionInfo.orders, predictedValue: regionInfo.predictedOrders },
        { index: 1, actualValue: regionInfo.totalPrice, predictedValue: regionInfo.predictedTotalPrice },
        { index: 2, actualValue: regionInfo.customers, predictedValue: regionInfo.predictedCustomers },
        { index: 3, actualValue: regionInfo.growth, predictedValue: regionInfo.predictedGrowth }
    ];

    panels.forEach(panel => {
        const span = regionPanels[panel.index].querySelector("span[data-value]");
        if (span) {
            // 获取第二行的span[data-value]并更新它
            const secondRowSpan = span.parentElement.nextElementSibling.querySelector("span[data-value]");
            if (secondRowSpan) {
                secondRowSpan.textContent = panel.predictedValue;
                
                // 添加箭头标志
                const arrowSpan = secondRowSpan.parentElement.querySelector(".arrow");
                if (panel.predictedValue > panel.actualValue) {
                    arrowSpan.innerHTML = "↑";  // 向上箭头
                    arrowSpan.style.color = "green"; // 可以自定义箭头颜色
                } else if (panel.predictedValue < panel.actualValue) {
                    arrowSpan.innerHTML = "↓";  // 向下箭头
                    arrowSpan.style.color = "red"; // 可以自定义箭头颜色
                } else {
                    arrowSpan.innerHTML = "→";  // 无变化，显示横向箭头
                    arrowSpan.style.color = "gray"; // 无变化时的颜色
                }
            }
        }
    });

    }
      // 轮播函数
      function startCarousel() {
        // 清除现有定时器
        clearInterval(carouselTimer);
        clearTimeout(pauseTimer);
        
        // 重新启动轮播
        carouselTimer = setInterval(() => {
            listItems.forEach(item => item.classList.remove("active"));
            const currentItem = listItems[currentIndex];
            currentItem.classList.add("active");
            
            const regionName = currentItem.querySelector("span").innerText;
            highlightRegion(regionName);
            
            currentIndex = (currentIndex + 1) % listItems.length;
        }, 3000);
    }
    
    function pauseCarousel() {
        clearInterval(carouselTimer);
        clearTimeout(pauseTimer);
        
        pauseTimer = setTimeout(() => {
            startCarousel();
        }, 3000);
    }
        
    // 点击区域按钮
    listItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            // 清除所有按钮的 active 状态
            listItems.forEach(item => item.classList.remove("active"));
            item.classList.add("active");

        // 调用暂停轮播函数
        pauseCarousel();
            // 高亮当前区域
            currentIndex = index; // 更新当前索引
            const regionName = item.querySelector("span").innerText;
            highlightRegion(regionName);
        });
    });
    // 开始轮播
    startCarousel();
    // 监听窗口尺寸变化，调整 ECharts 地图的尺寸
    window.addEventListener("resize", function () {
        echartsMap.resize();
    });
});