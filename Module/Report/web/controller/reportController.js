var grid;
app.controller('reportctrl', ['$scope', '$http', function($scope, $http) {
    $http.get('/reports/GetRepostName').success(function(data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: gettreeReport(data.Data)
                },
                template: kendo.template($("#treeview-template").html()),
                select: function(e) {
                    var name = $(e.node).find('[attr="treenode"]').text();
                    renderReport(name);
                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));
                renderReport($(treeview.select()).find('.k-state-selected span').text());
            }
        } else {
            BzAlert(data.Message);
        }

    })
}])

function gettreeReport(data) {
    var dd = [];
    for (var i = 0; i < data.length; i++) {
        var tjson = {};
        tjson.text = data[i];
        tjson.icon = "icon-list-alt";
        dd.push(tjson);
    }
    return dd;
}

//生成报表查询界面
function renderReport(name) {
    var pars = {
        "LineName": { value: "MachineGroup", name: lang.Report.ProductionLine },
        "Machine": { value: "Machine", name: lang.EmployeePerformance.Equipment },
        "StartDate": { value: "DateTime", name: lang.EmployeePerformance.StartTime },
        "EndDate": { value: "DateTime", name: lang.EmployeePerformance.EndTime },
        "Shift": { value: "Shift", name: lang.EmployeePerformance.Shift },
        "PlanNo": { value: "Plan", name: lang.Report.ProductionPlanNumber },
        "Type": { value: "Type", name: lang.Report.ReportType },
        "OperatorDate": { value: "DateTime", name: lang.Report.OperationDate },
        "Parameters": { value: "Pars", name: lang.Report.Parameter },
        "StartNum": { value: "Num", name: lang.Report.BeginToValue },
        "EndNum": { value: "Num", name: lang.Report.EndValue },
        "part_no": { value: "part_no", name: lang.Order.ProductName },
        "mem_nbr": { value: "mem_nbr", name: lang.EmployeePerformance.Personnel },
        "statis": { value: "statis", name: lang.Report.TypesOfQueries }
    };
    switch (name) {
        //报表名称不用翻译；需要和模板对应
        case "状态用时及占比报表":
        case "停机原因用时及占比报表":
            var tpars = ["Machine", "StartDate", "EndDate", "statis", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "机床每日产量报表":
            var tpars = ["Machine", "StartDate", "EndDate", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "产线加工进度报表":
            var tpars = ["LineName", "Machine", "StartDate", "EndDate", "Shift", "PlanNo", "Type", "OperatorDate"];
            creatSearchPars(pars, tpars, name);
            break;
        case "备件库存报表":
            var tpars = ["part_no", "StartDate", "EndDate", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "主轴负载报表":
            var tpars = ["LineName", "Machine", "StartDate", "EndDate", "StartNum", "EndNum", "Shift", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "历史报警分析报表":
            var tpars = ["LineName", "Machine", "StartDate", "EndDate", "Shift", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "产品质量分析报表":
            var tpars = ["PlanNo", "StartDate", "EndDate", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "抽检数据报表":
            var tpars = ["PlanNo", "Machine", "StartDate", "EndDate", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "停机原因分析报表":
            var tpars = ["LineName", "Machine", "StartDate", "EndDate", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "刀具寿命报表":
            var tpars = ["Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "设备稼动率报表":
        case "设备每日产量报表":
        case "机床参数报表":
            var tpars = ["Machine", "StartDate", "EndDate", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "运行参数（主轴倍率）":
            var tpars = ["LineName", "Machine", "StartDate", "EndDate", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        case "人员绩效报表":
            var tpars = ["Machine", "mem_nbr", "StartDate", "EndDate", "statis", "Type"];
            creatSearchPars(pars, tpars, name);
            break;
        default:
            $("#searchPars").empty();
            break;
    }
}

function creatSearchPars(pars, tpars, name) {
    $("#searchPars").empty();
    for (var i = 0; i < tpars.length; i++) {
        var shtml = '<div class="control-group">' +
            '<label class="control-label" data-lang="Common.PASSWORD" style="width:90px;">' + pars[tpars[i]].name + '</label>' +
            '<div class="controls" style="margin-left:100px;">' +
            '<input type="text" id="' + tpars[i] + '" name="' + tpars[i] + '" class="m-wrap" />' +
            '</div>' +
            '</div>';
        if (i == tpars.length - 1) {
            var shtml = shtml + '<div class="control-group">' +
                '<div class="controls" style="margin-left: 100px;">' +
                '<div id="Win_Submit" class="btn green" style=" width: 170px;" >' + lang.Report.Export + '<i class="icon-search"></i></div>' +
                '</div>' +
                '</div>';
        }
        $("#searchPars").append(shtml);
        //初始化控件
        switch (pars[tpars[i]].value) {
            case "MachineGroup":
                $("#" + tpars[i]).multipleComboxTree({
                    url: "/machine/GetGrouplist_Customer",
                    url2: "/machine/GetKeywordGrouplist",
                    type: 1,
                    data: {
                        GroupId: 0
                    },
                    checkbox: true
                }).data("BZ-multipleComboxTree");
                break;
            case "Machine":
                $("#" + tpars[i]).multipleComboxTree({
                    url: "/Alarm/GetAllMachineAndMachineGroup",
                    url2: "/Alarm/GetKeywordMachinelist",
                    type: 2,
                    data: {
                        GroupId: 0
                    },
                    checkbox: true
                }).data("BZ-multipleComboxTree");
                break;
            case "DateTime":
                $("#" + tpars[i]).css("width", "200px");
                $("#" + tpars[i]).kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
                break;
            case "Shift":
                $("#" + tpars[i]).multipleComboxTree({
                    url: "/Common/Shift/GetAllShift",
                    url2: "/Common/Shift/GetAllShift",
                    type: 8,
                    data: "",
                    tree: false
                }).data("BZ-multipleComboxTree");
                break;
            case "Plan":
                $("#" + tpars[i]).multipleComboxTree({
                    url: "/YieldAnalysis/QualityEfficiency/GetPlans",
                    url2: "/YieldAnalysis/QualityEfficiency/GetPlans",
                    type: 6,
                    data: "",
                    tree: false
                }).data("BZ-multipleComboxTree");
                break;
            case "Type":
                $("#" + tpars[i]).css("width", "200px");
                $("#" + tpars[i]).kendoComboBox({
                    dataTextField: "text",
                    dataValueField: "value",
                    dataSource: {
                        type: "json",
                        transport: {
                            read: {
                                url: '/reports/GetRepostType',
                            }
                        },
                        schema: {
                            data: function(response) {
                                var dd = [];
                                for (var i = 0; i < response.Data.length; i++) {
                                    var tjson = {}
                                    tjson.value = response.Data[i].Value;
                                    tjson.text = response.Data[i].Name;
                                    dd.push(tjson);
                                }
                                return dd;
                            }
                        }
                    }
                });
                break;
            case "Num":
                $("#" + tpars[i]).css("width", "200px");
                $("#" + tpars[i]).kendoNumericTextBox({ format: "n0", min: 0, value: 0 });
                break;
            case "part_no":
                $("#" + tpars[i]).multipleComboxTree({
                    url: "/TpmPart/PartManage/GetPartListByKeyWord",
                    url2: "/TpmPart/PartManage/GetPartListByKeyWord",
                    type: 11,
                    size: 100000000,
                    tree: false
                }).data("BZ-multipleComboxTree");
                break;
            case "mem_nbr":
                $("#" + tpars[i]).multipleComboxTree({
                    url: "/member/GetAllMemberAndMemberGroup",
                    url2: "/member/GetKeywordMemberlist",
                    type: 4,
                    data: {
                        GroupId: 0
                    },
                    checkbox: true,
                }).data("BZ-multipleComboxTree");
                break;
            case "statis":
                $("#" + tpars[i]).kendoComboBox({
                    dataTextField: "text",
                    dataValueField: "value",
                    dataSource: [
                        { text: lang.EmployeePerformance.Shift, value: 1 },
                        { text: lang.EmployeePerformance.Day, value: 2 },
                        { text: lang.EmployeePerformance.Weeks, value: 3 },
                        { text: lang.EmployeePerformance.Month, value: 4 },
                        { text: lang.EmployeePerformance.Years, value: 5 }
                    ],
                    value: 2
                });
                break;
        }
    }
    //导出
    $("#Win_Submit").bind("click", function() {

        var dd = {};
        dd.filename = name;
        dd.filetype = $("#Type").data("kendoComboBox").value();
        if (dd.filetype == '') {
            BzAlert(lang.Report.Alert_1);
            return;
        }
        dd.parameters = [];
        for (var mm = 0; mm < tpars.length; mm++) {
            var tt = {};
            if (tpars[mm] != "Type") {
                switch (tpars[mm]) {
                    case "LineName":
                    case "Machine":
                    case "Shift":
                    case "mem_nbr":
                        tt.FieldName = tpars[mm];
                        var p = [];
                        var kk = $("#" + tpars[mm]).data("BZ-multipleComboxTree");
                        for (var m in kk.dataAarry) {
                            p.push(parseInt(m));
                        }
                        tt.FieldValue = p.toString();
                        tt.FieldType = "string";
                        break;
                    case "PlanNo":
                    case "part_no":
                        tt.FieldName = tpars[mm];
                        var p = [];
                        var kk = $("#" + tpars[mm]).data("BZ-multipleComboxTree");
                        for (var m in kk.dataAarry) {
                            p.push(m);
                        }
                        tt.FieldValue = p.toString();
                        tt.FieldType = "string";
                        break;
                    case "StartDate":
                    case "EndDate":
                        tt.FieldName = tpars[mm];
                        tt.FieldValue = $("#" + tpars[mm]).val()
                        tt.FieldType = "date";
                        break;
                    case "StartNum":
                    case "EndNum":
                        tt.FieldName = tpars[mm];
                        tt.FieldType = "string";
                        tt.FieldValue = $("#" + tpars[mm]).data("kendoNumericTextBox").value();
                        break;
                    case "statis":
                        tt.FieldName = tpars[mm];
                        tt.FieldType = "int";
                        tt.FieldValue = parseInt($("#" + tpars[mm]).data("kendoComboBox").value());
                        break;
                }
                dd.parameters.push(tt);
            }
        }
        var pe = $('#path').html();
        window.open("http://localhost:27516/Modules/Report/Report.asmx/GetRepost?filename=" + dd.filename + ".json&filetype=" + dd.filetype + "&parameters=" + JSON.stringify(dd.parameters) + "&templateName=" + pe + "\\" + dd.filename + ".json");
    });
}