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
import GameManger from "../ScriptCore/common/GameManger";
import game from "./game";


const {ccclass, property} = cc._decorator;

@ccclass
export default class moveNode extends puremvc.Component {

    @property(cc.Node)
    closeNodeName:cc.Node = null;
    @property(cc.Integer)
    disance:Number = 50;
    startPos:cc.Vec3;
    moveTarget:cc.Node = null; 
    targetNodes:cc.Node = null;
    isMove:Boolean = false ;

    __onLoad () {
        this.moveTarget = cc.find("Canvas/moveTarget");
        this.startPos = this.node.position ;
        this.targetNodes = this.node.parent ;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd,this);
        let childs = this.node.parent.children;
        for(let i = 0; i < childs.length; i++)
        {
            if(childs[i].name == this.node.name)
            {
                this.node.name = i.toString() ;
            }
        }
    }
    touchPos:cc.Vec2;
    onTouchBegan( touch )
    {
        if( !this.isMove ) return ;

        this.facade.sendNotification("stop_guide_game",); // 停止引导

        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/fx_button~1");// 音效

        this.touchPos = touch.getLocation();

        //1.把该点转成世界坐标（只能老爸转）
        var pos1 = this.node.parent.convertToWorldSpaceAR(this.node.position);
        //2.把该点（世界坐标）转成节点坐标
        var pos2 = this.moveTarget.convertToNodeSpaceAR(pos1);
        this.node.parent = this.moveTarget;
        this.node.setPosition(pos2);

        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/拼图机械臂拿起");// 音效

        // 缩放动作
        cc.tween(this.node)
        .to(0.3,{scale:1})
        .start();
    }
    onTouchMove( touch )
    {
        if( !this.isMove ) return ;
        let deviationX = touch.getLocation().x - this.touchPos.x ;
        let deviationY = touch.getLocation().y - this.touchPos.y ;
        this.touchPos = touch.getLocation();
        this.node.setPosition(cc.v2( this.node.x + deviationX, this.node.y + deviationY));

        //1.把该点转成世界坐标（只能老爸转）
        var pos1 = this.targetNodes.convertToWorldSpaceAR(this.startPos);
        //2.把该点（世界坐标）转成节点坐标
        var pos2 = this.moveTarget.convertToNodeSpaceAR(pos1);
        let distance = pos2.sub(this.node.position).mag();
        if( distance < this.disance )
        {
            GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/拼图机械臂放对");// 音效

            this.isMove = false ;
            let self = this ;
            cc.tween(this.node)
            .to(0.3,{position:pos2})
            .call(() => {  
                //1.把该点转成世界坐标（只能老爸转）
                let pos1 = self.node.parent.convertToWorldSpaceAR(self.node.position);
                //2.把该点（世界坐标）转成节点坐标
                let pos2 = self.targetNodes.convertToNodeSpaceAR(pos1);
                self.node.parent = self.targetNodes ;
                self.node.setPosition(pos2);
                self.facade.sendNotification("updateScrol_Splicing",);

                self.node.zIndex = Number(self.node.name);

                if( self.closeNodeName != null )
                {
                    self.closeNodeName.active = false ;
                }
            })
            .start();
        }
    }
    onTouchEnd( touch )
    {
        if( !this.isMove ) return ;

        this.isMove = false ;
        //1.把该点转成世界坐标（只能老爸转）
        let pos1 = this.ItemParent.convertToWorldSpaceAR(this.ItemPos);
        //2.把该点（世界坐标）转成节点坐标
        let pos2 = this.node.parent.convertToNodeSpaceAR(pos1);
        
        GameManger.Instacne.AudioEngine.playAudioByUrl("步骤/拼图机械臂放错");// 音效
        
        let self = this ;
        cc.tween(this.node)
        .to(0.3,{scale:this.ItemScale,position:pos2})
        .call(() => {  
            self.node.parent = self.ItemParent ;
            self.node.position = cc.v3(self.ItemPos.x,self.ItemPos.y,0);
            self.isMove = true ;
        })
        .start();
    }
    ItemScale:Number = 50;
    ItemPos:cc.Vec2;
    ItemParent:cc.Node = null;
    setData(scale:Number,pos:cc.Vec2,)
    {
        this.isMove = true ;
        this.ItemScale = scale ;
        this.ItemPos = pos ;
        this.ItemParent = this.node.parent ;
    }
    __onDestroy()
    {

    }
    // 一键拼装
    OneClickAssembly()
    {
        this.facade.sendNotification("stop_guide_game",); // 停止引导

        //1.把该点转成世界坐标（只能老爸转）
        var __pos1 = this.node.parent.convertToWorldSpaceAR(this.node.position);
        //2.把该点（世界坐标）转成节点坐标
        var __pos2 = this.moveTarget.convertToNodeSpaceAR(__pos1);
        this.node.parent = this.moveTarget;
        this.node.setPosition(__pos2);

        //1.把该点转成世界坐标（只能老爸转）
        var pos1 = this.targetNodes.convertToWorldSpaceAR(this.startPos);
        //2.把该点（世界坐标）转成节点坐标
        var pos2 = this.moveTarget.convertToNodeSpaceAR(pos1);
        // let distance = pos2.sub(this.node.position).mag();
        // if( distance < this.disance )
        // {
            this.isMove = false ;
            let self = this ;
            cc.tween(this.node)
            .to(1,{position:pos2,scale:1})
            .call(() => {  
                //1.把该点转成世界坐标（只能老爸转）
                let pos1 = self.node.parent.convertToWorldSpaceAR(self.node.position);
                //2.把该点（世界坐标）转成节点坐标
                let pos2 = self.targetNodes.convertToNodeSpaceAR(pos1);
                self.node.parent = self.targetNodes ;
                self.node.setPosition(pos2);
                self.node.zIndex = Number(self.node.name);

                if( self.closeNodeName != null )
                {
                    self.closeNodeName.active = false ;
                }
                game.Instacne.end_animation();
                // self.facade.sendNotification("updateScrol_Splicing",);
            })
            .start();
    }
}
