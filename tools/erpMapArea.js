/*
    require jQuery
    require bdMap API
    require http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js
    require http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css
    created by xuyunxiang 2017.10.20
 */
(function ($) {
    $.fn.erpMapArea = function (args) {
        var self = $(this);
        if (self.length == 0) {
            return;
        }
        var defaults = {
            minZoom: 4,
            maxZoom: 19,
            enableMapClick: false, // 地图是否可以点击
            locationArray: [], // 其他经纪人区域
            locationNum: 1,
            pointNum: 1,
            isSetLocation: true,
            isSetPoint: false, // 是否可设置多个区域
            isCheckCross: true, // 检查重叠
            eventArray: [] // 事件数组
        };

        var options = $.extend(defaults, args);
        var map;
        var center = new BMap.Point(116.307852, 40.057031);
        var _polygonArray = [];
        var myDrawingManagerObject = null;

        self.data('point', []);
        self.data('locationArray', []);
        initMap();
        if (options.locationArray.length != 0) {
            renderAreas();
        }

        function initMap() {
            var bdOptions = $.extend({
                minZoom: 4,
                maxZoom: 19,
                enableMapClick: false
            }, options);
            map = new BMap.Map(self.get(0), bdOptions);
            var zoom = 16;
            if (self.data('locationArray').length == 0) {
                zoom = 10;
            }
            map.centerAndZoom(center, zoom);
            map.enableScrollWheelZoom();
            map.addControl(new BMap.MapTypeControl());
            initDrawTool(map);
            dispatchEvent();
            setViewport();
        }

        // 编辑时读取区域
        function renderAreas() {
            var pointArray = [];
            for (var i = options.locationArray.length - 1; i >= 0; i--) {
                var locationItem = options.locationArray[i];
                pointArray = pointArray.concat(drawPolygon(locationItem));
            }
        }

        function initDrawTool(map) {
            //实例化鼠标绘制工具
            var drawingModes = [];
            if (options.isSetLocation) {
                drawingModes.push(BMAP_DRAWING_POLYGON);
            }
            if (options.isSetPoint) {
                drawingModes.push(BMAP_DRAWING_MARKER);
            }
            myDrawingManagerObject = new BMapLib.DrawingManager(map, {
                isOpen: true, //是否开启绘制模式
                drawingType: 'hander', // BMAP_DRAWING_POLYGON
                enableDrawingTool: true, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_LEFT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    drawingTypes: [
                        BMAP_DRAWING_MARKER,
                        BMAP_DRAWING_CIRCLE,
                        BMAP_DRAWING_POLYLINE,
                        BMAP_DRAWING_POLYGON,
                        BMAP_DRAWING_RECTANGLE
                    ],
                    drawingModes: drawingModes
                },
                polygonOptions: {
                    strokeColor: "red",
                    fillColor: "white",
                    strokeWeight: 3,
                    strokeOpacity: 0.8,
                    fillOpacity: 0.6,
                    strokeStyle: 'solid'
                },
            });
            myDrawingManagerObject.setDrawingMode('hander'); // BMAP_DRAWING_POLYGON
            myDrawingManagerObject.addEventListener("markercomplete", function (e, overlay) {
                var currentNum = self.data('point').length;
                if (options.pointNum <= currentNum) {
                    alert('您最多可以添加' + options.pointNum + '个点')
                    map.removeOverlay(overlay);
                    return;
                }
                var point = overlay.getPosition();
                var pointArray = self.data('point');
                // pointArray.push(point);
                pointArray = [point];
                self.data('point', pointArray);
            });
            myDrawingManagerObject.addEventListener("polygoncomplete", function (e, overlay) {
                var currentNum = self.data('locationArray').length;
                if (options.locationNum <= currentNum) {
                    alert('您最多可以添加' + options.locationNum + '片区')
                    map.removeOverlay(overlay);
                    return;
                }

                var linePath = [];
                var locationArray = [];
                linePath = overlay.getPath();
                for (var i = 0; i < linePath.length; i++) {
                    locationArray.push(linePath[i].lng + "," + linePath[i].lat);
                }
                locationArray = locationArray.join(";");
                var locationsArray = self.data('locationArray');
                if (options.isCheckCross && window.erpMapPolygon) {
                    var polygon1 = new BMap.Polygon(locationArray);
                    for (var i = locationsArray.length - 1; i >= 0; i--) {
                        var item = locationsArray[i];
                        var polygon2 = new BMap.Polygon(item);
                        if (erpMapPolygon.mergePolygon(polygon1, polygon2, true)) {
                            alert('多边形不可以重叠');
                            map.removeOverlay(overlay);
                            return;
                        }
                    }
                }
                locationsArray.push ? locationsArray.push(locationArray) : (locationsArray = locationArray);
                self.data('locationArray', locationsArray);
            });
        }

        function drawPolygon(locationArray, styleOptions) {
            if (!map) {
                return;
            }
            var pointArray = locationArray.split(";");
            var polygonArray = [];
            for (var i = 0; i < pointArray.length; i++) {
                var pointItem = pointArray[i];
                var pointItemArray = pointItem.split(",");
                var bdPoint = new BMap.Point(+pointItemArray[0], +pointItemArray[1]);
                polygonArray.push(bdPoint);
            }
            var options = {
                strokeColor: "#333",
                fillColor: "#fff",
                strokeStyle: 'dashed',
                strokeWeight: 2,
                fillOpacity: 0.2
            };
            if (styleOptions) {
                options = $.extend(options, styleOptions);
            }
            var polygon = new BMap.Polygon(polygonArray, options);
            if (styleOptions) {
                _polygonArray.push(polygon);
            }
            map.addOverlay(polygon);

            return polygonArray;
        }

        /**
         * [dispatchEvent 派发地图事件]
         * @return {[type]} [undefined]
         */
        function dispatchEvent() {
            var ets = options.eventArray;
            for (var i = ets.length - 1; i >= 0; i--) {
                var item = ets[i];
                if (map) {
                    map.addEventListener(item.type, item.callback);
                }
            }
        }

        function setViewport() {
            var array = self.data('locationArray');
            var larray = options.locationArray;
            if (array.push) {
                array = larray.concat(array);
            } else {
                if (!!array) {
                    array = larray.push(array);
                } else {
                    array = larray;
                }
            }
            var pointArray = [];
            for (var i = array.length - 1; i >= 0; i--) {
                var item = array[i];
                item = item.split(';');
                for (var j = item.length - 1; j >= 0; j--) {
                    var pItem = item[j];
                    pItem = pItem.split(',');
                    pointArray.push(new BMap.Point(pItem[0], pItem[1]));
                }
            }
            map.setViewport(pointArray, { zoomFactor: 0 });
        }

        return {
            map: map,
            center: null,
            // 获取地图数据
            getData: function () {
                return {
                    point: self.data('point'),
                    locationArray: self.data('locationArray')
                };
            },
            // 设置地图数据
            setData: function (pointArray, locationArray) {
                // 重置数据
                map.clearOverlays();
                self.data('point', []);
                self.data('locationArray', []);
                var dataPoint = [];
                var dataLocationArray = [];

                pointArray.forEach(function (item, index) {
                    setPoint(item)
                    dataPoint.push(item)
                });

                locationArray.forEach(function (item, index) {
                    setPolygon(item)
                    dataLocationArray.push(item)
                });

                function setPoint(point) {
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);
                }

                function setPolygon(location) {
                    var pointArray = location.split(";");
                    var polygonArray = [];
                    for (var i = 0; i < pointArray.length; i++) {
                        var pointItem = pointArray[i];
                        var pointItemArray = pointItem.split(",");
                        var bdPoint = new BMap.Point(+pointItemArray[0], +pointItemArray[1]);
                        polygonArray.push(bdPoint);
                    }
                    var polygonOptions = {
                        strokeColor: "blue",
                        fillColor: "#ffffff",
                        strokeStyle: 'solid',
                        strokeWeight: 2,
                        fillOpacity: 0.2
                    };
                    var polygon = new BMap.Polygon(polygonArray, polygonOptions);
                    map.addOverlay(polygon);
                }
                // 设置片区
                renderAreas();

                self.data('point', dataPoint);
                self.data('locationArray', dataLocationArray);
            },
            setMoreArea: function (locationArray) {
                done();

                function done() {
                    var pointArray = [];
                    for (var i = locationArray.length - 1; i >= 0; i--) {
                        var locationItem = locationArray[i];
                        pointArray = pointArray.concat(drawPolygon(locationItem));
                    }
                }

            },
            setOtherMoreArea: function (locationArray) {
                done();

                function done() {
                    var styleOptions = {
                        strokeColor: "#8e8e8e",
                        fillColor: "#000",
                        strokeStyle: 'solid',
                        strokeWeight: 1,
                        fillOpacity: 0.2
                    }
                    for (var i = _polygonArray.length - 1; i >= 0; i--) {
                        map.removeOverlay(_polygonArray[i]);
                    }
                    _polygonArray = [];
                    var otherPointArray = [];
                    for (var i = locationArray.length - 1; i >= 0; i--) {
                        var locationItem = locationArray[i];
                        otherPointArray = otherPointArray.concat(drawPolygon(locationItem, styleOptions));
                    }
                }
            },
            // 清楚地图数据
            clearMap: function () {
                map.clearOverlays();
                // 重置数据
                self.data('point', []);
                self.data('locationArray', []);
            },
            getBounds: function () {
                return map.getBounds();
            },
            setViewport: function () {
                setViewport();
            },
            setCenter: function (point) {
                var center = new BMap.Point(point.lng, point.lat);
                map.centerAndZoom(center, 10);
            },
            getBoundary: function (areaName) {
                map.clearOverlays();
                // 重置数据
                self.data('point', []);
                self.data('locationArray', []);

                var boundary = new BMap.Boundary();
                boundary.get(areaName, function (rs) {
                    var count = rs.boundaries.length;
                    if (count === 0) {
                        alert('未能获取当前输入行政区域');
                        return;
                    }
                    var pointArray = [];
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
                        map.addOverlay(ply);
                        pointArray = pointArray.concat(ply.getPath());
                    }
                    map.setViewport(pointArray);
                });
            }
        };
    }
})(jQuery)