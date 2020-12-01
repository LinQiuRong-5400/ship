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
import game from "../Scene/game";
import main from "../Scene/main";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";

const {ccclass, property} = cc._decorator;
let self = null ;
@ccclass
export default class work1 extends puremvc.Component {

    Ani_Model:number = 0;
    // @property(cc.Node)
    g3_2_barge_:cc.Node = null;
    g13_backhoe_dredger:cc.Node = null;
    stage_1:cc.Node = null;
    stage_2_waterline:cc.Node = null;
    isClick_flag :boolean = true ;

    isLoadServer:boolean = true;
    loadSpSkeleton () {
        this.Ani_Model ++ ;
        // 加载骨骼动画
        self = this ;
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        // 船
        if(this.isLoadServer)
        {
            let imageUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/s7_g6.png';
            let skeUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/s7_g6.json';
            let atlasUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/s7_g6.atlas';
            GameManger.Instacne.loaderSkeleton(imageUrl,skeUrl,atlasUrl,"s7_g6.png",(err,res)=>{
                    if( err ) console.log( "ship_prefab load err" , err );
                    if( err ) return ;
                    console.log("lqr loaderSkeleton ok !")
                    let node = new cc.Node("g13_backhoe_dredger");
                    node.parent = self.node ;
                    node.addComponent(sp.Skeleton);
                    let spine = node.getComponent(sp.Skeleton);
                    spine.premultipliedAlpha = false ;
                    spine.skeletonData = res;
                    node.active = false ;
                    self.g13_backhoe_dredger = node ; 
                    node.zIndex = 3 ;
                });

            imageUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/home_7.png';
            skeUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/home_7.json';
            atlasUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/home_7.atlas';
            GameManger.Instacne.loaderSkeleton(imageUrl,skeUrl,atlasUrl,"home_7.png",(err,res)=>{
                    if( err ) console.log( "ship_prefab load err" , err );
                    if( err ) return ;
                    console.log("lqr loaderSkeleton ok !")
                    let node = new cc.Node("stage_1");
                    node.parent = self.node ;
                    node.addComponent(sp.Skeleton);
                    let spine = node.getComponent(sp.Skeleton);
                    spine.premultipliedAlpha = false ;
                    spine.skeletonData = res;
                    node.active = false ;
                    self.stage_1 = node ; 
                    node.zIndex = 2 ;
                });
            imageUrl = "Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 3 +'/stage_3_waterline.png';
            skeUrl = "Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 3 +'/stage_3_waterline.json';
            atlasUrl = "Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 3 +'/stage_3_waterline.atlas';
            GameManger.Instacne.loaderSkeleton(imageUrl,skeUrl,atlasUrl,"stage_3_waterline.png",(err,res)=>{
                    if( err ) console.log( "ship_prefab load err" , err );
                    if( err ) return ;
                    console.log("lqr loaderSkeleton ok !")
                    let node = new cc.Node("stage_2_waterline");
                    node.parent = self.node ;
                    node.addComponent(sp.Skeleton);
                    let spine = node.getComponent(sp.Skeleton);
                    spine.premultipliedAlpha = false ;
                    spine.skeletonData = res;
                    node.active = false ;
                    self.stage_2_waterline = node ; 
                    node.zIndex = 2 ;
                });
            imageUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/stage7_waves.png';
            skeUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/stage7_waves.json';
            atlasUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/stage7_waves.atlas';
            GameManger.Instacne.loaderSkeleton(imageUrl,skeUrl,atlasUrl,"stage7_waves.png",(err,res)=>{
                    if( err ) console.log( "ship_prefab load err" , err );
                    if( err ) return ;
                    console.log("lqr loaderSkeleton ok !")
                    let node = new cc.Node("stage7_waves");
                    node.parent = self.node ;
                    node.addComponent(sp.Skeleton);
                    let spine = node.getComponent(sp.Skeleton);
                    spine.premultipliedAlpha = false ;
                    spine.skeletonData = res;
                    node.zIndex = 4 ;
                    spine.setAnimation(0,"stage7_action_1",true);
                });
        }
        else
        {
            cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +
                '/s7_g6', sp.SkeletonData,(err,res)=>{
                if( err ) console.log( "Checkpoint2 g3_2_barge_ load err" , err );
                if( err ) return ;
                let node = new cc.Node("g13_backhoe_dredger");
                node.parent = self.node ;
                node.addComponent(sp.Skeleton);
                let spine = node.getComponent(sp.Skeleton);
                // spine.premultipliedAlpha = false ;
                spine.skeletonData = res;
                node.active = false ;
                self.g13_backhoe_dredger = node ; 
                node.zIndex = 3 ;
            });
            // 小岛
            cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +
                '/home_7', sp.SkeletonData,(err,res)=>{
                if( err ) console.log( "Checkpoint2 g3_2_barge_ load err" , err );
                if( err ) return ;
                let node = new cc.Node("stage_1");
                node.parent = self.node ;
                node.addComponent(sp.Skeleton);
                let spine = node.getComponent(sp.Skeleton);
                // spine.premultipliedAlpha = false ;
                spine.skeletonData = res;
                node.active = false ;
                self.stage_1 = node ; 
                node.zIndex = 2 ;
            });
            // 水
            cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+1+"/small_checkpoint"+ 3 +
                '/stage_3_waterline', sp.SkeletonData,(err,res)=>{
                if( err ) console.log( "Checkpoint2 g3_2_barge_ load err" , err );
                if( err ) return ;
                let node = new cc.Node("stage_2_waterline");
                node.parent = self.node ;
                node.addComponent(sp.Skeleton);
                let spine = node.getComponent(sp.Skeleton);
                // spine.premultipliedAlpha = false ;
                spine.skeletonData = res;
                node.active = false ;
                self.stage_2_waterline = node ; 
                node.zIndex = 2 ;
            });

            // 游艇
            cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+ big_checkpoint +"/small_checkpoint"+ small_checkpoint +
                '/stage7_waves', sp.SkeletonData,(err,res)=>{
                if( err ) console.log( "Checkpoint2 g3_2_barge_ load err" , err );
                if( err ) return ;
                let node = new cc.Node("stage7_waves");
                node.parent = self.node ;
                node.addComponent(sp.Skeleton);
                let spine = node.getComponent(sp.Skeleton);
                // spine.premultipliedAlpha = false ;
                spine.skeletonData = res;
                // node.active = false ;
                // self.stage_2_waterline = node ; 
                node.zIndex = 4 ;
                spine.setAnimation(0,"stage7_action_1",true);
                console.log("stage7_waves")
            });
        }

        
    }

    Init()
    {
        if( this.g13_backhoe_dredger == null || this.stage_1 == null || this.stage_2_waterline == null )
        {
            this.scheduleOnce(this.Init.bind(this),0.2 );
            return ;
        }

        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;

        if( this.Ani_Model == 1 )
        {
            GameManger.Instacne.AudioEngine.playActionAudioByUrl(big_checkpoint,small_checkpoint,1); // 音效
            this.isClick_flag = false ;
            // 运输船 g3_2_barge_
            // let g3_2_barge_ = this.g3_2_barge_.getComponent(sp.Skeleton);
            // g3_2_barge_.node.active = true ;
            // g3_2_barge_.setAnimation( 0,"stage2_action_1",false );
            // g3_2_barge_.setCompleteListener(function(){
            //     g3_2_barge_.setAnimation( 0,"stage2_idle_1",true );
            // });
            // 工作船 g13_backhoe_dredger
            let g13_backhoe_dredger = this.g13_backhoe_dredger.getComponent(sp.Skeleton);
            g13_backhoe_dredger.node.active = true ;
            g13_backhoe_dredger.setAnimation( 0,"stage7_action_1",false );
            g13_backhoe_dredger.setCompleteListener(function(){
                self.isClick_flag = true ;
                g13_backhoe_dredger.setAnimation( 0,"stage7_idle_1",true );
                GameManger.Instacne.AudioEngine.playActionAudioByUrl(big_checkpoint,small_checkpoint,0); // 音效
            });
            // 小岛 stage_1
            let stage_1 = this.stage_1.getComponent(sp.Skeleton);
            stage_1.node.active = true ;
            stage_1.setAnimation( 0,"stage7_action_1",false );
            stage_1.setCompleteListener(function(){
                stage_1.setAnimation( 0,"stage7_idle_1",true );
            });
            // 水 stage_2_waterline
            let stage_2_waterline = this.stage_2_waterline.getComponent(sp.Skeleton);
            stage_2_waterline.node.active = true ;
            stage_2_waterline.setAnimation( 0,"idle",true );
        }
        else if( this.Ani_Model == 2 )
        {
            GameManger.Instacne.AudioEngine.playActionAudioByUrl(big_checkpoint,small_checkpoint,2); // 音效
            this.isClick_flag = false ;
            // 运输船 g3_2_barge_
            // let g3_2_barge_ = this.g3_2_barge_.getComponent(sp.Skeleton);
            // g3_2_barge_.node.active = true ;
            // g3_2_barge_.setAnimation( 0,"stage2_action_2",false );
            // g3_2_barge_.setCompleteListener(function(){
            //     g3_2_barge_.setAnimation( 0,"stage2_idle_2",true );
            // });
            // 工作船 g13_backhoe_dredger
            let g13_backhoe_dredger = this.g13_backhoe_dredger.getComponent(sp.Skeleton);
            g13_backhoe_dredger.node.active = true ;
            g13_backhoe_dredger.setAnimation( 0,"stage7_action_2",false );
            g13_backhoe_dredger.setCompleteListener(function(){
                self.isClick_flag = true ;
                g13_backhoe_dredger.setAnimation( 0,"stage7_idle_2",true );
                GameManger.Instacne.AudioEngine.playActionAudioByUrl(big_checkpoint,small_checkpoint,0); // 音效
            });
            // 小岛 stage_1
            let stage_1 = this.stage_1.getComponent(sp.Skeleton);
            stage_1.node.active = true ;
            stage_1.setAnimation( 0,"stage7_action_2",false );
            stage_1.setCompleteListener(function(){
                stage_1.setAnimation( 0,"stage7_idle_2",true );
            });    
        } 
        else if( this.Ani_Model == 3 )
        {
            GameManger.Instacne.AudioEngine.playActionAudioByUrl(big_checkpoint,small_checkpoint,3); // 音效
            this.isClick_flag = false ;
            // 运输船 g3_2_barge_
            // let g3_2_barge_ = this.g3_2_barge_.getComponent(sp.Skeleton);
            // g3_2_barge_.node.active = true ;
            // g3_2_barge_.setAnimation( 0,"stage2_action_3",false );
            // g3_2_barge_.setCompleteListener(function(){
            //     g3_2_barge_.setAnimation( 0,"stage2_idle_3",true );
            // });
            // 工作船 g13_backhoe_dredger
            let g13_backhoe_dredger = this.g13_backhoe_dredger.getComponent(sp.Skeleton);
            g13_backhoe_dredger.node.active = true ;
            g13_backhoe_dredger.setAnimation( 0,"stage7_action_3",false );
            g13_backhoe_dredger.setCompleteListener(function(){
                // self.Ani_Model ++ ;
                // self.Init();
                g13_backhoe_dredger.setAnimation( 0,"stage7_idle_3",true );
                self.isClick_flag = true ;
                GameManger.Instacne.AudioEngine.playActionAudioByUrl(big_checkpoint,small_checkpoint,0); // 音效
            });
            // 小岛 stage_1
            let stage_1 = this.stage_1.getComponent(sp.Skeleton);
            stage_1.node.active = true ;
            stage_1.setAnimation( 0,"stage7_action_3",false );
            stage_1.setCompleteListener(function(){
                stage_1.setAnimation( 0,"stage7_idle_3",true );
            });
        } 
        else if( this.Ani_Model == 4 )
        {
            GameManger.Instacne.AudioEngine.playActionAudioByUrl(big_checkpoint,small_checkpoint,4); // 音效
            this.isClick_flag = false ;
            // 运输船 g3_2_barge_
            // let g3_2_barge_ = this.g3_2_barge_.getComponent(sp.Skeleton);
            // g3_2_barge_.node.active = true ;
            // g3_2_barge_.setAnimation( 0,"stage2_action_4",false );
            // g3_2_barge_.setCompleteListener(function(){

            // });
            // 工作船 g13_backhoe_dredger
            let g13_backhoe_dredger = this.g13_backhoe_dredger.getComponent(sp.Skeleton);
            g13_backhoe_dredger.node.active = true ;
            g13_backhoe_dredger.setAnimation( 0,"stage7_action_4",false );
            g13_backhoe_dredger.setCompleteListener(function(){

                self.Ani_Model ++ ;
                self.Init();
            });
            // 小岛 stage_1
            let stage_1 = this.stage_1.getComponent(sp.Skeleton);
            stage_1.node.active = true ;
            stage_1.setAnimation( 0,"stage7_action_4",false );
            stage_1.setCompleteListener(function(){

            });
        } 
        else if( this.Ani_Model == 5 )
        {
            // this.g3_2_barge_.active = false ;
            this.g13_backhoe_dredger.active = false ;
            
            this.node.parent.getComponent("work").next_scene();
        } 

    }
    // 共有的
    __startGame () {
        // 点击
        let node = new cc.Node("click");
        node.parent = this.node;
        node.width = cc.winSize.width ;
        node.height = cc.winSize.height ;
        node.on(cc.Node.EventType.TOUCH_START, this.clickCallBack_click,this);

        this.Init();
    }
    // 点击
    clickCallBack_click()
    {
        if( !this.isClick_flag ) return ;
        this.Ani_Model ++ ;
        this.Init();
    }

    // update (dt) {}
}
