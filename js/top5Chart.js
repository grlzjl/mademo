//Top5图表实现
$(function(){
    var top5_chart1, top5_chart2;
    top5_chart1 = echarts.init($("#top5_chart1")[0]);
    top5_chart2 = echarts.init($("#top5_chart2")[0]);

    // top5_chart.setOption(option_top);
    setInterval(function(){
        $.ajax({
            url: "http://127.0.0.1:8000/api/mbrs/topchart/",
            // url: "http://127.0.0.1:8000/api/mbrs/topchart/?top=5",
            method: "GET",
            timeout: 0,
            async: true,
            headers: {
                "Authorization": "Basic Z3JsempsOmdybHpqbA==",
            }
        }).done(function(data) {
            var suspect_data = data['suspect'], reporter_data = data['reporter'];
            var suspect_count = 0;
            var threshold = 5;
            var i = 0;
            while (i < suspect_data.length && suspect_data[i]['value'] >= threshold) {
                suspect_count += 1;
                i += 1;
            }
            $('#car_num').html(suspect_data.length);
            $('#suspect_num').html(suspect_count);
            suspect_data = suspect_data.slice(0, 5);
            reporter_data = reporter_data.slice(0, 5);
            var labels = [];
            for(i=0; i<suspect_data.length; i++) {
                labels.push(suspect_data[i]['name']);
            }
            option_top.yAxis.data=labels;
            option_top.series[0].data=suspect_data;
            top5_chart1.setOption(option_top);
            labels = [];
            for(i=0; i<reporter_data.length; i++) {
                labels.push(reporter_data[i]['name']);
            }
            option_top.yAxis.data=labels;
            option_top.series[0].data=reporter_data;
            top5_chart2.setOption(option_top);
        });
    }, 1000);

    setTimeout(function(){
        window.onresize = function() {
            top5_chart1.resize();
            top5_chart2.resize();
            pie_chart.resize();
            line_chart.resize();
            bar_chart1.resize();
            bar_chart2.resize();
        }
    }, 200);
});

var option_top = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        top: '4%',
        bottom: '3%',
        containLabel: true,
        borderWidth: 0
    },
    xAxis: {
        type: 'value',
        x: '180',
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false,
            textStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'category',
        data: ["ad921830", "f3c992f2", "bde83caf", "aebd9729", "8c00ecb2"],
        inverse: true,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            }
        }
    },
    series: [
        {
            name: '被举报次数',
            type: 'bar',
            stack: '次',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: [
                {'name': "ad921830", 'value': 99},
                {'name': "f3c992f2", 'value': 96},
                {'name': "bde83caf", 'value': 85},
                {'name': "aebd9729", 'value': 72},
                {'name': "8c00ecb2", 'value': 60}
            ],
            itemStyle: {
                normal: {
                    color: function (params) {
                        var colorList = ['#1864E3', '#2B5DB8', '#3F80D2', '#55B6ED', '#55DAED']
                        return colorList[params.dataIndex]
                    },
                    barBorderRadius: 10
                }
            }
        }
    ]
};