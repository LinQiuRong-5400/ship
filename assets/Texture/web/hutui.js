cc.Class({
    extends: cc.Component,

    properties: {
        huTuiItem:cc.Node,
        hutuiParent:cc.Node,
        huTui_Btn:cc.Node,
        close_Btn:cc.Node,
        redTips:cc.Node,
        Btn_add_ZhuoMian:cc.Node,
    },

    onLoad () {
        
        gameManager.hutuiMng = this ;

        this.node.active = false;
        this.huTui_Btn.active = false; 

        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "hutui";
        clickEventHandler.handler = "showView";
        clickEventHandler.customEventData = "lqr";
        this.huTui_Btn.getComponent(cc.Button).clickEvents.push(clickEventHandler);

        if( this.close_Btn != null )
        {
            let closeEventHandler = new cc.Component.EventHandler();
            closeEventHandler.target = this.node;
            closeEventHandler.component = "hutui";
            closeEventHandler.handler = "showView";
            closeEventHandler.customEventData = "lqr";
            this.close_Btn.getComponent(cc.Button).clickEvents.push(closeEventHandler);
        }
        if( this.Btn_add_ZhuoMian != null )
        {
            let addEventHandler = new cc.Component.EventHandler();
            addEventHandler.target = this.node;
            addEventHandler.component = "hutui";
            addEventHandler.handler = "Add_ZhuoMian";
            addEventHandler.customEventData = "lqr";
            this.Btn_add_ZhuoMian.getComponent(cc.Button).clickEvents.push(addEventHandler);
        }


        if(gameManager.channel!="oppo"){
            this.Btn_add_ZhuoMian.active = false ;
            return
        }
        else
        {
            if(!gameManager.adsManager.isShowAddZhuoMian)
            {
                this.Btn_add_ZhuoMian.active = false ;
                return ;
            }
            if(!gameManager.adsManager.isShowMyGame)
            {
                return ;
            }
        }

        let self = this;
        let callback = function(json)
        {
            self.InitView(json);
        };
        let  URL = "https://hutui-1300278118.cos.ap-chengdu.myqcloud.com/oppohutui/hutui"
        LoadManager.LoadRes( URL,callback,true,"json" );
    },

    InitView(json)
    {
        let data =  json.hutui;

        this.huTui_Btn.active = true; 
        for(let i=0 ; i < data.length -1  ; i++){
            let node = cc.instantiate(this.huTuiItem);
            node.parent = this.hutuiParent;
        }
        let children = this.hutuiParent.children ; 
        for( let i = 0 ; i < children.length  ; i++ ){
            let node = children[i] ;
            node.index = i;
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "hutui";
            clickEventHandler.handler = "click_hutui";
            clickEventHandler.customEventData = data[i].id;
            node.getComponent(cc.Button).clickEvents.push(clickEventHandler);


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


    },

    start () {
        return
        this.tag = 1; // 1 向右 0 向左
        if(cc.sys.localStorage.getItem('hutui')=="true"){
            this.redTips.active = false;
        }
    },

    showView()
    {
        this.node.active = !this.node.active ;
        if(  this.node.active )
        {
            gameManager.adsManager.HideBanner(); // 关闭广告
            if( gameManager.NativeControl != null )  gameManager.NativeControl.nativeBanner_closeFun();
            if( gameManager.NativeControl != null )  gameManager.NativeControl.nativeBanner_closeFun2();
        }
    },

    click_hutui(event,flag){
        console.log(flag,"lqr.click_hutui");
        qg.navigateToMiniGame({
            pkgName: flag,
            success: function() {
                console.log("lqr oppo 互推成功")
            },
            fail: function(res) {
            console.log("lqr oppo 互推失败",JSON.stringify(res))
            }
        })
    },

    getItemPosition(length,i)
    {
        let ii = Math.floor( i/3 );
        let jj = i % 3 ;
        let xx = -150 + 150 * ii ;
        let yy = -150 + 150 * jj ;
        return cc.v2(xx,yy);
    },

    Add_ZhuoMian()
    {
        this.Btn_add_ZhuoMian.active = false ;
        gameManager.adsManager.tianjiaZhuoMian(); // Add_ZhuoMian 
    }

 

    // update (dt) {},
});
