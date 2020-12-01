import { puremvc } from "../ScriptCore/puremvc/puremvc";
import GameManger from "../ScriptCore/common/GameManger";


export class selectyData{
    name:string;
    big_checkpoint:number;
    small_checkpoint:number;
    isLoadSubpackage:boolean;
    isLoadGameJson:boolean;
    // constructor(index:number){
    //     this.big_checkpoint = index;
    // }
    // public GetSelectIndex2():number{
    //     return this.index;
    // }
    // public SetSelectIndex2(num:number){
    //     this.index = num ;
    // }
    add_small_checkpoint()
    {
        cc.sys.localStorage.setItem( "Unlock_max" + this.big_checkpoint + "min"+this.small_checkpoint , "true");

        this.small_checkpoint ++ ;

        cc.sys.localStorage.setItem( "max" + this.big_checkpoint + "min"+this.small_checkpoint , "true");

        // cc.sys.localStorage.setItem( "big_checkpoint" + this.big_checkpoint , this.small_checkpoint);
    }
    get_local_checkpoint(key:number)
    {
        // let index = cc.sys.localStorage.getItem("big_checkpoint" + key);
        // if( index == null || index == "" ) 
        // {
        //     cc.sys.localStorage.setItem( "big_checkpoint" + key , 1);
        // }
        // index =  cc.sys.localStorage.getItem("big_checkpoint" + key);
        // index = Number(index);
        // return index;
    }
}

export default class selectProxy extends puremvc.TProxy {
    data:selectyData;
    // gameManger:GameManger =null;
    onRegister()
    {
        this.data = new selectyData();
        this.data.name = "selectyData" ;
        this.data.big_checkpoint = 0 ;
        this.data.small_checkpoint = 0 ;
        this.data.isLoadSubpackage = false ;
        this.data.isLoadGameJson = false ;
    }
    // public GetSelectIndex():number{
    //     return this.data.index;
    // }
    // public SetSelectIndex(num:number){
    //     this.data.index = num ;
    // }
}
