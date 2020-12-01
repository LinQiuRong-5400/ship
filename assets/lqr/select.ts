import { puremvc } from "../Script/ScriptCore/puremvc/puremvc";
import selectProxy from "../Script/Proxys/selectProxy";



const {ccclass, property} = cc._decorator;

@ccclass
export default class select extends puremvc.Component {

    big_checkpoint:number;
    small_checkpoint:number;

    __start () {

        // let bg_menu_ = this.node.getChildByName("bg_menu_").getComponent(sp.Skeleton);

        // let parts = ["left-arm", "left-hand", "left-shoulder"];
        // for ( let i = 0; i < parts.length; i++ ) {
        //     let slot1 = bg_menu_.findSlot(parts[i]);
        //     let slot2 = sk2.findSlot(parts[i]);
        //     let attachment = slot2.getAttachment();
        //     slot1.setAttachment(attachment);
        // }
        
    }
    
    // 点击切换到游戏关卡场景
    clickFun_item(small_checkpoint)
    {
        small_checkpoint = Number( small_checkpoint );
        this.small_checkpoint = small_checkpoint ;
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        selectProxy.data.small_checkpoint = this.small_checkpoint ;
        selectProxy.data.big_checkpoint = this.big_checkpoint ;
        // cc.director.loadScene("main");
        cc.director.loadScene("game");
    }

    // 点击切换到游戏关卡场景
    clickFun_btn(target,big_checkpoint)
    {
        big_checkpoint = Number( big_checkpoint );
        this.big_checkpoint = big_checkpoint ;
        // this.node.getChildByName("select").active = true ;

        // this.initSelect();
    }
    // 
    angle_step :number = 12;
    initSelect()
    {
        this.node.getChildByName("layer_btns").active = false ;
        let select = this.node.getChildByName("select") ;
        select.active = true ;
        let item = select.getChildByName("item");
        item.parent = null ;
        let itemNum = 0 ;
        if( this.big_checkpoint == 1 ) itemNum = 6 ;
        else  itemNum = 11 ;
        for( let i = 0 ; i < itemNum ; i++ )
        {
            let node = cc.instantiate( item );
            node.parent = select;
            let ii = i ;
            node.angle = -ii * this.angle_step  ;
            node.position = this.getPos( -ii * this.angle_step + 90 ) ;
            ii += 1 ;
            node.getChildByName("frame").getChildByName("label").getComponent(cc.Label).string = ii.toString() ;

            cc.loader.loadRes("select/" + this.big_checkpoint + "-" + ii, cc.SpriteFrame, function (err, spriteFrame) {
                node.getChildByName("frame").getChildByName("image").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        let node = new cc.Node("touch_move");
        node.parent = this.node ;
        node.width = cc.winSize.width ;
        node.height = cc.winSize.height ;

        node.on(cc.Node.EventType.TOUCH_START,this.TOUCH_START,this);
        node.on(cc.Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE,this);
        node.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END,this);
    }
    // 移动
    is_move = true ;
    is_click = true ;
    clickCallBack_TOUCH_START(touch)
    {
        // this.start_pos = touch.touch._point;
        // return
        this.is_click = true ;
    }
    clickCallBack_TOUCH_MOVE(touch)
    {

        // return
        if( !this.is_move ) return ;

        let xx = touch.getDelta().x ;
        let yy = touch.getDelta().y ;

        if( xx > 1 || yy > 1 ||  xx < -1 || yy < -1) this.is_click = false ;

        let select = this.node.getChildByName("select") ;
        if( xx > 0 ) select.angle -= 0.5 ;
        else  select.angle -= -0.5 ;
        // select.angle -= xx ;
        let maxAngle;
        if( this.big_checkpoint == 1 )
        {
            maxAngle = this.angle_step * 5  ;
            if( select.angle > maxAngle )
            {
                select.angle =  maxAngle ;
            }

            if( select.angle < 0 )
            {
                select.angle =  0 ;
            }
        }
        else if( this.big_checkpoint == 2 )
        {
            maxAngle = this.angle_step * 10  ;
            if( select.angle > maxAngle )
            {
                select.angle =  maxAngle ;
            }

            if( select.angle < 0 )
            {
                select.angle =  0 ;
            }
        }

    }
    // 结束
    clickCallBack_TOUCH_END(touch)
    {
        // let select = this.node.getChildByName("select") ;

        // let end_pos =  touch.touch._point;
        // let start_pos =  touch.touch._startPoint;

        // let next_step = 0 ; ;
        // if( end_pos.x > start_pos.x  ) next_step = -1 ;
        // else next_step = 1 ;

        // let maxAngle = 0 ;
        // if( this.big_checkpoint == 1 ) maxAngle = 6 ;
        // else  maxAngle = 11 ;

        // if( this.__now_index + next_step < 0 || this.__now_index + + next_step >= maxAngle ) return ;
        // this.__now_index += next_step;
        // let __hopeAngle = this.angle_step *  this.__now_index ;

        // cc.tween(select)
        // .to(0.3,{angle:__hopeAngle})
        // .call(() => {  
        //     // __this.is_move = true ;
        // })
        // .start();

        // return


        if( !this.is_move ) return ;

        if( this.is_click )
        {
            console.log( "点击事件" );
            return ;
        }

        let select = this.node.getChildByName("select") ;
        let step = select.angle / this.angle_step ;
        let __step = Math.ceil( step );
        let __hopeAngle = __step*this.angle_step ;

        this.is_move = false ;
        let __this = this ;
        cc.tween(select)
        .to(0.3,{angle:__hopeAngle})
        .call(() => {  
            __this.is_move = true ;
        })
        .start();
    }
    __now_index:number = 0 ;

    // 获取坐标
    getPos(a)
    {
        let x1   =   0   +   2450   *   Math.cos( a  *   3.14   /180 );
        let y1   =   0   +   2450   *   Math.sin( a  *   3.14   /180 );
        return new cc.Vec3( x1,y1,0 );
    }

    hope_width:number = 600 ;
    START_POS :cc.Vec2 ;
    init_angle:number = 0 ;
    TOUCH_START(event)
    {
        this.START_POS = event.getLocation() ;
    }
    TOUCH_MOVE(event)
    {
        if( !this.is_move ) return ;
        let START_MOVE = event.getLocation() ;
        let pos_xx = START_MOVE.x - this.START_POS.x ;
        pos_xx = Math.floor( pos_xx );
        if( pos_xx > this.hope_width ) pos_xx = this.hope_width ;
        else if( pos_xx < -this.hope_width ) pos_xx = -this.hope_width ;

        let __ag = - this.angle_step * pos_xx / this.hope_width;
        let select = this.node.getChildByName("select") ;
        select.angle = this.init_angle + __ag ;
    }
    TOUCH_END(event)
    {
        if( !this.is_move ) return ;
        let select = this.node.getChildByName("select") ;
        let step = ( select.angle   ) / this.angle_step ;
        let __step = Math.ceil( step );
        let __hopeAngle = __step*this.angle_step ;

        this.is_move = false ;
        let __this = this ;
        cc.tween(select)
        .to(0.3,{angle:__hopeAngle})
        .call(() => {  
            __this.is_move = true ;
            __this.init_angle = select.angle ;
        })
        .start();
    }
}
