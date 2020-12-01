
import { puremvc } from "../puremvc/puremvc";
import GameManger from "./GameManger";
const {ccclass, property} = cc._decorator;
@ccclass
export default class NativeView_oppo extends puremvc.Component {

    @property(cc.Node)
    private nativeBannerView:cc.Node = null;
    @property(cc.Node)
    private NativeInterView:cc.Node = null;
    @property(cc.Node)
    private NativeIconAdView:cc.Node = null;
    @property(cc.Node)
    private tianjiaZhuoMian:cc.Node = null;
    @property(cc.Node)
    private Btn_HuTui:cc.Node = null;
    __onLoad () {
        if(GameManger.Instacne.channel != "oppo") return ;
        if(this.nativeBannerView)
        {
            this.nativeBannerView.active = false ;
            GameManger.Instacne.NativeControl_oppo.addNode_nativeBannerView(this.nativeBannerView);
        }
        if(this.NativeInterView)
        {
            this.NativeInterView.active = false ;
            GameManger.Instacne.NativeControl_oppo.addNode_NativeInterView(this.NativeInterView);
        }
        if(this.NativeIconAdView)
        {
            this.NativeIconAdView.active = false ;
            GameManger.Instacne.NativeControl_oppo.addNode_nativeIconAdView(this.NativeIconAdView);
        }
        if(this.tianjiaZhuoMian)
        {
            if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
                return;
            }
            
            let self = this ;
            qg.hasShortcutInstalled({
            success: function (res) {
                // 判断图标未存在时，创建图标
                console.log("lqr.hasShortcutInstalled:::",res);
                if (res == true) {
                    self.tianjiaZhuoMian.active = false ;
                }
                else
                {
                    self.tianjiaZhuoMian.active = true ;
                }
            },
            fail: function (err) { },
            complete: function () { }
            })

            this.tianjiaZhuoMian.on(cc.Node.EventType.TOUCH_END, ()=>{
                self.tianjiaZhuoMian.active = false ;
                GameManger.Instacne.NativeControl_oppo.tianjiaZhuoMian();
            }, this);
        }
        if(this.Btn_HuTui)
        {
            if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
            {
                return  this.Btn_HuTui.active = false ;
            }
            else
            {

            }

            this.Btn_HuTui.active = GameManger.Instacne.NativeControl_oppo.HuTuiIsShow ;
            if(!GameManger.Instacne.NativeControl_oppo.HuTuiIsShow) return  
            this.Btn_HuTui.on(cc.Node.EventType.TOUCH_END, ()=>{
                GameManger.Instacne.NativeControl_oppo.hutuiShow();
            }, this);
        }
    }
    
    __updateView()
    {
        if(!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) return  this.Btn_HuTui.active = false ;
        this.Btn_HuTui.active = GameManger.Instacne.NativeControl_oppo.HuTuiIsShow ;
        if(!GameManger.Instacne.NativeControl_oppo.HuTuiIsShow) return  
        this.Btn_HuTui.on(cc.Node.EventType.TOUCH_END, ()=>{
            GameManger.Instacne.NativeControl_oppo.hutuiShow();
        }, this);
    }
    __onDestroy () {
        if(GameManger.Instacne.channel != "oppo") return ;
        GameManger.Instacne.NativeControl_oppo.deleNode_nativeBannerView();
        GameManger.Instacne.NativeControl_oppo.deleNode_NativeInterView();
        GameManger.Instacne.NativeControl_oppo.deleNode_nativeIconAdView();
    }
}
