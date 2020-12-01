
import { puremvc } from "../ScriptCore/puremvc/puremvc";
import selectProxy from "../Proxys/selectProxy";
import scrol_splicing from "./scrol_splicing";
import GameManger from "../ScriptCore/common/GameManger";
let self ;
const {ccclass, property} = cc._decorator;
@ccclass
export default class game extends puremvc.Component {
    @property(scrol_splicing)
    scrol_splicing:(scrol_splicing) = null ;
    static Instacne : game ;
    __onLoad()
    {  
        if( game.Instacne == null ) 
        game.Instacne = this;
        self = this ;
        // 船的预制
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +
        "/ship_" + small_checkpoint,cc.Prefab,(err,res)=>{
            if( err ) console.log( "ship_prefab load err" , err );
            if( err ) return ;
            self.start_game(res);
        })
        // 加载对应的脚本
        let scriptName = "jigsawPuzzle"+ big_checkpoint + "_" + small_checkpoint ;
        this.scriptName = scriptName ;
        this.node.addComponent( scriptName );
        GameManger.Instacne.AudioEngine.GameModelAudio("game");
        this.isEnd_animation = true ;
    }
    __start()
    {
        // 关闭banner
        GameManger.Instacne.adsManger.destoryBanner();
        //  不是广东，且不开启骚操作
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
    start_game(res:cc.Prefab)
    {
        let node = cc.instantiate(res);
        node.parent = this.node.getChildByName("ship");
        let targetNodes = node.getChildByName("targetNodes");
        this.scrol_splicing.Init(targetNodes);
    }
    scriptName:string = "";
    isEnd_animation:boolean = true ;
    end_animation()
    {
        if(!this.isEnd_animation) return ;
        this.isEnd_animation = false ;
        GameManger.Instacne.AudioEngine.GameModelEndAudio("youOk");
        this.node.getComponent( this.scriptName ).end_animation();
    }
    next_scene()
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) cc.director.loadScene("main");
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) return ;

        if(GameManger.Instacne.channel == "oppo")
        {
            if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
            {
                cc.director.loadScene("main");
            }
            else
            {
                // 插屏
                GameManger.Instacne.NativeControl_oppo.closeBack_NativeInter = function(falsg)
                {
                    console.log("lqr...game falsg :",falsg);
                    cc.director.loadScene("main");
                }
                GameManger.Instacne.NativeControl_oppo.ShowNativeInter(); // ad
            }
        }



    }
    __onDestroy()
    {
        game.Instacne = null;
    }
    btn_looadAd()
    {
        GameManger.Instacne.adsManger.ShowVideo(this.scrol_splicing.OneClickAssembly);
    }
}
