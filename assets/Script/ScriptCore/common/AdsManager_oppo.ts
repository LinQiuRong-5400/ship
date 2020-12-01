// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManger from "./GameManger";
import main from "../../Scene/main";
import game from "../../Scene/game";
const {ccclass, property} = cc._decorator;
let self;
@ccclass
export default class AdsManager_oppo {
    constructor(){
        self = this ;
    }
    lookVideo_GetRewards(falgs:boolean)
    {
        console.log("给奖励");
        GameManger.Instacne.adsManger.lookVideo_GetRewards( falgs );
    }
    // banner
    bannerAd = null;
    Appid_Banner_oppo:string = "262874";
    ShowBanner()
    {
        // return GameManger.Instacne.NativeControl_oppo.ShowNativeBanner();
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) { return }
        if (GameManger.Instacne.channel != "oppo") return;

        if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
        {
            if(GameManger.Instacne.NativeControl_oppo.isShowMoreGame)
            {
                try {
                    cc.find("Canvas").getComponent("MoreGame_oppo").showView();
                } catch (error) {
                    console.log("lqr.不需要关闭MoreGame_oppo");
                }
            }
        }

        if ( this.bannerAd != null ) {
            this.bannerAd.hide();
            console.log("lqr Banner关闭 hide");
        }

        let that = this;
        
        let SystemInfo = qg.getSystemInfoSync();
        let screenWidth = SystemInfo.screenWidth;
        let screenHeight = SystemInfo.screenHeight;

        console.log("lqr.SystemInfo:",screenWidth,screenHeight,cc.winSize.width,cc.winSize.height);

        if(main.Instacne && main.Instacne.GameModel == 1 || game.Instacne!=null)
        {
            console.log("lqr.banner type......1111")
            let targetBannerAdWidth = 560 ;
            that.bannerAd = qg.createBannerAd({
                adUnitId: that.Appid_Banner_oppo,
                style: {
                    left: screenWidth - targetBannerAdWidth - 50 ,
                    width: targetBannerAdWidth,
                }
            });
        }
        else
        {
            console.log("lqr.banner type......2222")
            that.bannerAd = qg.createBannerAd({
                adUnitId: that.Appid_Banner_oppo,
            });
        }


        that.bannerAd.onResize(function(obj) {
            console.log('banner 宽度：' + obj.width + ', banner 高度：' + obj.height);
            // that.bannerAd.s
          })
        var adshow = that.bannerAd.show();
        // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
        adshow && adshow.then(function () {
            //banner做适配			
            that.ShowBanner_ok();
        }).catch(function (err) {
            that.ShowBanner_fail();
        });
    }
    HideBanner()
    {
        if (this.bannerAd != null) {
            this.bannerAd.hide();
            console.log("lqr Banner关闭");
        }
    }

    destoryBanner()
    {
        if (this.bannerAd != null) {
            this.bannerAd.destroy();
            console.log("lqr destoryBanner");
        }
    }

    ShowBanner_ok()
    {
        console.log("lqr oppo banner：banner广告展示成功");
        //  不是广东，且不开启骚操作
        GameManger.Instacne.NativeControl_oppo.HideNativeBanner();
        if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
        {
            GameManger.Instacne.NativeControl_oppo.HideNativeIconAd();
        }
    }
    ShowBanner_fail()
    {
        console.log("lqr oppo banner：banner广告展示失败");
        GameManger.Instacne.NativeControl_oppo.ShowNativeBanner();
    }
    // 激励
    videoAd = null;
    Appid_Video_vv:string="262879";
    isLoadVideo:boolean = false;
    InitVideo()
    {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER) { return }

        let that = this;
        console.log("lqr InitVideo >>>>");
        this.videoAd = qg.createRewardedVideoAd({ 
            adUnitId: that.Appid_Video_vv,
        });
        this.videoAd.onError(function (err) {
            that.isLoadVideo = false;
            console.log("lqr oppo InitVideo videoAd:" + err.code + " " + err.msg);
        });
        this.videoAd.onLoad(function () {
            console.log("lqr videoAd Onload:ok");
            that.isLoadVideo = true;
        });
        this.videoAd.onClose((res) => {
            that.isLoadVideo = false;
            if (res.isEnded) {
                //奖励
                that.lookVideo_GetRewards(true);
            } else {
                // 播放中途退出，不下发游戏奖励
                console.log('lqr 中途退出');
            }
            that.videoAd.load();
        });
        this.videoAd.load();
    }
    ShowVideo()
    {
        if (this.isLoadVideo == false) {
            if (this.videoAd == null) {
                this.InitVideo();
            }
            else {
                this.videoAd.load();
            }
            return;
        }
        this.videoAd.show();
    }
    // 插屏-原生
    InitInterstitial()
    {
        console.log("lqr oppo 插屏-原生 InitInterstitial ");
    }
    ShowInterstitial()
    {
        console.log("lqr oppo 插屏-原生 ShowInterstitial ");
    }

}
