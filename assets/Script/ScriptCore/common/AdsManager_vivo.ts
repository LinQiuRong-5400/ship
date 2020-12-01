
import GameManger from "./GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AdsManager_oppo {
    
    // 漫画脸包名： com.eggstudio.manhualian.vivominigame
    // VIVONativeBannerId:"d56493b8173c4f18b561f2707abcf9cc";
    // VIVONativeInterId:"89f104127c1547b485e077eed696bf0f";
    // VIVONativeIconId:"cf55b94c40be465c949e1ae805d82956";
    // Appid_Banner_vv: "94492721659c407caf7a49e77e023c36";
    // Appid_Interstitial_vv: "2930928044894c18a8c47975bf887f26";
    // Appid_Video_vv: "fe84e253d9ac4ec884b989143065ca96";

    // ship: 包名： com.eggsstudio.bbmnzc.vivominigame

    // vivo
    // Appid_Banner_vv: "",//"f1e36a436ac144f7b91b8e7afbe9e7de",// 视频
    // Appid_Interstitial_vv: "",//"6176ada816fd49d9a34cd89a8993f0c0",// 插屏
    // Appid_Video_vv: "",//"8f5a6a882a454750b9b6d4c91dbfd604",//激励
    // 婚礼包名测试：com.eggsstudio.Barbieweddingrpk.vivominigame

    constructor(){

    }
    lookVideo_GetRewards(falgs:boolean)
    {
        console.log("lqr.vivo给奖励");
        GameManger.Instacne.adsManger.lookVideo_GetRewards( falgs );
    }
    isHasAd:boolean= true;
    isShowBanner:boolean= false;
    isShowInter:boolean= false;
    isShowVideo:boolean= false;
    Init(data?:Object)
    {
        if(this.isHasAd)
        {
            if( cc.sys.platform != cc.sys.DESKTOP_BROWSER)
            {
                // 1041
                if (qg.getSystemInfoSync().platformVersionCode < 1061) {
                    // 不支持激励视频
                    this.isShowVideo = false;
                }
                else
                {
                    this.isShowVideo = true;
                }
                // 1031
                if (qg.getSystemInfoSync().platformVersionCode < 1052) { 
                    // 不支持广告
                    this.isHasAd = false;
                    this.isShowBanner = false;
                    this.isShowInter = false;
                }
                else {
                    // 支持广告
                    this.isHasAd = true;
                    this.isShowBanner = true;
                    this.isShowInter = true;
                }
            }
        }
        console.log("lqr.<<< ****** Init ****** >>>");
        console.log("lqr. server:"+data);
        console.log("lqr. platformVersionCode:" + qg.getSystemInfoSync().platformVersionCode);
        console.log( "lqr.<isHasAd:"+this.isHasAd+"><"+ "isShowBanner:" + this.isShowBanner + ">");
        console.log( "lqr.<isShowInter:"+this.isShowInter+"><"+ "isShowVideo:" + this.isShowVideo + ">");
        console.log("lqr.<<< ****** Init ****** >>>");
    }
    // banner
    Appid_Banner_vv:string = "94492721659c407caf7a49e77e023c36";
    bannerAd = null;
    ShowBanner() {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        if(!this.isHasAd) return;
        if (this.bannerAd!=null){
            this.bannerAd.destroy();
        }
        let that = this;
        if(GameManger.Instacne.channel == "vivo"){
            if(!this.isShowBanner)
            {
                console.log("lqr","ShowBanner:平台小于<1052");
                return;
            }
            if(that.Appid_Banner_vv=="") return ;
            this.bannerAd = qg.createBannerAd({
                posId:  that.Appid_Banner_vv,
                style: {}
            });
            this.bannerAd.onLoad(function () {
                console.log("lqr","bannerAd is Load");
            });
              // 开始监听
            this.bannerAd.onClose(function () {
                console.log("lqr","bannerAd is onClose");
            });
            let adshow =  this.bannerAd.show();
            adshow && adshow.then(() => {
                console.log("lqr","bannerAd is show");
            }).catch((err) => {
                console.log("lqr","ShowBanner:广告展示失败,err.code:"+err.code);
                switch (err.code) {
                    case 30003:
                        console.log("lqr","ShowBanner:新用户7天内不能曝光Banner，请将手机时间调整为7天后，退出游戏重新进入")
                        break;
                    case 30009:
                        console.log("lqr","ShowBanner:10秒内调用广告次数超过1次，10秒后再调用")
                        break;
                    case 30002:
                        console.log("lqr","ShowBanner:加载广告失败，重新加载广告")
                        break;
                    default:
                        // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/ad?id=广告错误码信息 对错误码做分类处理
                        console.log("lqr","ShowBanner:" + JSON.stringify(err))
                        break;
                }
            });
        }
        else
        {
            console.log( "lqr 平台不是 vivo" )
        }
    }
    HideBanner() {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        if (this.bannerAd!=null){
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }
    // inter
    Appid_Interstitial_vv:string = "2930928044894c18a8c47975bf887f26";
    interstitialAd = null;
    InitInterstitial() {
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)return;
        if(!this.isHasAd) return;
        let that = this;
        if(!this.isShowInter)
        {
            console.log("lqr","InitInterstitial:平台小于<1052");
            return;
        }
        if(GameManger.Instacne.channel == "vivo"){
            if(that.Appid_Interstitial_vv=="") return ;
            this.interstitialAd = qg.createInterstitialAd({
                posId:that.Appid_Interstitial_vv,
                style:{}
            });
            this.interstitialAd.onClose(function () {
                //插屏广告实例不能复用，每次需要重新加载时要重新create
                that.InitInterstitial();
            })

        }
        else
        {
            console.log( "lqr 平台不是 vivo" )
        }
    }
    ShowInterstitial() {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        if(!this.isHasAd) return;
        if(GameManger.Instacne.channel == "vivo"){
            let that = this;
            if(!this.isShowInter)
            {
                console.log("lqr","InitInterstitial:平台小于<1052");
                return;
            }
            if(this.interstitialAd==null) 
            {
                this.InitInterstitial();
                return;
            }
            let adShow =  this.interstitialAd.show();
            // 调用then和catch之前需要对show的结果做下判空处理，防止出错（如果没有判空，在平台版本为1052以及以下的手机上将会出现错误）
            adShow && adShow.then(() => {
                console.log("lqr","插屏广告展示成功");
            }).catch((err) => {
                console.log("lqr","interstitialAd:广告展示失败,err.code:"+err.code);
                switch (err.code) {
                    case 30003:
                        console.log("lqr","interstitialAd:新用户7天内不能曝光Banner，请将手机时间调整为7天后，退出游戏重新进入");
                        break;
                    case 30009:
                        console.log("lqr","interstitialAd:10秒内调用广告次数超过1次，10秒后再调用");
                        break;
                    case 30002:
                        console.log("lqr","interstitialAd:load广告失败，重新加载广告");
                        break;
                    default:
                        // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/ad?id=广告错误码信息 对错误码做分类处理
                        console.log("lqr","interstitialAd:插屏广告展示失败")
                        console.log("lqr","interstitialAd:" + JSON.stringify(err));
                        that.InitInterstitial();
                        break;
                }
            });
        }
        else
        {
            console.log( "lqr 平台不是 vivo" )
        }
    }
    // video
    Appid_Video_vv:string="fe84e253d9ac4ec884b989143065ca96";
    videoAd = null ;
    isLoadVideo:boolean = false;
    videoFailNum:number = 0 ;
    InitVideo () {
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){return;}
        if(!this.isHasAd) return;
        if (this.videoAd!=null)
        {
            console.log("lqr","this.videoAd!=null");
            return;
        } 
        if(!this.isShowVideo)
        {
            console.log("lqr","InitVideo:平台小于<1061");
            return
        }
        if(GameManger.Instacne.channel == "vivo"){
            let that = this;
            if(that.Appid_Video_vv=="") return ;
            this.videoAd = qg.createRewardedVideoAd({
                posId: that.Appid_Video_vv
            });
            this.videoAd.onError( err => {
                console.log("lqr","jswrapper:激励广告加载失败,err.code:"+err.code);
                switch (err.errCode) {
                    case -3:
                        console.log("lqr","jswrapper:激励广告加载失败---调用太频繁", JSON.stringify(err));
                        break;
                    case -4:
                        console.log("lqr","jswrapper:激励广告加载失败--- 一分钟内不能重复加载", JSON.stringify(err));
                        break;
                    case 30008:
                        // 当前启动来源不支持激励视频广告，请选择其他激励策略
                        break;
                    default:
                        // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/ad?id=广告错误码信息 对错误码做分类处理
                        console.log("lqr","jswrapper:激励广告展示失败")
                        console.log("lqr","jswrapper:" + JSON.stringify(err))
                        break;
                }
                that.isLoadVideo = false;

                setTimeout(() => {
                    that.videoAd.load();
                }, 15000);
            });
            this.videoAd.onLoad(() => {
                that.isLoadVideo = true;
                console.log("lqr","InitVideo onLoad is ok ");
            });
            this.videoAd.onClose(res=> {
                that.isLoadVideo = false;
                // ui适配
                if (res && res.isEnded) {
                    // 真解锁
                    that.lookVideo_GetRewards(true);
                } else {
                    // 播放中途退出，不下发游戏奖励
                    console.log("lqr",'中途退出');
                }
                that.videoAd.load();
                // that.scheduleOnce(function () {
                //     that.videoAd.load();
                // },15);
            });
        }
        else
        {
            console.log( "lqr 平台不是 vivo" )
        }
    }
    ShowVideo() {
        let that = this;
        if(!this.isHasAd) return;
        if(cc.sys.platform == cc.sys.DESKTOP_BROWSER){
            // 真解锁
            that.lookVideo_GetRewards(true);
            return;
        }
        if(!this.isShowVideo)
        {
            console.log("lqr","ShowVideo:平台小于<1041");
            return
        }
        if(GameManger.Instacne.channel == "vivo"){
            if(that.isLoadVideo == false) {
                that.videoFailNum++;
                if (that.videoFailNum % 5 == 0) {
                    that.videoFailNum = 0;
                    // 假解锁
                    console.log("lqr","加解锁");
                    that.lookVideo_GetRewards(false);
                }
                else {
                    // 提示
                    console.log("lqr","提示"+that.videoFailNum);
                    that.InitVideo();
                }
                return;
            }
            that.videoAd.show()
                .then(() => {
                    console.log("lqr",'激励广告显示成功');
                })
                .catch(err => {
                    console.log("lqr","jswrapper:激励广告load失败"+JSON.stringify(err))
                    // 可以手动加载一次
                    that.videoAd.load()
                        .then(() => {
                            console.log("lqr",'手动加载成功');
                        });
                });
        }
    }
}
