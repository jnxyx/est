/**
 * 该例子提供基于多边形重叠合并算法 
 * 基于Baidu Map API
 *
 * Source:https://github.com/jnxyx/bdmap-plugin/
 *
 * @author arvin
 */

/** 
 * @namespace BMap的所有library类均放在BMapLib命名空间下
 */
var BMapLib = window.BMapLib = BMapLib || {};
(function() {
    /**
       * 地球半径
       */
    var EARTHRADIUS = 6370996.81;

    var polygonCtrl =
        /**
         * 并入BMapLib方法
         */
        BMapLib.polygonCtrl =
        /**
         * 并入全局对象
         */
        window.erpMapPolygon = function() {}

    /**
     * [isPointInRect 判断点是否在矩形内]
     * @param  {[type]}  point  [点对象]
     * @param  {[type]}  bounds [矩形边界对象]
     * @return {Boolean}        [点在矩形内返回true,否则返回false]
     */
    polygonCtrl.isPointInRect = function(point, bounds) {
        //检查类型是否正确
        if (!(point instanceof BMap.Point) ||
            !(bounds instanceof BMap.Bounds)) {
            return false;
        }
        var sw = bounds.getSouthWest(); //西南脚点
        var ne = bounds.getNorthEast(); //东北脚点
        return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
    }

    /**
     * [isPointInPolygon 判断点是否多边形内]
     * @param  {[type]}  point   [点对象]
     * @param  {[type]}  polygon [多边形对象]
     * @return {Boolean}         [点在多边形内返回true,否则返回false]
     */
    polygonCtrl.isPointInPolygon = function(point, polygon) { //检查类型

        if (!(point instanceof BMap.Point) ||
            !(polygon instanceof BMap.Polygon)) {
            return false;
        }

        //首先判断点是否在多边形的外包矩形内，如果在，则进一步判断，否则返回false
        var polygonBounds = polygon.getBounds();
        if (!this.isPointInRect(point, polygonBounds)) {
            return false;
        }

        var pts = polygon.getPath(); //获取多边形点

        //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
        //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
        //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

        var N = pts.length;
        var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        var intersectCount = 0; //cross points count of x 
        var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
        var p1, p2; //neighbour bound vertices
        var p = point; //测试点

        p1 = pts[0]; //left vertex        
        for (var i = 1; i <= N; ++i) { //check all rays            
            if (p.equals(p1)) {
                return boundOrVertex; //p is an vertex
            }

            p2 = pts[i % N]; //right vertex            
            if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) { //ray is outside of our interests                
                p1 = p2;
                continue; //next ray left point
            }

            if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) { //ray is crossing over by the algorithm (common part of)
                if (p.lng <= Math.max(p1.lng, p2.lng)) { //x is before of ray                    
                    if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) { //overlies on a horizontal ray
                        return boundOrVertex;
                    }

                    if (p1.lng == p2.lng) { //ray is vertical                        
                        if (p1.lng == p.lng) { //overlies on a vertical ray
                            return boundOrVertex;
                        } else { //before ray
                            ++intersectCount;
                        }
                    } else { //cross point on the left side                        
                        var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng; //cross point of lng                        
                        if (Math.abs(p.lng - xinters) < precision) { //overlies on a ray
                            return boundOrVertex;
                        }

                        if (p.lng < xinters) { //before ray
                            ++intersectCount;
                        }
                    }
                }
            } else { //special case when ray is crossing through the vertex                
                if (p.lat == p2.lat && p.lng <= p2.lng) { //p crossing over p2                    
                    var p3 = pts[(i + 1) % N]; //next vertex                    
                    if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) { //p.lat lies between p1.lat & p3.lat
                        ++intersectCount;
                    } else {
                        intersectCount += 2;
                    }
                }
            }
            p1 = p2; //next ray left point
        }

        if (intersectCount % 2 == 0) { //偶数在多边形外
            return false;
        } else { //奇数在多边形内
            return true;
        }
    }

    /**
     * [mergePolygon 多边形合并]
     * @param  {[type]} polygon1 [第一个多边形]
     * @param  {[type]} polygon2 [第二个多边形]
     * @return {[type]}          [多边形合并结果集]
     */
    polygonCtrl.mergePolygon = function(polygon1, polygon2, isCheckCross) {

        if (!(polygon1 instanceof BMap.Polygon) ||
            !(polygon2 instanceof BMap.Polygon)) {
            return [];
        }

        var pointArray1 = polygon1.getPath(),
            pointArray2 = polygon2.getPath();
             
        if (pointArray1.length == 0) return [new BMap.Polygon(pointArray2)];
        if (pointArray2.length == 0) return [new BMap.Polygon(pointArray1)];

        for (var i = pointArray1.length - 1; i >= 0; i--) {
            var pointItem = pointArray1[i];
            pointItem.index = i;
            pointItem.type = 1;
            pointItem.prev = pointArray1[(pointArray1.length + i - 1) % pointArray1.length];
            pointItem.next = pointArray1[(pointArray1.length + i + 1) % pointArray1.length];
            if (this.isPointInPolygon(pointItem, polygon2)) {
                if (isCheckCross) {
                    return true;
                }
                pointItem.cancle = true;
            }
        }

        for (var i = pointArray2.length - 1; i >= 0; i--) {
            var pointItem = pointArray2[i];
            pointItem.index = i;
            pointItem.type = 2;
            pointItem.prev = pointArray2[(pointArray2.length + i - 1) % pointArray2.length];
            pointItem.next = pointArray2[(pointArray2.length + i + 1) % pointArray2.length];
            if (this.isPointInPolygon(pointItem, polygon1)) {
                if (isCheckCross) {
                    return true;
                }
                pointItem.cancle = true;
            }
        }

        var point1Prev = pointArray1[0];
        var point2Prev = pointArray2[0];

        var crossPoints = [];
        for (var i = 1; i <= pointArray1.length; i++) {
            point1Next = pointArray1[i % pointArray1.length];

            for (var j = 1; j <= pointArray2.length; j++) {
                point2Next = pointArray2[j % pointArray2.length];

                // 解方程得出交叉点
                var crossPoint = mapEquationsSet([point1Prev, point1Next], [point2Prev, point2Next]);
                if (crossPoint) {
                    if (isCheckCross) {
                        return true;
                    }
                    crossPoints = crossPoints.concat(crossPoint);
                }
                point2Prev = point2Next;
            }

            point1Prev = point1Next;
        }

        if (isCheckCross) {
            return false;
        }

        if (!crossPoints.length) {
            return [polygon1, polygon2]
        } else {
            var concatPolygon = [];
            getNextPoint(pointArray1[0], concatPolygon, crossPoints);
            if (concatPolygon[0]) {
                concatPolygon.push(copyPoint(concatPolygon[0]));
            }
            concatPolygon = stringfyPolygon(concatPolygon)

            return [concatPolygon];
        }

    }

    /**
     * [getPolygonCenter 获取多边形外接矩形中心点]
     * @param  {[type]} polygon [多边形参数]
     * @return {[type]}         [中心点返回值]
     */
    polygonCtrl.getPolygonCenter = function(polygon) {
        if (!(polygon instanceof BMap.Polygon)) {
            return [];
        }
        var bounds = polygon.getBounds(); //获取多边形点
        var sw = bounds.getSouthWest(); //西南脚点
        var ne = bounds.getNorthEast(); //东北脚点
        return new BMap.Point((sw.lng + ne.lng) / 2, (sw.lat + ne.lat) / 2);
    }
    
    polygonCtrl.mapEquationsSet = mapEquationsSet;
      /**
      * 计算多边形面或点数组构建图形的面积,注意：坐标类型只能是经纬度，且不适合计算自相交多边形的面积
      * @param {Polygon|Array<Point>} polygon 多边形面对象或者点数组
      * @returns {Number} 多边形面或点数组构成图形的面积
      */
     polygonCtrl.getPolygonArea = function(polygon){
         //检查类型
         if(!(polygon instanceof BMap.Polygon) &&
             !(polygon instanceof Array)){
             return 0;
         }
         var pts;
         if(polygon instanceof BMap.Polygon){
             pts = polygon.getPath();
         }else{
             pts = polygon;    
         }
         
         if(pts.length < 3){//小于3个顶点，不能构建面
             return 0;
         }
         
         var totalArea = 0;//初始化总面积
         var LowX = 0.0;
         var LowY = 0.0;
         var MiddleX = 0.0;
         var MiddleY = 0.0;
         var HighX = 0.0;
         var HighY = 0.0;
         var AM = 0.0;
         var BM = 0.0;
         var CM = 0.0;
         var AL = 0.0;
         var BL = 0.0;
         var CL = 0.0;
         var AH = 0.0;
         var BH = 0.0;
         var CH = 0.0;
         var CoefficientL = 0.0;
         var CoefficientH = 0.0;
         var ALtangent = 0.0;
         var BLtangent = 0.0;
         var CLtangent = 0.0;
         var AHtangent = 0.0;
         var BHtangent = 0.0;
         var CHtangent = 0.0;
         var ANormalLine = 0.0;
         var BNormalLine = 0.0;
         var CNormalLine = 0.0;
         var OrientationValue = 0.0;
         var AngleCos = 0.0;
         var Sum1 = 0.0;
         var Sum2 = 0.0;
         var Count2 = 0;
         var Count1 = 0;
         var Sum = 0.0;
         var Radius = EARTHRADIUS; //6378137.0,WGS84椭球半径 
         var Count = pts.length;        
         for (var i = 0; i < Count; i++) {
             if (i == 0) {
                 LowX = pts[Count - 1].lng * Math.PI / 180;
                 LowY = pts[Count - 1].lat * Math.PI / 180;
                 MiddleX = pts[0].lng * Math.PI / 180;
                 MiddleY = pts[0].lat * Math.PI / 180;
                 HighX = pts[1].lng * Math.PI / 180;
                 HighY = pts[1].lat * Math.PI / 180;
             }
             else if (i == Count - 1) {
                 LowX = pts[Count - 2].lng * Math.PI / 180;
                 LowY = pts[Count - 2].lat * Math.PI / 180;
                 MiddleX = pts[Count - 1].lng * Math.PI / 180;
                 MiddleY = pts[Count - 1].lat * Math.PI / 180;
                 HighX = pts[0].lng * Math.PI / 180;
                 HighY = pts[0].lat * Math.PI / 180;
             }
             else {
                 LowX = pts[i - 1].lng * Math.PI / 180;
                 LowY = pts[i - 1].lat * Math.PI / 180;
                 MiddleX = pts[i].lng * Math.PI / 180;
                 MiddleY = pts[i].lat * Math.PI / 180;
                 HighX = pts[i + 1].lng * Math.PI / 180;
                 HighY = pts[i + 1].lat * Math.PI / 180;
             }
             AM = Math.cos(MiddleY) * Math.cos(MiddleX);
             BM = Math.cos(MiddleY) * Math.sin(MiddleX);
             CM = Math.sin(MiddleY);
             AL = Math.cos(LowY) * Math.cos(LowX);
             BL = Math.cos(LowY) * Math.sin(LowX);
             CL = Math.sin(LowY);
             AH = Math.cos(HighY) * Math.cos(HighX);
             BH = Math.cos(HighY) * Math.sin(HighX);
             CH = Math.sin(HighY);
             CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
             CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);
             ALtangent = CoefficientL * AL - AM;
             BLtangent = CoefficientL * BL - BM;
             CLtangent = CoefficientL * CL - CM;
             AHtangent = CoefficientH * AH - AM;
             BHtangent = CoefficientH * BH - BM;
             CHtangent = CoefficientH * CH - CM;
             AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));
             AngleCos = Math.acos(AngleCos);            
             ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
             BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
             CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;
             if (AM != 0)
                 OrientationValue = ANormalLine / AM;
             else if (BM != 0)
                 OrientationValue = BNormalLine / BM;
             else
                 OrientationValue = CNormalLine / CM;
             if (OrientationValue > 0) {
                 Sum1 += AngleCos;
                 Count1++;
             }
             else {
                 Sum2 += AngleCos;
                 Count2++;
             }
         }        
         var tempSum1, tempSum2;
         tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2);
         tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2;
         if (Sum1 > Sum2) {
             if ((tempSum1 - (Count - 2) * Math.PI) < 1)
                 Sum = tempSum1;
             else
                 Sum = tempSum2;
         }
         else {
             if ((tempSum2 - (Count - 2) * Math.PI) < 1)
                 Sum = tempSum2;
             else
                 Sum = tempSum1;
         }
         totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;
 
         return totalArea; //返回总面积
     }
    function mapEquationsSet(points1, points2) {

        var k1, k2, b1, b2;
        var minlat1 = Math.min(points1[0].lat, points1[1].lat);
        var maxlat1 = Math.max(points1[0].lat, points1[1].lat);
        var minlat2 = Math.min(points2[0].lat, points2[1].lat);
        var maxlat2 = Math.max(points2[0].lat, points2[1].lat);
        var minlng1 = Math.min(points1[0].lng, points1[1].lng);
        var maxlng1 = Math.max(points1[0].lng, points1[1].lng);
        var minlng2 = Math.min(points2[0].lng, points2[1].lng);
        var maxlng2 = Math.max(points2[0].lng, points2[1].lng);

        if (points1[0].lng == points1[1].lng) {
            if (points2[0].lng == points2[1].lng && points1[0].lng == points2[0].lng) {
                if (points1[0].lat < minlat2) {
                    if (points1[1].lat < minlat2) {
                        return false;
                    } else if (points1[1].lat < maxlat2) {
                        var p1 = new BMap.Point(points1[1].lng, points1[1].lat);
                        var p2;
                        if (points2[0].lat < points2[1].lat) {
                            p2 = new BMap.Point(points2[0].lng, points2[0].lat);
                        } else {
                            p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        }
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else {
                        var p1 = new BMap.Point(points2[0].lng, points2[0].lat);
                        var p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    }
                } else if (points1[0].lat <= maxlat2) {
                    var p1 = new BMap.Point(points1[0].lng, points1[0].lat);
                    if (points1[1].lat < minlat2) {
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1];
                    } else if (points1[1].lat < maxlat2) {
                        var p2 = new BMap.Point(points1[1].lng, points1[1].lat);
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else {
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1];
                    }
                } else {
                    if (points1[1].lat < minlat2) {
                        var p1 = new BMap.Point(points2[0].lng, points2[0].lat);
                        var p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else if (points1[1].lat < maxlat2) {
                        var p1 = new BMap.Point(points1[1].lng, points1[1].lat);
                        var p2;
                        if (points2[0].lat < points2[1].lat) {
                            p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        } else {
                            p2 = new BMap.Point(points2[0].lng, points2[0].lat);
                        }
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else {
                        return false;
                    }
                }
            } else if (points2[0].lng == points2[1].lng && points1[0].lng != points2[0].lng) {
                return false;
            } else {
                k2 = (points2[0].lat - points2[1].lat) / (points2[0].lng - points2[1].lng);
                b2 = points2[0].lat - k2 * points2[0].lng;
                var lng, lat;
                lng = points1[0].lng;
                lat = k2 * points1[0].lng + b2;
                if (lat < minlat1 || lat > maxlat1) {
                    return false;
                } else if (lat < minlat2 || lat > maxlat2) {
                    return false;
                } else {
                    var p1 = new BMap.Point(lng, lat);
                    p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                    return [p1];
                }
            }
        }

        if (points2[0].lng == points2[1].lng) {
            k1 = (points1[0].lat - points1[1].lat) / (points1[0].lng - points1[1].lng);
            b1 = points1[0].lat - k1 * points1[0].lng;
            var lng, lat;
            lng = points2[0].lng;
            lat = k1 * points2[0].lng + b1;
            if (lat < minlat2 || lat > maxlat2) {
                return false;
            } else if (lat < minlat1 || lat > maxlat1) {
                return false;
            } else {
                var p1 = new BMap.Point(lng, lat);
                p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                return [p1];
            }
        }

        k1 = (points1[0].lat - points1[1].lat) / (points1[0].lng - points1[1].lng);
        k2 = (points2[0].lat - points2[1].lat) / (points2[0].lng - points2[1].lng);

        b1 = points1[0].lat - k1 * points1[0].lng;
        b2 = points2[0].lat - k2 * points2[0].lng;

        if (k1 == k2) {
            if (b1 != b2) {
                return false;
            } else {
                if (points1[0].lat < minlat2) {
                    if (points1[1].lat < minlat2) {
                        return false;
                    } else if (points1[1].lat < maxlat2) {
                        var p1 = new BMap.Point(points1[1].lng, points1[1].lat);
                        var p2;
                        if (points2[0].lat < points2[1].lat) {
                            p2 = new BMap.Point(points2[0].lng, points2[0].lat);
                        } else {
                            p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        }
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else {
                        var p1 = new BMap.Point(points2[0].lng, points2[0].lat);
                        var p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    }
                } else if (points1[0].lat <= maxlat2) {
                    var p1 = new BMap.Point(points1[0].lng, points1[0].lat);
                    if (points1[1].lat < minlat2) {
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1];
                    } else if (points1[1].lat < maxlat2) {
                        var p2 = new BMap.Point(points1[1].lng, points1[1].lat);
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else {
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1];
                    }
                } else {
                    if (points1[1].lat < minlat2) {
                        var p1 = new BMap.Point(points2[0].lng, points2[0].lat);
                        var p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else if (points1[1].lat < maxlat2) {
                        var p1 = new BMap.Point(points1[1].lng, points1[1].lat);
                        var p2;
                        if (points2[0].lat < points2[1].lat) {
                            p2 = new BMap.Point(points2[1].lng, points2[1].lat);
                        } else {
                            p2 = new BMap.Point(points2[0].lng, points2[0].lat);
                        }
                        p1.concat = [points1[0], points1[1], points2[0], points2[1]];
                        p2.concat = [points1[0], points1[1], points2[0], points2[1]];
                        return [p1, p2];
                    } else {
                        return false;
                    }
                }
            }
        } else {
            var lat, lng;
            lng = (b2 - b1) / (k1 - k2);
            lat = k1 * lng + b1;
            if (lat < minlat1 || lat > maxlat1) {
                return false;
            }
            if (lat < minlat2 || lat > maxlat2) {
                return false;
            }
            if (lng < minlng1 || lng > maxlng1) {
                return false;
            }
            if (lng < minlng2 || lng > maxlng2) {
                return false;
            }
            var p1 = new BMap.Point(lng, lat);
            p1.concat = [points1[0], points1[1], points2[0], points2[1]];
            return [p1];
        }

    }

    function copyPoint(bdPoint) {
        return new BMap.Point(bdPoint.lng, bdPoint.lat);
    }

    /**
     * [getNextPoint 连接待合并的polygon]
     *
     * pyPoint    > pyPoint
     * pyPoint    > crossPoint
     * crossPoint > pyPoint
     * crossPoint > crossPoint
     * 
     */
    function getNextPoint(bdPoint, concatPolygon, crossPoints, prev) {
        if (!bdPoint.cancle) {
            concatPolygon.push(copyPoint(bdPoint));
            bdPoint.cancle = true;
        } else {
            return;
        }

        // crossPoint    > 
        if (bdPoint.concat) {
            var concatPoints = bdPoint.concat;
            concatPoints = getLeasePoints(concatPoints);
            if (concatPoints.length == 0) return;
            // > pyPoint
            for (var i = concatPoints.length - 1; i >= 0; i--) {
                var pointItem = concatPoints[i];
                var pointItemNear = getNearPointInLine(pointItem, crossPoints);
                if (pointItemNear == bdPoint) {
                    getNextPoint(pointItem, concatPolygon, crossPoints, bdPoint);
                    return;
                }
            }
            // > crossPoint
        }

        // pyPoint       > 
        else {
            var pointers = bePointerInCrossPoints(bdPoint, crossPoints);
            // > crossPoint
            if (pointers.length) {
                nearPoint = getNearPointInLine(bdPoint, pointers);
                if (!nearPoint.cancle) {
                    getNextPoint(nearPoint, concatPolygon, crossPoints, bdPoint);
                }
                return;
            }
            // > pyPoint
            else {
                if (bdPoint.prev.cancle) {
                    getNextPoint(bdPoint.next, concatPolygon, crossPoints, bdPoint);
                } else {
                    getNextPoint(bdPoint.prev, concatPolygon, crossPoints, bdPoint);
                }
            }
        }
    }

    // 在剩余交叉点集中存在指向
    function bePointerInCrossPoints(point, crossPoints) {
        var pointers = [];
        for (var i = crossPoints.length - 1; i >= 0; i--) {
            var crossPoint = crossPoints[i];
            if (crossPoint.concat.indexOf(point) != -1 && !crossPoint.cancle) {
                pointers.push(crossPoint);
            }
        }
        return pointers;
    }

    // 获取线段离指定端点最近的点
    function getNearPointInLine(point, pointers) {
        var nearPoint = pointers[0];
        for (var i = 1; i < pointers.length; i++) {
            var nearAbso = Math.abs(point.lat - nearPoint.lat);
            var abso = Math.abs(point.lat - pointers[i].lat);
            if (nearAbso <= abso) {
                continue;
            } else {
                nearPoint = pointers[i];
            }
        }
        return nearPoint;
    }

    // 获取剩下点、或者移除待删点
    function getLeasePoints(points) {
        if (points.length == 0) return [];
        var returnPoints = [];
        for (var i = points.length - 1; i >= 0; i--) {
            if (!points[i].cancle) {
                returnPoints.push(points[i]);
            }
        }

        return returnPoints;
    }

    function stringfyPolygon(polygon) {
        var array = [];
        for (var i = 0; i <= polygon.length - 1; i++) {
            var item = polygon[i];
            array.push(item.lng + ',' + item.lat);
        }
        return array.join(';');
    }

})();
