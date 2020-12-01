// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManger from "./GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdsManager_tt  {

    // appid: tte06796da7f4d2dba 穿搭日记
    // Appid_Banner_tt:'38392f495lb5bohc45',// 视频
    // Appid_Video_tt:'2phvglc8ewp3g6d0l1',// 激励
    // Appid_Interstitial_tt:"146a7bddngpah4iopn",// 插屏

    constructor(){

    }

    lookVideo_GetRewards(falgs:boolean)
    {
        console.log("给奖励");
        // GameManger.Instacne.MainController.GetRewards( falgs );
        GameManger.Instacne.adsManger.lookVideo_GetRewards( falgs );
    }

    Appid_Banner_tt:string = " 38392f495lb5bohc45 ";
    bannerAd = null;
    public ShowBanner()
    {
        if(this.Appid_Banner_tt=="") return;
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        if (this.bannerAd!=null){
            this.bannerAd.destroy();
        }
        let __self = this;
        const {
            windowWidth,
            windowHeight,
        } = tt.getSystemInfoSync();
        var targetBannerAdWidth = 200;

        // 创建一个居于屏幕底部正中的广告
        this.bannerAd = tt.createBannerAd({
            adUnitId: __self.Appid_Banner_tt,
            style: {
                width: targetBannerAdWidth,
                top: windowHeight - (targetBannerAdWidth / 16 * 9), // 根据系统约定尺寸计算出广告高度
            },
        });
        // 也可以手动修改属性以调整广告尺寸
        this.bannerAd.style.left = (windowWidth - targetBannerAdWidth) / 2;

        // 尺寸调整时会触发回调
        // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
        this.bannerAd.onResize(size => {
            // console.log(size.width, size.height);
            // 如果一开始设置的 banner 宽度超过了系统限制，可以在此处加以调整
            if (targetBannerAdWidth != size.width) {
                targetBannerAdWidth = size.width;
                __self.bannerAd.style.top = windowHeight - size.height;
                __self.bannerAd.style.left = (windowWidth - size.width) / 2;
            }
        });
        this.bannerAd.onLoad(function () {
            __self.bannerAd.show();
        });

        this.bannerAd.onError(err => {
            console.log(err);
        })
    }

    public HideBanner()
    {
        if(this.Appid_Banner_tt == "") return;
        if (this.bannerAd == null)   {
            return;
        }
        this.bannerAd.hide();
    }
    
    Appid_Video_tt:string = " 2phvglc8ewp3g6d0l1 ";
    videoAd = null;
    public InitVideo() {
        if(this.Appid_Video_tt=="")return;
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        if (this.videoAd!=null) return;
        let __self = this;
        // console.log(that.Appid_Video_tt);
        this.videoAd = tt.createRewardedVideoAd({
            adUnitId: __self.Appid_Video_tt
        });
        this.videoAd.load()
            .then(() => {
                // console.log('手动加载成功');
            });
        this.videoAd.onLoad(function () {

        });
        this.videoAd.onError(function (err) {
            console.log("lqr.InitVideo_tt is err !");
        });
        this.videoAd.onClose(res => {
            if (res.isEnded) {
                // 正常播放结束，可以下发游戏奖励
                __self.lookVideo_GetRewards(true);
            }
            else {
                // 播放中途退出，不下发游戏奖励
                console.log('中途退出');
            }
        });
    }

    public ShowVideo()
    {
        if(this.Appid_Video_tt=="")return;
        if(cc.sys.platform !== cc.sys.WECHAT_GAME){
            this.lookVideo_GetRewards(true);
            return;
        }
        let __self = this;
        if(this.videoAd==null)
        {
            this.InitVideo();
        }
        this.videoAd.show()
            .then(() => {
                // console.log('广告显示成功');
            })
            .catch(err => {
                console.log('lqr激励广告组件出现问题：', err);
                // that.lookVideo_GetRewards(gameManager.videoType_tt,true);
                // 可以手动加载一次
                // that.videoAd.load()
                //     .then(() => {
                //         // console.log('手动加载成功');
                //     });
            });
    }

    Appid_Interstitial_tt:string = " 146a7bddngpah4iopn ";
    interstitialAd = null ;
    public InitInterstitial() {
        if(this.Appid_Interstitial_tt=="")return;
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)return;
    }

    public ShowInterstitial() {
        const isToutiaio = tt.getSystemInfoSync().appName === "Toutiao";
        const current_version = tt.getSystemInfoSync().version;
        const isIOS = tt.getSystemInfoSync().platform!="ios";
        // 插屏广告仅今日头条安卓客户端支持
        let self = this ;
        if (isToutiaio&&(this.compareVersion(current_version, "7.6.6") != -1)&&isIOS) {
          const interstitialAd = tt.createInterstitialAd({  
            adUnitId: self.Appid_Interstitial_tt
          });
          interstitialAd
            .load()
            .then(() => {
              interstitialAd.show();
            })
            .catch(err => {
                console.log("Interstitial_tt",err);
            });
            interstitialAd.onError(function (err) {
                    console.log('插屏广告组件出现问题', err);
                });
            interstitialAd.onClose(function (err) {
                    console.log('关闭', err);
                    interstitialAd.destroy();
                });
            
        }
        else
        {
            console.log("插屏广告仅今日头条安卓客户端支持")
        }
    }

    compareVersion(__v1:string, __v2:string){
        let v1 = __v1.split('.');
        let v2 = __v2.split('.');
        let len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (let i = 0; i < len; i++) {
            let num1 = parseInt(v1[i]);
            let num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;

    }
}
