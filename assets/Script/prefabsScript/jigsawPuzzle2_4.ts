
import { puremvc } from "../ScriptCore/puremvc/puremvc";
import selectProxy from "../Proxys/selectProxy";
import GameManger from "../ScriptCore/common/GameManger";
const {ccclass, property} = cc._decorator;
let self ;
@ccclass
export default class jigsawPuzzle1_1 extends puremvc.Component {

    __start () {
        self = this ;
        // 加载船的骨骼动画
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;

        let imageUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/t8_1_sep_01.png';
        let skeUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/t8_1_dock_2.json';
        let atlasUrl = "Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +'/t8_1_dock_2.atlas';
        GameManger.Instacne.loaderSkeleton(imageUrl,skeUrl,atlasUrl,"t8_1_sep_01.png",(err,res)=>{
                if( err ) console.log( "ship_prefab load err" , err );
                if( err ) return ;
                console.log("lqr loaderSkeleton ok !")
                let node = new cc.Node("end_animation");
                node.parent = self.node ;
                node.addComponent(sp.Skeleton);
                let spine = node.getComponent(sp.Skeleton);
                spine.premultipliedAlpha = false ;
                spine.skeletonData = res;
                node.active = false ;
            });

        // cc.loader.loadRes("Checkpoint_ani/big_checkpoint"+big_checkpoint+"/small_checkpoint"+ small_checkpoint +
        // '/t8_1_dock_2', sp.SkeletonData,(err,res)=>{
        //     if( err ) console.log( "ship_prefab load err" , err );
        //     if( err ) return ;
        //     let node = new cc.Node("end_animation");
        //     node.parent = self.node;
        //     node.addComponent(sp.Skeleton);
        //     let spine = node.getComponent(sp.Skeleton);
        //     // spine.premultipliedAlpha = false ;
        //     spine.skeletonData = res;
        //     node.active = false ;  
        // });
    }
    // 驶出动画
    end_animation()
    {
        if( this.node.getChildByName("end_animation") == null )
        {
            console.log("lqr end_animation Node is null");
            return this.scheduleOnce(this.end_animation.bind(this),0.1 );
        }
        GameManger.Instacne.AudioEngine.playShipAudioByUrl("out","g8_dredger"); // 音效
        
        this.node.getChildByName("ship").active = false ;
        let end_skeleton = this.node.getChildByName("end_animation").getComponent(sp.Skeleton);
        end_skeleton.node.active = true ;
        // end_skeleton.node.y = -83 ;
        end_skeleton.timeScale = 2 ;
        end_skeleton.setAnimation( 0,"dock_liftdown_1",false );
        // cc.log("end_animation");
        let index = 0 ;
        end_skeleton.setCompleteListener(function(){
            index++;
            if( index == 1)
            {
                end_skeleton.timeScale = 1 ;
                end_skeleton.addAnimation( 1,"dock_swimout_1",false );
            }
            else if(  index == 2 )
            {
                // cc.director.loadScene("main");
                self.node.getComponent("game").next_scene();
            }
            // self.bg_animation();
        });

        // 船拖
        let bg_tech_lift = this.node.getChildByName("BG").getChildByName("bg_tech_lift").getComponent(sp.Skeleton);
        bg_tech_lift.setAnimation( 0,"liftdown",false );


        // g13_dock_1
        // dock_swimout_1
        // dock_idle_3
        // dock_swimin_3
    }

    // update (dt) {}
}
