// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManger from "./GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdsManager_wx  {
    // wx67c035d3e242ad56 找茬 appid
    // Appid_Banner_wx:"adunit-3c0671138f3ce6ed",// 视频
    // Appid_Video_wx:"adunit-ccef9fd8ceaf17e6",// 激励
    // Appid_Interstitial_wx:"adunit-26b3c3dcd4f03f29",// 插屏
    constructor(){

    }
    lookVideo_GetRewards(falgs:boolean)
    {
        console.log("给奖励");
        GameManger.Instacne.adsManger.lookVideo_GetRewards( falgs );
    }
    Appid_Banner_wx:string = "adunit-3c0671138f3ce6ed ";
    bannerAd = null;
    ShowBanner()
    {
        if(this.Appid_Banner_wx=="")return;
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        if (this.bannerAd!=null){
            this.bannerAd.destroy();
        }

        var __self = this;
        var phone = wx.getSystemInfoSync();
       // console.log(phone);
        var w = phone.screenWidth / 2;
        var h = phone.screenHeight;
        this.bannerAd = wx.createBannerAd({
            adUnitId: __self.Appid_Banner_wx,
            style: {
                width: 300,
                top: 0,
                left: 0
            }
        });
        this.bannerAd.onResize(function() {
            __self.bannerAd.style.left = w - __self.bannerAd.style.realWidth / 2 + 0.1;
            __self.bannerAd.style.top = h - __self.bannerAd.style.realHeight + 0.1;
        });
        this.bannerAd.onLoad(function () {
            console.log("lqr.banner load");
            __self.bannerAd.show();
        });
        this.bannerAd.onError(err => {
            console.log("lqr",err);
        });
    }
    HideBanner()
    {
        if(this.Appid_Banner_wx == "") return;
        if (this.bannerAd == null)   {
            return;
        }
        this.bannerAd.hide();
    }
    Appid_Video_wx:string = "adunit-ccef9fd8ceaf17e6 ";
    videoAd = null;
    InitVideo() {
        if(this.Appid_Video_wx=="")return;
        if (this.videoAd!=null) return;
        // if(!this.isCanShowVideo_wx()) return;
        let __self = this ;
        if(this.videoAd == null){
            this.videoAd = wx.createRewardedVideoAd({adUnitId: __self.Appid_Video_wx
        });
        if (this.videoAd != null) {
            this.videoAd.onError(function (err) {
                // wx.showToast({
                //     title: err
                // });
                console.log("lqr.激励视频加载失败！！！");
            });
        }
        }
    }
    ShowVideo()
    {
        if(this.Appid_Video_wx=="")
        {
            return;
        }
        // gameManager.istype=type;
        let __self = this;
        if(cc.sys.platform !== cc.sys.WECHAT_GAME){
            this.lookVideo_GetRewards(true);
            return;
        }
        if (this.videoAd == null){
            console.log('videoAd 不存在');
            wx.showToast({
                title: "广告加载失败,检查网络或重试"
            });
            this.InitVideo();
            return;
        }
        // if(!this.isCanShowVideo_wx()) return;
        this.videoAd.load().then(() => this.videoAd.show().catch(err =>
        {
            console.log("lqr videoAd",err);
            // wx.showToast({
            //     title: "激励视频失败,检查网络或重试"
            // });
            __self.lookVideo_GetRewards(false);
        }));

        this.videoAd.onClose(function (res) {
            this.videoAd.offClose();
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                __self.lookVideo_GetRewards(true);
            }
            else {
                // 播放中途退出，不下发游戏奖励
                console.log("lqr",'中途退出 不下发游戏奖励');
            }
        }.bind(this));
    }
    Appid_Interstitial_wx:string = "adunit-26b3c3dcd4f03f29 ";
    interstitialAd = null ;
    InitInterstitial() {
        if(this.Appid_Interstitial_wx=="")return;
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)return;
        this.interstitialAd = null;
        let __self = this;
        // 创建插屏广告实例，提前初始化
        if (wx.createInterstitialAd){
            this.interstitialAd = wx.createInterstitialAd({
                adUnitId: __self.Appid_Interstitial_wx//'adunit-0f53ba97ad220222'
            });
            this.interstitialAd.onError(err => {
                console.log("显示插屏onError");
                console.log(err);
            });
            this.interstitialAd.onLoad(function () {
                // console.log("显示插屏onLoad");
            });
            this.interstitialAd.onClose(function () {
                // console.log("显示插屏onClose");
                __self.interstitialAd.load();
            });
        }
    }
    ShowInterstitial() {
        if(this.Appid_Interstitial_wx=="")return;
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)return;
        let __self = this;
        if(this.interstitialAd)
        {
            this.interstitialAd.show()
                .then(() => {
                    // console.log('广告显示成功');
                })
                .catch(err => {
                    console.log('广告组件出现问题', err);
                    // 可以手动加载一次
                    __self.interstitialAd.load()
                        .then(() => {
                            console.log('手动加载成功');
                        });
                });
        }
        else {
            this.InitInterstitial();
        }
    }
}
