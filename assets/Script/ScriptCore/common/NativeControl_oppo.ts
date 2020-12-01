

import { puremvc } from "../puremvc/puremvc";
import GameManger from "./GameManger";

const {ccclass, property} = cc._decorator;

let self ;
@ccclass
export default class NativeControl_oppo extends puremvc.Component {

    __onLoad () {
        self = this ;
        if(GameManger.Instacne.channel != "oppo") return ;
        GameManger.Instacne.NativeControl_oppo = this ;
        this.getUserIp();
        this.HuTuiInit();

        // let url = "https://adsfs.heytapimage.com/ads-material-depot/image/b6bab331d541a1c62a683b64b5b65e9f.jpg?region=cn-north-1&x-ocs-process=image%2fresize%2cm_fix%2cw_640%2ch_320%2ffallback";
        // let arr = url.split("?"); 
        // console.log(arr[0]);

        // this.scheduleOnce(this.NativeInter_loadOk_Callback,10);
    }
    public oppoAd_Type:boolean = false ; // oppo 渠道 是否开始骚操作 默认不开启
    public oppo_userIP_is_GD:boolean = true ; // oppo 渠道 用户默认是广东的
    public is60Timer = false ; // 60 是否到了
    public isShowMoreGame = false ; // 是否展示 更多游戏
    public red_icon = false ; // 红点
    public __startShowBanner(obj:Object)
    {
        if(GameManger.Instacne.channel != "oppo") return ;
        this.oppoAd_Type = obj.oppoAd_Type ;
        // 默认开启，如果json是关闭屏蔽广东的，则必须关闭 ；
        if(obj.oppo_userIP_is_GD != null && obj.oppo_userIP_is_GD == false) 
        GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD = false;

        console.log("lqr...ad 时间是:"+obj.oppoAdTimer+"oppoAd_Type:"+this.oppoAd_Type,"oppo_userIP_is_GD:",obj.oppo_userIP_is_GD);
        
        let callBack = function()
        {
            console.log("lqr.__startShowBanner");
            this.is60Timer = true ;
            this.__updaBanner();
            this.schedule(this.__updaBanner.bind(this),30);
        }
        this.scheduleOnce(callBack.bind(this),obj.oppoAdTimer);
        // this.scheduleOnce(callBack.bind(this),5);
    }

