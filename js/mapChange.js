// 百度地图API功能
var map;    // 创建Map实例

$(function () {
    map = new BMap.Map("map",{toolBarVisible:false});
    map.centerAndZoom('北京',16); // 初始化地图,设置城市中心点和地图级别
    // map.centerAndZoom(new BMap.Point(116.311, 39.990), 18);
    map.enableScrollWheelZoom(true);    // 允许鼠标滚轮缩放
    map.setMapStyle(myMapStyle);
});

// 自定义地图风格模板，隐藏人造物等
var myMapStyle = {
    styleJson:[
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": "#021019"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#147a92"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#0b3d51"
            }
        },
        {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "lightness": -70
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#857f7f"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "color": "#062032"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#1e1c1c"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#2da0c6",
                "visibility": "on"
            }
        }
    ]
};

// 普通marker
function addMarker(lng, lat, error_type, pseudonym, error_msg, time) {
    var new_point = new BMap.Point(lng, lat);
    // 定义三种icon
    var greenIcon = new BMap.Icon("images/marker1.png", new BMap.Size(12, 15), {"anchor": new BMap.Size(10, 30)});
    var yellowIcon = new BMap.Icon("images/marker2.png", new BMap.Size(12, 15), {"anchor": new BMap.Size(10, 30)});
    var redIcon = new BMap.Icon("images/marker3.png", new BMap.Size(12, 15), {"anchor": new BMap.Size(10, 30)});
    var icons = [greenIcon, yellowIcon, redIcon];
    var marker = new BMap.Marker(new_point, {icon: icons[error_type]});
    // 使marker不被消除
    marker.disableMassClear();
    map.addOverlay(marker);
    // 添加点击事件，显示富marker
    marker.addEventListener('click', function (evt) {
        var point = evt.target.point;
        addRichMarker(lng, lat, error_type, pseudonym, error_msg, time);
    });
}


// 富Marker
function addRichMarker(lng, lat, error_type, pseudonym, error_msg, time) {
    map.clearOverlays();
    var new_point = new BMap.Point(lng, lat);

    var colors = ['#07fff8', '#ffe94f', '#ff2b3b'];
    var htm1 = "<div id='overLay' style='width:180px;height:90px;background:url(images/infobox_bg" + (error_type + 1) + ".png) center no-repeat;background-size:100% 100%;position: absolute;'>"
        + "<div id='pseudonym' style='width:75%;height:20%;color:#fff;float:right;clear:both;overflow: hidden;font-size:0.16rem;padding: 1% 1%'>"+pseudonym+"</div>"
        + "<div id='overLayTitle' style='width:75%;height:50%;color:" + colors[error_type] + ";float:right;padding: 1% 1%;font-size:0.16rem;line-height;50%;overflow:hidden;text-overflow: ellipsis;\n" +
        "    display: -webkit-box;\n" +
        "    -webkit-box-orient: vertical;\n" +
        "    -webkit-line-clamp: 2;font-weight: bold;'>" + error_msg + "</div>"
        + "<div id='overLayTime' style='width:80%;height:0.2rem;color:#fff;position:absolute;bottom:30%;right:5%;font-size:0.1rem;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;" +
        "；'>" + time + "</div>"
        + "</div>",
        myRichMarker1 = new BMapLib.RichMarker(htm1, new_point, {
            "anchor": new BMap.Size(-95, -105),
            "enableDragging": false
        });
    map.centerAndZoom(new_point);
    map.addOverlay(myRichMarker1);
    map.panTo(new_point);
}
