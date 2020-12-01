
import { puremvc } from "../puremvc/puremvc";
import GameManger from "./GameManger";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoreGame_oppo extends puremvc.Component {

    @property(cc.Boolean)
    private isSpecial:boolean = false;
    @property(cc.Node)
    private hutuiView:cc.Node = null;
    @property(cc.Node)
    private hutuiParent:cc.Node = null;
    @property(cc.Node)
    private huTuiItem:cc.Node = null;
    @property(cc.Node)
    private Btn_Close:cc.Node = null;
    @property(cc.Node)
    private Btn_moreGame:cc.Node = null;
    __onLoad () {

        this.Btn_moreGame.x = cc.winSize.width/2-120 ;
        this.hutuiView.active = false;
        this.Btn_moreGame.active = false ;
        if(GameManger.Instacne.channel != "oppo") return;
        // if(!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) return ;
        if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
        {
            return ;
        }
        else
        {

        }

        this.hutuiView.zIndex = 2 ;

        this.Btn_moreGame.on(cc.Node.EventType.TOUCH_END, this.showView, this);
        this.Btn_Close.on(cc.Node.EventType.TOUCH_END, this.showView, this); 
        this.loadGameJson();

        if(GameManger.Instacne.NativeControl_oppo.red_icon)
        {
            this.Btn_moreGame.getChildByName("red_icon").active = false ;
        }

        
        // 动画
        // this.Btn_moreGame.x = cc.winSize.width/2-120 ;
        // let move1 = cc.moveBy(0.5,cc.v2(-50,0));
        // let move2 = cc.moveBy(0.5,cc.v2(50,0));
        // let seq = cc.sequence(cc.delayTime(1),move1,move2,cc.delayTime(3));
        // // let seq = cc.sequence(move,);
        // // let action = cc.repeatForever(act);
        // // this.Btn_moreGame.runAction(action);
        // cc.tween(this.Btn_moreGame).then(seq).repeatForever().start();
    }

    showView()
    {
        this.hutuiView.active = !this.hutuiView.active ;
        GameManger.Instacne.NativeControl_oppo.isShowMoreGame = this.hutuiView.active ;
        if(  this.hutuiView.active )
        {
            this.Btn_moreGame.getChildByName("red_icon").active = false ;
            GameManger.Instacne.NativeControl_oppo.red_icon = true ;
            // var date = new Date();
            // var year = date.getFullYear(); 
            // var month =date.getMonth() + 1; 
            // var day = date.getDate(); 
            // let  Timer =  "Timer"+ year + month + day ;//天数为单位
            // cc.sys.localStorage.setItem( "red_icon" , Timer);

            if(GameManger.Instacne.NativeControl_oppo.oppo_userIP_is_GD||!GameManger.Instacne.NativeControl_oppo.oppoAd_Type) 
            {
                GameManger.Instacne.adsManger.HideBanner();
                GameManger.Instacne.NativeControl_oppo.HideNativeBanner();
                GameManger.Instacne.NativeControl_oppo.HideNativeInter();
                GameManger.Instacne.NativeControl_oppo.HideNativeIconAd();
            }
        }
    }
    loadGameJson()
    {
        let self = this ;
        let  URL = "https://hutui-1300278118.cos.ap-chengdu.myqcloud.com/oppohutui/hutui.json"
        cc.loader.load(URL,(err,res)=>{
            if(err)
            {
                console.log( "lqr 加载 腾讯 json 失败" ,URL,);
                return ;
            }
            this.InitView(res);
        });
    }
    InitView(json)
    {
        let data =  json.hutui;

        this.Btn_moreGame.active = true; 
        for(let i=0 ; i < data.length -1  ; i++){
            let node = cc.instantiate(this.huTuiItem);
            node.parent = this.hutuiParent;
        }
        let children = this.hutuiParent.children ; 
        for( let i = 0 ; i < children.length  ; i++ ){
            let node = children[i] ;
            node.name = data[i].id;
            node.on(cc.Node.EventType.TOUCH_END, this.click_hutui, this);

            // https://hutui-1300278118.cos.ap-chengdu.myqcloud.com/oppohutui/%E5%AE%9D%E5%AE%9D%E7%94%9C%E5%93%81%E7%83%98%E7%84%99%E5%B1%8B.png
            let url = "https://hutui-1300278118.cos.ap-chengdu.myqcloud.com/oppohutui/"+data[i].name+".png";
            cc.loader.load(url,function(err,res){
                if( err ) {
                    console.log(url);
                    return ;
                }
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
                let hopeItemW = 100 ;
                let hopeItemH = 100 ;
                let scale1 = (hopeItemW)/node.width;
                let scale2 = (hopeItemH)/node.height;
                scale1 = scale1>scale2?scale2:scale1;
                node.scale = scale1;
            })
            node.position = this.getItemPosition(children.length,i);
        }
    }
    getItemPosition(length,i)
    {
        let ii = Math.floor( i/3 );
        let jj = i % 3 ;
        let xx = -150 + 150 * ii ;
        let yy = -150 + 150 * jj ;
        return cc.v3(xx,yy,0);
    }
    click_hutui(event,){
        let flag = event.target.name;
        console.log("lqr.click_hutui",flag);
        if( cc.sys.platform == cc.sys.DESKTOP_BROWSER ) return ;
        qg.navigateToMiniGame({
            pkgName: flag,
            success: function() {
                console.log("lqr oppo 互推成功")
            },
            fail: function(res) {
            console.log("lqr oppo 互推失败",JSON.stringify(res))
            }
        })
    }

}
