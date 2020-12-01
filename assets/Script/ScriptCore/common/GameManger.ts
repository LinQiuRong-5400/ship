
import AdsManager from "./AdsManager";
import audioEngine from "./AudioEngine";
import { puremvc } from "../puremvc/puremvc";
import NativeControl_vivo from "./NativeControl_vivo";
import NativeControl_oppo from "./NativeControl_oppo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManger extends puremvc.Component {
    
    channel = "vivo";
    Debug = false ;
    URL = "https://shipbuild.obs.cn-south-1.myhuaweicloud.com/";

    tenxun = "https://shipbuild-1300278118.cos.ap-shanghai.myqcloud.com/";

    static Instacne : GameManger  ;
    adsManger:AdsManager;
    AudioEngine:audioEngine;
    NativeControl_vivo:NativeControl_vivo;
    NativeControl_oppo:NativeControl_oppo;


    // Texture resources 是分包文件 
    __onLoad () {
        
        cc.game.addPersistRootNode(this.node); // 设置的常驻节点 
        console.log( "lqr.GameManger.channel:"+this.channel );
        GameManger.Instacne = this;
        this.adsManger = new AdsManager(this);
        this.adsManger.InitInterstitial(); 
        this.adsManger.InitVideo();
    }

    // 加载服务器骨骼动画
    loaderServerSkeleton(imageUrl,skeUrl,atlasUrl,initImsgeName,callbacks)
    {
        // imageUrl = "https://babihunli-1300278118.cos.ap-chengdu.myqcloud.com/stage_1.png";
        // skeUrl = 'https://babihunli-1300278118.cos.ap-chengdu.myqcloud.com/stage_1.json';
        // atlasUrl = 'https://babihunli-1300278118.cos.ap-chengdu.myqcloud.com/stage_1.atlas';
        console.log( "imageUrl:" ,imageUrl ); 
        cc.loader.load(imageUrl, (error, texture) => {
            if( error ) console.log( "imageUrl err " );
            // if( error ) callbacks && callbacks(error,null);
            if( error ) return ;
            cc.loader.load({ url: atlasUrl, type: 'txt' }, (error, atlasJson) => {
                if( error ) console.log( "atlasUrl err " );
                // if( error ) callbacks && callbacks(error,null);
                if( error ) return ;
                cc.loader.load({ url: skeUrl, type: 'txt' }, (error, spineJson) => {
                    if( error ) console.log( "skeUrl err " );
                    // if( error ) callbacks && callbacks(error,null);
                    if( error ) return ;
                    var asset = new sp.SkeletonData();
                    // asset._uuid = skeUrl;
                    asset.skeletonJson = spineJson;
                    asset.atlasText = atlasJson;
                    asset.textures = [texture];
                    if(initImsgeName != "") asset.textureNames = [initImsgeName];
                    callbacks && callbacks(null,asset);
                    // console.log( "texture" ,texture );
                });
            });
        });

        // cc.loader.loadRes(imageUrl,cc.SpriteAtlas,function(err,Altas)//这是加载合图里面的精灵帧
        // {
        //     console.log( Altas , "Altas" )
        // }.bind(this))
    }
    // 加载本地骨骼动画
    loaderLoaclSkeleton(Url,callbacks)
    {
        // 加载骨骼动画
        cc.loader.loadRes(Url, sp.SkeletonData,(err,res)=>{
            if( err )  callbacks&&callbacks(err,res)
            if( err ) return ;
            callbacks&&callbacks(err,res)
        });
    }
    // 加载骨骼动画
    loaderSkeleton(imageUrl,skeUrl,atlasUrl?,initImsgeName?,callbacks?)
    {
        if( arguments.length == 2 ) this.loaderLoaclSkeleton(arguments[0],arguments[1]);
        else this.loaderServerSkeleton( this.URL + imageUrl, this.URL + skeUrl, this.URL + atlasUrl,initImsgeName,callbacks);
    }

    __onDestroy()
    {
        console.log( "lqr...__onDestroy" );
        GameManger.Instacne = null;
    }
}
