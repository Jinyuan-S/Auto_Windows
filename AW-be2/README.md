# AlphaWindow-be

Model Design
```js
window {
    id, // 窗户的id
    name, // 窗户的名字，默认为Undefined
    owner, // 持有者的id, 默认为None
    token,
    device_id, // Onenet上的设备id
    api_key, // Onenet上的apikey
    direciton, // 朝向 默认为None
    auto: true/false, // 窗户是否处于托管状态
    open: true/false, // 窗户是否处于开启状态
    has_owner: true/false， // 窗子是否已与账号绑定
    time_stamp: [...]
    // 后续可添加其他状态
}
condition {
    air_quality: {
        AQI,
        PM25, 
        PM10,
        O3,
        NO2,
        SO2,
        CO
    },
    weather: {
        weather: [...] // 天气
        wind_direction: [...], // 风向
        wind_speed: [...], // 风速
        humidity: [...], // 室外湿度
        temperature: [...] // 室外温度
    }
    /*
    indoor: {
        O2, // 含氧量
        RH, // 室内湿度
        TEM // 室内温度
    }
    */
}
user {
    id, 
    password,
    preference: {
        //rain, // 对降雨敏感
        //wind, // 对风敏感
        AQI, // 对空气质量敏感
        //RH, // 对湿度敏感
        //O2, // 对含氧量敏感
        TEM // 对温度敏感
    }
}
```