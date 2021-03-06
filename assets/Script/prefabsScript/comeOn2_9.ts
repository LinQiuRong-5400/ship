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
import main from "../Scene/main";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";

const {ccclass, property} = cc._decorator;
let self = null ;
@ccclass
export default class comeOn1 extends puremvc.Component {

    g13_dock_1:cc.Node = null;
    scriptNode:cc.Node = null;
    __onLoad()
    {
        self = this ;

        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        this.scriptNode = this.node.getChildByName("script");
        // 加载骨骼动画
        let imageUrl = "Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 5 +'/t_4_sep_01.png';
        let skeUrl = "Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 5 +'/t4_1_dock_1.json';
        let atlasUrl = "Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 5 +'/t4_1_dock_1.atlas';
        GameManger.Instacne.loaderSkeleton(imageUrl,skeUrl,atlasUrl,"t_4_sep_01.png",(err,res)=>{
                if( err ) console.log( "ship_prefab load err" , err );
                if( err ) return ;
                console.log("lqr loaderSkeleton ok !")
                let node = new cc.Node("g13_dock_1");
                node.parent = self.scriptNode.getChildByName("ship");
                node.addComponent(sp.Skeleton);
                let spine = node.getComponent(sp.Skeleton);
                spine.premultipliedAlpha = false ;
                spine.skeletonData = res;
                node.active = false ;
                self.g13_dock_1 = node ; 
                node.zIndex = 1 ;
                self.node.getComponent("comeOn").Init();
            });

        // cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 5 +
        // '/t4_1_dock_1', sp.SkeletonData,(err,res)=>{
        //     if( err ) console.log( "ship_ani g13_dock_1 load err" , err );
        //     if( err ) return ;
        //     let node = new cc.Node("g13_dock_1");
        //     node.parent = self.scriptNode.getChildByName("ship") ;
        //     node.addComponent(sp.Skeleton);
        //     let spine = node.getComponent(sp.Skeleton);
        //     // spine.premultipliedAlpha = false ;
        //     spine.skeletonData = res;
        //     node.active = false ;
        //     self.g13_dock_1 = node ; 
        //     node.zIndex = 1 ;
            
        //     self.node.getComponent("comeOn").Init();
        // });
    }
    // 船 驶入动画
    shipAni_DriveIn()
    {
        
        GameManger.Instacne.AudioEngine.playShipAudioByUrl("enter","g4_red_barge"); // 音效

        let g13_dock_1 = this.g13_dock_1.getComponent(sp.Skeleton);
        g13_dock_1.node.active = true ;
        g13_dock_1.setAnimation( 0,"dock_swimin_3",false );
    }
    // 船 驶出动画
    shipAni_DriveOut()
    {
        
        GameManger.Instacne.AudioEngine.playShipAudioByUrl("out","g4_red_barge"); // 音效

        let g13_dock_1 = this.g13_dock_1.getComponent(sp.Skeleton);
        g13_dock_1.node.active = true ;
        g13_dock_1.setAnimation( 0,"dock_swimout_2",false );
        g13_dock_1.setCompleteListener(function(){
            self.g13_dock_1.active = false ;
            self.node.getComponent("comeOn").Ani_Model ++ ;
            self.node.getComponent("comeOn").Init();
        });
    }
    // 获取油箱位置
    get_HopePos()
    {
        return cc.v2(38,-246);
    }
    
}
