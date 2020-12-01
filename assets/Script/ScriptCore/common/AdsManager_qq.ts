import GameManger from "./GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdsManager_qq {


    // "1110128949" 找茬
    // Appid_Banner_qq:"4f543a85ea0005b2be60061560605132",// 视频
    // Appid_Video_qq:"d43ae0a77199db7085abc43989d60dbc",// 激励
    // Appid_Interstitial_qq:"5a09dae89de2d786d554b4cf85e5d6d6",// 插屏
    // Appid_AppBox_qq:"b85a05e258e1c39ad28592256ca66ac5",// 盒子
        
    lookVideo_GetRewards(falgs:boolean)
    {
        console.log("给奖励");
        // GameManger.Instacne.MainController.GetRewards( falgs );
        GameManger.Instacne.adsManger.lookVideo_GetRewards( falgs );
    }

    Appid_Banner_qq:string = " 4f543a85ea0005b2be60061560605132 ";
    bannerAd = null;
    public ShowBanner()
    {
        if(this.Appid_Banner_qq=="") return;
        if (cc.sys.platform !== cc.sys.WECHAT_GAME){return;}
        if (this.bannerAd!=null){
            this.bannerAd.destroy();
        }

        var __self = this;
        qq.getSystemInfo({
            success(res){
                let screenWidth = res.windowWidth;
                let screenHeight = res.windowHeight;
                __self.bannerAd = qq.createBannerAd({
                    adUnitId: __self.Appid_Banner_qq,//'f824d26164970262827a93f2accb8ea5',
                    style: {
                        left:0,
                        top:0,
                        width: 300,
                    }
                });
                __self.bannerAd.onResize(function (r) {
                    __self.bannerAd.style.left = ( screenWidth-r.width )/2;
                    __self.bannerAd.style.top = screenHeight-r.height;
                });
                __self.bannerAd.onError(err => {
                    console.log(err);
                });
                __self.bannerAd.onLoad(function () {

                });
                __self.bannerAd.hide(function () {

                });

                __self.bannerAd.show();
            }
        });
    }

    public HideBanner()
    {
        if(this.Appid_Banner_qq == "") return;
        if (cc.sys.platform !== cc.sys.WECHAT_GAME){return;}
        if (this.bannerAd == null)   {
            return;
        }
        this.bannerAd.hide();
    }
    
    Appid_Video_qq:string = " d43ae0a77199db7085abc43989d60dbc ";
    videoAd = null;
    public InitVideo() {
        if(this.Appid_Video_qq=="") return ;
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return;
        }
        if (this.videoAd!=null) return;
        let __self = this;
        if(this.videoAd == null){
            // console.log("初始化成功了！！！！！:"+ that.Appid_Video_qq);
            this.videoAd = qq.createRewardedVideoAd({adUnitId: __self.Appid_Video_qq//'fff60b65de582d27a785ffe6303c8e20'
        });
        if (this.videoAd!=null) {
            this.videoAd.onError(function (err) {

            });
            this.videoAd.onClose(function (res) {

                    if (res && res.isEnded || res === undefined) {
                        __self.lookVideo_GetRewards(true);
                    }
                    else {
                        // 播放中途退出，不下发游戏奖励
                        console.log('中途退出');
                    }
                }.bind(this));
            }
        }
    }

    public ShowVideo()
    {
        if(this.Appid_Video_qq=="") return ;
        if(cc.sys.platform !== cc.sys.WECHAT_GAME){
            this.lookVideo_GetRewards(true);
            return;
        }

        let __self = this;
        this.videoAd.load().then(() => this.videoAd.show().catch(err =>
        {
            if(err)
            {
                console.log("ShowVideo_qq is err");
                console.log(err);
            }
        }));
    }

    Appid_Interstitial_qq:string = " 5a09dae89de2d786d554b4cf85e5d6d6 ";
    interstitialAd = null ;
    public InitInterstitial() {
        if(this.Appid_Interstitial_qq=="") return ;
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)return;
        if(this.isCanShowInterstitial_qq() == false)
        {
            return;
        }
        this.interstitialAd = null;
        let __self = this;
        // 创建插屏广告实例，提前初始化
        if (qq.createInterstitialAd){
            this.interstitialAd = qq.createInterstitialAd({
                adUnitId: __self.Appid_Interstitial_qq//'adunit-bacdb03214fe7302'
            });
            // let that = this;
            this.interstitialAd.onError(err => {
                // console.log("显示插屏onError");
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

    public ShowInterstitial() {
        if(this.Appid_Interstitial_qq=="") return ;
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)return;
        if(this.isCanShowInterstitial_qq() == false)
        {
            return;
        }
        let that = this;
        if(this.interstitialAd)
        {
            this.interstitialAd.show()
                .then(() => {

                })
                .catch(err => {
                    console.log('广告组件出现问题', err);
                    // 可以手动加载一次
                    that.interstitialAd.load()
                        .then(() => {
                            // console.log('手动加载成功');
                        });
                });
        }
        else {
            this.InitInterstitial();
        }
    }

    isCanShowInterstitial_qq(){
        var ret = false;
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            let current_version = qq.getSystemInfoSync().SDKVersion;
            if (this.compareVersion_qq(current_version, "1.12.0") === -1){
                console.log('=====版本不够1.12.0，插屏广告不能用')
            }else{
                ret = true;
            }
        }
        return ret;
    }

    compareVersion_qq(__v1:String, __v2:String) {//比较版本
        let v1 = __v1.split('.');
        let v2 = __v2.split('.');
        let len = Math.max(v1.length, v2.length);
        while (v1.length < len) {
            v1.push('0');
        }
        while (v2.length < len) {
            v2.push('0');
        }
        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i]);
            var num2 = parseInt(v2[i]);
            if (num1 > num2) {
                return 1;
            } else if (num1 < num2) {
                return -1;
            }
        }
        return 0;
    }
}
