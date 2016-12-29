/// <reference path="raphael-min.js" />
var zyGH = function () {

}
zyGH.CGauge = function (container, x, y) {
    this.startAngle; //起始角度
    this.endAngle;  //结束角度
    this.LargeTick;  //粗等数
    this.SmallTick;  //细等数
    this.minValue;  //最小值
    this.maxValue;  //最大值
    this.paper = Raphael(container, x, y);
    this.dialRadius; //表盘半径
    this.ltlen; //表盘粗分隔线长
    this.stlen; //表盘细分隔线长
    this.ltlenColor;
    this.stlenColor;
    this.cenX;
    this.cenY;
    this.point;
    this.pointRadion;
    this.data;
    this.value;
    this.WatchName;
}
zyGH.CGauge.prototype.StartAngleSet = function (angle1) {
    this.startAngle = angle1;
    return this;
}
zyGH.CGauge.prototype.EndAngleSet = function (angle2) {
    this.endAngle = angle2;
    return this;
}
zyGH.CGauge.prototype.LargeTickSet = function (count1) {
    this.LargeTick = count1;
    return this;
}
zyGH.CGauge.prototype.SmallTickSet = function (count2) {
    this.SmallTick = count2;
    return this;
}
zyGH.CGauge.prototype.MinValueSet = function (min) {
    this.minValue = min;
    return this;
}
zyGH.CGauge.prototype.MaxValueSet = function (max) {
    this.maxValue = max;
    return this;
}
zyGH.CGauge.prototype.DialRadiusSet = function (r) {
    this.dialRadius = r;
    return this;
}
zyGH.CGauge.prototype.ltlenSet = function (len1) {
    this.ltlen = len1;
    return this;
}
zyGH.CGauge.prototype.stlenSet = function (len2) {
    this.stlen = len2;
    return this;
}
zyGH.CGauge.prototype.SetName = function (name) {
    this.WatchName = name;
    return this;
}
zyGH.CGauge.prototype.SetValue = function (val) {
    var rotateAngle = val * (this.endAngle - this.startAngle) / (this.maxValue - this.minValue);
    if (rotateAngle == 0)
        rotateAngle = 0.0001;
    if (rotateAngle >= (this.endAngle - this.startAngle))
        rotateAngle = this.endAngle - this.startAngle;
    var ssss = "r" + rotateAngle.toString() + "," + this.cenX.toString() + "," + this.cenY.toString();
    //起始角度弧度
    var startAngleRadion = this.startAngle * 2 * Math.PI / 360;
    //终点角度弧度
    var endAngleRadion = (this.startAngle + rotateAngle) * 2 * Math.PI / 360;
    //起始点的X,Y坐标
    var lineX1 = 0;
    var lineY1 = 0;
    var lineX2 = 0;
    var lineY2 = 0;
    lineX1 = this.cenX - Math.sin(startAngleRadion) * (this.dialRadius + this.ltlen);
    lineY1 = this.cenY + Math.cos(startAngleRadion) * (this.dialRadius + this.ltlen);
    lineX2 = this.cenX - Math.sin(endAngleRadion) * (this.dialRadius + this.ltlen);
    lineY2 = this.cenY + Math.cos(endAngleRadion) * (this.dialRadius + this.ltlen);
    //判断大弧度还是小弧度
    var BigOrSmallRadion;
    if (rotateAngle < 180)
        BigOrSmallRadion = 0;
    else
        BigOrSmallRadion = 1;
    var RadionStringPath = "M" + lineX1.toString() + " " + lineY1.toString() + "A" + (this.dialRadius + this.ltlen).toString() + " " + (this.dialRadius + this.ltlen).toString() + ",0," + BigOrSmallRadion.toString() + ",1," + lineX2.toString() + " " + lineY2.toString();
    this.pointRadion.animate({ path: RadionStringPath }, 0, "linear");

    //    var strPoint1 = "M" + (this.cenX - Math.sin(endAngleRadion) * (this.dialRadius - 10)).toString() + " " + (this.cenY + Math.cos(endAngleRadion) * (this.dialRadius - 10)).toString();
    //    var strPoint2 = "L" + (this.cenX - Math.cos(endAngleRadion) * 10).toString() + " " + (this.cenY - Math.sin(endAngleRadion) * 10).toString();
    //    var strPoint3 = "L" + (this.cenX + Math.sin(endAngleRadion) * 40).toString() + " " + (this.cenY - Math.cos(endAngleRadion) * 40).toString();
    //    var strPoint4 = "L" + (this.cenX + Math.cos(endAngleRadion) * 10).toString() + " " + (this.cenY + Math.sin(endAngleRadion) * 10).toString() + "Z";
    //    var strpointpath = strPoint1 + strPoint2 + strPoint3 + strPoint4;
    //    this.point.animate({ path: strpointpath }, 200, ">");
    this.point.animate({ transform: ssss }, 200, ">");
    //this.data.remove();
    this.data.attr("text", val.toString());
    //this.data = this.paper.text(this.cenX, this.cenY + 55, val.toString()).attr("font-size", 22).attr("font-family", "Arial").attr("stroke", "#E9A349");
}
function drawString(angle, r, lineN, CenterX, CenterY) {
    //r 表盘半径  lineN 表盘分隔线长度
    var lineX1 = 0;
    var lineY1 = 0;
    var lineX2 = 0;
    var lineY2 = 0;
    lineX1 = CenterX - Math.sin(angle) * (r + lineN);
    lineY1 = CenterY + Math.cos(angle) * (r + lineN);
    lineX2 = CenterX - Math.sin(angle) * r;
    lineY2 = CenterY + Math.cos(angle) * r;
    var strpath = "M" + lineX1.toString() + " " + lineY1.toString() + "L" + lineX2.toString() + " " + lineY2.toString();
    return (strpath);
}
zyGH.CGauge.prototype.Create = function (offsetX, offsetY) {
    this.cenX = offsetX;
    this.cenY = offsetY;
    var angle = (this.endAngle - this.startAngle) / this.LargeTick;
    var angle1 = angle / this.SmallTick;
    //画背景圆
    this.paper.circle(offsetX, offsetY, offsetX - 2).attr("stroke-width", 2).attr("stroke", "#000000").attr("fill", "#000000"); //97AFD5;FAFCFF 2014.11.14
    //画内圆
    this.paper.circle(offsetX, offsetY, offsetX - 20).attr("stroke-width", 2).attr("stroke", "#000000").attr("fill", "#000000");//CDD5D9;E8EEF3 2014.11.14
    for (i = 0; i <= this.LargeTick; i++) {
        var Radian = (i * angle + this.startAngle) * 2 * Math.PI / 360;  //角度转到弧度
        var s = drawString(Radian, this.dialRadius, this.ltlen, offsetX, offsetY);
        this.paper.path(s).attr("stroke", "#FFFFFF").attr("stroke-width", 3);
        var intText = i * (this.maxValue - this.minValue) / this.LargeTick;
        var strText = intText.toString();
        var TextX;
        var TextY;
        //        if (inttext <= 90) {
        //TextX = offsetX - Math.sin(Radian) * (this.dialRadius + this.ltlen + 12);
        //TextY = offsetY + Math.cos(Radian) * (this.dialRadius + this.ltlen + 12);
        TextX = offsetX - Math.sin(Radian) * (this.dialRadius - 15);
        TextY = offsetY + Math.cos(Radian) * (this.dialRadius - 15);
        this.paper.text(TextX, TextY, strText).attr({
            "font-size": 14,
            "font-family": "Arial",
            "stroke": "#FFFFFF",
            "stroke-width": 0,
            "fill": "#FFFFFF"
        }); //7D848B
        if (i < this.LargeTick) {
            for (j = 1; j < this.SmallTick; j++) {
                var Radian1 = j * angle1 * 2 * Math.PI / 360 + Radian;  //角度转到弧度
                //var s1 = drawString(Radian1, this.dialRadius + 3, this.stlen, offsetX, offsetY);
                var s1 = drawString(Radian1, this.dialRadius + 3, this.stlen, offsetX, offsetY);
                this.paper.path(s1).attr("stroke", "#FFFFFF").attr("stroke-width", 1);//C9D2DB
            }
        }
    }
    //画圆弧
    //起始角度弧度
    var startAngleRadion = this.startAngle * 2 * Math.PI / 360;
    //终点角度弧度
    var endAngleRadion = this.endAngle * 2 * Math.PI / 360;
    //起始点的X,Y坐标
    var lineX1 = 0;
    var lineY1 = 0;
    var lineX2 = 0;
    var lineY2 = 0;
    lineX1 = offsetX - Math.sin(startAngleRadion) * (this.dialRadius + this.ltlen);
    lineY1 = offsetY + Math.cos(startAngleRadion) * (this.dialRadius + this.ltlen);
    lineX2 = offsetX - Math.sin(endAngleRadion) * (this.dialRadius + this.ltlen);
    lineY2 = offsetY + Math.cos(endAngleRadion) * (this.dialRadius + this.ltlen);
    //判断大弧度还是小弧度
    var BigOrSmallRadion;
    if ((this.endAngle - this.startAngle) < 180)
        BigOrSmallRadion = 0;
    else
        BigOrSmallRadion = 1;
    var RadionStringPath = "M" + lineX1.toString() + " " + lineY1.toString() + "A" + (this.dialRadius + this.ltlen).toString() + " " + (this.dialRadius + this.ltlen).toString() + ",0," + BigOrSmallRadion.toString() + ",1," + lineX2.toString() + " " + lineY2.toString();
    this.paper.path(RadionStringPath).attr("stroke-width", 5).attr("stroke", "#FFFFFF");
    //var RadionStringPath1 = "M" + lineX1.toString() + " " + lineY1.toString() + "A" + (this.dialRadius + this.ltlen).toString() + " " + (this.dialRadius + this.ltlen).toString() + ",0," + "0" + ",1," + lineX1.toString() + " " + lineY1.toString();
    var RadionStringPath1 = "M" + lineX1.toString() + " " + lineY1.toString() + "L" + lineX1.toString() + " " + lineY1.toString();
    this.pointRadion = this.paper.path(RadionStringPath1).attr("stroke-width", 5).attr("stroke", "#FF0000")//.attr("fill","#FFFFFF");
    //var str = drawString(this.startAngle * 2 * Math.PI / 360, 0, this.dialRadius - 3, offsetX, offsetY);
    //this.point = this.paper.path(str).attr("stroke", "#FB1509").attr("stroke-width", 3).rotate(0, offsetX, offsetY);
    var circle1 = this.paper.circle(offsetX, offsetY, 20).attr("stroke-width", 2);
    circle1.attr("fill", "#FFFFFF");
    circle1.attr("stroke", "#FFFFFF");
    //画表名称
    this.paper.text(offsetX, offsetY - 45, this.WatchName).attr("font-size", 16).attr("font-family", "Arial").attr("stroke", "#FFFFFF").attr("font-weight", "bold").attr("fill", "#FFFFFF").attr("stroke-width", 0); //7D848B
    //画指针
    var strPoint1 = "M" + (offsetX - Math.sin(startAngleRadion) * (this.dialRadius - 10)).toString() + " " + (offsetY + Math.cos(startAngleRadion) * (this.dialRadius - 10)).toString();
    var strPoint2 = "L" + (offsetX - Math.cos(startAngleRadion) * 10).toString() + " " + (offsetY - Math.sin(startAngleRadion) * 10).toString();
    var strPoint3 = "L" + (offsetX + Math.sin(startAngleRadion) * 40).toString() + " " + (offsetY - Math.cos(startAngleRadion) * 40).toString();
    var strPoint4 = "L" + (offsetX + Math.cos(startAngleRadion) * 10).toString() + " " + (offsetY + Math.sin(startAngleRadion) * 10).toString() + "Z";
    this.point = this.paper.path(strPoint1 + strPoint2 + strPoint3 + strPoint4).attr("stroke", "#DE0202").attr("stroke-width", 0).attr("fill", "135-#DE0202-#DE0202:48-#AE0303:52-#AE0303"); //67.5-#dd4242-#ff4242:48-#A00:52-#A00  

    var circle2 = this.paper.circle(offsetX, offsetY, 15).attr("stroke-width", 2);
    circle2.attr("fill", "#FFFFFF")
    //circle2.attr("fill", "45-#00000-#FFFFFF:48-#A00:52-#A00")
    circle2.attr("stroke", "#C3C8CC");
    //画显示数字
    //var viewDataPath1 = "M" + (offsetX - 36).toString() + " " + (offsetY + 35).toString();
    //var viewDataPath2 = "L" + (offsetX + 36).toString() + " " + (offsetY + 35).toString();
    //var viewDataPath3 = "A18 18,0,1,1," + (offsetX + 36).toString() + " " + (offsetY + 71).toString();
    //var viewDataPath4 = "L" + (offsetX - 36).toString() + " " + (offsetY + 71).toString();
    //var viewDataPath5 = "A18 18,0,1,1," + (offsetX - 36).toString() + " " + (offsetY + 35).toString();
    //this.paper.path(viewDataPath1 + viewDataPath2 + viewDataPath3 + viewDataPath4 + viewDataPath5).attr("stroke-width", 2).attr("stroke", "#CBD2D7").attr("fill", "#FFFFFF"); //DAE2E8

    //var viewDataPath11 = "M" + (offsetX - 36).toString() + " " + (offsetY + 38).toString();
    //var viewDataPath21 = "L" + (offsetX + 36).toString() + " " + (offsetY + 38).toString();
    //var viewDataPath31 = "A15 15,0,1,1," + (offsetX + 36).toString() + " " + (offsetY + 68).toString();
    //var viewDataPath41 = "L" + (offsetX - 36).toString() + " " + (offsetY + 68).toString();
    //var viewDataPath51 = "A15 15,0,1,1," + (offsetX - 36).toString() + " " + (offsetY + 38).toString();
    //this.paper.path(viewDataPath11 + viewDataPath21 + viewDataPath31 + viewDataPath41 + viewDataPath51).attr("stroke-width", 2).attr("stroke", "#D8DFE4").attr("fill", "#FFFFFF");//EDF1F4
    this.data = this.paper.text(offsetX + 80, offsetY + 70, "0").attr("font-size", 60).attr("font-family", "Arial").attr("stroke", "#FF8000").attr("fill", "#FF8000").attr("stroke-width", 1); //E9A349
    return this;
}
//数码管显示--带小数点、最高位0时不显示
zyGH.SSegArray = function (container, x, y) {
    this.paperSSeg = Raphael(container, x, y);
    this.myArray;
    //  this.mySegCode = new Array(); //代码数组
    this.initial; //初始化值
    this.Countn; //数码管数目
    this.scaleValue; //放大倍数
    this.space; //数码管间距
    this.colorBlack; //底色
    this.colorTop; //显示数字颜色
}
zyGH.SSegArray.prototype.scale = function (m) {
    this.scaleValue = m;
    return this;
}
zyGH.SSegArray.prototype.Spacing = function (sp) {
    this.space = sp;
    return this;
}
zyGH.SSegArray.prototype.Count = function (count) {
    this.Countn = count;
    return this;
}
zyGH.SSegArray.prototype.initialValue = function (init) {
    this.initial = init;
    return this;
}
zyGH.SSegArray.prototype.SetcolorBlack = function (color1) {
    this.colorBlack = color1;
    return this;
}
zyGH.SSegArray.prototype.SetcolorTop = function (color2) {
    this.colorTop = color2;
    return this;
}
zyGH.SSegArray.prototype.SetValue = function (val) {
    for (i = 0; i < this.Countn; i++) {
        if (val >= Math.pow(10, i - this.initial)) {
            var pp = val * Math.pow(10, this.initial) / Math.pow(10, i); //扩大倍数，如果小数1位即扩大10倍
            var uu = parseInt(pp.toString(), 10) % 10; //算最后一位整数值
            var aa = SSegDecode(uu); //返回数字对应LED的编码
            var bb = aa.length; //数组长度
            for (t = 0; t < 7; t++) {
                this.myArray[this.Countn - i - 1][t].attr("fill", this.colorBlack).attr("stroke", this.colorBlack);
            }
            for (j = 0; j < bb; j++) {
                this.myArray[this.Countn - i - 1][aa[j]].attr("fill", this.colorTop).attr("stroke", this.colorTop);
            }
        }
        else if (i > 1) {
            for (t = 0; t < 7; t++) {
                this.myArray[this.Countn - i - 1][t].attr("fill", this.colorBlack).attr("stroke", this.colorBlack);
            }
        }
    }
}
zyGH.SSegArray.prototype.Create = function (offsetX, offsetY) {
    this.myArray = new Array();
    for (i = 1; i <= this.Countn; i++) {
        offsetX = offsetX + 60 * this.scaleValue + this.space;
        var ledArray = new Array();
        for (j = 0; j < 3; j++) {
            var tempY = j * (40 * this.scaleValue + 2);
            var p11 = "M" + offsetX.toString() + " " + (offsetY + tempY).toString();
            var p21 = "L" + (offsetX + 5).toString() + " " + (offsetY + tempY - 5).toString();
            var p31 = "L" + (offsetX + 35).toString() + " " + (offsetY + tempY - 5).toString();
            var p41 = "L" + (offsetX + 40).toString() + " " + (offsetY + tempY).toString();
            var p51 = "L" + (offsetX + 35).toString() + " " + (offsetY + tempY + 5).toString();
            var p61 = "L" + (offsetX + 5).toString() + " " + (offsetY + tempY + 5).toString();
            var strPath1 = p11 + p21 + p31 + p41 + p51 + p61 + " Z";
            var xx = 40 * (this.scaleValue - 1) / 2;
            var yy = 0;
            var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
            var SSeg1 = this.paperSSeg.path(strPath1).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
            ledArray.push(SSeg1);
        }
        for (j1 = 0; j1 < 2; j1++) {
            var tempY1 = j1 * (40 * this.scaleValue + 2);
            var p12 = "M" + (offsetX - 1).toString() + " " + (offsetY + tempY1 + 1).toString();
            var p22 = "L" + (offsetX + 4).toString() + " " + (offsetY + tempY1 + 6).toString();
            var p32 = "L" + (offsetX + 4).toString() + " " + (offsetY + tempY1 + 36).toString();
            var p42 = "L" + (offsetX - 1).toString() + " " + (offsetY + tempY1 + 41).toString();
            var p52 = "L" + (offsetX - 6).toString() + " " + (offsetY + tempY1 + 36).toString();
            var p62 = "L" + (offsetX - 6).toString() + " " + (offsetY + tempY1 + 6).toString();
            var strPath2 = p12 + p22 + p32 + p42 + p52 + p62 + " Z";
            var xx = 0;
            var yy = 40 * (this.scaleValue - 1) / 2;
            var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
            var SSeg2 = this.paperSSeg.path(strPath2).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
            ledArray.push(SSeg2);
        }
        for (j2 = 0; j2 < 2; j2++) {
            var tempY2 = j2 * (40 * this.scaleValue + 2);
            var p13 = "M" + (offsetX + 41).toString() + " " + (offsetY + tempY2 + 1).toString();
            var p23 = "L" + (offsetX + 46).toString() + " " + (offsetY + tempY2 + 6).toString();
            var p33 = "L" + (offsetX + 46).toString() + " " + (offsetY + tempY2 + 36).toString();
            var p43 = "L" + (offsetX + 41).toString() + " " + (offsetY + tempY2 + 41).toString();
            var p53 = "L" + (offsetX + 36).toString() + " " + (offsetY + tempY2 + 36).toString();
            var p63 = "L" + (offsetX + 36).toString() + " " + (offsetY + tempY2 + 6).toString();
            var strPath3 = p13 + p23 + p33 + p43 + p53 + p63 + " Z";
            var xx = 40 * (this.scaleValue - 1);
            var yy = 40 * (this.scaleValue - 1) / 2;
            var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
            var SSeg3 = this.paperSSeg.path(strPath3).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
            ledArray.push(SSeg3);
        }
        var xx = 50 * (this.scaleValue - 1);
        var yy = 0;
        var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
        var SSeg4 = this.paperSSeg.circle(offsetX + 50, offsetY + 80 * this.scaleValue + 4, 4).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
        ledArray.push(SSeg4);
        this.myArray.push(ledArray);
    }
    this.myArray[this.Countn - this.initial - 1][7].attr("fill", this.colorTop).attr("stroke-width", 0).attr("stroke", this.colorTop);
    for (t = 0; t <= this.initial; t++) {
        this.myArray[this.Countn - t - 1][0].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t - 1][2].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t - 1][3].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t - 1][4].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t - 1][5].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t - 1][6].attr("fill", this.colorTop).attr("stroke", this.colorTop);
    }
    return this;
}
function SSegDecode(n) {
    switch (n) {
        case 0:
            cc = [0, 2, 3, 4, 5, 6];
            break;
        case 1:
            cc = [5, 6]
            break
        case 2:
            cc = [0, 1, 2, 4, 5]
            break
        case 3:
            cc = [0, 1, 2, 5, 6]
            break
        case 4:
            cc = [1, 3, 5, 6]
            break
        case 5:
            cc = [0, 1, 2, 3, 6]
            break
        case 6:
            cc = [0, 1, 2, 3, 4, 6]
            break
        case 7:
            cc = [0, 5, 6]
            break
        case 8:
            cc = [0, 1, 2, 3, 4, 5, 6]
            break
        case 9:
            cc = [0, 1, 2, 3, 5, 6]
            break
    }
    return cc;
}
//数码管显示--不带小数点、最高位0时显示
zyGH.SSegArray_1 = function (container, x, y) {
    this.paperSSeg = Raphael(container, x, y);
    this.myArray;
    //  this.mySegCode = new Array(); //代码数组
    this.initial; //初始化值
    this.Countn; //数码管数目
    this.scaleValue; //放大倍数
    this.space; //数码管间距
    this.colorBlack; //底色
    this.colorTop; //显示数字颜色
}
zyGH.SSegArray_1.prototype.scale = function (m) {
    this.scaleValue = m;
    return this;
}
zyGH.SSegArray_1.prototype.Spacing = function (sp) {
    this.space = sp;
    return this;
}
zyGH.SSegArray_1.prototype.Count = function (count) {
    this.Countn = count;
    return this;
}
zyGH.SSegArray_1.prototype.initialValue = function (init) {
    this.initial = init;
    return this;
}
zyGH.SSegArray_1.prototype.SetcolorBlack = function (color1) {
    this.colorBlack = color1;
    return this;
}
zyGH.SSegArray_1.prototype.SetcolorTop = function (color2) {
    this.colorTop = color2;
    return this;
}
zyGH.SSegArray_1.prototype.SetValue = function (val) {
    var aa;
    var uu = val;
    var bb;
    for (i = 0; i < this.Countn; i++) {

        aa = SSegDecode_1(uu % 10); //返回数字对应LED的编码
        uu = Math.floor(uu / 10);
        bb = aa.length; //数组长度
        for (var t = 0; t < 7; t++) {
            this.myArray[this.Countn - i - 1][t].attr("fill", this.colorBlack).attr("stroke", this.colorBlack);
        }
        for (j = 0; j < bb; j++) {
            this.myArray[this.Countn - i - 1][aa[j]].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        }

        //        if (val >= Math.pow(10, i - this.initial)) {
        //            var pp = val * Math.pow(10, this.initial) / Math.pow(10, i); //扩大倍数，如果小数1位即扩大10倍
        //            var uu = parseInt(pp.toString(), 10) % 10; //算最后一位整数值
        //            var aa = SSegDecode_1(uu); //返回数字对应LED的编码
        //            var bb = aa.length; //数组长度
        //            for (t = 0; t < 7; t++) {
        //                this.myArray[this.Countn - i - 1][t].attr("fill", this.colorBlack).attr("stroke", this.colorBlack);
        //            }
        //            for (j = 0; j < bb; j++) {
        //                this.myArray[this.Countn - i - 1][aa[j]].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        //            }
        //        }
        //        else if (i > 1) {
        //            for (t = 0; t < 7; t++) {
        //                this.myArray[this.Countn - i - 1][t].attr("fill", this.colorBlack).attr("stroke", this.colorBlack);
        //            }
        //        }
    }
}
zyGH.SSegArray_1.prototype.Create = function (offsetX, offsetY) {
    this.myArray = new Array();
    for (i = 1; i <= this.Countn; i++) {
        offsetX = offsetX + 60 * this.scaleValue + this.space;
        var ledArray = new Array();
        for (j = 0; j < 3; j++) {
            var tempY = j * (40 * this.scaleValue + 2);
            var p11 = "M" + offsetX.toString() + " " + (offsetY + tempY).toString();
            var p21 = "L" + (offsetX + 5).toString() + " " + (offsetY + tempY - 5).toString();
            var p31 = "L" + (offsetX + 35).toString() + " " + (offsetY + tempY - 5).toString();
            var p41 = "L" + (offsetX + 40).toString() + " " + (offsetY + tempY).toString();
            var p51 = "L" + (offsetX + 35).toString() + " " + (offsetY + tempY + 5).toString();
            var p61 = "L" + (offsetX + 5).toString() + " " + (offsetY + tempY + 5).toString();
            var strPath1 = p11 + p21 + p31 + p41 + p51 + p61 + " Z";
            var xx = 40 * (this.scaleValue - 1) / 2;
            var yy = 0;
            var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
            var SSeg1 = this.paperSSeg.path(strPath1).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
            ledArray.push(SSeg1);
        }
        for (j1 = 0; j1 < 2; j1++) {
            var tempY1 = j1 * (40 * this.scaleValue + 2);
            var p12 = "M" + (offsetX - 1).toString() + " " + (offsetY + tempY1 + 1).toString();
            var p22 = "L" + (offsetX + 4).toString() + " " + (offsetY + tempY1 + 6).toString();
            var p32 = "L" + (offsetX + 4).toString() + " " + (offsetY + tempY1 + 36).toString();
            var p42 = "L" + (offsetX - 1).toString() + " " + (offsetY + tempY1 + 41).toString();
            var p52 = "L" + (offsetX - 6).toString() + " " + (offsetY + tempY1 + 36).toString();
            var p62 = "L" + (offsetX - 6).toString() + " " + (offsetY + tempY1 + 6).toString();
            var strPath2 = p12 + p22 + p32 + p42 + p52 + p62 + " Z";
            var xx = 0;
            var yy = 40 * (this.scaleValue - 1) / 2;
            var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
            var SSeg2 = this.paperSSeg.path(strPath2).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
            ledArray.push(SSeg2);
        }
        for (j2 = 0; j2 < 2; j2++) {
            var tempY2 = j2 * (40 * this.scaleValue + 2);
            var p13 = "M" + (offsetX + 41).toString() + " " + (offsetY + tempY2 + 1).toString();
            var p23 = "L" + (offsetX + 46).toString() + " " + (offsetY + tempY2 + 6).toString();
            var p33 = "L" + (offsetX + 46).toString() + " " + (offsetY + tempY2 + 36).toString();
            var p43 = "L" + (offsetX + 41).toString() + " " + (offsetY + tempY2 + 41).toString();
            var p53 = "L" + (offsetX + 36).toString() + " " + (offsetY + tempY2 + 36).toString();
            var p63 = "L" + (offsetX + 36).toString() + " " + (offsetY + tempY2 + 6).toString();
            var strPath3 = p13 + p23 + p33 + p43 + p53 + p63 + " Z";
            var xx = 40 * (this.scaleValue - 1);
            var yy = 40 * (this.scaleValue - 1) / 2;
            var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
            var SSeg3 = this.paperSSeg.path(strPath3).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
            ledArray.push(SSeg3);
        }
        //var xx = 50 * (this.scaleValue - 1);
        //var yy = 0;
        //var stringscale = "S" + this.scaleValue.toString() + "T" + xx.toString() + " " + yy.toString();
        //var SSeg4 = this.paperSSeg.circle(offsetX + 50, offsetY + 80 * this.scaleValue + 4, 4).attr("fill", this.colorBlack).attr("stroke-width", 0).attr("stroke", this.colorBlack).transform(stringscale);
        //ledArray.push(SSeg4);
        this.myArray.push(ledArray);
    }
    //this.myArray[this.Countn - this.initial - 1][7].attr("fill", this.colorTop).attr("stroke-width", 0).attr("stroke", this.colorTop);
    for (t = 1; t <= this.initial; t++) {
        this.myArray[this.Countn - t][0].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t][2].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t][3].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t][4].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t][5].attr("fill", this.colorTop).attr("stroke", this.colorTop);
        this.myArray[this.Countn - t][6].attr("fill", this.colorTop).attr("stroke", this.colorTop);
    }
    return this;
}
function SSegDecode_1(n) {
    switch (n) {
        case 0:
            cc = [0, 2, 3, 4, 5, 6];
            break;
        case 1:
            cc = [5, 6]
            break
        case 2:
            cc = [0, 1, 2, 4, 5]
            break
        case 3:
            cc = [0, 1, 2, 5, 6]
            break
        case 4:
            cc = [1, 3, 5, 6]
            break
        case 5:
            cc = [0, 1, 2, 3, 6]
            break
        case 6:
            cc = [0, 1, 2, 3, 4, 6]
            break
        case 7:
            cc = [0, 5, 6]
            break
        case 8:
            cc = [0, 1, 2, 3, 4, 5, 6]
            break
        case 9:
            cc = [0, 1, 2, 3, 5, 6]
            break
    }
    return cc;
}
//进度条显示
zyGH.ProgressBar = function (container, x, y) {
    this.PBar = Raphael(container, x, y);
    this.width; //进度条宽度
    this.height; //进度条高度
    this.maxvalue;
    this.minvalue;
    this.strokecolor; //边框颜色
    this.colorTop;
    this.colorMid;
    this.colorButtom;
    this.opacity; //颜色透明度
    this.xx;
    this.yy;
    this.p2;
    this.radio; //圆角半径
}
zyGH.ProgressBar.prototype.SetWidth = function (w) {
    this.width = w;
    return this;
}
zyGH.ProgressBar.prototype.SetHight = function (h) {
    this.height = h;
    return this;
}
zyGH.ProgressBar.prototype.max = function (max) {
    this.maxvalue = max;
    return this;
}
zyGH.ProgressBar.prototype.min = function (min) {
    this.minvalue = min;
    return this;
}
zyGH.ProgressBar.prototype.SetStrokecolor = function (color1) {
    this.strokecolor = color1;
    return this;
}
zyGH.ProgressBar.prototype.SetcolorTop = function (color2) {
    this.colorTop = color2;
    return this;
}
zyGH.ProgressBar.prototype.SetcolorMid = function (color3) {
    this.colorMid = color3;
    return this;
}
zyGH.ProgressBar.prototype.SetcolorButtom = function (color4) {
    this.colorButtom = color4;
    return this;
}
zyGH.ProgressBar.prototype.Setopacity = function (n) {
    this.opacity = n;
    return this;
}
zyGH.ProgressBar.prototype.Radio = function (r) {
    this.radio = r;
    return this;
}
zyGH.ProgressBar.prototype.SetValue = function (val) {
    var x1 = this.xx + 0.5 * this.radio;
    var y1 = this.yy + 0.5 * this.radio;
    var y2 = this.yy + this.height - 0.5 * this.radio;
    var temp = val * (this.width - this.radio) / (this.maxvalue - this.minvalue);
    if (temp >= (this.width - this.radio))
        temp = this.width - this.radio;
    var x2 = x1 + temp;
    var strpath = "M" + x1.toString() + " " + y1.toString() + "L" + x1.toString() + " " + y2.toString() + "L" + x2.toString() + " " + y2.toString() + "L" + x2.toString() + " " + y1.toString() + " Z";
    this.p2.animate({ path: strpath }, 200, ">");
}
zyGH.ProgressBar.prototype.Create = function (offsetX, offsetY) {
    this.xx = offsetX;
    this.yy = offsetY;

    var stringpathout = zyGH.RectRadio(offsetX, offsetY, this.width, this.height, this.radio); //画矩形圆角
    var p1 = this.PBar.path(stringpathout).attr("stroke-width", 2).attr("stroke", this.strokecolor);

    var stringpathRect = zyGH.Rect(offsetX, offsetY, this.width, this.height, this.radio); //画矩形
    //var colorstring = "270-" + this.strokecolor + "-#FFFFFF:20-#DC143C";
    var colorstring = "270-" + this.colorTop + "-" + this.colorMid + ":" + this.opacity.toString() + "-" + this.colorButtom;
    this.p2 = this.PBar.path(stringpathRect).attr("stroke-width", 1).attr("stroke", this.strokecolor).attr("fill", colorstring);

    this.PBar.path(zyGH.Radio1(offsetX, offsetY, this.width, this.height, this.radio)).attr("stroke-width", 2).attr("stroke", "#000000").attr("fill", "#000000");
    this.PBar.path(zyGH.Radio2(offsetX, offsetY, this.width, this.height, this.radio)).attr("stroke-width", 2).attr("stroke", "#000000").attr("fill", "#000000");
    this.PBar.path(zyGH.Radio3(offsetX, offsetY, this.width, this.height, this.radio)).attr("stroke-width", 2).attr("stroke", "#000000").attr("fill", "#000000");
    this.PBar.path(zyGH.Radio4(offsetX, offsetY, this.width, this.height, this.radio)).attr("stroke-width", 2).attr("stroke", "#000000").attr("fill", "#000000");

    var stringpathin = zyGH.RectRadio(offsetX + 0.5 * this.radio, offsetY + 0.5 * this.radio, this.width - this.radio, this.height - this.radio, 0.5 * this.radio); //画矩形圆角
    var p3 = this.PBar.path(stringpathin).attr("stroke-width", 2).attr("stroke", this.strokecolor);
    return this;
}
//边圆角
zyGH.Radio1 = function (X1, Y1, W, H, R) {
    var statrpoint = "M" + (X1 + R).toString() + " " + (Y1 + 0.5 * R).toString();
    var stringradio = "A" + (0.5 * R).toString() + " " + (0.5 * R).toString() + ", 0, 0, 0," + (X1 + 0.5 * R).toString() + " " + (Y1 + R).toString();
    var stringL = "L" + (X1 + 0.5 * R).toString() + " " + (Y1 + 0.5 * R).toString() + "Z";
    var stringpathRadio = statrpoint + stringradio + stringL;
    return stringpathRadio;
}
zyGH.Radio2 = function (X1, Y1, W, H, R) {
    var statrpoint = "M" + (X1 + 0.5 * R).toString() + " " + (Y1 + H - R).toString();
    var stringradio = "A" + (0.5 * R).toString() + " " + (0.5 * R).toString() + ", 0, 0, 0," + (X1 + R).toString() + " " + (Y1 + H - 0.5 * R).toString();
    var stringL = "L" + (X1 + 0.5 * R).toString() + " " + (Y1 + H - 0.5 * R).toString() + "Z";
    var stringpathRadio = statrpoint + stringradio + stringL;
    return stringpathRadio;
}
zyGH.Radio3 = function (X1, Y1, W, H, R) {
    var statrpoint = "M" + (X1 + W - R).toString() + " " + (Y1 + H - 0.5 * R).toString();
    var stringradio = "A" + (0.5 * R).toString() + " " + (0.5 * R).toString() + ", 0, 0, 0," + (X1 + W - 0.5 * R).toString() + " " + (Y1 + H - R).toString();
    var stringL = "L" + (X1 + W - 0.5 * R).toString() + " " + (Y1 + H - 0.5 * R).toString() + "Z";
    var stringpathRadio = statrpoint + stringradio + stringL;
    return stringpathRadio;
}
zyGH.Radio4 = function (X1, Y1, W, H, R) {
    var statrpoint = "M" + (X1 + W - 0.5 * R).toString() + " " + (Y1 + R).toString();
    var stringradio = "A" + (0.5 * R).toString() + " " + (0.5 * R).toString() + ", 0, 0, 0," + (X1 + W - R).toString() + " " + (Y1 + 0.5 * R).toString();
    var stringL = "L" + (X1 + W - 0.5 * R).toString() + " " + (Y1 + 0.5 * R).toString() + "Z";
    var stringpathRadio = statrpoint + stringradio + stringL;
    return stringpathRadio;
}
//矩形
zyGH.Rect = function (X1, Y1, W, H, R) {
    var statrpoint = "M" + (X1 + 0.5 * R).toString() + " " + (Y1 + 0.5 * R).toString();
    var V_left = "L" + (X1 + 0.5 * R).toString() + " " + (H - 0.5 * R + Y1).toString();
    var H_buttom = "L" + (0.5 * R + X1).toString() + " " + (H - 0.5 * R + Y1).toString();
    var V_right = "L" + (0.5 * R + X1).toString() + " " + (0.5 * R + Y1).toString() + " Z";
    var stringpath = statrpoint + V_left + H_buttom + V_right;
    return stringpath;
}
//圆角矩形X1、Y1：起始点坐标；W：宽度；H：高度；R：半径
zyGH.RectRadio = function (X1, Y1, W, H, R) {
    var statrpoint = "M" + X1.toString() + " " + (Y1 + R).toString();
    var V_left = "V" + (H - R + Y1).toString();
    var circle1 = "A" + R.toString() + " " + R.toString() + ", 0, 0, 0," + (X1 + R).toString() + " " + (H + Y1).toString();
    var H_buttom = "H" + (W - R + X1).toString();
    var circle2 = "A" + R.toString() + " " + R.toString() + ", 0, 0, 0," + (W + X1).toString() + " " + (H - R + Y1).toString();
    var V_right = "V" + (R + Y1).toString();
    var circle3 = "A" + R.toString() + " " + R.toString() + ", 0, 0, 0," + (W - R + X1).toString() + " " + Y1.toString();
    var H_top = "H" + (R + X1).toString();
    var circle4 = "A" + R.toString() + " " + R.toString() + ", 0, 0, 0," + X1.toString() + " " + (R + Y1).toString() + "Z";
    var stringpath = statrpoint + V_left + circle1 + H_buttom + circle2 + V_right + circle3 + H_top + circle4;
    return stringpath;
}
//机舱图表
zyGH.Naceller = function (container, x, y) {
    this.Naceller = Raphael(container, x, y);
    this.R;
    this.r;
    this.centerX = x / 2;
    this.centerY = y / 2;
    this.color_R; //大圆背景
    this.color_r; //小圆背景
    this.NacellPointColor;
    this.WindDirPointColor;
    this.NacellP;
    this.WindDirP;
    this.arrayobj = new Array();
}
zyGH.Naceller.prototype.Set_R = function (R) {
    this.R = R;
    return this;
}
zyGH.Naceller.prototype.Set_r = function (r) {
    this.r = r;
    return this;
}
zyGH.Naceller.prototype.SetColor_R = function (color1) {
    this.color_R = color1;
    return this;
}
zyGH.Naceller.prototype.SetColor_r = function (color2) {
    this.color_r = color2;
    return this;
}
zyGH.Naceller.prototype.SetNacellPointColor = function (color3) {
    this.NacellPointColor = color3;
    return this;
}
zyGH.Naceller.prototype.SetWindDirPointColor = function (color4) {
    this.WindDirPointColor = color4;
    return this;
}
zyGH.Naceller.prototype.Create = function () {
    this.Naceller.circle(this.centerX, this.centerY, this.R).attr("stroke-width", 1).attr("stroke", this.color_R).attr("fill", this.color_R);
    this.Naceller.circle(this.centerX, this.centerY, this.r).attr("stroke-width", 2).attr("stroke", this.color_r).attr("fill", this.color_r);
    //画刻度
    this.Naceller.text(this.centerX - 1, this.centerY - 101, "N").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    this.Naceller.text(this.centerX + 73, this.centerY - 73, "NE").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    this.Naceller.text(this.centerX + 101, this.centerY, "E").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    this.Naceller.text(this.centerX + 73, this.centerY + 73, "SE").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    this.Naceller.text(this.centerX, this.centerY + 101, "S").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    this.Naceller.text(this.centerX - 73, this.centerY + 73, "SW").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    this.Naceller.text(this.centerX - 101, this.centerY - 1, "W").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    this.Naceller.text(this.centerX - 73, this.centerY - 73, "NW").attr("font-size", 12).attr("font-family", "Arial").attr("stroke", "#000000").attr("stroke-width", 0);
    var TickMarkPath = "M" + (this.centerX - 1).toString() + " " + (this.centerY - 85).toString() + "L" + (this.centerX + 1).toString() + " " + (this.centerY - 85).toString() + "L" + (this.centerX + 1).toString() + " " + (this.centerY - 75).toString() + "L" + (this.centerX - 1).toString() + " " + (this.centerY - 75).toString() + "Z";
    for (i = 0; i < 8; i++) {
        this.Naceller.path(TickMarkPath).attr("stroke-width", 1).attr("stroke", this.color_r).attr("fill", this.color_r).rotate(45 * i, this.centerX, this.centerY);
    }
    var NacellPointPath = "M" + this.centerX.toString() + " " + (this.centerY - 50).toString() + "L" + (this.centerX + 15).toString() + " " + (this.centerY + 25).toString() + "L" + this.centerX.toString() + " " + (this.centerY + 10).toString() + "L" + (this.centerX - 15).toString() + " " + (this.centerY + 25).toString() + "Z";
    this.NacellP = this.Naceller.path(NacellPointPath).attr("stroke-width", 1).attr("stroke", this.NacellPointColor).attr("fill", this.NacellPointColor);
    var WindDirPointPath = "M" + this.centerX.toString() + " " + (this.centerY - 90).toString() + "L" + (this.centerX + 10).toString() + " " + (this.centerY - 100).toString() + "L" + this.centerX.toString() + " " + (this.centerY - 60).toString() + "L" + (this.centerX - 10).toString() + " " + (this.centerY - 100).toString() + "Z";
    this.WindDirP = this.Naceller.path(WindDirPointPath).attr("stroke-width", 1).attr("stroke", this.WindDirPointColor).attr("fill", this.WindDirPointColor);
    return this;
}
zyGH.Naceller.prototype.SetValue = function (val1, val2, val3) {
    var ssss1 = "r" + val1.toString() + "," + this.centerX.toString() + "," + this.centerY.toString();
    var ssss2 = "r" + val2.toString() + "," + this.centerX.toString() + "," + this.centerY.toString();
    this.NacellP.animate({ transform: ssss1 }, 0, "linear");
    this.WindDirP.animate({ transform: ssss2 }, 0, "linear");

    var ssss3 = "r" + val3.toString() + "," + this.centerX.toString() + "," + this.centerY.toString();
    this.windir1s = this.Naceller.circle(this.centerX, this.centerY - this.r + 4, 2).attr("stroke-width", 0).attr("fill", "rgba(255, 0, 0, .01)").animate({ transform: ssss3 }, 0, "linear");
    if (this.arrayobj.push(this.windir1s) > 600) {
        this.arrayobj[0].remove();
        this.arrayobj.shift();
    }

}
//风机
zyGH.WindTurbine = function (container, x, y) {
    this.WindTurbine = Raphael(container, x, y);
    this.R; //叶片长度
    this.r;
    this.L;
    this.l;
    this.Rad;
    this.CirleTime;
    this.centerX;
    this.centerY;
    this.angle1;
    this.angle2;
    this.WT;
    this.rotorspeed;
    this.cenX;
    this.cenY;
    var timer;
    this.count = 0;
}
zyGH.WindTurbine.prototype.Set_R = function (R) {
    this.R = R;
    return this;
}
zyGH.WindTurbine.prototype.Set_r = function (r) {
    this.r = r;
    return this;
}
zyGH.WindTurbine.prototype.Set_Rad = function (rad) {
    this.Rad = rad;
    return this;
}
zyGH.WindTurbine.prototype.Set_L = function (L) {
    this.L = L;
    return this;
}
zyGH.WindTurbine.prototype.Set_l = function (l) {
    this.l = l;
    return this;
}
zyGH.WindTurbine.prototype.Set_Angle1 = function (angle) {
    this.angle1 = angle;
    return this;
}
zyGH.WindTurbine.prototype.Set_Angle2 = function (angle) {
    this.angle2 = angle;
    return this;
}
zyGH.WindTurbine.prototype.Set_CirleTime = function (ms) {
    this.CirleTime = ms;
    return this;
}
zyGH.WindTurbine.prototype.SetValue = function (val) {
    this.rotorspeed = 0.006 * this.CirleTime * val / 3;
    this.WT.rotate(this.rotorspeed, this.cenX, this.cenY);
}
zyGH.WindTurbine.prototype.Create = function (offsetX, offsetY) {
    this.cenX = offsetX;
    this.cenY = offsetY;
    var path1 = "M" + (offsetX - this.r * Math.sin(this.angle1 * 2 * Math.PI / 360)).toString() + " " + (offsetY - this.r * Math.cos(this.angle1 * 2 * Math.PI / 360)).toString();
    var path2 = "L" + (offsetX - (this.r + this.L) * Math.sin(Math.PI / 6)).toString() + " " + (offsetY - (this.r + this.L) * Math.cos(Math.PI / 6)).toString();
    var path3 = "L" + offsetX.toString() + " " + (offsetY - this.R).toString();
    var path4 = "L" + (offsetX + this.l * Math.sin(this.angle2 * 2 * Math.PI / 360)).toString() + " " + (offsetY - (this.R - this.l * Math.cos(this.angle2 * 2 * Math.PI / 360))).toString();
    var path5 = "L" + (offsetX + this.r).toString() + " " + offsetY.toString();

    var path6 = "L" + (offsetX + this.r + this.L).toString() + " " + offsetY.toString();
    var path7 = "L" + (offsetX + this.R * Math.cos(Math.PI / 6)).toString() + " " + (offsetY + this.R * Math.sin(Math.PI / 6)).toString();
    var path8 = "L" + (offsetX + this.R * Math.cos(Math.PI / 6) - this.l * Math.sin((120 - this.angle2) * 2 * Math.PI / 360)).toString() + " " + (offsetY + this.R * Math.sin(Math.PI / 6) + this.l * Math.cos((120 - this.angle2) * 2 * Math.PI / 360)).toString();
    var path9 = "L" + (offsetX - this.r * Math.sin(this.angle1 * 2 * Math.PI / 360)).toString() + " " + (offsetY + this.r * Math.cos(this.angle1 * 2 * Math.PI / 360)).toString();

    var path10 = "L" + (offsetX - (this.r + this.L) * Math.sin(this.angle1 * 2 * Math.PI / 360)).toString() + " " + (offsetY + (this.r + this.L) * Math.cos(this.angle1 * 2 * Math.PI / 360)).toString();
    var path11 = "L" + (offsetX - this.R * Math.cos(Math.PI / 6)).toString() + " " + (offsetY + this.R * Math.sin(Math.PI / 6)).toString();
    var path12 = "L" + (offsetX - this.R * Math.cos(Math.PI / 6) + this.l * Math.cos((this.angle2 + 30) * 2 * Math.PI / 360)).toString() + " " + (offsetY + this.R * Math.sin(Math.PI / 6) - this.l * Math.sin((this.angle2 + 30) * 2 * Math.PI / 360)).toString() + "Z";

    var paths = path1 + path2 + path3 + path4 + path5 + path6 + path7 + path8 + path9 + path10 + path11 + path12;
    //this.WindTurbine.path("M"+(offsetX-3).toString()+" "+offsetY.toString()+"L"+)
    this.WT = this.WindTurbine.path(paths).attr("stroke-width", 1).attr("stroke", "red");
    this.WindTurbine.circle(offsetX, offsetY, this.Rad).attr("stroke-width", 1).attr("stroke", "#000000").attr("fill", "#000000");
    return this;
}
//button
zyGH.Button = function (container, x, y) {
    this.Btn = Raphael(container, x, y);
    this.BtnWidth;
    this.BtnHeight;
    this.BtnRadio;
    this.BtnName;
    this.btnBlackground;
    this.btnText;
    this.btnType; //按钮类型 1:急停（复位、自动、停机、维护、手动）；2:点动按钮；
    this.DisEnable; //按钮使能
}
zyGH.Button.prototype.Set_Width = function (width) {
    this.BtnWidth = width;
    return this;
}
zyGH.Button.prototype.Set_Height = function (heigth) {
    this.BtnHeight = heigth;
    return this;
}
zyGH.Button.prototype.Set_Radio = function (rad) {
    this.BtnRadio = rad;
    return this;
}
zyGH.Button.prototype.Set_butName = function (name) {
    this.BtnName = name;
    return this;
}
zyGH.Button.prototype.Set_btnType = function (type) {
    this.btnType = type;
    return this;
}
zyGH.Button.prototype.Set_DisEnable = function (enable) {
    this.DisEnable = enable;
    return this;
}
zyGH.Button.prototype.onbutton = function () {

}
zyGH.Button.prototype.status = function (val) {
    if (val == 1) { //按钮触发状态
        this.btnBlackground.attr("src", "../../images/6.png");
        this.btnText.attr("fill", "#FFFFFF");
    }
    else {
        this.btnBlackground.attr("src", "../../images/7.png");
        if (this.DisEnable == true)
            this.btnText.attr("fill", "#000000");
        else
            this.btnText.attr("fill", "#C0C0C0");
    }
}
zyGH.Button.prototype.Create = function (offsetX, offsetY) {
    if (this.btnType == 1) {
        if (this.DisEnable == true) {
            this.btnBlackground = this.Btn.image("../../images/7.png", 3, 3, this.BtnWidth, this.BtnHeight)
                                  .attr("cursor", "pointer")
                                  .data("obj", this)
                                  .click(function () {
                                      this.data("obj").onbutton();
                                  });
            this.btnText = this.Btn.text(this.BtnWidth / 2 + 2, this.BtnHeight / 2 + 3, this.BtnName)
                           .attr("font-size", 16)
                           .attr("font-family", "Arial")
                           .attr("font-weight", "bold")
                           .attr("stroke-width", 0)
                           .attr("fill", "#000000")
                           .attr("cursor", "pointer")
                           .data("objt", this)
                           .click(function () {
                               this.data("objt").onbutton();
                           });
        }
        else {
            this.btnBlackground = this.Btn.image("../../images/7.png", 3, 3, this.BtnWidth, this.BtnHeight);
            this.btnText = this.Btn.text(this.BtnWidth / 2 + 2, this.BtnHeight / 2 + 3, this.BtnName)
                           .attr("font-size", 16)
                           .attr("font-family", "Arial")
                           .attr("font-weight", "bold")
                           .attr("stroke-width", 0)
                           .attr("fill", "#C0C0C0");
        }
    }
    if (this.btnType == 2) {
        if (this.DisEnable == true) {
            this.btnBlackground = this.Btn.image("../../images/7.png", 3, 3, this.BtnWidth, this.BtnHeight)
                                  .attr("cursor", "pointer")
                                  .data("obj", this)
                                  .mousedown(function () {
                                      this.data("obj").onbutton();
                                  })
                                  .mouseup(function () {
                                      this.data("obj").onbutton();
                                  });
            this.btnText = this.Btn.text(this.BtnWidth / 2 + 2, this.BtnHeight / 2 + 3, this.BtnName)
                           .attr("font-size", 16)
                           .attr("font-family", "Arial")
                           .attr("font-weight", "bold")
                           .attr("stroke-width", 0)
                           .attr("fill", "#000000")
                           .attr("cursor", "pointer")
                           .data("objt", this)
                           .mousedown(function () {
                               this.data("objt").onbutton();
                           })
                           .mouseup(function () {
                               this.data("objt").onbutton();
                           });
        }
        else {
            this.btnBlackground = this.Btn.image("../../images/7.png", 3, 3, this.BtnWidth, this.BtnHeight);
            this.btnText = this.Btn.text(this.BtnWidth / 2 + 2, this.BtnHeight / 2 + 3, this.BtnName)
                           .attr("font-size", 16)
                           .attr("font-family", "Arial")
                           .attr("font-weight", "bold")
                           .attr("stroke-width", 0)
                           .attr("fill", "#C0C0C0");
        }
    }
    return this;
}
//指示灯
zyGH.Light = function (container, x, y) {
    this.Light = Raphael(container, x, y);
    this.LightR;
    this.Color1;
    this.Color2;
    this.Color3;
    this.circle;
}
zyGH.Light.prototype.Set_lr = function (R) {
    this.LightR = R;
    return this;
}
zyGH.Light.prototype.Set_Color1 = function (color1) {
    this.Color1 = color1;
    return this;
}
zyGH.Light.prototype.Set_Color2 = function (color2) {
    this.Color2 = color2;
    return this;
}
zyGH.Light.prototype.Set_Color3 = function (color3) {
    this.Color3 = color3;
    return this;
}
zyGH.Light.prototype.Status = function (Sta, c1, c2, c3) {
    if (Sta == true) {
        this.circle.attr("fill", "r(0.2, 0.7)#" + c1 + "-#" + c2 + ":95-#" + c3);
    }
    else {
        this.circle.attr("fill", "r(0.2, 0.7)#" + this.Color1 + "-#" + this.Color2 + ":95-#" + this.Color3);
    }
}
zyGH.Light.prototype.Create = function (offsetX, offsetY) {
    this.circle = this.Light.circle(offsetX, offsetY, this.LightR).attr("stroke-width", 0).attr("stroke", "#CDD5D9");
    this.circle.attr("fill", "r(0.2, 0.7)#" + this.Color1 + "-#" + this.Color2 + ":95-#" + this.Color3); //r(0.25, 0.75)#fff-#000
    return this;
}
//条状图显示
zyGH.StatusBar = function (container, x, y) {
    this.StatusBar = Raphael(container, x, y);
    this.Width;
    this.Height;
    this.xx;
    this.yy;
    this.rect;
    this.txt;
}
zyGH.StatusBar.prototype.Width = function (ww) {
    this.Width = ww;
    return this;
}
zyGH.StatusBar.prototype.Height = function (hh) {
    this.Height = hh;
    return this;
}
zyGH.StatusBar.prototype.Create = function (offsetX, offsetY) {
    this.xx = offsetX;
    this.yy = offsetY;
    this.StatusBar.rect(offsetX, offsetY, this.Width, this.Height, 0).attr("stroke-width", 1).attr("stroke", "#000000");
    return this;
}
Raphael.fn.DrawStatusBar = function (ww, hh, xx, yy, obj, DD, timeobj, id, id_shift, deviceName) {
    //ww--宽度
    //hh--高度
    //xx--右上角X坐标
    //yy--右上角Y坐标
    //obj--数据
    //DD--日期
    //timeobj--状态数据
    //deviceName--设备名称
    var paper = this;
    //paper.rect(xx - 110, yy, 100, 29, 5).attr("stroke-width", 1).attr("stroke", "#000000");
    this.DeviceName = deviceName;
    this.Element_ID = [];
    paper.rect(xx, yy, ww + 2, hh, 0).attr({
        "stroke-width": 0,
        "stroke": "#000000",
        "fill": "#FFFFFF"
    });
    var oldxx = 1;
    chart = this.set();
    //this.elemname = elem;
    //绘制时间刻度
    for (var k = 0; k <= parseInt(timeobj.pix * 2 / 120) ; k++) {
        //2小时一格;
        var oldmin = timeobj.intStartime_H * 60 + timeobj.intStartime_M;
        var newmin = timeobj.intStartime_H * 60 + timeobj.intStartime_M + 120 * k;
        if (newmin >= 1440)
            newmin = newmin - 1440;
        //计算出要显示的刻度时间
        var strtime = parseInt(newmin / 60) + ":" + fromtTo2(newmin % 60);
        paper.text(xx + 60 * k, yy - 7, strtime)
             .attr("font-size", 12)
             .attr("font-family", "Arial")
             .attr("stroke", "#000000")
             .attr("stroke-width", 0);
    }
    //计算开始时间和结束时间 以秒为单位
    var t1 = timeobj.intStartime_H * 3600 + timeobj.intStartime_M * 60;
    var t2 = timeobj.intEndtime_H * 3600 + timeobj.intEndtime_M * 60;
    if (timeobj.cross == "1") {
        t2 = t2 + 86400;
    }
    var process = function (j) {
        var starttime = new Date(Date.parse((DD + " " + obj[j][0]).replace(/-/g, "/")));
        var endtime = new Date(Date.parse((DD + " " + obj[j][1]).replace(/-/g, "/")));
        var starttimes = starttime.getHours() * 3600 + starttime.getMinutes() * 60 + starttime.getSeconds();
        var endtimes = endtime.getHours() * 3600 + endtime.getMinutes() * 60 + endtime.getSeconds();
        if (obj[j][2] == "1") {//跨天
            if (starttimes >= endtimes) {
                endtimes = endtimes + 86400;
            }
            else {
                starttimes = starttimes + 86400;
                endtimes = endtimes + 86400;
            }
        }
        //var tempxx = (ww - 2) * (endtimes - starttimes) / 86400;
        var px1 = timeobj.pix * (starttimes - t1) / (t2 - t1);
        var px2 = timeobj.pix * (endtimes - t1) / (t2 - t1);

        //保存数据
        var tempobj = {};
        tempobj.START_TIME = obj[j][0];
        tempobj.END_TIME = obj[j][1];
        tempobj.STATUS = obj[j][3];
        tempobj.ID = obj[j][5];
        tempobj.REASONID = obj[j][6];
        tempobj.NOTE = obj[j][7];
        tempobj.STATUS_ID = obj[j][8];
        var rect;
        if (obj[j][9] == 1) {
            rect = paper.rect(xx + oldxx + px1, yy + 1, px2 - px1, hh - 2, 0)
                                 .attr({
                                     "stroke-width": 0,
                                     "fill": obj[j][4]
                                 })
                                 .data("id", id)
                                 .data("id_shift", id_shift)
                                 .data("obj", tempobj);
        }
        else if (obj[j][9] == 2) {
            rect = paper.rect(xx + oldxx + px1, yy + 1, px2 - px1, hh - 2, 0)
                                 .attr({
                                     "stroke-width": 2,
                                     "stroke": "#000000",
                                     //"opacity":0.5,
                                     "fill": obj[j][4]
                                 })
                                 .data("id", id)
                                 .data("id_shift", id_shift)
                                 .data("obj", tempobj);
        }
        paper.Element_ID.push(rect.id);
        //        var txt = paper.text(xx + oldxx, yy + 60, obj[j][3])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_starttime = paper.text(xx + oldxx, yy + 60, obj[j][0])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_endtime = paper.text(xx + oldxx, yy + 60, obj[j][1])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_id = paper.text(xx + oldxx, yy + 60, obj[j][5])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_note = paper.text(xx + oldxx, yy + 60, obj[j][6])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });

        //*****************************

        //var txt = paper.text(100, 88, obj[j][3])
        //                             .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_starttime = paper.text(100, 88, obj[j][0])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_endtime = paper.text(100, 88, obj[j][1])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_id = paper.text(100, 88, obj[j][5])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_note = paper.text(100, 88, obj[j][6])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        rect.mouseover(function () {
            rect.stop().animate({ transform: "s1" }, 200).toFront();
            var message = "<table><tr><td>开始时间:</td><td>" + this.data("obj").START_TIME + "</td></tr><tr><td>结束时间:</td><td>" + this.data("obj").END_TIME + "</td></tr><tr><td>设备状态:</td><td align='left'>" + this.data("obj").STATUS + "</td></tr><tr><td>状态备注:</td><td align='left'>" + this.data("obj").NOTE + "</td></tr></table>";
            //var message = "开始时间:" + txt_starttime.attrs.text + "<br>" + "结束时间:" + txt_endtime.attrs.text + "<br>" + "状态:" + txt.attrs.text;
            //var top = (this.data("top") - 100) + "px";
            var top, left;
            if (this.data("id_shift") == 0) { //日期状态数据
                top = $("#status_" + this.data("id")).offset().top + 35;
                left = $("#status_" + this.data("id")).offset().left;
            }
            else { //班次状态数据
                top = $("#status_" + this.data("id") + "_" + this.data("id_shift") + "_shift").offset().top + 35;
                left = $("#status_" + this.data("id") + "_" + this.data("id_shift") + "_shift").offset().left;
            }
            $("#display").jCallout({
                message: message,
                position: "bottom",
                id: "ms"
            });
            $("#ms").css({ "display": "block" });
            $("#ms").css({
                //"top": (rect.attrs.y + rect.attrs.height + 20) + "px",
                "z-index": 50,
                "top": top + "px",
                "left": (rect.attrs.x + left + rect.attrs.width / 2 - ($("#ms").width() + 12) / 2) + "px"
            });
        }).mouseout(function () {
            rect.stop().animate({ transform: "" }, 200); //elastic
            $("#ms").remove()
        });
        //        .click(function () {
        //            var obj = {};
        //            obj.MACHINE_NAME = this.paper.DeviceName;
        //            obj.DATETIME = $("#tr_" + this.data("id")).attr("date");
        //            obj.ID = this.data("obj").ID;
        //            obj.START_TIME = this.data("obj").START_TIME;
        //            obj.END_TIME = this.data("obj").END_TIME;
        //            obj.STATUS_ID = this.data("obj").STATUS_ID;
        //            obj.STATUS_NAME = this.data("obj").STATUS;
        //            obj.REASON_ID = this.data("obj").REASONID;
        //            obj.COMMENT = this.data("obj").NOTE;
        //            fn_statusInfo(obj, this);
        //            //showkwindow("状态信息", "treeview-EditStatusInfo");

        //        });
        chart.push(rect);
        // chart.push(txt);
        //oldxx = oldxx + tempxx;
    }
    for (var i = 0; i < obj.length; i++) {
        process(i);
    }
    return chart;
}
Raphael.fn.DrawStatusBarDetail = function (ww, hh, xx, yy, obj, DD, timeobj, id, id_shift, deviceName) {
    //ww--宽度
    //hh--高度
    //xx--右上角X坐标
    //yy--右上角Y坐标
    //obj--数据
    //DD--日期
    //timeobj--状态数据
    //deviceName--设备名称
    var paper = this;
    //paper.rect(xx - 110, yy, 100, 29, 5).attr("stroke-width", 1).attr("stroke", "#000000");
    this.DeviceName = deviceName;
    this.Element_ID = [];
    paper.rect(xx, yy, ww + 2, hh, 0).attr({
        "stroke-width": 0,
        "stroke": "#000000",
        "fill": "#FFFFFF"
    });
    var oldxx = 1;
    chart = this.set();
    //this.elemname = elem;
    //绘制时间刻度
    for (var k = 0; k <= parseInt(timeobj.pix * 40 / 3600) ; k++) {
        //40秒=1px;
        var oldmin = timeobj.intStartime_H * 60 + timeobj.intStartime_M;
        var newmin = timeobj.intStartime_H * 60 + timeobj.intStartime_M + 60 * k;
        if (newmin >= 1440)
            newmin = newmin - 1440;
        //计算出要显示的刻度时间
        var strtime = parseInt(newmin / 60) + ":" + fromtTo2(newmin % 60);
        paper.text(xx + 90 * k, yy - 7, strtime)
             .attr("font-size", 12)
             .attr("font-family", "Arial")
             .attr("stroke", "#000000")
             .attr("stroke-width", 0);
    }
    //计算开始时间和结束时间 以秒为单位
    var t1 = timeobj.intStartime_H * 3600 + timeobj.intStartime_M * 60;
    var t2 = timeobj.intEndtime_H * 3600 + timeobj.intEndtime_M * 60;
    if (timeobj.cross == "1") {
        t2 = t2 + 86400;
    }
    var process = function (j) {
        var starttime = new Date(Date.parse((DD + " " + obj[j][0]).replace(/-/g, "/")));
        var endtime = new Date(Date.parse((DD + " " + obj[j][1]).replace(/-/g, "/")));
        var starttimes = starttime.getHours() * 3600 + starttime.getMinutes() * 60 + starttime.getSeconds();
        var endtimes = endtime.getHours() * 3600 + endtime.getMinutes() * 60 + endtime.getSeconds();
        if ((timeobj.cross == "1") && (obj[j][2] == "1")) {//跨天  更改跨天判断标识位，判断是否是真的跨天画法--lkj2013.7.16
            if (starttimes > endtimes) {
                endtimes = endtimes + 86400;
            }
            else {
                starttimes = starttimes + 86400;
                endtimes = endtimes + 86400;
            }
        }
        //var tempxx = (ww - 2) * (endtimes - starttimes) / 86400;
        var px1 = timeobj.pix * (starttimes - t1) / (t2 - t1);
        var px2 = timeobj.pix * (endtimes - t1) / (t2 - t1);

        //保存数据
        var tempobj = {};
        tempobj.START_TIME = obj[j][0]; //开始时间
        tempobj.END_TIME = obj[j][1];//结束时间
        tempobj.STATUS = obj[j][3];//状态
        tempobj.ID = obj[j][5];//ID
        tempobj.REASONID = obj[j][6];//原因ID
        tempobj.NOTE = obj[j][7];//备注
        tempobj.STATUS_ID = obj[j][8];//状态ID

        var rect;
        if (obj[j][9] == 1) {
            rect = paper.rect(xx + oldxx + px1, yy + 1, px2 - px1, hh - 2, 0)
                                 .attr({
                                     "stroke-width": 0,
                                     "fill": obj[j][4]
                                 })
                                 .data("id", id)
                                 .data("id_shift", id_shift)
                                 .data("obj", tempobj);
        }
        else if (obj[j][9] == 2) {
            rect = paper.rect(xx + oldxx + px1, yy + 1, px2 - px1, hh - 2, 0)
                                 .attr({
                                     "stroke-width": 2,
                                     "stroke": "#000000",
                                     //"opacity":0.5,
                                     "fill": obj[j][4]
                                 })
                                 .data("id", id)
                                 .data("id_shift", id_shift)
                                 .data("obj", tempobj);
        }
        //        var rect = paper.rect(xx + oldxx + px1, yy + 1, px2 - px1, hh - 2, 0)
        //                                 .attr({
        //                                     "stroke-width": 0,
        //                                     "fill": obj[j][4]
        //                                 })
        //                                 .data("id", id)
        //                                 .data("id_shift", id_shift)
        //                                 .data("obj", tempobj);
        paper.Element_ID.push(rect.id);
        //        var txt = paper.text(xx + oldxx, yy + 60, obj[j][3])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_starttime = paper.text(xx + oldxx, yy + 60, obj[j][0])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_endtime = paper.text(xx + oldxx, yy + 60, obj[j][1])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        //        var txt_note = paper.text(xx + oldxx, yy + 60, obj[j][5])
        //                                .attr({ fill: obj[j][4], stroke: "none", opacity: 0, "font-size": 12 });
        rect.mouseover(function () {
            rect.stop().animate({ transform: "s1" }, 200).toFront();
            var message = "<table><tr><td>开始时间:</td><td>" + this.data("obj").START_TIME + "</td></tr><tr><td>结束时间:</td><td>" + this.data("obj").END_TIME + "</td></tr><tr><td>设备状态:</td><td align='left'>" + this.data("obj").STATUS + "</td></tr><tr><td>状态备注:</td><td align='left'>" + this.data("obj").NOTE + "</td></tr></table>";
            //var message = "开始时间:" + txt_starttime.attrs.text + "<br>" + "结束时间:" + txt_endtime.attrs.text + "<br>" + "状态:" + txt.attrs.text;
            //var top = (this.data("top") - 100) + "px";
            var top, left;
            if (this.data("id_shift") == 0) { //日期状态数据
                top = $("#status_Detail_" + this.data("id")).offset().top - 100;
                left = $("#status_Detail_" + this.data("id")).offset().left;
            }
            else { //班次状态数据
                top = $("#status_" + this.data("id") + "_" + this.data("id_shift") + "_shift").offset().top + 35;
                left = $("#status_" + this.data("id") + "_" + this.data("id_shift") + "_shift").offset().left;
            }
            $("#display").jCallout({
                message: message,
                position: "top",
                id: "ms"
            });
            $("#ms").css({ "display": "block" });
            $("#ms").css({
                //"top": (rect.attrs.y + rect.attrs.height + 20) + "px",
                "z-index": 50,
                "top": top + "px",
                "left": (rect.attrs.x + left + rect.attrs.width / 2 - ($("#ms").width() + 12) / 2) + "px"
            });
        }).mouseout(function () {
            rect.stop().animate({ transform: "" }, 200); //elastic
            $("#ms").remove()
        });
        //        .click(function () {
        //            var obj = {};
        //            obj.MACHINE_NAME = this.paper.DeviceName;
        //            obj.DATETIME = $("#tr_" + this.data("id")).attr("date");
        //            obj.ID = this.data("obj").ID;
        //            obj.START_TIME = this.data("obj").START_TIME;
        //            obj.END_TIME = this.data("obj").END_TIME;
        //            obj.STATUS_ID = this.data("obj").STATUS_ID;
        //            obj.STATUS_NAME = this.data("obj").STATUS;
        //            obj.REASON_ID = this.data("obj").REASONID;
        //            obj.COMMENT = this.data("obj").NOTE;
        //            fn_statusInfo(obj, this);
        //        });

        chart.push(rect);
        //chart.push(txt);
        //oldxx = oldxx + tempxx;
    }
    for (var i = 0; i < obj.length; i++) {
        process(i);
    }
    return chart;
}
function fromtTo2(n) {
    if (n < 10) {
        return "0" + n.toString();
    }
    else {
        return n.toString();
    }
}