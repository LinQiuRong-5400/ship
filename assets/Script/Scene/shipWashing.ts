
import { puremvc } from "../ScriptCore/puremvc/puremvc";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";
import main from "./main";
const {ccclass, property} = cc._decorator;
let self = null ;
@ccclass
export default class shipWashing extends puremvc.Component {

    scriptName:string = "";
    InitShipWashing () {
        // InitShipWashing

        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        this.scriptName = "shipWashing"+big_checkpoint+"_"+small_checkpoint;

        // this.node.getChildByName("script").addComponent(this.scriptName);
        // 添加对应的脚本
        this.node.addComponent(this.scriptName);

        self = this ;

        this.scriptNode = this.node.getChildByName("script");

        // 获取节点
        this.bubbles_parent = this.scriptNode.getChildByName("bubbles_parent"); // 船的mask
        this.foam = this.node.getChildByName("foam"); // 预制体
        this.barrel = this.scriptNode.getChildByName("barrel"); // 气泡动画
        // 泡沫
        this.arm_parent = this.scriptNode.getChildByName("arm_parent");//
        this.arm = this.arm_parent.getChildByName("arm");
        this.target = this.arm.getChildByName("splash_target");
        this.target2 = this.arm.getChildByName("splash_target2");
        this.target3 = this.arm.getChildByName("splash_target3");
        // 刷子
        this.brush_parent = this.scriptNode.getChildByName("brush_parent");
        this.brush = this.brush_parent.getChildByName("brush");
        this.target4 = this.brush.parent.getChildByName("splash_target4");
        // 水枪
        this.water_parent = this.scriptNode.getChildByName("water_parent");
        this.water = this.water_parent.getChildByName("water");

        this.game_model ++ ;

        // 点击
        this.scriptNode.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan,this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd,this);

