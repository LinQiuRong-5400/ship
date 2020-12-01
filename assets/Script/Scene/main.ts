
import { puremvc } from "../ScriptCore/puremvc/puremvc";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class main extends puremvc.Component {

    GameModel:number = 1;
    static Instacne : main ;

    __onLoad () {
        if( main.Instacne == null ) 
        main.Instacne = this;
        this.loadSpSkeleton();
        this.Init();
    }

    __start()
    {

    }

    Init()
    {
        if( this.GameModel == 1 )
        {
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

            let comeOn = this.node.getChildByName("comeOn");
            comeOn.getComponent("comeOn").initComeOn();
            comeOn.active = true ;

            GameManger.Instacne.AudioEngine.GameModelAudio("main1");
        }
        else if( this.GameModel == 2 )
        {
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
            // 关闭banner
            GameManger.Instacne.adsManger.adsManager_oppo.destoryBanner();
            // GameManger.Instacne.NativeControl_oppo.ShowNativeInter(); // ad
            let work = this.node.getChildByName("work");
            work.active = true ;
            let move_x = work.x ;
            this.move_map(move_x)
            this.scheduleOnce(()=>{
                work.getComponent("work").InitWork();
            },0.6)

            GameManger.Instacne.AudioEngine.GameModelAudio("main2");
        }
        else if( this.GameModel == 3 )
        {
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

            let shipWashing = this.node.getChildByName("shipWashing");
            shipWashing.active = true ;
            let move_x = shipWashing.x ;
            this.move_map(move_x)
            this.scheduleOnce(()=>{
                shipWashing.getComponent("shipWashing").InitShipWashing();
            },0.6)

            GameManger.Instacne.AudioEngine.GameModelAudio("main3");
        }
        else if( this.GameModel == 4 )
        {

            // 插屏
            if(GameManger.Instacne.channel == "oppo")
            {
                let NativeInterView = this.node.getChildByName("win").getChildByName("nodes_view").getChildByName("NativeInterView")
                GameManger.Instacne.NativeControl_oppo.addNode_NativeInterView(NativeInterView);
                GameManger.Instacne.NativeControl_oppo.ShowNativeInter();
            }


            let win = this.node.getChildByName("win");
            win.active = true ;
            // 星星
            let end_game_anim = win.getChildByName("end_game_anim").getComponent(sp.Skeleton);
            end_game_anim.addAnimation( 0,"end",false );
            end_game_anim.setCompleteListener(function(){
                end_game_anim.addAnimation( 0,"end_idle",true );
            }); 
            // 水
            let wave_ = win.getChildByName("wave_").getComponent(sp.Skeleton);
            wave_.addAnimation( 0,"wave_1",false );
            wave_.setCompleteListener(function(){
                wave_.addAnimation( 0,"idle_1",true );
            });
            // 礼花
            let konf_bg = win.getChildByName("konf_bg").getComponent(sp.Skeleton);
            konf_bg.addAnimation( 0,"action_1",true );
            // 礼花
            let konf_fg = win.getChildByName("konf_fg").getComponent(sp.Skeleton);
            konf_fg.addAnimation( 0,"action",true );

            // 存储关卡
            let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
            let big_checkpoint = selectProxy.data.big_checkpoint ;
            let small_checkpoint = selectProxy.data.small_checkpoint ;
            if ( ( big_checkpoint == 1 && small_checkpoint == 7 ) || ( big_checkpoint == 2 && small_checkpoint == 11  ) )
            {

            }
            else
            {
                selectProxy.data.add_small_checkpoint();
            }

        }
    }
    loadSpSkeleton()
    {
        let work = this.node.getChildByName("work");
        work.getComponent("work").loadSpSkeleton();
    }
    // 下一个场景
    next_scene()
    {           
        console.log("next_scene"); 
        // 跳转
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        if ( ( big_checkpoint == 1 && small_checkpoint == 7 ) || ( big_checkpoint == 2 && small_checkpoint == 11  ) )
        {
            cc.director.loadScene("select");
        }
        else
        {
            // selectProxy.data.add_small_checkpoint();
            cc.director.loadScene("game");
        }
    }
    // 选关场景
    select_scene()
    {           
        cc.director.loadScene("loading");
    }

    move_map(posX)
    {
        let comeOn = this.node.getChildByName("comeOn");
        let work = this.node.getChildByName("work");
        let shipWashing = this.node.getChildByName("shipWashing");
        cc.tween(comeOn)
        .to(0.5,{position:cc.v2(comeOn.x - posX,comeOn.y)})
        .start()

        cc.tween(work)
        .to(0.5,{position:cc.v2(work.x - posX,work.y)})
        .start()

        cc.tween(shipWashing)
        .to(0.5,{position:cc.v2(shipWashing.x - posX,shipWashing.y)})
        .call(()=>{
            // callback && callback();
        })
        .start()
    }

    __onDestroy()
    {
        main.Instacne = null;
    }

}
