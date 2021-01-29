// 时间区
$(document).ready(function() {
    setInterval(showTime, 1000);

    function setTime(obj, txt) {
        obj.text(txt);
    }

    function showTime() {
        var weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        var today = new Date();
        var date = today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日';
        var hour = today.getHours();
        var minute = today.getMinutes();
        var second = today.getSeconds();
        if (hour < 10) hour = '0' + hour;
        if (minute < 10) minute = '0' + minute;
        if (second < 10) second = '0' + second;
        setTime($("#date"), date);
        setTime($("#day"), weekdays[today.getDay()]);
        setTime($("#hour"), hour);
        setTime($("#minute"), minute);
        setTime($("#second"), second);
    }
})