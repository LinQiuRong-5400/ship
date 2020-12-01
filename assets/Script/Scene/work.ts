

import { puremvc } from "../ScriptCore/puremvc/puremvc";
import main from "./main";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";
const {ccclass, property} = cc._decorator;

@ccclass
export default class work extends puremvc.Component {


    loadSpSkeleton()
    {
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        this.scriptName = "work"+big_checkpoint+"_"+small_checkpoint;

        this.node.getChildByName("script").addComponent(this.scriptName);

        this.node.getChildByName("script").getComponent(this.scriptName).loadSpSkeleton();
    }

    // LIFE-CYCLE CALLBACKS:
    scriptName:string = "";
    InitWork()
    {
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        this.scriptName = "work"+big_checkpoint+"_"+small_checkpoint;

        if( this.node.getChildByName("script").getComponent(this.scriptName) == null) 
            this.node.getChildByName("script").addComponent(this.scriptName);
            
        this.node.getChildByName("script").getComponent(this.scriptName).__startGame();
    }

    next_scene()
    {
        if(GameManger.Instacne.channel == "oppo")
        {
            if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
            {
                main.Instacne.GameModel++;
                main.Instacne.Init();
            }
            else
            {
                // 插屏
                GameManger.Instacne.NativeControl_oppo.closeBack_NativeInter = function(falsg)
                {
                    console.log("lqr...game falsg :",falsg);
                    main.Instacne.GameModel++;
                    main.Instacne.Init();
                }
                GameManger.Instacne.NativeControl_oppo.ShowNativeInter(); // ad
            }
        }
        


    }

    // update (dt) {}
}
