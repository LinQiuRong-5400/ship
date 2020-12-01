// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { puremvc } from "../puremvc/puremvc";
import GameManger from "./GameManger";

const {ccclass, property} = cc._decorator;
let self ;
@ccclass
export default class NativeControl_vivo extends puremvc.Component {

    // 初始化
    __onLoad()
    {
        self = this ;
        if(GameManger.Instacne.channel != "vivo") return ;
    }
    public addListen_NativeBannerView(node:cc.Node)
    {
        this.nativeBannerView = node ;
        if( this.nativeBannerView == null ) return ;
        let banner_btn_close = this.nativeBannerView.getChildByName("btn_close");
        banner_btn_close.on(cc.Node.EventType.TOUCH_END, this.NativeBanner_closeBanner, this);
        let banner_target_size = this.nativeBannerView.getChildByName("target_size");
        for( let i = 0 ; i < banner_target_size.children.length ; i++ )
        {
            banner_target_size.children[i].on(cc.Node.EventType.TOUCH_END, this.NativeBanner_clickBanner, this);
        }
    }
    public removeListen_NativeBannerView()
    {
        this.nativeBannerView = null ;
    }
    public addListen_NativeInterView(node:cc.Node)
    {
        this.NativeInterView = node ;
        if( this.NativeInterView == null ) return ;
        let inter_btn_close = this.NativeInterView.getChildByName("btn_close");
        inter_btn_close.on(cc.Node.EventType.TOUCH_END, this.NativeInter_closeBanner, this);
        let inter_target_size = this.NativeInterView.getChildByName("target_size");
        for( let i = 0 ; i < inter_target_size.children.length ; i++ )
        {
            inter_target_size.children[i].on(cc.Node.EventType.TOUCH_END, this.NativeInter_clickBanner, this);
        }
    }
    public removeListen_NativeInterView()
    {
        this.NativeInterView = null ;
    }
    public addListen_NativeIconView(node:cc.Node)
    {
        this.NativeIconView = node ;
        if( this.NativeIconView == null ) return ;
        let icon_btn_close = this.NativeIconView.getChildByName("btn_close");
        icon_btn_close.on(cc.Node.EventType.TOUCH_END, this.NativeIcon_closeBanner, this);
        let icon_target_size = this.NativeIconView.getChildByName("target_size");
        for( let i = 0 ; i < icon_target_size.children.length ; i++ )
        {
            icon_target_size.children[i].on(cc.Node.EventType.TOUCH_END, this.NativeIcon_clickBanner, this);
        }
    }
    public removeListen_NativeIconView()
    {
        this.NativeIconView = null ;
    }
    // 结束回调 
    __onDestroy()
    {

    }

