let drawFactoryView = (paper, id) => {
    paper.image("./web/image/jnzq.png", 0, 0, 1360, 680);
    let attr = {
        "fill": "#B8BBBD", //B8BBBD
        "stroke-width": 0,
        "fill-opacity": 0.75,
        "stroke": "#FFFFFF"
    };
    return {
        10: {
            MAC: paper.path('M415.5,188v33H395v-33H415.5z').attr(attr)
        },
        11: {
            MAC: paper.path('M569,216.5V253h-23v-36.5H569z').attr(attr)
        },
        12: {
            MAC: paper.path('M745,251v39h-24.5v-39H745z').attr(attr)
        },
        13: {
            MAC: paper.path('M752.5,146.5v32h-20.75v-32H752.5z').attr(attr)
        },
        14: {
            MAC: paper.path('M1055.491,188.655l-2.123,33.934l-22.91-1.434l2.123-33.934L1055.491,188.655z').attr(attr)
        },
        Robot: {

        }
    }
}