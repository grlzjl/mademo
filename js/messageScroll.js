// 错误代码字典
var errorDict = [
    //0-主动上报
    [
        "证书文件下载失败",
        "证书文件验证失败",
        "证书文件解密失败",
        "证书验证失败",
        "证书内容错误",
        "RA鉴证失败",
        "CRL验证失败",
        "必填数据项值无法获取",
    ],
    //1-安全类异常
    [
        "AID值错误",
        "消息生成时间过早或过晚",
        "消息序号错误，非递增或不连续",
        "证书类型错误",
        "证书链验证失败",
        "证书已被撤销",
        "证书有效期异常",
        "证书地理区域错误",
        "证书权限错误",
        "消息签名错误",
        "消息负载为空",
    ],
    //2-语义类异常
    [
        "BSM消息异常：位置",
        "BSM消息异常：档位",
        "BSM消息异常：速度",
        "BSM消息异常：航向",
        "BSM消息异常：方向盘转角",
        "BSM消息异常：加速度",
        "BSM消息异常：车辆长度/宽度",
        "BSM消息异常：刹车状态",
        "BSM消息异常：车辆类别",
    ],
];

// 将某类消息添加到框内的html代码
function htmlExtend(msg, errorType, ifLocate){
    var errorCode = parseInt(msg["errorCode"]);
    var generationTime = msg["generationTime"].replace('T', ' ').replace('Z', '');
    var locationText = msg["longitude"]+','+msg["latitude"]+','+errorType+','+msg['suspectId']+','+errorDict[errorType][errorCode]+','+generationTime;
    addLocation(locationText);
    if (ifLocate) {
        toLocation(locationText);
    }
    return "<div class=\"message_scroll\">\n" +
        "<div class=\"scroll_top\">\n" +
        "   <span class=\"scroll_title\">"+msg["suspectId"]+"</span>\n" +
        "   <span class=\"scroll_timer\">"+generationTime+"</span>\n" +
        "   <a class=\"localize\" onclick='toLocation(this.innerText)'>" + locationText +"</a>\n" +
        "</div>\n" +
        "<div class=\"msg_cage\">\n" +
        "   <span class=\"error_msg\">"+errorDict[errorType][errorCode]+"</span>\n" +
        "</div>\n" +
        "</div>\n";
}

function initializeMessage(data){
    var htmlText = ["","",""];
    $.each(data, function(index, msg){
        // console.log(msg["suspectId"]);
        var errorType = 0;
        switch (msg["errorType"]) {
            case "CERT":
                errorType = 1;
                break;
            case "SEMANTIC":
                errorType = 2;
        }
        htmlText[errorType] += htmlExtend(msg, errorType, false);
        msgCount[errorType] += 1;
    });
    return htmlText;
}

function insertMessage(errorType, html) {
    var id = "#message"+(errorType+1);
    var content = $(id).html();
    if(content == null || content.length == 0 ) {
        $(id).html(html);
        return;
    }

    $(id).animate({marginTop: 65},800,
        function(){
            $(id).css({marginTop:0});    //顶部边界清零
            //第一条信息上面插入最后一个新闻
            $(id+" .message_scroll:first").before(html);
        });
}

function updateMessage(data) {
    $.each(data, function(index, msg){
        // console.log(msg["suspectId"]);
        var errorType = 0;
        switch (msg["errorType"]) {
            case "CERT":
                errorType = 1;
                break;
            case "SEMANTIC":
                errorType = 2;
        }
        insertMessage(errorType, htmlExtend(msg, errorType, true));
        msgCount[errorType] += 1;
    });
}

var curMsgCount = 0;
var msgCount = [0, 0, 0];

function myAjax(settings) {
    $.ajax(settings).done(function (data) {
        // console.log(data.length);
        // console.log(curMsgCount, msgCount);
        var newData;
        if (data.length > curMsgCount) {
            newData = data.slice(curMsgCount, data.length);
            curMsgCount = data.length;
            updateMessage(newData);
        }
    });
}

$(function(){
    curMsgCount = 0;
    var $message = [$("#message1"), $("#message2"), $("#message3")];
    for (var i=0; i<3; i++) {
        $message[i].empty();
    }

    // 首次进入页面get数据, 顺便初始化settings
    var today = new Date;
    var y = today.getFullYear(), m = today.getMonth()+1, d = today.getDate();
    today = y+'-'+m+'-'+d;
    var settings = {
        url: "http://127.0.0.1:8000/api/mbrs/?startDate="+ today,
        method: "GET",
        timeout: 0,
        async: true,
        headers: {
            "Authorization": "Basic Z3JsempsOmdybHpqbA==",
        }
    };
    $.ajax(settings).done(function (data) {
        // console.log(data.length);
        curMsgCount = data.length;
        var htmlText = initializeMessage(data);
        for (i=0; i<3; i++) {
            $message[i].html(htmlText[i]);
        }
    });
    $("#total_num").html(""+curMsgCount);

    gauge1 = echarts.init($("#gross_gauge1")[0]);
    gauge2 = echarts.init($("#gross_gauge2")[0]);
    gauge3 = echarts.init($("#gross_gauge3")[0]);

    // 轮询更新数据
    setInterval(function() {
        myAjax(settings);
        $("#total_num").html(""+curMsgCount);
        pieChart();
    }, 1000);
});