    // --------------------------- baner -----------------------------------
    // @property(cc.Node)
    nativeBannerView:cc.Node = null;
    NativeBanner_ID:string = "";
    public ShowNativeBanner()
    {
        if(GameManger.Instacne.channel != "vivo") return ;
        if(GameManger.Instacne.channel == "vivo")
        {
            self.NativeBanner_ID = "";
            this.NativeBanner_load(this.NativeBanner_loadOk_Callback);
        }
    }
    public HideNativeBanner()
    {
        if(GameManger.Instacne.channel != "vivo") return ;
        if(GameManger.Instacne.channel == "vivo")
        {
            this.nativeBannerView.active = false ;
        }
    }
    private NativeBanner_loadOk_Callback(obj)
    {
        console.log("lqr.","<<<<<<<<<< NativeBanner start >>>>>>>>>");
        for(let key in obj)
        {
            console.log("lqr.adList.key:",key,":lqr.value:",obj[key]);
        }
        console.log("lqr.","<<<<<<<<<< NativeBanner end >>>>>>>>>");

        // 关闭广告
        GameManger.Instacne.adsManger.HideBanner(); 

        // 展示界面
        self.nativeBannerView.active = true;
        // 加载 icon
        cc.loader.load(obj["icon"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let icon = self.nativeBannerView.getChildByName("icon").getComponent(cc.Sprite);
            icon.spriteFrame = new cc.SpriteFrame(texture);
        });
        // 加载 image
        cc.loader.load(obj["imgUrlList"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let image = self.nativeBannerView.getChildByName("image").getComponent(cc.Sprite);
            image.spriteFrame = new cc.SpriteFrame(texture);
        });
        
        // title 文本
        let title = self.nativeBannerView.getChildByName("title").getComponent(cc.Label);
        title.string = obj["title"];
        // desc 文本
        let desc = self.nativeBannerView.getChildByName("desc").getComponent(cc.Label);
        desc.string = obj["desc"];
        // click_ID
        self.NativeBanner_ID = obj["adId"];
    }
    private NativeBanner_closeBanner()
    {
        this.nativeBannerView.active = false ;
    }
    private NativeBanner_clickBanner()
    {
        if(self.NativeBanner_ID == "") return console.log("id == null ");
        console.log("lqr.vivo原生banner","NativeBanner_Click",self.NativeBanner_ID);
        self.nativeBannerAd.reportAdClick({
            adId: self.NativeBanner_ID,
        });
    }
    private NativeBanner_loadFail_Callback()
    {
        // 展示广告
        GameManger.Instacne.adsManger.ShowBanner(); 
    }
    // 加载原生banner广告
    VIVONativeBannerId:string = "d56493b8173c4f18b561f2707abcf9cc";
    nativeBannerAd = null ;
    private NativeBanner_load(func:Function)
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) return;
        let platformVersionCode = qg.getSystemInfoSync().platformVersionCode;
        if ( platformVersionCode < 1052)  return console.log("lqr.platformVersionCode:"+platformVersionCode);
        let that = this;
        this.nativeBannerAd = qg.createNativeAd({
            posId: that.VIVONativeBannerId,
        });

        this.nativeBannerAd && this.nativeBannerAd.onLoad(function(res) {
            let nativeCurrentAd;
            if (res && res.adList){
                nativeCurrentAd = res.adList.pop();
                func(nativeCurrentAd);
                that.nativeBannerAd.reportAdShow({
                    adId: nativeCurrentAd.adId.toString()
                });
            }
        });
        this.nativeBannerAd.onError(function(err) {
            console.log("lqr","vivo.nativeBannerAd.errMsg",err.errMsg);
            self.NativeBanner_loadFail_Callback();
        });
        this.nativeBannerAd.load();

    }
    // ------------------------------- Interstitial -------------------------------
    // Interstitial
    // @property(cc.Node)
    NativeInterView:cc.Node = null;
    NativeInter_ID:string = "";
    public ShowNativeInter()
    {
        if(GameManger.Instacne.channel != "vivo") return ;
        if(GameManger.Instacne.channel == "vivo")
        {
            self.NativeInter_ID = "";
            this.NativeInterstitial_load(this.NativeInter_loadOk_Callback);
        }
    }
    private NativeInter_loadOk_Callback(obj)
    {
        console.log("lqr.","<<<<<<<<<< NativeInter start >>>>>>>>>");
        for(let key in obj)
        {
            console.log("lqr.adList.key:",key,":lqr.value:",obj[key]);
        }
        console.log("lqr.","<<<<<<<<<< NativeInter end >>>>>>>>>");

        // 加载 icon
        cc.loader.load(obj["icon"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let icon = self.NativeInterView.getChildByName("icon").getComponent(cc.Sprite);
            icon.spriteFrame = new cc.SpriteFrame(texture);
        });
        // 加载 image
        cc.loader.load(obj["imgUrlList"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let image = self.NativeInterView.getChildByName("image").getComponent(cc.Sprite);
            image.spriteFrame = new cc.SpriteFrame(texture);
        });
        // 点击id
        self.NativeInter_ID = obj["adId"];
        // title 文本
        let title = self.NativeInterView.getChildByName("title").getComponent(cc.Label);
        title.string = obj["title"];
        // desc 文本
        let desc = self.NativeInterView.getChildByName("desc").getComponent(cc.Label);
        desc.string = obj["desc"];
        // 展示界面
        self.NativeInterView.active = true ;
    }
    private NativeInter_closeBanner()
    {
        this.NativeInterView.active = false ;
    }
    private NativeInter_clickBanner()
    {
        if(self.NativeInter_ID == "") return console.log("id == null ");
        console.log("lqr","vivo原生 NativeInterstitial_Click",self.NativeInter_ID);
        self.nativeInterAd.reportAdClick({
            adId: self.NativeInter_ID,
        });
    }
    private NativeInter_loadFail_Callback()
    {
        // 展示插屏广告
        GameManger.Instacne.adsManger.ShowInterstitial(); 
    }
    // 展示原生插屏广告
    VIVONativeInterId:string = "89f104127c1547b485e077eed696bf0f";
    nativeInterAd = null ;
    private NativeInterstitial_load(func)
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) return;
        let platformVersionCode = qg.getSystemInfoSync().platformVersionCode;
        if ( platformVersionCode < 1052)  return console.log("lqr.platformVersionCode:"+platformVersionCode);
        let that = this;
        this.nativeInterAd = qg.createNativeAd({
            posId: that.VIVONativeInterId,
        });
        this.nativeInterAd.onLoad(function(res) {
            let nativeCurrentAd;
            if (res && res.adList){
                console.log("lqr","vivo.nativeInterAd.res",res);
                nativeCurrentAd = res.adList.pop();
                func(nativeCurrentAd);
                that.nativeInterAd.reportAdShow({
                    adId: nativeCurrentAd.adId.toString()
                });
            }
        });
        this.nativeInterAd.onError(function(err) 
        {
            console.log("lqr","vivo.nativeInterAd.errMsg",err.errMsg);
            self.NativeInter_loadFail_Callback();
        });
        this.nativeInterAd.load();
    }
    // ---------------- 暂时没用到 --------------------------
    // -------------------------- NativeIcon ------------------------------------
    // @property(cc.Node)
    NativeIconView:cc.Node = null;
    NativeIcon_ID:string = "";
    public ShowNativeIcon()
    {
        if(GameManger.Instacne.channel != "vivo") return ;
        if(GameManger.Instacne.channel == "vivo")
        {
            self.NativeIcon_ID = "";
            this.NativeIcon_load(this.NativeIcon_loadOk_Callback);
        }
    }
    public HideNativeIcon()
    {
        if(GameManger.Instacne.channel != "vivo") return ;
        if(GameManger.Instacne.channel == "vivo")
        {
            this.NativeIconView.active = false ;
        }
    }
    private NativeIcon_loadOk_Callback(obj)
    {
        // 关闭广告
        console.log("lqr.","<<<<<<<<<< NativeIcon start >>>>>>>>>");
        for(let key in obj)
        {
            console.log("lqr.adList.key:",key,":lqr.value:",obj[key]);
        }
        console.log("lqr.","<<<<<<<<<< NativeIcon end >>>>>>>>>");
        // 加载 icon
        cc.loader.load(obj["icon"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let icon = self.NativeIconView.getChildByName("icon").getComponent(cc.Sprite);
            icon.spriteFrame = new cc.SpriteFrame(texture);
        });
        // 加载 image
        cc.loader.load(obj["imgUrlList"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let image = self.NativeIconView.getChildByName("image").getComponent(cc.Sprite);
            image.spriteFrame = new cc.SpriteFrame(texture);
        });
        // 点击id
        self.NativeInter_ID = obj["adId"];
        // title 文本
        let title = self.NativeIconView.getChildByName("title").getComponent(cc.Label);
        title.string = obj["title"];
        // desc 文本
        let desc = self.NativeIconView.getChildByName("desc").getComponent(cc.Label);
        desc.string = obj["desc"];
        // 展示界面
        self.NativeIconView.active = true ;
    }
    private NativeIcon_closeBanner()
    {
        self.NativeIconView.active = false ;
    }
    private NativeIcon_clickBanner()
    {
        if(self.NativeIcon_ID == "") return console.log("id == null ");
        console.log("lqr.vivo原生Interstitial","ShowNativeInterstitial_Click",self.NativeIcon_ID);
        this.nativeIconAd.reportAdClick({
            adId: self.NativeIcon_ID
        });
    }
    private NativeIcon_loadFail_Callback()
    {
        console.log( "lqr.NativeIcon_loadFail_Callback" );
    }
    VIVONativeIconId:string = "cf55b94c40be465c949e1ae805d82956";
    nativeIconAd = null;
    // 展示原生植入广告
    private NativeIcon_load(func)
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        let platformVersionCode = qg.getSystemInfoSync().platformVersionCode;
        if ( platformVersionCode < 1052)  return console.log("lqr.platformVersionCode:"+platformVersionCode);
        let that = this;
        this.nativeIconAd = qg.createNativeAd({
            posId: that.VIVONativeIconId,
        });
        this.nativeIconAd.onLoad(function(res) {
            let nativeCurrentAd;
            if (res && res.adList){
                nativeCurrentAd = res.adList.pop();
                func(nativeCurrentAd);
                that.nativeIconAd.reportAdShow({
                    adId: nativeCurrentAd.adId.toString()
                });
            }
        });
        this.nativeIconAd.onError(function(err) 
        {
            console.log("lqr","vivo.ShowNativeIcon_Err",err.errMsg);
            self.NativeIcon_loadFail_Callback();
        });
        this.nativeIconAd.load();
    }
}
