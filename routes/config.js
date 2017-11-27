module.exports = {
    //node发布端口
    port: '8899',

    //http post的格式
    options: {
        url: "",
        json: true,
        body: "",
        headers: {
            'content-type': 'application/json',
            'cookie': ''
        }
    },
    factory: [{
        "WORKSHOP_CODE": "cj01",
        "GP_NBR": [1],
        "PIC_IMG": './images/factory/威强电.png',
        "ORDER_NUM": 0,
        "ICON_IMG": "./images/factory/威强电.png"
    }],
    webIP: 'localhost',
    webPort: 27516,
    // webIP: 'localhost',
    // webPort: 8090,
    model: 'HGFH',
    DNCPath: 'D:\\DNC\\',
    Notice: {
        webscoketIP: '192.168.0.153',
        webscoketPort: 8883,
        open: true
    }

}