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
import game from "./game";
const {ccclass, property} = cc._decorator;
let self ;
@ccclass
export default class scrol_splicing extends puremvc.Component {

    // @property(cc.Node)
    targetNodes:cc.Node = null;
    // zIndexs: number[] = [] ;
    __onLoad()
    {
        this.node.x = - cc.winSize.width/2;
    }
    
    Init (node:cc.Node) {
        self = this ;
        this.targetNodes = node ;
        this.setScrol_Splicing();

        // 引导
        let content = this.node.getChildByName("view").getChildByName("content");
        let nodes = content.children ;

        let index ;
        for( let i = 0 ; i < nodes.length;i++)
        {
            if(i==0) index = i;
            else
            {
                if( nodes[i].y > nodes[index].y )
                {
                    index = i;
                }
            }
        }
        let obj = {startNode:null,endNode:null};
        obj.startNode = nodes[index] ;
        obj.endNode = nodes[index].getComponent("moveNode").closeNodeName ;
        self.facade.sendNotification("guide_game",obj);
    }

    // 一键拼装
    OneClickAssembly()
    {   
        let content = self.node.getChildByName("view").getChildByName("content");
        let children = content.children;
        for( let i = children.length -1 ; i >= 0 ; i-- )
        {
            let node = children[i];
            if(node.getComponent("moveNode") == null)
            {
                console.log( "lqr 没有找到moveNode:"+i+"脚本" );
                continue;
            }
            node.getComponent("moveNode").OneClickAssembly() ;
        }
    }

    setScrol_Splicing()
    {
        let hopeW = 150;
        let hopeH = 150;
        let __hopeH = 120;
        let content = this.node.getChildByName("view").getChildByName("content");
        let children = this.targetNodes.children;
        content.height = children.length*hopeH;
        for( let i = children.length-1 ; i >= 0 ; i-- )
        {
            let node = children[i];
            node.parent = content;
        }
        let nodes = content.children ;

        // 打乱数组排序
        let zIndexs = [] ;
        for( let i = 0 ; i < nodes.length ; i++ )
        {
            zIndexs.push(i);
        }
        zIndexs.sort(function() {
            return (0.5-Math.random());
        });
        // this.zIndexs = zIndexs ;
        for( let i = 0 ; i < nodes.length ; i++ )
        {
            nodes[i].zIndex = zIndexs[i] ;
        }

        for( let i = 0 ; i < nodes.length ; i++ )
        {
            let node = nodes[i];
            let scale1 = hopeW / (node.width);
            let scale2 = __hopeH / (node.height);
            scale1 = scale1>scale2?scale2:scale1;
            node.scale = scale1;
            node.x = 0 ;
            node.y = - (zIndexs[i]+1)*hopeH+hopeH/2 - 50 ;
            node.getComponent("moveNode").setData(node.scale,node.position);
        }
    }

    updateScrol_Splicing()
    {
        let hopeH = 150;
        let content = self.node.getChildByName("view").getChildByName("content");
        let children = content.children;
        content.height = children.length*hopeH;
        if( children.length == 0)
        {
            game.Instacne.end_animation();
            return ;
        }
        for( let i = 0 ; i < children.length ; i++ )
        {
            let node = children[i];
            // let __hopeY = - (children.length-i)*hopeH+hopeH/2;
            let __hopeY = - (i+1) *hopeH+hopeH/2 - 50 ;
            if( node.getComponent("moveNode") == null )
            {
                console.log( "lqr node.getComponent( moveNode) == null" )
                continue;
            }
            node.getComponent("moveNode").isMove = false ;
            cc.tween(node)
            .to(0.3,{position:cc.v2(0,__hopeY)})
            .call(() => {  
                if( node.getComponent("moveNode") == null )
                {
                    console.log( "lqr call node.getComponent( moveNode) == null" )
                    return;
                }
                node.getComponent("moveNode").setData(node.scale,node.position);
            })
            .start();
        }
    }

    listNotificationInterests() : string[] {    
        return[
            "updateScrol_Splicing",
        ]
    }

    handleNotification(notification: puremvc.INotification){
        let msg: string = notification.getName();
        let body = notification.getBody();
        switch(msg){
            case  "updateScrol_Splicing":
                this.updateScrol_Splicing();
                break;
        }
    }
    
}
