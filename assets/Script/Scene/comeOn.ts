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
import main from "../Scene/main";
import GameManger from "../ScriptCore/common/GameManger";

const {ccclass, property} = cc._decorator;
let self = null ;
@ccclass
export default class comeOn extends puremvc.Component {

    scriptName:string = "";
    initComeOn () {

        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;
        this.scriptName = "comeOn"+big_checkpoint+"_"+small_checkpoint;

        this.node.addComponent(this.scriptName);
        
        this.Ani_Model ++ ;
        self = this ;

        this.scriptNode = this.node.getChildByName("script");
        this.mask = this.scriptNode.getChildByName("mask");
        this.arm = this.scriptNode.getChildByName("mask").getChildByName("arm");
        this.target = this.scriptNode.getChildByName("mask").getChildByName("arm").getChildByName("splash_target");
        this.target2 = this.scriptNode.getChildByName("mask").getChildByName("arm").getChildByName("splash_target2");
        this.arm.active = false ;
        // 点击
        this.scriptNode.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan,this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
        this.scriptNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd,this);

        // this.Init();
    }
    Ani_Model:number = 0;
    arm :cc.Node = null ;
    target:cc.Node = null;
    target2:cc.Node = null;
    mask:cc.Node = null;
    scriptNode:cc.Node = null;
    Init () {

        if( this.Ani_Model == 1 )
        {
            // 机械臂
            let arm = this.arm.getComponent(sp.Skeleton);
            arm.node.active = true ;
            arm.setAnimation( 0,"appear",false );
            arm.addAnimation( 1,"userMove",false );
            arm.setCompleteListener(function(){
                // 
                self.start_pos = self.mask.position ;
                self.is_Touch = true ;
            });
            // 船 驶入动画
            this.node.getComponent(this.scriptName).shipAni_DriveIn();

            // GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/泊船到位");// 音效
            // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
            // console.log(arm.skeletonData.skeletonJson.animations);
            // console.log( "<<<<<<<   骨骼动画list   >>>>>>>" );
        }
        else if( this.Ani_Model == 2 )
        {
            this.scriptNode.getChildByName("btn_click").active = true ;
            this.isBtn_click = true ;
            this.scriptNode.getChildByName("btn_click").on("click",this.onBtn_click.bind(this));
        }
        else if( this.Ani_Model == 3 )
        {
            // 机械臂 
            // action 加油
            let arm = this.arm.getComponent(sp.Skeleton);
            arm.setAnimation( 0,"action",false );
            arm.setCompleteListener(function(){
            });

            this.isBtn_click = false ;
            let tankNode = this.scriptNode.parent.getChildByName("tank");
            let tank = tankNode.getComponent(sp.Skeleton);
            tank.setAnimation( 0,"action_1",false );
            tank.setCompleteListener(function(){
                self.isBtn_click = true ;
            });

        }
        else if( this.Ani_Model == 4 )
        {
            // 机械臂 
            // action 加油
            let arm = this.arm.getComponent(sp.Skeleton);
            arm.setAnimation( 0,"action",false );
            arm.setCompleteListener(function(){
            });

            this.isBtn_click = false ;
            let tankNode = this.node.getChildByName("tank");
            let tank = tankNode.getComponent(sp.Skeleton);
            tank.setAnimation( 0,"action_2",false );
            tank.setCompleteListener(function(){
                self.isBtn_click = true ;
            });
        }
        else if( this.Ani_Model == 5 )
        {
            // 机械臂 
            // action 加油
            let arm = this.arm.getComponent(sp.Skeleton);
            arm.setAnimation( 0,"action",false );
            arm.setCompleteListener(function(){
            });

            this.isBtn_click = false ;
            let tankNode = this.node.getChildByName("tank");
            let tank = tankNode.getComponent(sp.Skeleton);
            tank.setAnimation( 0,"action_3",false );
            tank.setCompleteListener(function(){
                self.isBtn_click = true ;
            });
        }
        else if( this.Ani_Model == 6 )
        {
            // 机械臂 
            // action 加油
            let arm = this.arm.getComponent(sp.Skeleton);
            arm.setAnimation( 0,"action",false );
            arm.setCompleteListener(function(){
                console.log( "arm Complete" )
            });
            // 加油箱
            this.isBtn_click = false ;
            let tankNode = this.node.getChildByName("tank");
            let tank = tankNode.getComponent(sp.Skeleton);
            tank.setAnimation( 0,"action_4",false );
            tank.setCompleteListener(function(){
                // console.log( "tank Complete" )
                self.Ani_Model++ ;
                self.Init();
            });
        }
        // 结束
        else if( this.Ani_Model == 7 )
        {
            // 船 驶出动画
            this.node.getComponent(this.scriptName).shipAni_DriveOut();
            
            // 机械臂 
            // action 加油
            // this.mask.setPosition(0,0);
            this.arm.setPosition(0,0);
            let arm = this.arm.getComponent(sp.Skeleton);
            arm.setAnimation( 0,"hide",false );
            arm.setCompleteListener(function(){
                // console.log( "arm Complete" )

            });
        }
        // 下一步骤
        else if( this.Ani_Model == 8 )
        {
            this.arm.active = false ;

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
                        console.log("lqr...main falsg :",falsg);
                        main.Instacne.GameModel++;
                        main.Instacne.Init();
                    }
                    GameManger.Instacne.NativeControl_oppo.ShowNativeInter(); // ad
                }
            }


            
            // if (cc.sys.platform == cc.sys.DESKTOP_BROWSER)
            // {
            //     main.Instacne.GameModel++;
            //     main.Instacne.Init();
            // }
        }

    }
    isBtn_click:boolean = false ;
    onBtn_click()
    {
        if( !this.isBtn_click ) return ;

        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/加油阀按下");// 音效
        this.Ani_Model++ ;
        this.Init();
    }
    start_pos:cc.Vec2 = null;
    is_Touch:Boolean = false;
    is_target:Boolean = false;
    onTouchBegan(touch)
    {
        if( !this.is_Touch ) return ;
        this.is_target = this.target.getBoundingBoxToWorld().contains(touch.touch.getLocation());

        this.facade.sendNotification("stop_guide_comeOn"); // 停止引导

        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/拼图机械臂拿起");// 音效
    }
    onTouchMove (touch) {
        if( !this.is_Touch || !this.is_target) return ;
        this.mask.setPosition(this.mask.x + touch.getDelta().x ,this.mask.y +  touch.getDelta().y);
        
        if( this.mask.y < 350 * 1.15 ) this.mask.y = 350 * 1.15 ;
        // this.onTouchPos = touch.touch.getLocation()
    }
    onTouchEnd (touch) {
        if( !this.is_Touch ) return ;
        this.is_target = false ;

        // 船 期望位置
        let hope_Pos = this.node.getComponent(this.scriptName).get_HopePos();

        //1.把该点转成世界坐标（只能老爸转）
        var pos1 = this.target2.parent.convertToWorldSpaceAR(this.target2.position);
        //2.把该点（世界坐标）转成节点坐标
        var pos2 = this.scriptNode.convertToNodeSpaceAR(pos1);
        let distance = pos2.sub(hope_Pos).mag();
        if( distance < 50 )
        {
            GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/拼图机械臂放对");// 音效

            //1.把该点转成世界坐标（只能老爸转）
            var pos3 = this.scriptNode.convertToWorldSpaceAR(hope_Pos);
            var pos4 = this.scriptNode.convertToWorldSpaceAR(this.mask.position);
            
            let xx = pos4.x + ( pos3.x - pos1.x );
            let yy = pos4.y + ( pos3.y - pos1.y );
            //2.把该点（世界坐标）转成节点坐标
            var pos5 = this.scriptNode.convertToNodeSpaceAR(cc.v2(xx,yy));

            this.is_Touch = false ;
            cc.tween(this.mask)
            .to(0.1,{position:pos5})
            .call(() => {  
                // console.log( "onTouchEnd finish" );
                self.Ani_Model ++;
                self.Init();
            })
            .start();
            return
        }

        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/拼图机械臂放错");// 音效

        // 没有移动到规定位置
        this.is_Touch = false ;
        cc.tween(this.mask)
        .to(0.3,{position:cc.v2(this.start_pos.x,this.start_pos.y)})
        .call(() => {  
            self.is_Touch = true ;
        })
        .start();
    }

    // 引导
    startGuide()
    {
        // 引导
        let end_pos = this.node.getComponent(this.scriptName).get_HopePos();
        //1.把该点转成世界坐标（只能老爸转）
        var pos1 = this.target.parent.convertToWorldSpaceAR(this.target.position);
        //2.把该点（世界坐标）转成节点坐标
        var start_pos = this.scriptNode.convertToNodeSpaceAR(pos1);
        let obj = {start_pos:null,end_pos:null,target:null};
        obj.start_pos = start_pos ;
        obj.end_pos = end_pos ;
        obj.target = this.scriptNode ;
        this.facade.sendNotification("guide_comeOn",obj); // 停止引导
    }
    
}
