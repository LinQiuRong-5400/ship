// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { puremvc } from "../ScriptCore/puremvc/puremvc";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";
const {ccclass, property} = cc._decorator;
let self = null ;
@ccclass
export default class shipWashing1 extends puremvc.Component {

    g13_dock_2:cc.Node = null;
    __onLoad()
    {
        self = this ;
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;

        let scriptNode = this.node.getChildByName("script");
        // 加载骨骼动画 
        // let imageUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/t_3_1_dock_2.png';
        // let skeUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/t_3_1_dock_2.json';
        // let atlasUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/t_3_1_dock_2.atlas';
        // GameManger.Instacne.loaderSkeleton(imageUrl,skeUrl,atlasUrl,"t_3_1_dock_2.png",(err,res)=>{
        //         if( err ) console.log( "ship_prefab load err" , err );
        //         if( err ) return ;
        //         console.log("lqr loaderSkeleton ok !")
        //         let node = new cc.Node("g13_dock_2");
        //         node.parent = scriptNode.getChildByName("ship") ;
        //         node.addComponent(sp.Skeleton);
        //         let spine = node.getComponent(sp.Skeleton);
        //         spine.premultipliedAlpha = false ;
        //         spine.skeletonData = res;
        //         node.active = false ;
        //         self.g13_dock_2 = node ; 
        //         node.zIndex = 1 ;
        //         self.is_next();
        //     });

        cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint + 
        '/t_3_1_dock_2', sp.SkeletonData,(err,res)=>{
            if( err ) console.log( "ship_ani t5_dock_2 load err" , err );
            if( err ) return ;
            let node = new cc.Node("g13_dock_2");
            node.parent = scriptNode.getChildByName("ship") ;
            node.addComponent(sp.Skeleton);
            let spine = node.getComponent(sp.Skeleton);
            // spine.premultipliedAlpha = false ;
            spine.skeletonData = res;
            node.active = false ;
            self.g13_dock_2 = node ; 
            node.zIndex = 1 ;

            self.is_next();
        });
        



    }

    // 船 驶入动画
    shipAni_DriveIn()
    {
        GameManger.Instacne.AudioEngine.playShipAudioByUrl("enter","g3_stacker_ship"); // 音效

        let g13_dock_2 = this.g13_dock_2.getComponent(sp.Skeleton);
        g13_dock_2.node.active = true ;
        // g13_dock_2.node.y = -50 ;
        g13_dock_2.setAnimation( 0,"dock_swimin_2",false );
        let index = true ;
        g13_dock_2.setCompleteListener(function(){
            if( !index ) return;
            index = false ;
            self.node.getComponent("shipWashing").game_model ++ ;
            self.node.getComponent("shipWashing").Init();
        });

        // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
        // console.log(g13_dock_2.skeletonData.skeletonJson.animations);
        // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
    }
    //  船 向上动画
    shipAni_liftup()
    {
        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/站台_up~1"); // 音效
        
        let g13_dock_2 = this.g13_dock_2.getComponent(sp.Skeleton);
        g13_dock_2.setAnimation( 0,"dock_liftup_1",false );
        g13_dock_2.setCompleteListener(function(){
            self.node.getComponent("shipWashing").is_Touch = true ;
        });
    }
    // 是否下一步
    is_next()
    {
        self.node.getComponent("shipWashing").Init();
    }
    // 新船
    new_shipAni()
    {
        let g13_dock_2 = this.g13_dock_2.getComponent(sp.Skeleton);
        g13_dock_2.setAnimation( 0,"dock_idle_4",false );
    }
    //   船 向下动画
    shipAni_LiftDown()
    {
        
        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/站台_down~1"); // 音效

        let g13_dock_2 = this.g13_dock_2.getComponent(sp.Skeleton);
        g13_dock_2.setAnimation( 0,"dock_liftdown",false );
        let index = 1 ;
        g13_dock_2.setCompleteListener(function(){
            if( index  == 1 ) 
            {
                
                GameManger.Instacne.AudioEngine.playShipAudioByUrl("out","g3_stacker_ship"); // 音效

                index ++  ;
                g13_dock_2.setAnimation( 0,"dock_swimout_1",false );
            }
            else if( index  == 2 ) 
            {
                index ++  ;
                self.node.getComponent("shipWashing").game_model ++ ;
                self.node.getComponent("shipWashing").Init();
            }

        });
    }

}
