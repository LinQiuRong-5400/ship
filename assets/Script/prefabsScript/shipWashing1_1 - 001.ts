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
const {ccclass, property} = cc._decorator;
let self = null ;
@ccclass
export default class shipWashing1 extends puremvc.Component {

    g13_dock_2:cc.Node = null;

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
    __onLoad () {
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
        this.target4 = this.brush.getChildByName("splash_target4");
        // 水枪
        this.water_parent = this.scriptNode.getChildByName("water_parent");
        this.water = this.water_parent.getChildByName("water");

        this.game_model ++ ;

        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        // 加载骨骼动画 
        cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint + 
        '/g13_dock_2', sp.SkeletonData,(err,res)=>{
            if( err ) console.log( "ship_ani g13_dock_2 load err" , err );
            if( err ) return ;
            let node = new cc.Node("g13_dock_2");
            node.parent = self.scriptNode.getChildByName("ship") ;
            node.addComponent(sp.Skeleton);
            let spine = node.getComponent(sp.Skeleton);
            // spine.premultipliedAlpha = false ;
            spine.skeletonData = res;
            node.active = false ;
            self.g13_dock_2 = node ; 
            node.zIndex = 1 ;

        });

        // 点击
        this.scriptNode.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan,this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd,this);

        this.Init();

    }

    Init () {

        if( this.g13_dock_2 == null  )
        {
            this.scheduleOnce(this.Init.bind(this),0.2 );
            return ;
        }

        if( this.game_model == 1 )
        {
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
            // 船
            let g13_dock_2 = this.g13_dock_2.getComponent(sp.Skeleton);
            g13_dock_2.node.active = true ;
            // g13_dock_2.node.y = -50 ;
            g13_dock_2.setAnimation( 0,"dock_swimin_2",false );
            let index = true ;
            g13_dock_2.setCompleteListener(function(){
                if( !index ) return;
                index = false ;
                self.game_model ++ ;
                self.Init();
            });
            // foam_appear 杯子 初始
            // foam_idle 正常
            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"foam_appear",false );
            barrel.addAnimation( 1,"foam_idle",true );

            // foam_hide 杯子 完成
            // let barrel = this.barrel.getComponent(sp.Skeleton);
            // barrel.setAnimation( 0,"foam_hide",false );
        }
        else if( this.game_model == 2 )
        {
            let g13_dock_2 = this.g13_dock_2.getComponent(sp.Skeleton);
            g13_dock_2.setAnimation( 0,"dock_liftup_1",false );
            g13_dock_2.setCompleteListener(function(){
                self.is_Touch = true ;
            });

            // lift up
            let bg_tech_lift = this.scriptNode.getChildByName("bg_tech_lift").getComponent(sp.Skeleton);
            bg_tech_lift.node.active = true ;
            bg_tech_lift.setAnimation( 0,"liftup",false );
        }
        else if( this.game_model == 3 )
        {
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

            // console.log( this.game_model , "this.game_model" );

            // appear 启动
            // action 正常
            // hide  退出
            // idle 消除
            // userMove 字节移动

        }
        else if( this.game_model == 4 )
        {
            this.is_Touch = false ;
            cc.tween(this.brush_parent)
            .to(0.5,{position:cc.v2(this.brush_parent.x+2000,this.brush_parent.y)})
            .call(()=>{
                self.is_Touch = true ;
                self.water_parent.active = true ;

                let water = self.water.getComponent(sp.Skeleton);
                water.setAnimation( 0,"jet_3",false );

                self.water_parent.setPosition(350+1000,20);
                cc.tween(self.water_parent)
                .to(0.3,{position:cc.v2(350,20)})
                .start()

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
            cc.tween(self.water_parent)
            .to(0.3,{position:cc.v2(1350,20)})
            .call(()=>{
                self.game_model ++ ;
                self.Init();
            })
            .start()
        }
        else if( this.game_model == 6 )
        {
            cc.director.loadScene("select");
        }
    }
    brush_parent_start_pos:cc.Vec2 = null;

    start_pos:cc.Vec2 = null;
    is_Touch:Boolean = false;
    is_target:Boolean = false;

    foam_pos:cc.Vec2 = null;
    onTouchBegan(touch)
    {
        if( !this.is_Touch ) return ;

        // 泡泡
        if( this.game_model == 2 )
        {
            this.is_target = this.target.getBoundingBoxToWorld().contains(touch.touch.getLocation());
            if( !this.is_target ) return ;
            this.target2.getChildByName("particle").active = true ;
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
            let water = self.water.getComponent(sp.Skeleton);
            water.setAnimation( 0,"jet_2",true );   
            this.is_target = this.water.getChildByName("splash_target6").getBoundingBoxToWorld().contains(touch.touch.getLocation());
            if( !this.is_target ) return ;
        }

    }
    onTouchMove (touch) {
        if( !this.is_Touch || !this.is_target) return ;
        
        // 涂鸦泡泡
        if( this.game_model == 2 )
        {
            this.arm_parent.setPosition(this.arm_parent.x + touch.getDelta().x ,this.arm_parent.y +  touch.getDelta().y);
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
                    cc.tween( foam )
                    .to(0.2, { scale: 1 })
                    .start();
                    this.foam_pos = pos2 ;
                }
            }
        }
        // 擦除泡泡
        else if( this.game_model == 3 )
        {
            if( !this.is_target ) return ;
            this.brush_parent.setPosition(this.brush_parent.x + touch.getDelta().x ,this.brush_parent.y +  touch.getDelta().y);

            // let  is_target = this.target.getBoundingBoxToWorld().contains(touch.touch.getLocation());
            let target5 = this.brush_parent.getChildByName("brush").getChildByName("splash_target5");
            let target5_WorldPos = target5.parent.convertToWorldSpaceAR(target5.position);
            let nodes = this.bubbles_parent.children ;
            for( let i = 0 ; i < nodes.length ; i++ )
            {
                let node = nodes[i];
                let WorldPos = node.parent.convertToWorldSpaceAR(node.position);
                if(WorldPos.x < target5_WorldPos.x + 15 && WorldPos.x > target5_WorldPos.x - 15)
                {
                    node.opacity = 80 ;
                }
                // let distance = target5_WorldPos.sub(WorldPos).mag();
                // if( distance < 80 )
                // {
                //     node.opacity = 80 ;
                // }
            }
        }
        // 水枪
        else if( this.game_model == 4 )
        {
            if( !this.is_target ) return ;
            this.water_parent.setPosition(this.water_parent.x + touch.getDelta().x ,this.water_parent.y +  touch.getDelta().y);
            let splash_target7 = this.water.getChildByName("splash_target7");
            let splash_target7_WorldPos = splash_target7.parent.convertToWorldSpaceAR(splash_target7.position);
            let nodes = this.bubbles_parent.children ;
            for( let i = 0 ; i < nodes.length ; i++ )
            {
                let node = nodes[i];
                let WorldPos = node.parent.convertToWorldSpaceAR(node.position);
                let distance = splash_target7_WorldPos.sub(WorldPos).mag();
                if( distance < 80 )
                {
                    node.destroy();
                }
            }
        }

    }
    onTouchEnd (touch) {

        if( !this.is_Touch ) return ;

        if( this.game_model == 2 )
        {
            this.is_target = false ;
            this.target2.getChildByName("particle").active = false ;
            // foam_action 触摸 杯子
            let barrel = this.barrel.getComponent(sp.Skeleton);
            barrel.setAnimation( 0,"foam_idle",true );
            
            // 泡泡
            this.foam_pos = null;
            // 下一步
            if(this.bubbles_parent.childrenCount>100)
            {
                console.log( "this.bubbles_parent." , this.bubbles_parent.childrenCount );
                this.game_model ++ ;
                this.Init();
            }
            else
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
            let water = self.water.getComponent(sp.Skeleton);
            water.setAnimation( 0,"jet_3",false );
            if( this.bubbles_parent.childrenCount == 0 )
            {
                this.game_model ++ ;
                this.Init();
            }
        }
    }

    // update (dt) {}
}
