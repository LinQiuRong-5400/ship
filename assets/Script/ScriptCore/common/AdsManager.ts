import AdsManager_wx from "./AdsManager_wx";
import GameManger from "./GameManger";
import AdsManager_tt from "./AdsManager_tt";
import AdsManager_qq from "./AdsManager_qq";
import AdsManager_oppo from "./AdsManager_oppo";
import AdsManager_vivo from "./AdsManager_vivo";

export default class AdsManager {
    gameManager:GameManger;
    adsManager_wx:AdsManager_wx = null;
    adsManager_tt:AdsManager_tt = null;
    adsManager_qq:AdsManager_qq = null;
    adsManager_oppo:AdsManager_oppo = null;
    AdsManager_vivo:AdsManager_vivo = null;
    constructor(gameManager){
        this.gameManager = gameManager;
        if(this.gameManager.channel == "wx") this.adsManager_wx = new AdsManager_wx();
        else if(this.gameManager.channel == "tt") this.adsManager_tt = new AdsManager_tt();
        else if(this.gameManager.channel == "qq") this.adsManager_qq = new AdsManager_qq();
        else if(this.gameManager.channel == "oppo") this.adsManager_oppo = new AdsManager_oppo();
        else if(this.gameManager.channel == "vivo") 
        {
            this.AdsManager_vivo = new AdsManager_vivo();
            this.AdsManager_vivo.Init();
        }
        else console.log(" 平台错误 ")
    }
    callback:Function ;
    lookVideo_GetRewards(falgs:boolean)
    {
        // GameManger.Instacne.MainController.GetRewards( falgs );
        this.callback&&this.callback(falgs);
    }

    public ShowBanner()
    {
        if(this.gameManager.channel == "wx"){
            this.adsManager_wx.ShowBanner();
        }
        else if(this.gameManager.channel == "tt"){
            this.adsManager_tt.ShowBanner();
        }
        else if(this.gameManager.channel == "qq"){
            this.adsManager_qq.ShowBanner();
        }
        else if(this.gameManager.channel == "oppo"){
            this.adsManager_oppo.ShowBanner();
        }
        else if(this.gameManager.channel == "vivo"){
            this.AdsManager_vivo.ShowBanner();
        }
        else
        {
            console.log("平台错误");
        }
    }

    public HideBanner()
    {
        if(this.gameManager.channel == "wx"){
            this.adsManager_wx.HideBanner();
        }
        else if(this.gameManager.channel == "tt"){
            this.adsManager_tt.HideBanner();
        }
        else if(this.gameManager.channel == "qq"){
            this.adsManager_qq.HideBanner();
        }
        else if(this.gameManager.channel == "oppo"){
            this.adsManager_oppo.HideBanner();
        }
        else if(this.gameManager.channel == "vivo"){
            this.AdsManager_vivo.HideBanner();
        }
        else
        {
            console.log("平台错误");
        }
    }
    public destoryBanner()
    {
        if(this.gameManager.channel == "oppo"){
            this.adsManager_oppo.destoryBanner();
        }
    }

    public InitInterstitial()
    {
        if(this.gameManager.channel == "wx"){
            this.adsManager_wx.InitInterstitial();
        }
        else if(this.gameManager.channel == "tt"){
            this.adsManager_tt.InitInterstitial();
        }
        else if(this.gameManager.channel == "qq"){
            this.adsManager_qq.InitInterstitial();
        }
        else if(this.gameManager.channel == "oppo"){
            this.adsManager_oppo.InitInterstitial();
        }
        else if(this.gameManager.channel == "vivo"){
            this.AdsManager_vivo.InitInterstitial();
        }
        else
        {
            console.log("平台错误");
        }
    }

    public ShowInterstitial()
    {
        if(this.gameManager.channel == "wx"){
            this.adsManager_wx.ShowInterstitial();
        }
        else if(this.gameManager.channel == "tt"){
            this.adsManager_tt.ShowInterstitial();
        }
        else if(this.gameManager.channel == "qq"){
            this.adsManager_qq.ShowInterstitial();
        }
        else if(this.gameManager.channel == "oppo"){
            this.adsManager_oppo.ShowInterstitial();
        }
        else if(this.gameManager.channel == "vivo"){
            this.AdsManager_vivo.ShowInterstitial();
        }
        else
        {
            console.log("平台错误");
        }
    }

    public InitVideo()
    {
        if(this.gameManager.channel == "wx"){
            this.adsManager_wx.InitVideo();
        }
        else if(this.gameManager.channel == "tt"){
            this.adsManager_tt.InitVideo();
        }
        else if(this.gameManager.channel == "qq"){
            this.adsManager_qq.InitVideo();
        }
        else if(this.gameManager.channel == "oppo"){
            this.adsManager_oppo.InitVideo();
        }
        else if(this.gameManager.channel == "vivo"){
            this.AdsManager_vivo.InitVideo();
        }
        else
        {
            console.log("平台错误");
        }
    }

    public ShowVideo(callback)
    {
        this.callback = callback ;
        if (cc.sys.platform == cc.sys.DESKTOP_BROWSER ||  GameManger.Instacne.Debug ){return this.lookVideo_GetRewards(true) }

        if(this.gameManager.channel == "wx"){
            this.adsManager_wx.ShowVideo();
        }
        else if(this.gameManager.channel == "tt"){
            this.adsManager_tt.ShowVideo();
        }
        else if(this.gameManager.channel == "qq"){
            this.adsManager_qq.ShowVideo();
        }
        else if(this.gameManager.channel == "oppo"){
            this.adsManager_oppo.ShowVideo();
        }
        else if(this.gameManager.channel == "vivo"){
            this.AdsManager_vivo.ShowVideo();
        }
        else
        {
            console.log("平台错误");
        }
    }
}
