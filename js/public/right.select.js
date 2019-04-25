
var RightSelectPage = AXBasePage.extend("rightSelect",
{
    initForm: function()
    {
        ax.call(url_make("sys/user/qryUserPermList", {"userId":"1","userType":"0"}), this.initRight);
    },
    initRight: function(ret)
    {
        this.treeRight = ax.getElement(this, "treeview-right").treeview(
        {
            data: ax.func.list2tree(url_data(ret), "permId", "pPermId", "permName"),
            showIcon: false,
            showCheckbox: true,
            highlightSelected: false
        });
    },
    initRightGroup: function(ret)
    {
        var data = url_data(ret);
        if (!data)
            return;
        var groupData = [];
        for (var i in data)
        {
            var d = data[i];
            var g = {id:d.permgroupId, text:d.permgroupName};
            if (d.permList && d.permList.length)
            {
                g.nodes = g.nodes || [];
                for (var j in d.permList)
                    g.nodes.push({id:g.id+"_"+d.permList[j].permId, pid:g.id, text:d.permList[j].permName, data:d.permList[j]});
            }
            groupData.push(g);
        }
        this.treeRightGroup = ax.getElement(this, "treeview-right-group").treeview(
        {
            data: groupData,
            showIcon: false,
            showCheckbox: true,
            highlightSelected: false
        });
    },
    switchShowType: function()
    {
        if (this.scope.showType == "group" && !this.treeRightGroup)
            ax.call(url_make("sys/permGroup/qrySysPermgroupByUserId", {"userId":"1"}), this.initRightGroup);
    },
    updateRightSelected: function(data)
    {
        this.treeRightSelected = ax.getElement(this, "treeview-right-selected").treeview(
        {
            data: data,
            showIcon: false,
            showCheckbox: true,
            highlightSelected: false
        });
    },
    addRight: function()
    {
        if (this.treeRight)
        {
            var selected = this.scope.showType == "menu" ? this.treeRight.getCheckedData() : this.treeRightGroup.getCheckedData();
            var nodes = this.treeRightSelected ? this.treeRightSelected.getData().concat(selected) : selected;
            this.updateRightSelected(ax.func.list2tree(nodes, "permId", "pPermId", "permName"));
        }
    },
    addRightAll: function(event, node)
    {
        if (this.treeRight)
        {
            var selected = this.scope.showType == "menu" ? this.treeRight.getData() : this.treeRightGroup.getData();
            var nodes = this.treeRightSelected ? this.treeRightSelected.getData().concat(selected) : selected;
            this.updateRightSelected(ax.func.list2tree(nodes, "permId", "pPermId", "permName"));
        }
    },
    decRight: function()
    {
        if (this.treeRightSelected)
            this.treeRightSelected.removeNode(this.treeRightSelected.getChecked());
    },
    decRightAll: function()
    {
        if (this.treeRightSelected)
            this.updateRightSelected();
    },
    submit: function()
    {
        this.scope.AXModalInfo.callback(this.treeRightSelected && this.treeRightSelected.getTree());
    }
});
