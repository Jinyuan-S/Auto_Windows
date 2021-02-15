const { writeHeapSnapshot } = require("v8");

var xhr = new XMLHttpRequest(); 

var comfortTemperature = 28; 

function GetVPP(ventilationStrategy) {
    if(ventilationStrategy == "default") return 30; 
}

class TimeBlock{
    constructor(id, len, starttime, airqualityTimeline, temperatureTimeline, windspeedTimeline) {
        this.id = id; 
        this.len = len; // 时间长度
        this.recommended = false; 
        this.airqualityTimeline = []; 
        this.temperatureTimeline = []; 
        this.windspeedTimeline = []; 
        for (var i = startime, j = 0; i < starttime + len; i ++, j ++) {
            this.airqualityTimeline[j] = airqualityTimeline[i]; 
            this.temperatureTimeline[j] = temperatureTimeline[i]; 
            this.windspeedTimeline[j] = windspeedTimeline[i]; 
        }
    }

    CalcTempScore(temperature) {
        var tempDiff = Math.abs(temperature - comfortTemperature); 
        return -tempDiff;  
    }

    CalcAQScore(airquality) {
        return -(airquality / 10); 
    }

    ClacVentilation(windspeed) { // 返回一分钟内的期望通风

    }

    Calculate() { // 计算分数、通风量，需要调参
        this.tempScore = 100;
        this.aqScore = 100;  
        this.ventilation = 0; 
        for (var i = 0; i < this.len; i ++) {
            this.tempScore += CalcTempScore(this.temperatureTimeline[i]); 
            this.aqScore += CalcAQScore(this.airqualityTimeline[i]); 
            this.ventilation += ClacVentilation(windspeedTimeline[i]); 
        }
    }
}

class RecommendTime {
    constructor(l, r, avgTempScore, avgAqScore, ventilation) {
        this.l = l; 
        this.r = r; 
        this.avgTempScore = avgTempScore; 
        this.avgAqScore = avgAqScore; 
        this.ventilation = ventilation; 
    }
}

function cmpRecommendTime(a, b) { 
    if (a.avgTempScore + a.avgAqScore == b.avgTempScore + b.avgAqScore) 
        return (a.ventilation < b.ventilation) ? 1 : -1; 
    return (a.avgTempScore + a.avgAqScore < b.avgTempScore + b.avgAqScore) ? 1 : -1; 
}

recommend = []; 
timeblock = []; 
const aqScoreLimit = 80;
const tempScoreLimit = 80; 
const consecutiveTimeLimit = 15; // 推荐的手动开关窗的最小连续时间

function main(Data) {
    var time = Data.time; // 计算未来多长时间内的通风情况 (min)
    var len = Data.len; // 计算区分度，单位分钟
    var ventilationPerPeople = GetVPP(Data.ventilationStrategy); 
    var requiredVentilation = ventilationPerPeople * Data.people;  

    var tot = 0; // 区块总数
    for (var i = 0; i < time; i += len) {
        timeblock[tot] = new TimeBlock(tot, len, i, Data.airqualityTimeline, Data.temperatureTimeline, Data.windspeedTimeline); 
        timeblcok[tot].Calculate(); 
        tot ++; 
    }

    var st = -1, totRec = 0;
    var avgTempScore, avgAqScore, ventilation; 
    
    for (var i = 0; i <= tot; i ++) {
        if (i == tot || timeblock[tot].tempScore < tempScoreLimit || timeblock[tot].aqScore < aqScoreLimit) {
            if (st != -1) {
                var tempLen = i - st; 
                if (templen * len < consecutiveTimeLimit) { st = -1; continue; }
                avgTempScore /= tempLen; 
                avgAqScore /= tempLen; 
                recommend[totRec] = new RecommendTime(st, i - 1, avgTempScore, avgAqScore, ventilation); 
                totRec ++;
            }
            st = -1; continue; 
        }

        if (st == -1) {
            st = i;
            avgTempScore = 0; 
            avgAqScore = 0; 
            ventilation = 0; 
        }
        avgTempScore += timeblock[i].tempScore; 
        avgAqScodre += timeblock[i].aqScore; 
        ventilation += timeblock[i].ventilation; 
    }

    recommend.sort(cmpRecommendTime); 
    ventilation = 0; 
    for (var i = 0; i < totRec; i ++) {
        if (ventilation >= requiredVentilation) break; 
        for (var j = recommend[i].l; j <= recommend[i].r; j ++)
            timeline[j].recommended = true; 
        ventilation += recommend[i].ventilation; 
    }
}