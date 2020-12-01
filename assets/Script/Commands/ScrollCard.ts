
import { puremvc } from "../ScriptCore/puremvc/puremvc";

const {ccclass, property} = cc._decorator;
let directionType = cc.Enum({
    Horizontal: 0,
    Vertical: 1,
});
@ccclass
export default class ScrollCard extends puremvc.Component {

    // '方向',
    @property({
        type:cc.Enum(directionType),
    })
    Direction = directionType.Horizontal ;

    //每个item的间隔
    @property(cc.Integer)
    itemOffset: number = 0 ;

    // '移动速度'
    @property(cc.Integer)
    speed: number = 500 ;

    // '减速频率'
    @property(cc.Float)
    rub: number = 1.0 ;

    //  '缩放最小值'
    @property(cc.Float)
    scaleMin: number = 0.5 ;

    //  '缩放最大值
    @property(cc.Float)
    scaleMax: number = 1.0 ;
    
    //滚动item
    @property([cc.Node])
    item: cc.Node[] = [] ;

    @property(cc.Integer)
    startTime: number = 0 ;
    @property(cc.Integer)
    moveSpeed: number = 0 ;

    @property(cc.Node)
    item_Prefab:cc.Node = null;

    @property(cc.Integer)
    item_PrefabNum: number = 12 ;

    @property({
        type: cc.Component.EventHandler,
        displayName: "按钮回调函数"
    })
    btnClickCallBack = null;

    // 全局变量定义
    startMousePosition:cc.Vec2;
    moveFlag:Boolean = false;
    maxSize:cc.Size;
    screenRect:cc.Rect;
    itemList: cc.Node[] = [] ;

    __onLoad() {
        this._initItem();
        this._initItemPos();
        this.updateScale();

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan,this);//触摸事件监听
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove,this);//触摸事件监听
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);//触摸事件监听
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd,this);//触摸事件监听

    }
    onTouchBegan(touch)
    {
        this.moveSpeed = 0;
        this.startTime = new Date().getTime();
        this.startMousePosition = touch.touch.getLocation();
        this.moveFlag = false;
    }
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
    }
    onTouchEnd(event)
    {
        this.touchEnd(event);
        let pos = event.touch.getLocation();
        if(this.moveFlag === false && Math.abs(pos.x - this.startMousePosition.x) <= 0.01 && Math.abs(pos.y - this.startMousePosition.y) <= 0.01)
        {
            this.clickFun(pos);
        }
    }

    // 点击切换到游戏关卡场景
    clickFun(pos)
    {
        let targetPos = this.node.convertToNodeSpaceAR(pos);
        for(let i = 0; i< this.item.length; i++){
            let rect = this.item[i].getBoundingBox();
            let IsClick = rect.contains(targetPos);
            if(IsClick){
                let index = this.item[i].name ;
                this.btnClickCallBack.target.getComponent(this.btnClickCallBack._componentName)[this.btnClickCallBack.handler](index);
                break ;
            }
        }
        // 执行回调事件
        // cc.Component.EventHandler.emitEvents(this.scrapeEvents, new cc.Event.EventCustom('scrapeEvents'));
    }

    // 初始化滚动item有几个，预制
    _initItem()
    {
        this.item_Prefab.parent = null ;
        for (let i = 0; i < this.item_PrefabNum; i++)
        {
            let node = cc.instantiate(this.item_Prefab);
            node.parent = this.node ;
            node.name = (i+1).toString();
            this.item.push(node);
            node.getChildByName("label").getComponent(cc.Label).string = (i+1).toString() ;
        }
    }

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
        var disTime = curTime - this.startTime;
        //v = s/t
        this.moveSpeed = dis / disTime;
    }
    _initItemPos() {
        this.node.anchorY = 0.5;
        this.node.anchorX = 0.5;
        this.maxSize = new cc.Size(0, 0);
        for (let i = 0; i < this.item.length; i++) {
            this.maxSize.width += this.item[i].width;
            this.maxSize.height += this.item[i].height;
            this.maxSize.width += this.itemOffset;
            this.maxSize.height += this.itemOffset;
        }
        var startPos;
        if (this.Direction == 0) {
            startPos = cc.v2(-this.maxSize.width * this.node.anchorX, -this.maxSize.height * this.node.anchorY);
        } else {
            startPos = cc.v2(this.maxSize.width * this.node.anchorX, this.maxSize.height * this.node.anchorY);
        }
        this.screenRect = new cc.Rect(startPos.x, startPos.y, this.maxSize.width, this.maxSize.height);
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
        
    }
    itemMoveBy(pos) {
        for (let i = 0; i < this.item.length; i++) {
            if (this.Direction == 0) {
                this.item[i].x += pos.x;
            } else {
                this.item[i].y += pos.y;
            }
        }
        this.updatePos();
    }
    updatePos() {

        var startItem = this.itemList[0];
        var endItem = this.itemList[this.itemList.length - 1];

        var startout = false;
        if( this.Direction == 0 ){
            if( startItem.x < -this.maxSize.width/2 ){
                startout = true;
            }
        }else{
            if( startItem.y > this.maxSize.width/2 ){
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
            if( endItem.x > this.maxSize.width/2 ){
                endout = true;
            }
        }else{
            if( endItem.y < -this.maxSize.height/2 ){
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
    }
    updateScale() {
        if (this.scaleMax < this.scaleMin || this.scaleMax == 0) {
            return;
        }
        for (let i = 0; i < this.item.length; i++) {

            var pre;
            if (this.Direction == 0) {
                var x = this.item[i].x + this.maxSize.width / 2;
                if (this.item[i].x < 0) {
                    pre = x / this.maxSize.width;
                }
                else {
                    pre = 1 - x / this.maxSize.width;
                }

            } else {
                var y = this.item[i].y + this.maxSize.height / 2;
                if (this.item[i].y < 0) {
                    pre = y / this.maxSize.height;
                }
                else {
                    pre = 1 - y / this.maxSize.height;
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
    }
    __update(dt) {
        if (this.moveSpeed == 0) return;
        for (let i = 0; i < this.item.length; i++) {

            if (this.Direction == 0) {
                this.item[i].x -= this.moveSpeed * dt * this.speed;
            } else {
                this.item[i].y -= this.moveSpeed * dt * this.speed;
            }
        }
        if (this.moveSpeed > 0) {
            this.moveSpeed -= dt * this.rub;
            if (this.moveSpeed < 0) {
                this.moveSpeed = 0;
            }
        } else {
            this.moveSpeed += dt * this.rub;
            if (this.moveSpeed > 0) {
                this.moveSpeed = 0;
            }
        }
        var moveTo = -this.moveSpeed * dt * this.speed;
        this.itemMoveBy(cc.v2(moveTo, moveTo))
        this.updatePos();
    }
}
