// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { puremvc } from "./puremvc/puremvc";
import StartUpCommand from "./StartUpCommand";


const {ccclass, property} = cc._decorator;
/**
* @App game is start .
*
*/
@ccclass
export default class App extends puremvc.Component {

    __start()
    {
        // 启动指令
        this.facade.registerCommand("__MSG_STARTUP__", StartUpCommand);
        this.facade.sendNotification("__MSG_STARTUP__");
    }

}
