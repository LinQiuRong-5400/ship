import { puremvc } from "./ScriptCore/puremvc/puremvc";
import GameManger from "./ScriptCore/common/GameManger";
const {ccclass, property} = cc._decorator;
@ccclass
export default class test_btn extends puremvc.Component {

    __start () {

    }

    showBanner()
    {
        // GameManger.Instacne.adsManger.ShowBanner();
        GameManger.Instacne.NativeControl_oppo.ShowNativeIconAd();
    }
    showInter()
    {
        // GameManger.Instacne.NativeControl_oppo.tianjiaZhuoMian();
        // GameManger.Instacne.NativeControl_oppo.ShowNativeInter();
        // GameManger.Instacne.adsManger.ShowInterstitial();
    }
    showVideo()
    {
        // GameManger.Instacne.NativeControl_oppo.hutuiShow();
        // cc.find("Canvas").getComponent("NativeControl_vivo").ShowNativeIcon();

        // let callBack = function(flags)
        // {
        //     console.log( "lqr.callBack -- lookVideo_GetRewards.flags："+flags );
        // }
        // GameManger.Instacne.adsManger.ShowVideo(callBack);
    }
}