    private __updaBanner()
    {
        console.log("lqr.__updaBanner");
        if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
        {
            if(this.NativeInterView&&this.NativeInterView.active) return ;
            if( this.isShowMoreGame ) return ;
        }
        GameManger.Instacne.adsManger.ShowBanner();
    }
    // ------------------------------- IconAd -------------------------------
    private nativeIconAdView:cc.Node = null;
    public addNode_nativeIconAdView(node:cc.Node)
    {
        this.nativeIconAdView = node ;
        if( this.nativeIconAdView == null ) return ;
        let banner_btn_close = this.nativeIconAdView.getChildByName("btn_close");
        banner_btn_close.on(cc.Node.EventType.TOUCH_END, this.NativeIconAd_closeBanner, this);
        let banner_target_size = this.nativeIconAdView.getChildByName("target_size");
        for( let i = 0 ; i < banner_target_size.children.length ; i++ )
        {
            banner_target_size.children[i].on(cc.Node.EventType.TOUCH_END, this.NativeIconAd_clickBanner, this);
        }
    }
    public deleNode_nativeIconAdView()
    {
        this.nativeIconAdView = null;
    }
    private nativeIconAd_ID:"";
    public ShowNativeIconAd(){
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            self.nativeIconAd_ID = "";
            if(this.nativeIconAdView == null) return;
            console.log("lqr..<<..ShowNativeIconAd..>>");
            this.NativeIconAd_load(this.NativeIconAd_loadOk_Callback);
        }
    }
    public HideNativeIconAd()
    {
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            if(this.nativeIconAdView == null) return;
            this.nativeIconAdView.active = false ;
        }
    }
    private NativeIconAd_loadOk_Callback(list)
    {
        console.log("lqr.","<<<<<<<<<< NativeIconAd start >>>>>>>>>");
        let obj = list[0];
        for(let key in obj)
        {
            console.log("lqr.adList.key:",key,":lqr.value:",obj[key]);
        }
        console.log("lqr.","<<<<<<<<<< NativeIconAd end >>>>>>>>>");
        // 点击id
        self.nativeIconAd_ID = obj["adId"];
        // 加载 icon
        cc.loader.load(obj["icon"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let icon = self.nativeIconAdView.getChildByName("icon").getComponent(cc.Sprite);
            icon.spriteFrame = new cc.SpriteFrame(texture);
            let scale1 = 70 / (icon.node.width);
            let scale2 = 70 / (icon.node.height);
            scale1 = scale1>scale2?scale2:scale1;
            icon.node.scale = scale1;
        });
        // 展示界面
        self.nativeIconAdView.active = true ;
    }
    private NativeIconAd_closeBanner()
    {
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            if( this.nativeIconAdView == null ) return ;
            this.nativeIconAdView.active = false ;
        }
    }
    private NativeIconAd_clickBanner()
    {
        if(self.nativeIconAd_ID == "") return console.log("lqr.id == null ");
        console.log("lqr.oppo原生IconAd","NativeIconAd_clickBanner",self.nativeIconAd_ID);
        self.nativeIconAd.reportAdClick({
            adId: self.nativeIconAd_ID,
        });
    }
    private NativeIconAd_loadFail_Callback()
    {
        console.log("lqr..NativeIconAd_loadFail_Callback")
    }
    // 原生IconAd
    private nativeIconAd = null;
    private OPPONativeIconAd:string = "262877";
    // 加载原生IconAd广告
    private NativeIconAd_load(func:Function) // type:0创建新的广告(小的) 1创建新的广告位（大的） 2、更新成小banner 3、更新成大的banner
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
            return;
        }
        var that = this;
        if (this.nativeIconAd != null) {
            this.nativeIconAd.destroy();
            this.nativeIconAd = null;
        }
        this.nativeIconAd = qg.createNativeAd({
            posId: self.OPPONativeIconAd, // "222244"
        });
        this.nativeIconAd.onLoad(function (res) {
            console.log("lqr 原生banner onLoad", res.adList[0].title);
            if (res.adList.length > 0) {
                func(res.adList);
                self.nativeIconAd.reportAdShow({
                    adId: res.adList[0].adId
                });
            }
        });
        this.nativeIconAd.onError(function (err) {
            console.log("lqr 原生banner onError", JSON.stringify(err));
            self.NativeIconAd_loadFail_Callback();

        });
        this.nativeIconAd.load();
    }

    // --------------------------- baner -----------------------------------
    // @property(cc.Node)
    private nativeBannerView:cc.Node = null;
    public addNode_nativeBannerView(node:cc.Node)
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
    public deleNode_nativeBannerView()
    {
        this.nativeBannerView = null;
    }
    private NativeBanner_ID:"";
    public ShowNativeBanner(){
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            self.NativeBanner_ID = "";
            if(this.nativeBannerView == null) return;
            this.NativeBanner_load(this.NativeBanner_loadOk_Callback);
        }
    }
    public HideNativeBanner()
    {
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            if(this.nativeBannerView == null) return;
            this.nativeBannerView.active = false ;
        }
    }
    private NativeBanner_loadOk_Callback(list)
    {
        //  不是广东，且不开启骚操作
        if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
        {
            GameManger.Instacne.NativeControl_oppo.HideNativeIconAd();
        }

        console.log("lqr.","<<<<<<<<<< NativeBanner start >>>>>>>>>");
        let obj = list[0];
        for(let key in obj)
        {
            console.log("lqr.adList.key:",key,":lqr.value:",obj[key]);
        }
        console.log("lqr.","<<<<<<<<<< NativeBanner end >>>>>>>>>");
        // 点击id
        self.NativeBanner_ID = obj["adId"];
        let desc = self.nativeBannerView.getChildByName("desc").getComponent(cc.Label);
        // desc 文本
        desc.string = obj["desc"];
        // title 文本
        let title = self.nativeBannerView.getChildByName("title").getComponent(cc.Label);
        title.string = obj["title"];
        // 加载 icon
        cc.loader.load(obj["icon"],function (err,texture) {
            if(err)
            {
                console.log("lqr,",err);
                return;
            }
            let icon = self.nativeBannerView.getChildByName("icon").getComponent(cc.Sprite);
            icon.spriteFrame = new cc.SpriteFrame(texture);

            let scale1 = 70 / (icon.node.width);
            let scale2 = 70 / (icon.node.height);
            scale1 = scale1>scale2?scale2:scale1;
            icon.node.scale = scale1;
        });
        // 展示界面
        self.nativeBannerView.active = true ;
    }
    private NativeBanner_closeBanner()
    {
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            this.nativeBannerView.active = false ;
        }
    }
    private NativeBanner_clickBanner()
    {
        if(self.NativeBanner_ID == "") return console.log("id == null ");
        console.log("lqr.oppo原生banner","NativeBanner_Click",self.NativeBanner_ID);
        self.nativeBannerAd.reportAdClick({
            adId: self.NativeBanner_ID,
        });
    }
    private NativeBanner_loadFail_Callback()
    {
        console.log("lqr..NativeBanner_loadFail_Callback")
        GameManger.Instacne.NativeControl_oppo.ShowNativeIconAd();
    }
    // 原生banner
    private nativeBannerAd = null;
    private OPPONativeBannerId:string = "262877";
    // 加载原生banner广告
    private NativeBanner_load(func:Function) // type:0创建新的广告(小的) 1创建新的广告位（大的） 2、更新成小banner 3、更新成大的banner
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
            return;
        }
        var that = this;
        if (this.nativeBannerAd != null) {
            this.nativeBannerAd.destroy();
            this.nativeBannerAd = null;
        }
        let __oppo_NativeBanner;
        this.nativeBannerAd = qg.createNativeAd({
            posId: self.OPPONativeBannerId, // "222244"
        });
        this.nativeBannerAd.onLoad(function (res) {
            console.log("lqr 原生banner onLoad", res.adList[0].title);
            if (res.adList.length > 0) {
                func(res.adList);
                self.nativeBannerAd.reportAdShow({
                    adId: res.adList[0].adId
                });
            }
        });
        this.nativeBannerAd.onError(function (err) {
            console.log("lqr 原生banner onError",__oppo_NativeBanner, JSON.stringify(err));
            self.NativeBanner_loadFail_Callback();

        });
        this.nativeBannerAd.load();
    }
    // ------------------------------- Interstitial -------------------------------
    // @property(cc.Node)
    private NativeInterView:cc.Node = null;
    public addNode_NativeInterView(node:cc.Node)
    {
        this.NativeInterView = node ;
        if( this.NativeInterView == null ) return ;
        let banner_btn_close = this.NativeInterView.getChildByName("btn_close");
        banner_btn_close.on(cc.Node.EventType.TOUCH_END, this.NativeInter_closeBanner, this);
        let banner_target_size = this.NativeInterView.getChildByName("target_size");
        for( let i = 0 ; i < banner_target_size.children.length ; i++ )
        {
            banner_target_size.children[i].on(cc.Node.EventType.TOUCH_END, this.NativeInter_clickBanner, this);
        }
    }
    public deleNode_NativeInterView()
    {
        this.NativeInterView = null;
    }
    private NativeInter_ID:"";
    public closeBack_NativeInter:Function = null;
    public ShowNativeInter(){
        console.log("lqr<<< ----- ShowNativeInter ------ >>>")
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            self.NativeInter_ID = "";
            
            if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
            {
                if(GameManger.Instacne.NativeControl_oppo.isShowMoreGame)
                {
                    return console.log("lqr.展示互推，不展示banner");
                }
            }

            if( !this.is60Timer || this.isShowMoreGame || this.NativeInterView == null || (cc.sys.platform == cc.sys.DESKTOP_BROWSER)) 
            {
                // 关闭回调
                if(self.closeBack_NativeInter)
                {
                    self.closeBack_NativeInter(false);
                    self.closeBack_NativeInter = null ;
                }
                return ;
            }
            this.NativeInterstitial_load(this.NativeInter_loadOk_Callback);
        }
    }
    public HideNativeInter()
    {
        if(GameManger.Instacne.channel != "oppo") return ;
        if(GameManger.Instacne.channel == "oppo")
        {
            if(this.NativeInterView == null) return;
            this.NativeInterView.active = false ;
        }
    }
    private NativeInter_loadOk_Callback(list)
    {
        //  不是广告，且不开启骚操作
        if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
        {
            GameManger.Instacne.adsManger.HideBanner();
            GameManger.Instacne.NativeControl_oppo.HideNativeBanner();
            GameManger.Instacne.NativeControl_oppo.HideNativeIconAd(); 
        }
        console.log("lqr.","<<<<<<<<<< NativeInter start >>>>>>>>>");
        let obj = list[0];
        for(let key in obj)
        {
            console.log("lqr.adList.key:",key,":lqr.value:",obj[key]);
        }
        console.log("lqr.","<<<<<<<<<< NativeInter end >>>>>>>>>");
        // 点击id
        self.NativeInter_ID = obj["adId"];
        
        // let desc = self.NativeInterView.getChildByName("desc").getComponent(cc.Label);
        // // desc 文本
        // desc.string = obj["desc"];
        // // title 文本
        // let title = self.NativeInterView.getChildByName("title").getComponent(cc.Label);
        // title.string = obj["title"];
        // // 加载 image
        // // url = "https://adsfs.heytapimage.com/ads-material-depot/image/b6bab331d541a1c62a683b64b5b65e9f.jpg?region=cn-north-1&x-ocs-process=image%2fresize%2cm_fix%2cw_640%2ch_320%2ffallback";
        // cc.loader.load(obj["icon"],(err, texture)=>{
        //     if(err)
        //     {
        //         console.log("lqr,",err);
        //         return;
        //     }
        //     let icon = self.NativeInterView.getChildByName("icon").getComponent(cc.Sprite);
        //     icon.spriteFrame = new cc.SpriteFrame(texture);
        //     let scale1 = 140 / (icon.node.width);
        //     let scale2 = 140 / (icon.node.height);
        //     scale1 = scale1>scale2?scale2:scale1;
        //     icon.node.scale = scale1;
        // });

        // console.log( "lqr...url...",obj["imgUrlList"][0] );
        cc.loader.load(obj["imgUrlList"][0],(err, texture)=>{
            if(err)
            {
                console.log("lqr load err ,",err);

                // 关闭回调
                if(self.closeBack_NativeInter)
                {
                    self.closeBack_NativeInter(false);
                    self.closeBack_NativeInter = null ;
                }
                return;
            }
            console.log( "lqr...",obj["imgUrlList"][0] );
            let image = self.NativeInterView.getChildByName("image").getComponent(cc.Sprite);
            image.spriteFrame = new cc.SpriteFrame(texture);
            // 展示界面
            self.NativeInterView.active = true ;
            // 查看按钮
            if( self.NativeInterView.parent.getChildByName("btn_look") )
            {
                self.NativeInterView.parent.getChildByName("btn_look").active = true ;
                self.NativeInterView.parent.getChildByName("btn_goOn").x = -120 ;
            }
        });


    }
    private NativeInter_closeBanner()
    {
        if(GameManger.Instacne.channel != "oppo") return ;
        
        // 关闭回调
        if(self.closeBack_NativeInter)
        {
            self.closeBack_NativeInter(true);
            self.closeBack_NativeInter = null ;
        }

        if(GameManger.Instacne.channel == "oppo")
        {
            this.NativeInterView.active = false ;
            GameManger.Instacne.adsManger.ShowBanner();
        }
    }
    private NativeInter_clickBanner()
    {
        if(self.NativeInter_ID == "") return console.log("id == null ");
        console.log("lqr.oppo原生banner","NativeBanner_Click",self.NativeInter_ID);
        self.nativeInterAd.reportAdClick({
            adId: self.NativeInter_ID,
        });
    }
    private NativeInter_loadFail_Callback()
    {
        // 关闭回调
        if(self.closeBack_NativeInter)
        {
            self.closeBack_NativeInter(false);
            self.closeBack_NativeInter = null ;
        }
        console.log("lqr..NativeInter_loadFail_Callback");
    }
    // 原生Inter
    private nativeInterAd = null;
    private OPPONativeInterId:string = "262878";
    // 加载原生Inter广告
    private NativeInterstitial_load(func:Function) // type:0创建新的广告(小的) 1创建新的广告位（大的） 2、更新成小banner 3、更新成大的banner
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
            return;
        }
        var that = this;
        if (this.nativeInterAd != null) {
            this.nativeInterAd.destroy();
            this.nativeInterAd = null;
        }
        this.nativeInterAd = qg.createNativeAd({
            posId: self.OPPONativeInterId, // "222244"
        });
        this.nativeInterAd.onLoad(function (res) {
            console.log("lqr 原生banner onLoad", res.adList[0].title);
            if (res.adList.length > 0) {
                func(res.adList);
                this.nativeInterAd.reportAdShow({
                    adId: res.adList[0].adId
                });
            }
        });
        this.nativeInterAd.onError(function (err) {
            console.log("lqr 原生banner onError", JSON.stringify(err));
            self.NativeInter_loadFail_Callback();

        });
        this.nativeInterAd.load();
    }
    // ------------------- 其他 ------------------------
    // 添加桌面
    public tianjiaZhuoMian() {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
            return;
        }
        if (GameManger.Instacne.channel != "oppo") return;
        qg.hasShortcutInstalled({
            success: function (res) {
                // 判断图标未存在时，创建图标
                if (res == false) {
                    console.log("lqr.判断图标未存在时，创建图标")
                    qg.installShortcut({
                        success: function () {
                            // 执行用户创建图标奖励
                            console.log("lqr.用户创建图标success")
                        },
                        fail: function (err) {console.log("lqr.用户创建图标fail") },
                        complete: function () { }
                    })
                }
            },
            fail: function (err) { },
            complete: function () { }
        })
    }
    // 互推初始化
    private gamePortalAd = null;
    public HuTuiIsShow:boolean = false; // 给外面的状态 快应用平台版本是否支持
    public isHutuiActive:boolean = false; // 给外面的状态，当前ad是否展示
    private isHuTuiState:boolean = false;// 是否load成功
    private oppo_HuTuiAd:string = "262880";
    private HuTuiInit() {
        let that = this;
        if( GameManger.Instacne.channel != "oppo" ) return ;
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) return ;
        if(that.gamePortalAd){
            that.gamePortalAd.destroy();
            that.gamePortalAd = null;
        }
        if (qg.getSystemInfoSync().platformVersionCode >= 1076) {
            this.HuTuiIsShow = true ;
            that.gamePortalAd = qg.createGamePortalAd({
                adUnitId: that.oppo_HuTuiAd 
            })
            that.gamePortalAd.onLoad(function () {
                console.log('lqr HuTuiInit 互推盒子九宫格广告加载成功')
                that.isHuTuiState = true;
            })
            that.gamePortalAd.onClose(function () {
                console.log('lqr HuTuiInit 互推盒子九宫格广告关闭')
                that.isHutuiActive = false;
                that.gamePortalAd.load();
                that.isHuTuiState = false;
            })
            that.gamePortalAd.onError(function (err) {
                console.log('lqr HuTuiInit 互推盒子九宫格广告加载失败')
                console.log("lqr" +">>>>>>>>>>>>>>>>>");
                console.log("lqr" + that.oppo_HuTuiAd);
                console.log("lqr" + err.errCode+"加载错误");
                console.log("lqr" + err.errMsg+"加载错误");
                console.log("lqr" + err+"加载错误");
                console.log("lqr" +">>>>>>>>>>>>>>>>>");
                that.isHuTuiState = false;
            })

            that.gamePortalAd.load().then(function() {
                console.log('lqr 互推盒子九宫格广告加载成功')
            }).catch(function(error) {
                console.log('lqr 互推盒子九宫格广告加载失败:' + error.errCode + ',' + error.errMsg)
            })

        } else {
            console.log('lqr 快应用平台版本号低于1076，暂不支持互推盒子相关 API');
            this.HuTuiIsShow = false ;
        }
    }
    // 互推展示
    public hutuiShow(){
        if ( !this.HuTuiIsShow ) return;
        if(this.gamePortalAd==null){
            this.HuTuiInit();
            return;
        }
        if(this.isHuTuiState == false){
            this.gamePortalAd.load();
            return ;
        }

        this.gamePortalAd.show().then(function() {
            console.log('lqr 互推展示 成功');
            self.isHutuiActive = true;
            self.hutui_closeOtherAd();
        }).catch(function(error) {
            console.log('lqr 互推展示 失败');
        });
    }
    // 互推关闭其他广告
    private hutui_closeOtherAd()
    {
        console.log("lqr.互推关闭其他广告");
    }
    // 获取用户地址
    private getUserIp(){
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) { return; }
        console.log("lqr.getUserIp");
        let that = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (response[0] != '{')
                    response = response.substr(1);
                try{
                    let json =JSON.parse(response)
                    if (json.proCode != "440000"&&json.proCode!= "440300") {
                        GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD = false;
                    }
                    console.log("lqr.proCode"+json.proCode,"userIP_isGD:"+GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD);
                } catch{
                    let json =JSON.parse(response)
                    console.log("lqr.游戏ip"+json);
                }
            }

        }
        xhr.open("GET", "https://whois.pconline.com.cn/ipJson.jsp?json=true", true);
        xhr.send();
    }
}
