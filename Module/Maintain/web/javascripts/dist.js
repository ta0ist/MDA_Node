//guid


if (typeof(kendo) != "undefined") {

    /*KendoUI Extend 获取选择的行数据*/
    kendo.ui.Grid.prototype.selectedDataRows = function() {
        var rows = this.select();
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push(this.dataItem(rows[i]));
        }
        return data;
    };
    /*删除选择行的数据*/
    kendo.ui.Grid.prototype.deleteDataRows = function(ds) {
        var rows = this.select();
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push(this.dataItem(rows[i]));
        }
        if (data.length == 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            ds.remove(data[i]);
        }
        ds.sync();
        return true;
    };
    /*grid 调整大小*/
    kendo.ui.Grid.prototype.resizeGrid = function(height) {
        var gridElement = $(this);
        var dataArea = gridElement[0].content;

        var newGridHeight = height;
        var newDataAreaHeight = newGridHeight - 65;

        dataArea.height(newDataAreaHeight);
        gridElement[0].element.height(newGridHeight);

        this.refresh();
    };
}