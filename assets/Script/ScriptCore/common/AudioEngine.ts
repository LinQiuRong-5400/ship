

import { puremvc } from "../puremvc/puremvc";
import audio from "./audio";
import GameManger from "./GameManger";
import selectProxy from "../../Proxys/selectProxy";

const { ccclass, property } = cc._decorator;

// @ccclass('LanStringList')
// class LanStringList {
//     @property({
//         type:[cc.String],
//         displayName:"list"
//     })
//     list:string[] = [];
// }

let self ;
@ccclass
export default class audioEngine extends puremvc.Component {
    @property({
        type:[cc.String],
        displayName:"背景音效"
    })
    BGmusicURL:string[] = [];
    Clip_BGmusic:cc.AudioClip[] = [];
    @property({
        type:[cc.String],
        displayName:"步骤开始"
    })
    stepStartURL:string[] = [];
    Clip_stepStart:cc.AudioClip[] = [];
    @property({
        type:[cc.String],
        displayName:"步骤结束"
    })
    stepOverURl:string[] = [];
    Clip_stepOver:cc.AudioClip[] = [];
    @property({
        type:[audio],
        displayName:"关卡船名字"
    })
    CheckpointAudio: audio[] = [];
    Clip_Checkpoint:cc.AudioClip[][] = [];
    // @property([LanStringList])
    // title: LanStringList[] = [];
    __onLoad()
    {
        self = this ;
        GameManger.Instacne.AudioEngine = this ;

        this.Clip_Checkpoint.length = this.CheckpointAudio.length ;
        this.Clip_Checkpoint[0] = [] ;  this.Clip_Checkpoint[1] = [];
        this.Clip_Checkpoint[0].length =  this.CheckpointAudio[0].audios.length ;
        this.Clip_Checkpoint[1].length =  this.CheckpointAudio[1].audios.length ;

        this.Clip_BGmusic.length = this.BGmusicURL.length ;
        this.Clip_stepStart.length = this.stepStartURL.length ;
        this.Clip_stepOver.length = this.stepOverURl.length ;

        console.log( 'AudioEngine __start' );
    }
    // 游戏模式
    GameModelAudio(model:string)
    {
        switch(model) {
            case "select":
                this.playAudio_BGmusic(0);
               break;
            case "game":
                this.playAudio_BGmusic(1);
                this.playAudio_stepStart(0);
               break;
            case "main1":
                this.playAudio_BGmusic(1);
                this.playAudio_stepStart(1);
                break;
            case "main2":
                this.playAudio_BGmusic(2);
                this.playAudio_stepStart(2);
                break;
            case "main3":
                this.playAudio_BGmusic(1);
                this.playAudio_stepStart(3);
                break;
            default:
                break;
       }
    }
    // --------------------------------------
    // 游戏背景
    audioId_stepStart = null; 
    // 游戏背景
    playAudio_stepStart(num:number)
    {

        if( this.audioId_stepStart != null )
        {
            cc.audioEngine.stopEffect(this.audioId_stepStart);
            this.audioId_stepStart = null ;
        }

        if( this.Clip_stepStart[num] )
        {
            if(num == 2) this.audioId_stepStart = cc.audioEngine.playEffect(this.Clip_stepStart[num], true);
            else if(num == 0)
            {
                this.audioId_stepStart = cc.audioEngine.playEffect(this.Clip_stepStart[num], false, 1);
                let time = cc.audioEngine.getDuration(this.audioId_stepStart);
                this.scheduleOnce(()=>{
                    this.playAudio_shipName();
                },1.5)
            }
            else
            {
                this.audioId_stepStart = cc.audioEngine.playEffect(this.Clip_stepStart[num], false, 1);
            }
        }
        else
        {
            let self = this ;
            this.loadAudio(this.stepStartURL[num],( res )=>{
                self.Clip_stepStart[num] = res ;
                self.playAudio_stepStart(num);
            })
        }
    }
    // 船
    audioId_shipName = null;
    playAudio_shipName()
    {
        let selectProxy:selectProxy = this.facade.retrieveProxy("selectProxy");
        let big_checkpoint = selectProxy.data.big_checkpoint ;
        let small_checkpoint = selectProxy.data.small_checkpoint ;

        if( this.audioId_shipName != null )
        {
            cc.audioEngine.stopEffect(this.audioId_shipName);
            this.audioId_shipName = null ;
        }

        if( this.Clip_Checkpoint[big_checkpoint-1][small_checkpoint-1] )
        {
            this.audioId_shipName = cc.audioEngine.playEffect(this.Clip_Checkpoint[big_checkpoint-1][small_checkpoint-1], false);
        }
        else
        {
            let self = this ;
            this.loadAudio("shipName/"+this.CheckpointAudio[big_checkpoint-1].audios[small_checkpoint-1],( res )=>{
                self.Clip_Checkpoint[big_checkpoint-1][small_checkpoint-1] = res ;
                self.playAudio_shipName();
            })
        }

    }
    // --------------------------------------
    // 游戏背景
    audioId_BGmusic = null; 
    // 游戏背景
    playAudio_BGmusic(num:number)
    {
        // return
        if( this.audioId_BGmusic != null )
        {
            cc.audioEngine.stop(this.audioId_BGmusic);
            this.audioId_BGmusic = null ;
        }

        if( this.Clip_BGmusic[num] )
        {
            this.audioId_BGmusic = cc.audioEngine.play(this.Clip_BGmusic[num], true, 1);
        }
        else
        {
            let self = this ;
            this.loadAudio(this.BGmusicURL[num],( res )=>{
                self.Clip_BGmusic[num] = res ;
                self.playAudio_BGmusic(num);
            })
        }
    }
    // --------------------------------------
    // 游戏结束
    GameModelEndAudio(model:string)
    {
        switch(model) {
            case "youOk":
                this.playAudio_GameModelEnd(0);
                break;
            case "youFinish":
                this.playAudio_GameModelEnd(1);
                break;
            default:
                break;
        }
    }
    // 游戏结束
    audioId_end = null; 
    playAudio_GameModelEnd(num:number)
    {
        if( this.Clip_stepOver[num] )
        {
            this.audioId_end = cc.audioEngine.playEffect(this.Clip_stepOver[num], false);
        }
        else
        {
            let self = this ;
            this.loadAudio(this.stepOverURl[num],( res )=>{
                self.Clip_stepOver[num] = res ;
                self.playAudio_GameModelEnd(num);
            })
        }
    }
    // --------------------------------------
    // url
    loadAudioList:Object = {};
    loadAudio(url:string,callback:Function)
    {
        // return ;
        let path = GameManger.Instacne.URL + "Audio/" + url +".mp3";
        if( self.serverAudioList[path] == null)
        {
            cc.loader.load( path, (err, res) => 
            {
                if (err) {
                    console.log(path,err);
                    return;
                }
                self.loadAudioList[path] = res ;
                callback && callback(res);
            });
        }
        else
        {
            callback && callback(self.loadAudioList[path]);
        }

        // 加载本地
        // cc.loader.loadRes("Audio/" + url, cc.AudioClip, (err, res) => {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     callback && callback(res);
        // });
    }
    serverAudioList:Object = {};
    playAudioByUrl(url:string)
    {
        let path = GameManger.Instacne.URL + "Audio/" + url +".mp3";
        console.log( "playAudioByUrl:" , path );
        if( self.serverAudioList[path] == null)
        {
            cc.loader.load( path, (err, res) => 
            {
                if (err) {
                    console.log(path,err);
                    return;
                }
                cc.audioEngine.playEffect(res, false);
                self.serverAudioList[path] = res ;
            });
        }
        else
        {
            cc.audioEngine.playEffect(self.serverAudioList[path], false);
        }

    }
    // ship
    shipAudioUrlList = [
        "g1_hydrographic_ship",
        "g2_diving_boat",
        "g3_stacker_ship",
        "g4_red_barge",
        "g5_crane_ship",
        "g6_yellow_barge",
        "g7_blue_barge",
        "g8_dredger",
        "g9_cantilever_ship",
        "g10_container_ship",
        "g11_ship_carrier",
        "g12_ferry",
        "g13_backhoe_dredger",
        "g15_sheerleg_barge",
    ];
    playShipAudio:Object = {};
    playShipAudioByUrl(type:string,shipId:string)
    {
        let path = null ;
        if(type == "out") path = GameManger.Instacne.URL + "Audio/码头出/" + shipId +".mp3";
        else if(type == "enter") path = GameManger.Instacne.URL + "Audio/码头进/"+ shipId +".mp3";
        else return ;
        if( self.playShipAudio[path] == null)
        {
            cc.loader.load( path, (err, res) => 
            {
                if (err) {
                    console.log(path,err);
                    return;
                }
                cc.audioEngine.playEffect(res, false);
                self.playShipAudio[path] = res ;
            });
        }
        else
        {
            cc.audioEngine.playEffect(self.playShipAudio[path], false);
        }
    }
    // action
    audioId_action = null; 
    shipActionUrlList = [
        "idle",
        "action_1",
        "action_2",
        "action_3",
        "action_4",
        "action_5",
    ];
    playActionAudio:Object = {};
    playActionAudioByUrl(max:number,min:number,type:number)
    {
        if(max == 2) return ;
        let path = GameManger.Instacne.URL + "Audio/" + "h" + max + "/st"+(min-1) +"/"+ this.shipActionUrlList[type] +".mp3";
        // if( type == -1 ) path = GameManger.Instacne.URL + "Audio/" + "h" + max + "/st"+(min-1) +"/"+ "h20_action_out" +".mp3";

        if( this.audioId_action != null )
        {
            cc.audioEngine.stop(this.audioId_action);
            this.audioId_action = null ;
        }

        console.log( "action:", "h" + max + "/st"+(min-1) +"/"+ this.shipActionUrlList[type] );

        let loop = type == 0 ;
        if( self.playActionAudio[path] == null)
        {
            cc.loader.load( path, (err, res) => 
            {
                if (err) {
                    console.log(path,err);
                    return;
                }

                self.audioId_action = cc.audioEngine.playEffect(res, loop);
                self.playActionAudio[path] = res ;
            });
        }
        else
        {
            self.audioId_action = cc.audioEngine.playEffect(self.playActionAudio[path], loop);
        }
    }
}