// 解析信息并添加Marker
function addLocation(text){
    text = text.split(',');
    // console.log(text);
    addMarker(parseFloat(text[0]),parseFloat(text[1]),parseInt(text[2]),text[3],text[4],text[5]);
}
// 点击图标显示定位
function toLocation(text){
    text = text.split(',');
    // console.log(text);
    addRichMarker(parseFloat(text[0]),parseFloat(text[1]),parseInt(text[2]),text[3],text[4],text[5]);
}


// 仪表盘图（饼图实现）
var gauge1, gauge2, gauge3;
function pieChart() {
    // 定义一个通用的option
    var option_gauge = {
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            borderWidth: 0
        },
        title: {
            text: '主动上报',
            subtext: '50%',
            x: 'center',
            y: '15%',
            itemGap: 0,
            textStyle: {
                color: '#B7E1FF',
                fontWeight: 'bolder',
                fontFamily: 'electronicFont',
                fontSize: '.5rem'
            },
            subtextStyle: {
                color: '#B7E1FF',
                fontWeight: 'normal',
                fontFamily: 'electronicFont',
                fontSize: '.2rem'
            }
        },
        series: [{
            type: 'pie',
            // center: ['50%', '50%'],
            radius: ['90%', '100%'],
            x: '0%',
            tooltip: {show: false},
            data: [{
                name: '占比',
                value: 0,
                itemStyle: {color: '#B7E1FF'},
                hoverAnimation: false,
                label: {show: false},
                labelLine: {show: false}
            },
                {
                    name: '阴影',
                    value: 100,
                    itemStyle: {color: 'rgba(0,153,255,0.1)'},
                    hoverAnimation: false,
                    label: {show: false},
                    labelLine: {show: false}
                }],
        }]
        // // 内外边框
        // {
        //     type : 'pie',
        //     center : ['50%', '50%'],
        //     radius : ['88%','89%'],
        //     x: '0%',
        //     hoverAnimation: false,
        //     data : [{
        //         value:100,
        //         itemStyle:{color :'rgba(0,153,255,0.3)'},
        //         label : {show : false},
        //         labelLine : {show : false}
        //     }]
        // },
        // {
        //     type : 'pie',
        //     center : ['50%', '50%'],
        //     radius : ['101%','102%'],
        //     x: '0%',
        //     hoverAnimation: false,
        //     data : [{
        //         value:100,
        //         itemStyle:{color :'rgba(0,153,255,0.3)'},
        //         label : {show : false},
        //         labelLine : {show : false}
        //     }]
        // }]
    };

    var color = ['#07fff8', '#ffe94f', '#ff2b3b'];

    option_gauge.title.text = msgCount[0];
    option_gauge.series[0].data[0].value = msgCount[0];
    option_gauge.title.subtext = (msgCount[0]/curMsgCount*100).toFixed(1)+'%';
    option_gauge.series[0].data[1].value = curMsgCount-msgCount[0];
    option_gauge.title.textStyle.color = color[0];
    option_gauge.series[0].data[0].itemStyle.color=color[0];
    gauge1.resize();
    gauge1.setOption(option_gauge);
    option_gauge.title.text = msgCount[1];
    option_gauge.series[0].data[0].value = msgCount[1];
    option_gauge.title.subtext = (msgCount[1]/curMsgCount*100).toFixed(1)+'%';
    option_gauge.series[0].data[1].value = curMsgCount-msgCount[1];
    option_gauge.title.textStyle.color = color[1];
    option_gauge.series[0].data[0].itemStyle.color=color[1];
    gauge2.resize();
    gauge2.setOption(option_gauge);
    option_gauge.title.text = msgCount[2];
    option_gauge.series[0].data[0].value = msgCount[2];
    option_gauge.title.subtext = (msgCount[2]/curMsgCount*100).toFixed(1)+'%';
    option_gauge.series[0].data[1].value = curMsgCount-msgCount[2];
    option_gauge.title.textStyle.color = color[2];
    option_gauge.series[0].data[0].itemStyle.color=color[2];
    gauge3.resize();
    gauge3.setOption(option_gauge);
}

