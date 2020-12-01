
import { puremvc } from "../ScriptCore/puremvc/puremvc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class guide extends puremvc.Component {

    // shipWashing
    guide_shipWashing(body)
    {

        if( cc.sys.localStorage.getItem( "guide_shipWashing" ) == "true") return ;
        if( !this.isStop_guide_work ) this.isStop_guide_work = true ;

        let target = body ;
        let handTips = this.node.getChildByName("tip");

        //1.把该点转成世界坐标（只能老爸转）
        let pos1 = target.parent.convertToWorldSpaceAR(target.position);
        //2.把该点（世界坐标）转成节点坐标
        let start_pos = this.node.convertToNodeSpaceAR(pos1);
        handTips.setPosition(start_pos);

        let self = this ;
        cc.tween(handTips)
        .to(0.5,{position:cc.v3(-100,0,0)})
        .to(0.5,{position:cc.v3(100,0,0)})
        .call(() => {  
            self.guide_shipWashing(body);
        })
        .start();
    }
    stop_guide_shipWashing(body)
    {
        if( this.isStop_guide_work )
        {
            let handTips = this.node.getChildByName("tip")
            handTips.stopAllActions();
            handTips.y = 888 ;
            cc.sys.localStorage.setItem( "guide_shipWashing" , "true" );
        }
    }
    // work
    isStop_guide_work:boolean = false ;
    guide_work(body)
    {
        if( cc.sys.localStorage.getItem( "guide_work" ) == "true") return ;
        if( !this.isStop_guide_work ) this.isStop_guide_work = true ;
        this.node.getChildByName("tip").setPosition(cc.v3(0,0,0));
        let handTips = this.node.getChildByName("tip").getChildByName("handTips");
        let self = this ;
        handTips.angle = 0;
        handTips.stopAllActions();
        cc.tween(handTips)
        .to(1,{angle:8})
        .call(() => {  
            self.guide_work(body);
        })
        .start();
    }
    stop_guide_work(body)
    {
        if( this.isStop_guide_work )
        {
            this.node.getChildByName("tip").setPosition(cc.v3(0,888,0));
            let handTips = this.node.getChildByName("tip").getChildByName("handTips");
            handTips.stopAllActions();
            handTips.angle = 0 ;
            cc.sys.localStorage.setItem( "guide_work" , "true" );
        }
    }
    // comeOn
    isStop_guide_comeOn:boolean = false ;
    guide_comeOn(body)
    {
        if( cc.sys.localStorage.getItem( "guide_comeOn" ) == "true") return ;
        if( !this.isStop_guide_comeOn ) this.isStop_guide_comeOn = true ;

        //1.把该点转成世界坐标（只能老爸转）
        let pos1 = body.target.parent.convertToWorldSpaceAR(body.start_pos);
        //2.把该点（世界坐标）转成节点坐标
        let start_pos = this.node.convertToNodeSpaceAR(pos1);

        //1.把该点转成世界坐标（只能老爸转）
        let pos2 = body.target.parent.convertToWorldSpaceAR(body.end_pos);
        //2.把该点（世界坐标）转成节点坐标
        let end_pos = this.node.convertToNodeSpaceAR(pos2);
        end_pos = cc.v3( end_pos.x , end_pos.y , 0 );

        
        let handTips = this.node.getChildByName("tip");
        let self = this ;
        handTips.setPosition(start_pos);
        cc.tween(handTips)
        .to(1,{position:end_pos})
        .call(() => {  
            self.guide_comeOn(body);
        })
        .start();
    }
    stop_guide_comeOn(body)
    {
        if( this.isStop_guide_comeOn ) 
        {
            let handTips = this.node.getChildByName("tip")
            handTips.stopAllActions();
            handTips.y = 888 ;
            cc.sys.localStorage.setItem( "guide_comeOn" , "true" );
        }
    }
    // game
    guide_game(body)
    {
        if( cc.sys.localStorage.getItem( "guide_game" ) == "true") return ;

        if( !this.isStop_guide_game ) this.isStop_guide_game = true ;

        let handTips = this.node.getChildByName("tip");

        let startNode = body.startNode ;
        let endNode = body.endNode ;

        //1.把该点转成世界坐标（只能老爸转）
        let pos1 = startNode.parent.convertToWorldSpaceAR(startNode.position);
        //2.把该点（世界坐标）转成节点坐标
        let start_pos = this.node.convertToNodeSpaceAR(pos1);

        //1.把该点转成世界坐标（只能老爸转）
        let pos2 = endNode.parent.convertToWorldSpaceAR(endNode.position);
        //2.把该点（世界坐标）转成节点坐标
        let end_pos = this.node.convertToNodeSpaceAR(pos2);

        console.log()

        let self = this ;
        handTips.setPosition(start_pos);
        cc.tween(handTips)
        .to(1,{position:end_pos})
        .call(() => {  
            self.guide_game(body);
        })
        .start();

    }
    isStop_guide_game:boolean = false ;
    stop_guide_game(body)
    {
        if( this.isStop_guide_game ) 
        {
            let handTips = this.node.getChildByName("tip")
            handTips.stopAllActions();
            handTips.y = 888 ;
            cc.sys.localStorage.setItem( "guide_game" , "true" );
        }
    }
    // 接收消息
    listNotificationInterests() : string[] {    
        return[
            "guide_game",
            "stop_guide_game",
            "guide_comeOn",
            "stop_guide_comeOn",
            "guide_work",
            "stop_guide_work",
            "guide_shipWashing",
            "stop_guide_shipWashing",
        ]
    }

    handleNotification(notification: puremvc.INotification){
        let msg: string = notification.getName();
        let body = notification.getBody();
        switch(msg){
            case  "guide_game":
                this.guide_game(body);
                break;
            case  "stop_guide_game":
                this.stop_guide_game(body);
                break;
            case  "guide_comeOn":
                this.guide_comeOn(body);
                break;
            case  "stop_guide_comeOn":
                this.stop_guide_comeOn(body);
                break;
            case  "guide_work":
                this.guide_work(body);
                break;
            case  "stop_guide_work":
                this.stop_guide_work(body);
                break;
            case  "guide_shipWashing":
                this.guide_shipWashing(body);
                break;
            case  "stop_guide_shipWashing":
                this.stop_guide_shipWashing(body);
                break;
        }
    }
}
