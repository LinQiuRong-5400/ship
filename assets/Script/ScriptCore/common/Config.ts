export class Config  {
    // 读取
	GetItemLockFlags(name:string)
	{
		return cc.sys.localStorage.getItem(name);
	}
	// 存取
	SetItemLockFlags(name:string,value:string)
	{
		cc.sys.localStorage.setItem(name, value);
	}
	// 移除
	RemoveItemLockFlags(name:string)
	{
		cc.sys.localStorage.removeItem(name);
	}
	// 获取时间
	GetNowTime()
	{
        return new Date().getTime(); // 秒数为单位
	}
	// 获取时间字符串
	GetNowTimeStr()
	{
		let date = new Date();
        let year = date.getFullYear(); 
        let month = date.getMonth() + 1; 
        let day = date.getDate(); 
        return "Timer:" + year + month + day; // 天数为单位
	}
	//返回min到max中的随机数
	RangeRandom(min:number,max:number)
	{
		let range = max - min;
		let rand = Math.floor(Math.random() * range) + min;
		return rand;
    }
    // 获取旋转角度
    getAngle(pointA:cc.Vec2,pointB:cc.Vec2,pointC:cc.Vec2)
    {
        let lengthAB = Math.sqrt( Math.pow(pointA.x - pointB.x, 2) + 
                Math.pow(pointA.y - pointB.y, 2)),
        lengthAC = Math.sqrt( Math.pow(pointA.x - pointC.x, 2) + 
                    Math.pow(pointA.y - pointC.y, 2)),
        lengthBC = Math.sqrt( Math.pow(pointB.x - pointC.x, 2) + 
                    Math.pow(pointB.y - pointC.y, 2));
        let cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / 
                        (2 * lengthAB * lengthAC);
        let angleA = Math.round( Math.acos(cosA) * 180 / Math.PI );
        console.log("angleA",angleA);
        return angleA ;
    }
};
