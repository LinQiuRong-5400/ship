import { puremvc } from "../ScriptCore/puremvc/puremvc";
import selectProxy from "../Proxys/selectProxy";

// 游戏启动指令

export default class StartUpCommand extends puremvc.MacroCommand{
    initializeMacroCommand(){
        this.addSubCommand(RegisterCommand);
        // TODO 在此处执行初始化指令
        this.addSubCommand(JumpSceneCommand);
    }
}

// 注册 数据 

class RegisterCommand extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification){
        this.facade.registerProxy(new selectProxy("selectProxy"));
    }
}

// 跳转场景

class JumpSceneCommand extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification){
        cc.director.loadScene("loading");
    }
}