        // this.Init();
        // 加载预制 
        cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +
        "/clear_prefab",cc.Prefab,(err,res)=>{
            if( err ) console.log( "ship_prefab load err" , err );
            if( err ) return ;
            let node = cc.instantiate(res);
            node.name = "clear_prefab";
            node.parent = this.scriptNode;
            // self.node.getComponent("shipWashing").foam = node;
            node.zIndex = -1 ;
            node.opacity = 0 ;
        })

    }
    arm_parent:cc.Node = null;
    arm :cc.Node = null ;
    target:cc.Node = null;
    target2:cc.Node = null;
    target3:cc.Node = null;
    game_model:number = 0;
    barrel:cc.Node = null ;
    foam:cc.Node = null ;
    bubbles_parent:cc.Node = null ;
    // 刷子
    brush_parent:cc.Node = null ;
    brush:cc.Node = null ;
    target4:cc.Node = null ;
    // 水枪
    water_parent:cc.Node = null ;
    water:cc.Node = null ;

    scriptNode:cc.Node = null;

    // 音效id
    audioId_GM2 = null;
    audioId_GM3 = null;
    audioId_GM4 = null;
    audioId_JXB = null;

    Init () {

        if( this.game_model == 1 )
        {
            GameManger.Instacne.AudioEngine.playAudioByUrl('步骤/洗船_机械臂出现'); // 音效
            // 机械臂
            this.arm_parent.active = true ;
            let arm = this.arm.getComponent(sp.Skeleton);
            arm.node.active = true ;
            arm.node.zIndex = 10 ;
            arm.setAnimation( 0,"appear",false );
            arm.addAnimation( 1,"userMove",false );
            arm.setCompleteListener(function(){
                // console.log( "动作结束" );
                self.start_pos = self.arm_parent.position ;
            });

            // 船 驶入动画
            this.node.getComponent(this.scriptName).shipAni_DriveIn();

            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"foam_appear",false );
            barrel.addAnimation( 1,"foam_idle",true );

        }
        else if( this.game_model == 2 )
        {

            // 船 向上动画
            this.node.getComponent(this.scriptName).shipAni_liftup();

            // lift up
            let bg_tech_lift = this.scriptNode.getChildByName("bg_tech_lift").getComponent(sp.Skeleton);
            bg_tech_lift.node.active = true ;
            bg_tech_lift.setAnimation( 0,"liftup",false );
            bg_tech_lift.setCompleteListener(function(){
                self.facade.sendNotification("guide_shipWashing",self.target); // 停止引导
            });
            
        }
        else if( this.game_model == 3 )
        {


            let callback_fun = function(res)
            {
                self.audioId_GM3 = cc.audioEngine.playEffect(res, true);
            }
            GameManger.Instacne.AudioEngine.loadAudio('步骤/洗船_洗涤机待机转动',callback_fun); // 音效
            GameManger.Instacne.AudioEngine.playAudioByUrl('步骤/洗船_机械臂出现'); // 音效
            this.is_Touch = false ;
            cc.tween(this.arm_parent)
            .to(0.5,{position:cc.v2(this.arm_parent.x+1000,this.arm_parent.y)})
            .call(()=>{
                self.brush_parent.active = true ;
                let brush = self.brush.getComponent(sp.Skeleton);
                brush.setAnimation( 0,"idle",true );
                self.brush_parent_start_pos = self.brush_parent.position ;
                self.is_Touch = true ;
            })
            .start();

            //  触摸 杯子
            let barrel = self.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"foam_hide",false );
            barrel.addAnimation( 1,"barrel_empty",true );

            // 船 崭新动画
            this.node.getComponent(this.scriptName).new_shipAni();

            // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
            // console.log(barrel.skeletonData.skeletonJson.animations);
            // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
            // console.log( barrel , "this.game_model:" + this.game_model );

            // appear 启动
            // action 正常
            // hide  退出
            // idle 消除
            // userMove 字节移动
            // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
            // console.log(brush.skeletonData.skeletonJson.animations);
            // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
        }
        else if( this.game_model == 4 )
        {
            if( self.audioId_GM3 !=null )
            {
                cc.audioEngine.stopEffect(this.audioId_GM3);
                this.audioId_GM3 = null ;
            }

            let callback_fun = function(res)
            {
                self.audioId_JXB = cc.audioEngine.playEffect(res, true);
            }
            GameManger.Instacne.AudioEngine.loadAudio('步骤/洗船_机械臂出现',callback_fun); // 音效


            // // 船 崭新动画
            // this.node.getComponent(this.scriptName).new_shipAni();

            //  触摸 杯子
            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"water_appear",false );
            let index = true ;
            barrel.setCompleteListener(function(){
                if( !index ) return
                index = false ;
                barrel.addAnimation( 0,"water_idle",true );
            });


            this.is_Touch = false ;
            cc.tween(this.brush_parent)
            .to(0.5,{position:cc.v2(this.brush_parent.x+2000,this.brush_parent.y)})
            .call(()=>{
                self.is_Touch = true ;
                self.water_parent.active = true ;

                let water = self.water.getComponent(sp.Skeleton);
                water.setAnimation( 0,"jet_3",false );

                self.water_parent.setPosition(self.water_parent_pos.x+1000,self.water_parent_pos.y);
                cc.tween(self.water_parent)
                .to(0.3,{position:cc.v2(self.water_parent_pos.x,self.water_parent_pos.y)})
                .start()

                if( self.audioId_JXB !=null )
                {
                    cc.audioEngine.stopEffect(self.audioId_JXB);
                    self.audioId_JXB = null ;
                }

                // let water = self.water.getComponent(sp.Skeleton);
                // water.setAnimation( 0,"appear",false );
                // let index = true ;
                // water.setCompleteListener(function(){
                //     if( !index ) return ;
                //     index = false ;
                //     self.water_parent.setPosition(350,20);
                //     water.setAnimation( 0,"jet_3",false );
                // });

                
                // hide 退出
                // appear 显示
                // idle 自然动
                // jet_1 喷水
                // jet_2 清洗
                // jet_3 不动
                // userMove 自然下来
                
            })
            .start();
        }
        else if( this.game_model == 5 )
        {
            GameManger.Instacne.AudioEngine.playAudioByUrl('步骤/洗船_机械臂出现'); // 音效
            cc.tween(self.water_parent)
            .to(0.3,{position:cc.v2(1350,20)})
            .call(()=>{
                self.game_model ++ ;
                self.Init();
            })
            .start()

            //  触摸 杯子
            let barrel = self.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"water_hide",false );
            barrel.addAnimation( 1,"barrel_empty",true );
        }
        else if( this.game_model == 6 )
        {
            if( self.audioId_GM2 !=null )
            {
                cc.audioEngine.stopEffect(this.audioId_GM2);
                this.audioId_GM2 = null ;
            }
            if( self.audioId_GM3 !=null )
            {
                cc.audioEngine.stopEffect(this.audioId_GM3);
                this.audioId_GM3 = null ;
            }
            if( self.audioId_GM4 !=null )
            {
                cc.audioEngine.stopEffect(this.audioId_GM4);
                this.audioId_GM4 = null ;
            }            
            if( self.audioId_JXB !=null )
            {
                cc.audioEngine.stopEffect(this.audioId_JXB);
                this.audioId_JXB = null ;
            }

            GameManger.Instacne.AudioEngine.GameModelEndAudio("youFinish");

            // 船 向下动画
            this.node.getComponent(this.scriptName).shipAni_LiftDown();

            // lift up
            let bg_tech_lift = this.scriptNode.getChildByName("bg_tech_lift").getComponent(sp.Skeleton);
            bg_tech_lift.node.active = true ;
            bg_tech_lift.setAnimation( 0,"liftdown",false );
        }
        else if( this.game_model == 7 )
        {

            main.Instacne.GameModel ++;
            main.Instacne.Init();
            return


        }

    }

    brush_parent_start_pos:cc.Vec2 = null;

    start_pos:cc.Vec2 = null;
    is_Touch:Boolean = false;
    is_target:Boolean = false;

    foam_pos:cc.Vec2 = null;
    water_parent_pos:cc.Vec2 = cc.v2(350,20);
    onTouchBegan(touch)
    {
        if( !this.is_Touch ) return ;

        

        // 泡泡
        if( this.game_model == 2 )
        {
            let callback_fun = function(res)
            {
                self.audioId_GM2 = cc.audioEngine.playEffect(res, true);
            }
            GameManger.Instacne.AudioEngine.loadAudio('步骤/洗船_泡泡',callback_fun); // 音效

            this.is_target = this.target.getBoundingBoxToWorld().contains(touch.touch.getLocation());
            if( !this.is_target ) return ;

            this.facade.sendNotification("stop_guide_shipWashing",); // 停止引导

            // let arm = this.arm.getComponent(sp.Skeleton);
            // arm.setAnimation( 0,"jet_1",true );

            this.target2.getChildByName("particle").active = true ; // 粒子
            
            // foam_action 触摸 杯子
            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"foam_action",true );
        }
        // 刷子
        else if( this.game_model == 3 )
        {
            this.is_target = this.target4.getBoundingBoxToWorld().contains(touch.touch.getLocation());
            if( !this.is_target ) return ;
        }
        // 水枪
        else if( this.game_model == 4 )
        {
            let callback_fun = function(res)
            {
                self.audioId_GM4 = cc.audioEngine.playEffect(res, true);
            }
            GameManger.Instacne.AudioEngine.loadAudio('步骤/洗船_泡泡水箱',callback_fun); // 音效

            let water = self.water.getComponent(sp.Skeleton);
            water.setAnimation( 0,"jet_2",true );   
            this.is_target = this.water.parent.getChildByName("splash_target6").getBoundingBoxToWorld().contains(touch.touch.getLocation());
            if( !this.is_target ) return ;

            //  触摸 杯子
            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"water_action",true );
            
            this.isTouchWater = true ;
        }
        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/fx_button~1");// 音效


    }
    isTouchWater = false ;
    onTouchMove (touch) {
        if( !this.is_Touch || !this.is_target) return ;
        
        // 涂鸦泡泡
        if( this.game_model == 2 )
        {

            this.arm_parent.setPosition(this.arm_parent.x + touch.getDelta().x ,this.arm_parent.y +  touch.getDelta().y);

            if( this.arm_parent.y < 340 * 1.2 ) this.arm_parent.y = 340 * 1.2  ;
            // 生成泡泡
            //1.把该点转成世界坐标（只能老爸转）
            var pos1 = this.target3.parent.convertToWorldSpaceAR(this.target3.position);
            let pos3 = this.scriptNode.getChildByName("clear_prefab").convertToNodeSpaceAR(pos1);
            let world_points = this.scriptNode.getChildByName("clear_prefab").getComponent(cc.PolygonCollider).world.points;
            let is_bubbles_parent = cc.Intersection.pointInPolygon(pos3,world_points); 
            if( is_bubbles_parent )
            {
                //2.把该点（世界坐标）转成节点坐标
                var pos2 = this.bubbles_parent.convertToNodeSpaceAR(pos1);
                let distance = 0 ;
                if( this.foam_pos !=null ) distance = pos2.sub(this.foam_pos).mag();
                if (distance > 50||this.foam_pos == null)
                {
                    let foam = cc.instantiate( this.foam );
                    foam.parent = this.bubbles_parent ;
                    foam.position = pos2 ;
                    foam.scale = 0.3 ;
                    let m = 7;
                    let n = 13;
                    let scale = Math.floor(Math.random()*(m-n+1)+n);
                    scale = scale / 10 ;
                    cc.tween( foam )
                    .to(0.2, { scale: scale })
                    .start();
                    this.foam_pos = pos2 ;
                }
            }
            // 下一步
            if(this.bubbles_parent.childrenCount>50)
            {
                this.onTouchEnd(touch);
            }
        }
        // 擦除泡泡
        else if( this.game_model == 3 )
        {
            if( !this.is_target ) return ;
            this.brush_parent.setPosition(this.brush_parent.x + touch.getDelta().x ,this.brush_parent.y +  touch.getDelta().y);

            if( this.brush_parent.y < -120 / 1.3  ) this.brush_parent.y = -120 / 1.3  ;
            

            // let  is_target = this.target.getBoundingBoxToWorld().contains(touch.touch.getLocation());
            let target5 = this.brush_parent.getChildByName("brush").getChildByName("splash_target5");
            let target5_WorldPos = target5.parent.convertToWorldSpaceAR(target5.position);
            let nodes = this.bubbles_parent.children ;
            for( let i = 0 ; i < nodes.length ; i++ )
            {
                let node = nodes[i];
                let WorldPos = node.parent.convertToWorldSpaceAR(node.position);
                // if(WorldPos.x < target5_WorldPos.x + 15 && WorldPos.x > target5_WorldPos.x - 15)
                // {
                //     node.opacity = 80 ;
                // }
                let distance = target5_WorldPos.sub(WorldPos).mag();
                if( distance < 120 )
                {
                    node.opacity = 80 ;
                }
            }

            // 下一步
            let isNext = true ;
            let childrens = this.bubbles_parent.children ;
            for( let i = 0 ; i < childrens.length ; i++ )
            {
                let node = childrens[i];
                if( node.opacity != 80 )
                {
                    isNext = false ;
                    continue ;
                }
            }
            if( isNext )
            {
                this.onTouchEnd(touch);
            }
        }
        // 水枪
        else if( this.game_model == 4 )
        {
            if( !this.is_target ) return ;
            
            if ( this.water_parent.y < -130 / 1.3  )  this.water_parent.y = -130 / 1.3  ;

            this.water_parent.setPosition(this.water_parent.x + touch.getDelta().x ,this.water_parent.y +  touch.getDelta().y);
            let splash_target7 = this.water.getChildByName("splash_target7");
            let splash_target7_WorldPos = splash_target7.parent.convertToWorldSpaceAR(splash_target7.position);
            let nodes = this.bubbles_parent.children ;
      
            for( let i = 0 ; i < nodes.length ; i++ )
            {
                let node = nodes[i];
                let WorldPos = node.parent.convertToWorldSpaceAR(node.position);
                // if(WorldPos.x < splash_target7_WorldPos.x + 15 && WorldPos.x > splash_target7_WorldPos.x - 15)
                // {
                //     node.destroy();
                // }
                let distance = splash_target7_WorldPos.sub(WorldPos).mag();
                if( distance < 150 )
                {
                    node.destroy();
                }
            }   

            let world_points = this.scriptNode.getChildByName("clear_prefab").getComponent(cc.PolygonCollider).world.points;
            let local_points = this.scriptNode.getChildByName("clear_prefab").convertToNodeSpaceAR(splash_target7_WorldPos);
            let is_bubbles_parent = cc.Intersection.pointInPolygon(cc.v2(local_points.x,local_points.y),world_points); 

            if( this.isTouchWater == is_bubbles_parent ) return ;
            this.isTouchWater = is_bubbles_parent ;
            if( this.isTouchWater )
            {
                let water = self.water.getComponent(sp.Skeleton);
                water.setAnimation( 0,"jet_2",true );  
            }
            else
            {
                let water = self.water.getComponent(sp.Skeleton);
                water.setAnimation( 0,"jet_1",true );  
            }

            if( this.bubbles_parent.childrenCount == 0 )
            {
                this.onTouchEnd(touch);
            }
        }

    }
    onTouchEnd (touch) {

        if( !this.is_Touch ) return ;

        // 泡泡
        if( this.game_model == 2 )
        {
            if( self.audioId_GM2 !=null )
            {
                cc.audioEngine.stopEffect(this.audioId_GM2);
                this.audioId_GM2 = null ;
            }

            this.is_target = false ;
            // let arm = this.arm.getComponent(sp.Skeleton);
            // arm.setAnimation( 0,"jet_2",true );
            this.target2.getChildByName("particle").active = false ; // 粒子
            // foam_action 触摸 杯子
            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"foam_idle",true );
            
            // 泡泡
            this.foam_pos = null;
            // 下一步
            if(this.bubbles_parent.childrenCount>50)
            {
                console.log( "this.bubbles_parent." , this.bubbles_parent.childrenCount );
                this.game_model ++ ;
                this.Init();
            }
            else
            {
                if(this.start_pos != null)
                {
                    // 没有移动到规定位置
                    this.is_Touch = false ;
                    cc.tween(this.arm_parent)
                    .to(0.3,{position:cc.v2(this.start_pos.x,this.start_pos.y)})
                    .call(() => {  
                        self.is_Touch = true ;
                    })
                    .start();
                }
            }
        }
        // 擦除
        else if( this.game_model == 3 )
        {
            let isNext = true ;
            let nodes = this.bubbles_parent.children ;
            for( let i = 0 ; i < nodes.length ; i++ )
            {
                let node = nodes[i];
                if( node.opacity != 80 )
                {
                    isNext = false ;
                    continue ;
                }
            }

            if( isNext )
            {
                this.game_model ++ ;
                this.Init();
            }
            else
            {
                if(this.brush_parent_start_pos == null)
                {
                    this.brush_parent_start_pos = new cc.Vec2(0,220);
                }
                // 没有移动到规定位置
                this.is_Touch = false ;
                cc.tween(this.brush_parent)
                .to(0.3,{position:cc.v2(this.brush_parent_start_pos.x,this.brush_parent_start_pos.y)})
                .call(() => {  
                    self.is_Touch = true ;
                })
                .start();
            }
        }
        // 水枪
        else if( this.game_model == 4 )
        {

            if( self.audioId_GM4 !=null )
            {
                cc.audioEngine.stopEffect(this.audioId_GM4);
                this.audioId_GM4 = null ;
            }

            //  触摸 杯子
            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"water_idle",true );
            // console.log( barrel )

            let water = self.water.getComponent(sp.Skeleton);
            water.setAnimation( 0,"jet_3",false );
            if( this.bubbles_parent.childrenCount == 0 )
            {
                this.game_model ++ ;
                this.Init();
                return ;
            }
            else
            {
                // 没有移动到规定位置
                this.is_Touch = false ;
                cc.tween(this.water_parent)
                .to(0.3,{position:cc.v2(this.water_parent_pos.x,this.water_parent_pos.y)})
                .call(() => {  
                    self.is_Touch = true ;
                })
                .start();
            }

        }

        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/拼图机械臂放错");// 音效
    }
}
