
import { puremvc } from "../ScriptCore/puremvc/puremvc";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";
const {ccclass, property} = cc._decorator;
let self ;
@ccclass
export default class select_gq extends puremvc.Component {

    item:cc.Node ;
    angle_step :number = 9 ;
    item_index :number = 0 ;
    @property(cc.SpriteFrame)
    item_bg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ad_icon:cc.SpriteFrame = null;
    __onLoad () {
        self = this ;
        this.item = this.node.getChildByName("item_parent");
        this.item.parent = null ;

        let node = this.node.parent.getChildByName("touch_move");
        node.parent = this.node.parent ;
        node.width = cc.winSize.width ;
        node.height = cc.winSize.height ;
        node.on(cc.Node.EventType.TOUCH_START,this.TOUCH_START,this);
        node.on(cc.Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE,this);
        node.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END,this);
        
        this.node.active = false ;
        this.node.parent.getChildByName("select_max").active = true ;

        GameManger.Instacne.AudioEngine.GameModelAudio("select");

        if(GameManger.Instacne.channel == "oppo")
        {
            if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
            {
                
            }
            else
            {
                GameManger.Instacne.NativeControl_oppo.ShowNativeIconAd();
            }
        }

    }
    __onEnable()
    {
        this.is_move = true ;
        // this.node.parent.getChildByName("press").active = true ;
        let itemNum = 7 ;
        this.node.destroyAllChildren() ;
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        // let adKey = selectProxy.data.get_local_checkpoint(selectProxy.data.big_checkpoint);
        if( selectProxy.data.big_checkpoint == 2 ) itemNum = 11 ;
        for( let i = 0 ; i < itemNum ; i++ )
        {
            let item = cc.instantiate(this.item) ;
            item.parent = this.node ;
            item.angle = - i * this.angle_step ;

            let ii = i + 1 ;
            let adKey = cc.sys.localStorage.getItem( "max" + selectProxy.data.big_checkpoint + "min"+ii );
            if( adKey == "true" || ii == 1 || GameManger.Instacne.Debug )
            {
                item.getChildByName("item").getChildByName("frame").getChildByName("ad").active = false ;
            }

            if(item.getChildByName("item").getChildByName("frame").getChildByName("ad").active)
            {
                if(GameManger.Instacne.channel == "oppo")
                {
                    if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
                    {
                        
                    }
                    else
                    {
                        item.getChildByName("item").getChildByName("frame").getChildByName("ad")
                        .getComponent(cc.Sprite).spriteFrame = this.ad_icon;
                    }
                }

            }


            // if( ii <= adKey)
            // {
            //     item.getChildByName("item").getChildByName("frame").getChildByName("ad").active = false ;
            // }
            let bg_type = cc.sys.localStorage.getItem( "Unlock_max" + selectProxy.data.big_checkpoint + "min"+ii );
            if(bg_type == "true" )
            {
                item.getChildByName("item").getChildByName("frame").getChildByName("item_bg").getComponent(cc.Sprite).spriteFrame = this.item_bg;
            }
            item.getChildByName("item").getChildByName("frame").getChildByName("label").getComponent(cc.Label).string = ii.toString() ;

            cc.loader.loadRes("select/" + selectProxy.data.big_checkpoint + "-" + ii, cc.SpriteFrame, function (err, spriteFrame) {
                item.getChildByName("item").getChildByName("frame").getChildByName("image").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });

        }
    }
    __start()
    {

    }
    itemAdId :number = 0 ; 
    itemAd :cc.Node  ; 
    isClickItem(event:cc.Touch)
    {
        let id = this.is_onTouchTargetNode(event);
        if(id != -1)
        {
            let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
            selectProxy.data.small_checkpoint = id + 1 ;

            let item = this.node.children[id];
            if( item.getChildByName("item").getChildByName("frame").getChildByName("ad").active )
            {
                if(GameManger.Instacne.channel == "oppo")
                {
                    if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
                    {
                        
                    }
                    else
                    {
                        this.itemAdId = id + 1 ;
                        this.itemAd = item ;
                        GameManger.Instacne.adsManger.ShowVideo(this.GetReward);
                        return ;
                    }
                }

                if(GameManger.Instacne.channel == "oppo")
                {
                    let tip = item.getChildByName("item").getChildByName("frame").getChildByName("tip");
                    tip.stopAllActions();
                    tip.opacity = 0 ;
                    tip.active = true ;
                    cc.tween(tip)
                    .to(0.3,{opacity:255})
                    .delay(3)
                    .to(0.3,{opacity:0})
                    .call(()=>{
                        tip.active = false ;
                    })
                    .start();
                    return ;
                }
                this.itemAdId = id + 1 ;
                this.itemAd = item ;
                GameManger.Instacne.adsManger.ShowVideo(this.GetReward);
                return ;
            }
            cc.director.loadScene("game");
        }
    }
    // 是否触摸typeItem，
    is_onTouchTargetNode(touch:cc.Touch)
    {
        let items = this.node.children ;
        for(let i = 0 ; i < items.length ; i ++)
        {
            let item = items[i];
            if(item.getChildByName("item").getBoundingBoxToWorld().contains(touch.getLocation()))
            {
                return i  ;
            }
        }
        return -1 ;
    }
    hope_width:number = 600 ;
    START_POS :cc.Vec2 ;
    init_angle:number = 0 ;
    is_move = false ;
    is_click = true ;
    TOUCH_START(event)
    {
        this.START_POS = event.getLocation() ;
        this.is_click = true ;
    }
    TOUCH_MOVE(event)
    {
        if( !this.is_move ) return ;
        let xx = event.getDelta().x ;
        let yy = event.getDelta().y ;
        if( xx > 1 || yy > 1 ||  xx < -1 || yy < -1) this.is_click = false ;

        if( this.START_POS ==  null  )
        {
            this.START_POS = event.getLocation() ;
            return ;
        }

        let START_MOVE = event.getLocation() ;
        let pos_xx = START_MOVE.x - this.START_POS.x ;
        pos_xx = Math.floor( pos_xx );
        if( pos_xx > this.hope_width ) pos_xx = this.hope_width ;
        else if( pos_xx < -this.hope_width ) pos_xx = -this.hope_width ;

        let __ag = - this.angle_step * pos_xx / this.hope_width;
        let select = this.node ;

        let count = this.node.childrenCount -1 ;
        let maxAngle = count * this.angle_step;

        if( this.init_angle + __ag < - this.angle_step /2 + 1  )
        {
            return 
            // __ag  = this.angle_step /2 + 1 ;
            // console.log(  this.init_angle + __ag , - this.angle_step /2 + 1  );
        }
        else if( this.init_angle + __ag > maxAngle + this.angle_step /2 - 1)
        {
            // __ag = this.angle_step /2 - 1 ;
            return
        }

        select.angle = this.init_angle + __ag ;
        
    }
    TOUCH_END(event)
    {
        if( !this.is_move ) return ;

        if( this.is_click )
        {
            this.isClickItem(event);
            return ;
        }

        let select = this.node ;

        let START_MOVE = event.getLocation() ;
        let pos_xx = START_MOVE.x - this.START_POS.x ;
        pos_xx = Math.floor( pos_xx );
        if( pos_xx > this.hope_width ) pos_xx = this.hope_width ;
        else if( pos_xx < -this.hope_width ) pos_xx = -this.hope_width ;

        let __ag = - this.angle_step * pos_xx / this.hope_width;

        let count = this.node.childrenCount -1  ;
        let maxAngle = count * this.angle_step;
        if( this.init_angle + __ag < - this.angle_step /2 + 1  )
        {
            __ag  =  - this.angle_step /2 + 1 ;
        }
        else if( this.init_angle + __ag > maxAngle + this.angle_step /2 - 1)
        {
            __ag = this.angle_step /2 - 1 ;
        }

        if( __ag > this.angle_step/2 )
        {
            this.init_angle += this.angle_step ;
        }
        else if( __ag < -this.angle_step/2 )
        {
            this.init_angle -= this.angle_step ;
        }

        this.is_move = false ;
        let __this = this ;
        cc.tween(select)
        .to(0.2,{angle:__this.init_angle})
        .call(() => {  
            __this.is_move = true ;
        })
        .start();

        this.START_POS = null ;
    }
    clickFun_select_max(target,index)
    {
        index = Number(index) ;
        // console.log( index );
        if( index == 3 ) return ;

        this.node.parent.getChildByName("back_big_checkpoint").active = true ;

        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        // selectProxy.data.small_checkpoint = this.small_checkpoint ;
        selectProxy.data.big_checkpoint = index ;
        // console.log( selectProxy.data.big_checkpoint )
        this.node.parent.getChildByName("select_max").active = false ;
        this.node.active = true ;
    }
    GetReward(falgs)
    {
        self.itemAd.getChildByName("item").getChildByName("frame").getChildByName("ad").active = false ;
        if(!falgs) return
        let selectProxy:selectProxy = self.facade.retrieveProxy("selectProxy");
        cc.sys.localStorage.setItem( "max" + selectProxy.data.big_checkpoint + "min"+self.itemAdId , "true");
    }
    back_big_checkpoint()
    {
        this.node.parent.getChildByName("back_big_checkpoint").active = false ;
        this.node.active = false ;
        this.node.parent.getChildByName("select_max").active = true ;
    }
}
