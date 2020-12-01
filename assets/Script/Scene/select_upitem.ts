// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { puremvc } from "../ScriptCore/puremvc/puremvc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class select_upitem extends puremvc.Component {

    scale_size :number = 0.3;
    angle_step :number = 12;
    __onLoad()
    {
        this.angle_step = this.node.parent.getComponent("select_gq").angle_step ;
    }
    update (dt) {
        let angle = this.node.angle + this.node.parent.angle ;
        angle = Math.abs(angle);
        if( angle > this.angle_step ) angle = this.angle_step ;
        let sca = angle / this.angle_step * this.scale_size ;
        this.node.getChildByName("item").scale = 1 - sca ;
    }
}
