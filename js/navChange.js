$(function(){
    // index();
    $(".index_nav ul li").each(function(index){
        $(this).click(function(){
            $(this).addClass("nav_active").siblings().removeClass("nav_active");
            $(".main_body .inner").eq(index).fadeIn().siblings("div").stop().hide();
            if(index===1) {
                stats();
            }
        })
    });
});

// 初始化图
var pie_chart, line_chart, bar_chart1, bar_chart2;

function stats() {
    pie_chart = echarts.init($("#chart01")[0]);
    line_chart = echarts.init($("#chart03")[0]);
    bar_chart1 = echarts.init($("#chart02")[0]);
    bar_chart2 = echarts.init($("#chart04")[0]);
    // setInterval('chartAjax', 1000);
    console.log('in stats');
    chartAjax();
}

function getSettings(chart, time_type, time_value){
    return {
        url: "http://127.0.0.1:8000/api/summaries/" + chart + "/?time_type=" + time_type + "&time_value=" + time_value,
        method: "GET",
        timeout: 0,
        async: true,
        headers: {
            "Authorization": "Basic Z3JsempsOmdybHpqbA==",
        }
    };
}
// ajax查询数据
function chartAjax() {
    // 饼图
    var settings = getSettings("piechart", 'YEAR', '2020');
    console.log('in ajax');
    console.log(settings);
    $.ajax(settings).done(function (data) {
        console.log(data);
        option_pie.series[0].data[0].value=data['self_count'];
        option_pie.series[0].data[1].value=data['cert_count'];
        option_pie.series[0].data[2].value=data['semantic_count'];
        pie_chart.setOption(option_pie);
    });
    // 折线图
    settings = getSettings("linechart", 'YEAR', '2020');
    $.ajax(settings).done(function (data) {
        console.log(data);
        option_line.xAxis[0].data = data['time'];
        option_line.series[0].data = data['self'];
        option_line.series[1].data = data['cert'];
        option_line.series[2].data = data['semantic'];
        line_chart.setOption(option_line);
    });
    // 柱状图
    settings = getSettings("barchart", 'YEAR', '2020');
    $.ajax(settings).done(function (data) {
        console.log(data);
        option_bar.yAxis[0].data = errorDict[1];
        option_bar.series[0].data = data['cert']['count'];
        bar_chart1.setOption(option_bar);
        option_bar.yAxis[0].data = errorDict[2];
        option_bar.series[0].data = data['semantic']['count'];
        bar_chart2.setOption(option_bar);
    });
    //
    // setTimeout(function(){
    //     window.onresize = function() {
    //         pie_chart.resize();
    //         line_chart.resize();
    //         bar_chart1.resize();
    //         bar_chart2.resize();
    //     }
    // }, 200);
}


// 图位置布局
var gridStyle = {
    left: '3%',
    right: '4%',
    top: '10%',
    bottom: '3%',
    containLabel: true,
    borderWidth: 0
};


// 图表1 饼图 分类汇总
var option_pie = {
    legend: {
        x: 'left',
        y: 'bottom',
        textStyle: {
            color: "#fff"
        },
        data: ['主动上报类', '证书安全类', '消息内容类'],
        orient: 'vertical'
    },
    grid: gridStyle,
    series: [
        {
            type: 'pie',
            // center: ['50%', '50%'],
            radius: ['50%','90%'],
            // x: '0%', // for funnel
            data: [
                {name: '主动上报类', value: 46},
                {name: '证书安全类', value: 54},
                {name: '消息内容类', value: 54}
            ],
            label: {
                normal: {
                    show: true,
                    formatter: '{b|{b}}{abg|}\n{hr|}\n {c}次 {per|{d}%}',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    rich: {
                        // a: {
                        //     color: '#999',
                        //     lineHeight: 22,
                        //     align: 'center'
                        // },
                        // abg: {
                        //     backgroundColor: '#aaa',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            lineHeight: 22,
                            align: 'center',
                            fontWeight: 'bold'
                        },
                        c: {
                            fontSize: 12,
                            lineHeight: 20
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                },
                emphasis: {
                    show: true,
                    // position: 'center',
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ],
};


// 图表3 折线图 报告数量随时间趋势
var option_line = {
    tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c}次"
    },
    legend: {
        x: 'center',
        data: ['主动上报类', '证书安全类', '消息内容类'],
        textStyle:{
            color:"#e9ebee"
        }
    },
    grid: gridStyle,
    xAxis: [
        {
            type: "category",
            name: "x",
            splitLine:{show: false},
            axisLabel : {
                formatter: '{value} ',
                textStyle: {
                    color: '#a4a7ab',
                    align: 'right'
                }
            },
            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
        }
    ],
    yAxis: [
        {
            type: "value",
            name: "y",
            splitLine:{show: false},
            // data: ['10','30','50','70','90','110','120','130','150','170','190','210','250'],
            axisLabel : {
                textStyle: {
                    color: '#a4a7ab',
                    align: 'right'
                }
            },
        }
    ],

    calculable: false,
    series: [
        {
            name: "主动上报类",
            type: "line",
            data: [26, 59, 90, 26, 28, 70, 175, 182, 48, 188, 60, 23],
            itemStyle: {
                normal: {
                    color:"#1afffd"
                }
            }
        },
        {
            name: "证书安全类",
            type: "line",
            data: [175, 182, 48, 188, 60, 23, 26, 59, 90, 26, 28, 70],
            itemStyle: {
                normal: {
                    color:"#ffcb89"
                }
            }
        },
        {
            name: "消息内容类",
            type: "line",
            data: [28, 70, 175, 182, 26, 59, 90, 26, 48, 188, 60, 23],
            itemStyle: {
                normal: {
                    color:"#e15828"
                }
            }
        }
    ]
};


// 图表2和4 柱状图

var option_bar = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    // legend: {
    //     data: data.legendData,
    //     textStyle:{
    //         color:"#fff"
    //     },
    // },
    grid: gridStyle,
    // calculable : false,
    xAxis : [
        {
            type : 'value',
            splitLine: {show: false},
            axisLabel : {
                textStyle: {
                    color: '#fff',
                    align: 'right'
                }
            },
        }
    ],
    yAxis : [
        {
            type : 'category',
            inverse: true,
            splitLine: {show: false},
            axisLabel : {
                textStyle: {
                    color: '#fff',
                    align: 'right'
                }
            },
            data: [
                "AID值",
                "消息生成时间",
                "消息序号递增",
                "证书类型",
                "证书合法性检查",
                "证书撤销列表检查",
                "证书有效期检查",
                "证书地理区域检查",
                "证书权限描述",
                "消息已签名且签名正确",
                "消息负载非空",
            ],
        }
    ],
    series: [
        {
            type:'bar',
            itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
            data: [231,131,212,123,12,132,34,44,19,156,15],
            itemStyle: {
                normal: {
                    color:"#0ad5ff"
                }
            }
        }
    ]
};


