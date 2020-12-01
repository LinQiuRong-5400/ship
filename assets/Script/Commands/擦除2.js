cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            default: null,
            type: cc.Mask,
            tooltip:'需要刮开的'
        },
        scrapteRadiusX: {
            default: 25.0,
            type: cc.Float,
            tooltip: '绘制点图形的x轴半径'
        },
        scrapteRadiusY: {
            default: 35.0,
            type: cc.Float,
            tooltip: '绘制点图形的Y轴半径'
        },
        scrapteArea: {
            default: 0.5,
            type: cc.Float,
            tooltip: '需要刮开的图层面积的多少'
        },
        scrapeEvents: {
            default: [],
            type: [cc.Component.EventHandler],
            tooltip: '擦除完成后所触发的事件'
        },

    },
    // 完成回调
    okFun()
    {
        cc.log("完成回调");
    },

    onLoad: function () {
        this.activeMaskNode();
    },

    activeMaskNode() {
        this.getinitNum();
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    },

    /**
     * 结束刮图的动作监听
     */
    endScrape(){
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    },
    /**
     * 点击开始
     * @param {*} event 
     */
    _onTouchBegin: function (event) {
        cc.log('touchBegin');    
        this.comFun(event);
    },

    _onTouchMoved: function (event) {
        this.comFun(event);
    },

    _onTouchEnd: function (event) {
        cc.log('touchEnd');
        this.checkScrape();
        this.comFun(event);
    },

    _onTouchCancel: function (event) {
        cc.log('TouchCancel')
        this.checkScrape();
    },
    
    onDestroy: function () {
        this.endScrape();
    },

    comFun(event) {
        var point = this.getPos(event);
        this.checkPixelPiont(point);
        this._addCircle(point);
    },

    /**
     * 进行刮开的操作
     * @param {*} point 
     */
    _addCircle: function (point) {
        var graphics = this.mask._graphics;
        //cc.log("xxxx:",graphics)
        var color = cc.color(0, 0, 0, 255);
        // 绘制椭圆
        graphics.ellipse(point.x, point.y, this.scrapteRadiusX * 2, this.scrapteRadiusY * 2);
        graphics.lineWidth = 2;
        // 填充颜色为透明
        graphics.fillColor = color;
        // 开始填充颜色
        graphics.fill();
    },

    /**
     * 检查是否完成擦除
     */
    checkScrape() {
        cc.log('目标数是：' + this.achieveNum);
        cc.log('现在已经刮开' + this.pixelNum);
        if (this.achieveNum <= this.pixelNum) {
            cc.log("已经刮完图层");
            this.achieveScrape();
        }
    },

    /**
     * 获得点击的位置
     * @param {事件} e 
     */
    getPos(e) {
        var point = e.touch.getLocation();
        point = this.node.convertToNodeSpaceAR(point);
        return point;
    },

    /**
     * 获取初始值
     */
    getinitNum() {
        this.pixelNum = 0;
        // 记录要擦除多少像素点才能完成擦除操作
        this.achieveNum = this.scrapteArea * this.initPixel();
    },

    /**
     * 根据所设计的接触点的大小设置出一个点矩阵,在根据接触点与点矩阵的
     * 距离判断当前已经刮开了图像的多少了
     */
    initPixel() {
        this.scrapeNode = this.mask.node.children[0];
        var x = this.scrapeNode.width, y = this.scrapeNode.height;

        //根据所设texture的大小来改变主节点的大小
        this.node.width = x;
        this.node.height = y;

        //根据接触点的大小来设置矩阵点多少以及点之间的距离
        this.widthWide = x / 2 + 20;
        this.heightWide = x / 2 + 20;
        var zx = x / 2, zy = y / 2, dx = -zx, dy = -zy, dy1 = dy;
        var pixelPiont = [];
        var rx = this.scrapteRadiusX * 2;
        var ry = this.scrapteRadiusY * 2;

        // 开始排列矩阵
        for (; dx <= zx; dx += rx) {
            for (dy = dy1; dy <= zy; dy += ry) {
                var p = [dx, dy];
                // 该属性确保每个矩阵点只能有一次的检测操作
                // 被检测完后变为false不能被二次检测
                p.isTouch = true;
                pixelPiont.push(p);
            }
        }
        this.pixelPiont = pixelPiont;
        //返回像素点的个数
        return pixelPiont.length;
    },

    /**
     * 检查是否画在新的像素点上,若是话在了新的点上,接使刮开数执行++操作
     */
    checkPixelPiont(point) {
        var pixelPiont = this.pixelPiont;
        var x, y;
        for (var i in pixelPiont) {
            x = Math.abs(point.x - pixelPiont[i][0]);
            y = Math.abs(point.y - pixelPiont[i][1]);
            if (x <= this.scrapteRadiusX && y <= this.scrapteRadiusY && pixelPiont[i].isTouch) {
                // 让该元素不可以响应触摸功能
                pixelPiont[i].isTouch = false;
                this.pixelNum++;
                return;
            }
        }
    },

    /**
     * 完成刮蹭事件
     */
    achieveScrape() {
        this.endScrape();
        // 执行渐隐效果，卡片消失
        this.node.runAction(cc.fadeOut(0.5));
        this.scheduleOnce((() => {
            // 执行回调事件
            cc.Component.EventHandler.emitEvents(this.scrapeEvents, new cc.Event.EventCustom('scrapeEvents'));
            //this.node.destroy();
        }).bind(this), 0.6);
    },
});
