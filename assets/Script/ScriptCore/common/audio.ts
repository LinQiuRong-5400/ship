// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

// 使用注解定义一个CCClass，名称就是Player，括号内是参数
// 如果不传参，将会有意想不到的意外
@ccclass("audio")
export default class audio {

    @property({
        type:[cc.String],
        displayName:"音效路径"
    })
    audios:string[] = [];

    // @property({
    //     displayName: "Q群"
    // })
    // qGroup = "704391772";
}
