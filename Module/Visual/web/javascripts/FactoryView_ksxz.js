var drawFactoryView = function (paper, id) {
    //var paper = Raphael("context", 1360, 680);
    var option = {
        "fill": "#B8BBBD",
            "stroke-width": 0,
            "fill-opacity": 1,
            "stroke": "#FFFFFF"
    }
    if (id == 1) {
        paper.image("/Modules/Visual/Images/车间1.png", 0, 90, 1360, 500);
        return {
            A015: {
                MAC: paper.path('M 1169.0 253.5 C 1169.0 265.0 1169.0 265.0 1169.0 265.0 C 1171.75 267.0 1171.75 267.0 1171.75 ' +
        '267.0 C 1175.25 266.75 1175.25 266.75 1175.25 266.75 C 1179.25 266.75 1179.25 266.75 1179.25 266.75 C 1181.25 ' +
        '265.0 1181.25 265.0 1181.25 265.0 C 1181.5 253.0 1181.5 253.0 1181.5 253.0 C 1177.5 254.0 1177.5 254.0 1177.5 ' +
        '254.0 C 1174.5 254.0 1174.5 254.0 1174.5 254.0 C 1171.0 253.5 1171.0 253.5 1171.0 253.5 z').attr()
            }
        }
    }
    else {
        paper.image("./Visual/web/image/昆山旭正.png", 0, 0, 1360, 680);
        return {
            "A05": {
                MAC: paper.path('M136,117v15.333h-11.25V117H136z').attr(option)
            },
            "A06": {
                MAC: paper.path('M159.75,128v16H148.5v-16H159.75z').attr(option)
            },"A07": {
                MAC: paper.path('M186,140v16h-12.25v-16H186z').attr(option)
            },"A08": {
                MAC: paper.path('M215,153v17h-12.25v-17H215z').attr(option)
            },"A04": {
                MAC: paper.path('M404,110v14.667h-10.25V110H404z').attr(option)
            },"A03": {
                MAC: paper.path('M438,120v15h-10.25v-15H438z').attr(option)
            },"A02": {
                MAC: paper.path('M476,130.25v15.5h-11v-15.5H476z').attr(option)
            },"A01": {
                MAC: paper.path('M517,142v15.5h-11.25V142H517z').attr(option)
            },"B01": {
                MAC: paper.path('M611,166v18.75h-13V166H611z').attr(option)
            },"B02": {
                MAC: paper.path('M654.75,178.75V198h-12.5v-19.25H654.75z').attr(option)
            },"B03": {
                MAC: paper.path('M703.75,191.75V212h-13v-20.25H703.75z').attr(option)
            },"B04": {
                MAC: paper.path('M758,206.75v21h-14v-21H758z').attr(option)
            },"B05": {
                MAC: paper.path('M818.25,223.75v22H804v-22H818.25z').attr(option)
            },"B06": {
                MAC: paper.path('M884.75,242v23.75H870V242H884.75z').attr(option)
            },"B07": {
                MAC: paper.path('M959.5,262.75V288H944v-25.25H959.5z').attr(option)
            },"B08": {
                MAC: paper.path('M1045.006,286.01l-1.021,27.481l-16.981-0.631l1.021-27.481L1045.006,286.01z').attr(option)
            },"B09": {
                MAC: paper.path('M1142.851,312.776l-1.304,28.626l-19.197-0.875l1.305-28.627L1142.851,312.776z').attr(option)
            },"B10": {
                MAC: paper.path('M1253.427,343.903l-1.391,30.519l-20.249-0.923l1.391-30.519L1253.427,343.903z').attr(option)
            }
        }
    }
}