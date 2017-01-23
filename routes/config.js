module.exports = {
    //node发布端口
    port: '8080',

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
    // webIP: 'localhost',
    // webPort: 27516
    webIP: '192.168.0.95',
    webPort: 8013,
    model: 'SVG'
}