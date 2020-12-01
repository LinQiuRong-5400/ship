// var gameManager = require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        Direction: {
            default: 0,
            type: cc.Enum({
                Horizontal: 0,
                Vertical: 1,
            }),
            tooltip: '方向',
            notify() {
                this._initItemPos();
            }
        },

        //每个item的间隔
        itemOffset: {
            default: 0,
            type: cc.Integer,
            tooltip: 'node 间隔',
            notify() {
                this._initItemPos();
            }
        },
        speed: {
            default: 500,
            type: cc.Integer,
            tooltip: '移动速度',
            notify() {
                this._initItemPos();
            }
        },
        rub: {
            default: 1.0,
            type: cc.Float,
            tooltip: '减速频率'
        },
        scaleMin: {
            default: 0.5,
            type: cc.Float,
            tooltip: '缩放最小值'
        },
        scaleMax: {
            default: 1.0,
            type: cc.Float,
            tooltip: '缩放最大值'
        },
        //滚动item
        item: {
            default: [],
            type: [cc.Node],
            notify() {
                this._initItemPos();
            }
        },
        // anchor:cc.Node,
        _startTime: {
            default: 0,
            type: cc.Integer,
        },
        _moveSpeed: {
            default: 0,
            type: cc.Integer,
        },
        Unit_pic:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._initItem();
        this._initItemPos();
        this.updateScale();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan,this);//触摸事件监听
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove,this);//触摸事件监听
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);//触摸事件监听
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd,this);//触摸事件监听

    },
    onTouchBegan(touch)
    {
        this._moveSpeed = 0;
        this._startTime = new Date().getTime();

        this.startMousePosition = touch.touch.getLocation();
        this.moveFlag = false;
    },
    onTouchMove(event)
    {
        var movePos = event.getDelta();
        this.itemMoveBy(movePos);

        let deltaX = event.touch.getLocation().x - this.startMousePosition.x;
        let deltaY = event.touch.getLocation().y - this.startMousePosition.y;
        if(Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01)
        {
            this.moveFlag = true;
        }
    },
    onTouchEnd(event)
    {
        this.touchEnd(event);
        let pos = event.touch.getLocation();
        if(this.moveFlag === false && Math.abs(pos.x - this.startMousePosition.x) <= 0.01 && Math.abs(pos.y - this.startMousePosition.y) <= 0.01)
        {
            this.clickFun(pos);
        }
    },

    //初始化滚动item有几个，预制
    _initItem()
    {
        for (let i = 0; i < gameManager.initMapNum; i++)
        {
            let node = cc.instantiate(this.Unit_pic);
            node.index = i ;
            node.parent = this.node ;
            this.item.push(node);
        }
    },

    // 点击切换到游戏关卡场景
    clickFun(pos)
    {
        // cc.log("点击切换到游戏关卡场景");
    },

    touchEnd(event) {

        var curpos = event.getLocation();
        var startpos = event.getStartLocation();

        var dis;
        if (this.Direction == 0) {
            dis = startpos.x - curpos.x;

        } else {
            dis = startpos.y - curpos.y;
        }

        var curTime = new Date().getTime();
        var disTime = curTime - this._startTime;
        //v = s/t
        this._moveSpeed = dis / disTime;
    },
    _initItemPos() {
        this.node.anchorY = 0.5;
        this.node.anchorX = 0.5;
        this._maxSize = new cc.Size(0, 0);
        for (let i = 0; i < this.item.length; i++) {
            this._maxSize.width += this.item[i].width;
            this._maxSize.height += this.item[i].height;
            this._maxSize.width += this.itemOffset;
            this._maxSize.height += this.itemOffset;
        }
        var startPos;
        if (this.Direction == 0) {
            startPos = cc.v2(-this._maxSize.width * this.node.anchorX, -this._maxSize.height * this.node.anchorY);
        } else {
            startPos = cc.v2(this._maxSize.width * this.node.anchorX, this._maxSize.height * this.node.anchorY);
        }
        this._screenRect = new cc.Rect(startPos.x, startPos.y, this._maxSize.width, this._maxSize.height);
        this.itemList = [];
        for (let i = 0; i < this.item.length; i++) {
            var anchor = this.item[i].getAnchorPoint();
            var itemSize = this.item[i].getContentSize();

            if (this.Direction == 0) {
                startPos.addSelf(cc.v2(itemSize.width * anchor.x, itemSize.height * anchor.y));
                this.item[i].x = startPos.x;
                // cc.log('x:'+startPos.x);
                this.item[i].y = 0;
                startPos.addSelf(cc.v2(itemSize.width * anchor.x, itemSize.height * anchor.y));
                startPos.addSelf(cc.v2(this.itemOffset, this.itemOffset));
            } else {
                startPos.subSelf(cc.v2(itemSize.width * anchor.x, itemSize.height * anchor.y));
                this.item[i].x = 0;
                this.item[i].y = startPos.y;
                startPos.subSelf(cc.v2(itemSize.width * anchor.x, itemSize.height * anchor.y));
                startPos.subSelf(cc.v2(this.itemOffset, this.itemOffset));
            }
            this.itemList[i] = this.item[i];
        }
        
    },
    start() {

    },
    itemMoveBy(pos) {
        for (let i = 0; i < this.item.length; i++) {
            if (this.Direction == 0) {
                this.item[i].x += pos.x;
            } else {
                this.item[i].y += pos.y;
            }
        }
        this.updatePos();
    },
    updatePos() {

        var startItem = this.itemList[0];
        var endItem = this.itemList[this.itemList.length - 1];

        var startout = false;
        if( this.Direction == 0 ){
            if( startItem.x < -this._maxSize.width/2 ){
                startout = true;
            }
        }else{
            if( startItem.y > this._maxSize.width/2 ){
                startout = true;
            }
        }

        //left
        if (startout) {
            var item = this.itemList.shift();
            this.itemList.push(item);

            if (this.Direction == 0) {
                item.x = endItem.x + endItem.width + this.itemOffset;
            } else {
                item.y = endItem.y - endItem.height - this.itemOffset;
            }
        }

        var endout = false;
        if( this.Direction == 0 ){
            if( endItem.x > this._maxSize.width/2 ){
                endout = true;
            }
        }else{
            if( endItem.y < -this._maxSize.height/2 ){
                endout = true;
            }
        }

        //right
        if (endout) {
            var item = this.itemList.pop();
            this.itemList.unshift(item);

            if (this.Direction == 0) {
                item.x = startItem.x - startItem.width - this.itemOffset;
            } else {
                item.y = startItem.y + startItem.height + this.itemOffset;
            }
        }

        this.updateScale();
    },
    updateScale() {
        if (this.scaleMax < this.scaleMin || this.scaleMax == 0) {
            return;
        }
        for (let i = 0; i < this.item.length; i++) {

            var pre;
            if (this.Direction == 0) {
                var x = this.item[i].x + this._maxSize.width / 2;
                if (this.item[i].x < 0) {
                    pre = x / this._maxSize.width;
                }
                else {
                    pre = 1 - x / this._maxSize.width;
                }

            } else {
                var y = this.item[i].y + this._maxSize.height / 2;
                if (this.item[i].y < 0) {
                    pre = y / this._maxSize.height;
                }
                else {
                    pre = 1 - y / this._maxSize.height;
                }
            }
            pre *= 2;
            var scaleTo = this.scaleMax - this.scaleMin;
            scaleTo *= pre;
            scaleTo += this.scaleMin;
            scaleTo = Math.abs(scaleTo);
            this.item[i].scaleX = scaleTo;
            this.item[i].scaleY = scaleTo;
        }
    },
    update(dt) {
        if (this._moveSpeed == 0) return;
        for (let i = 0; i < this.item.length; i++) {

            if (this.Direction == 0) {
                this.item[i].x -= this._moveSpeed * dt * this.speed;
            } else {
                this.item[i].y -= this._moveSpeed * dt * this.speed;
            }
        }
        if (this._moveSpeed > 0) {
            this._moveSpeed -= dt * this.rub;
            if (this._moveSpeed < 0) {
                this._moveSpeed = 0;
            }
        } else {
            this._moveSpeed += dt * this.rub;
            if (this._moveSpeed > 0) {
                this._moveSpeed = 0;
            }
        }
        var moveTo = -this._moveSpeed * dt * this.speed;
        this.itemMoveBy(cc.v2(moveTo, moveTo))
        this.updatePos();
    },
});
