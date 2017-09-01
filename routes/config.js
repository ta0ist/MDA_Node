﻿module.exports = {
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
    webIP: '192.168.0.96',
    webPort: 8015,
    model: 'HGFH'
}