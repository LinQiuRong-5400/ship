// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { puremvc } from "../ScriptCore/puremvc/puremvc";
import GameManger from "../ScriptCore/common/GameManger";
import selectProxy from "../Proxys/selectProxy";


const {ccclass, property} = cc._decorator;
@ccclass
export default class loading extends puremvc.Component {

    __onLoad () {
        this.node.getChildByName("btn_start").on("click",this.clickFun_btn_start,this);

        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        this.isLoadSubpackage = selectProxy.data.isLoadSubpackage ;
        this.isLoadGameJson = selectProxy.data.isLoadGameJson ;

        this.loadGameJson();
        this.loadSubpackage();

        GameManger.Instacne.AudioEngine.GameModelAudio("select"); // 音效

        // let self = this ;
        // let url = "https://adsfs.heytapimage.com/res/v2/default/mat_pic/202010/28/1000070415_1603874484260.jpg?region=cn-north-1&x-ocs-process=image%2fresize%2cm_fix%2cw_640%2ch_320%2ffallback";
        // cc.loader.load(url,function (err,texture) {
        //     if(err)
        //     {
        //         console.log("lqr,",err);
        //         return;
        //     }
        //     console.log("lqr..NativeInter_loadOk_Callback imgUrlList load ok!");
        //     let image = self.node.getChildByName("Btn_HuTui").getComponent(cc.Sprite);
        //         image.spriteFrame = new cc.SpriteFrame(texture);
        //         image.node.active = true ;
        // })

    }
    __start()
    {
        if(GameManger.Instacne.channel == "oppo")
        {
            if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
            {
                
            }
            else
            {
                GameManger.Instacne.NativeControl_oppo.ShowNativeIconAd();
            }
        }
    }
    clickFun_btn_start()
    {
        if( !this.isLoadSubpackage || !this.isLoadGameJson )
        {
            this.scheduleOnce(()=>this.clickFun_btn_start,0.1);
            return ;
        }
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        selectProxy.data.isLoadSubpackage = true ;
        selectProxy.data.isLoadGameJson = true ;
        cc.director.loadScene("select");
    }
    isLoadSubpackage :boolean = false ;
    loadSubpackage()
    {
        let that = this ;
        //加载分包
        if(cc.sys.platform === cc.sys.WECHAT_GAME&&GameManger.Instacne.channel=="wx"&&!this.isLoadSubpackage){
            cc.loader.downloader.loadSubpackage('subpackage', function (err) {
                if (err) {
                    console.log('load subpackage is faile');
                    that.loadSubpackage();
                    return console.error(err);
                }
                console.log('load subpackage is ok');
                that.isLoadSubpackage = true;
            }.bind(this));
        }
        else if(cc.sys.platform === cc.sys.WECHAT_GAME&&GameManger.Instacne.channel=="qq"&&!this.isLoadSubpackage){
            let loadTask = qq.loadSubpackage({
                name :'subpackage', 
                success(res)
                {
                    that.isLoadSubpackage=true;
                },
                fail(res)
                {
                    console.log('load subpackage is faile');
                    that.loadSubpackage();
                },

            })
        }
        else if(GameManger.Instacne.channel=="vivo"&&!this.isLoadSubpackage)
        {
            if (cc.sys.platform == cc.sys.DESKTOP_BROWSER){
                that.isLoadSubpackage = true;
                return;
            }
            // vivo加载分包
            const Info = qg.getSystemInfoSync();
            if (Info.platformVersionCode < 1052) {
                console.log('lqr.不需要加载分包:' + Info.platformVersionCode);
                that.isLoadSubpackage = true;
            } else {
                // console.log('加载分包的代码')
                const loadTask = qg.loadSubpackage({
                    name: 'subpackage',
                    success: function (info) {
                        console.log("lqr:", "subpackage 分包加载后通过 success 回调");
                        that.isLoadSubpackage = true;
                    },
                    fail: function (info) {
                        that.loadSubpackage();
                        // 分包加载失败通过 fail 回调
                        console.log("lqr:", " subpackage 分包加载后通过 fail 回调");
                    },
                    complete: function () {
                        // 不关分包加载成功还是失败都会执行此回调
                        // console.log("lqr:", "不关分包加载成功还是失败都会执行此回调");
     
                    }
                })
            }
        }
        else if(GameManger.Instacne.channel=="tt"&&!that.isLoadSubpackage)
        {
            that.isLoadSubpackage = true;
        }
        else if(GameManger.Instacne.channel=="oppo"&&!that.isLoadSubpackage)
        {
            that.isLoadSubpackage = true;
        }
        else
        {
            that.isLoadSubpackage = true;
        }
    }
    isLoadGameJson :boolean = false ;
    loadGameJson()
    {
        let self = this ;
        let jsonUrl = GameManger.Instacne.tenxun + "game.json" ;
        cc.loader.load(jsonUrl,(err,res)=>{
            if(err)
            {
                console.log( "lqr 加载 腾讯 json 失败" ,jsonUrl,);
                self.isLoadGameJson = true ;
                let obj = { oppoAd_Type:null,oppoAdTimer:null };
                obj.oppoAdTimer = 60 ;
                obj.oppoAd_Type = true;
                GameManger.Instacne.NativeControl_oppo.__startShowBanner(obj);
                return ;
            }
            if( res.ShiTenXunYunMa )
            {
                GameManger.Instacne.URL = GameManger.Instacne.tenxun ;
            }
            GameManger.Instacne.NativeControl_oppo.__startShowBanner(res);
            console.log( "lqr loadGameJson is ok !",JSON.stringify(res) );
            self.isLoadGameJson = true ;
            if(cc.find("Canvas").getComponent("NativeView_oppo"))
            {
                cc.find("Canvas").getComponent("NativeView_oppo").__updateView();
            }
        });
    }

}
