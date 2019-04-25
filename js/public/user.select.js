
var UserSelectPage = AXBasePage.extend("userSelect",
{
    initForm: function()
    {
        ax.page.home.initOrganization(this.initTreeOrg.bind(this));
        if (this.scope.AXModalInfo.selectedUser)
            this.updateSelected(this.scope.AXModalInfo.selectedUser);
    },
    initTreeOrg: function()
    {
        this.treeOrg = ax.getElement(this, "treeview-org").treeview(
        {
            data: ax.page.home.scope.g_org.tree,
            text: function(o){return o.areaCode + "：" + o.deptName;},
            levels: ax.page.home.scope.g_org.tree.length == 1 ? 2 : 1,
            onNodeSelected: this.treeOrgSelected.bind(this)
        });
    },
    treeOrgSelected: function(event, node)
    {
        this.currOrg = node;
        ax.call(url_make("sys/dept/qryDeptUserList", {deptId:node.data.deptId, isRecur:1}), this.initTreeUser, node.data.deptId);
    },
    initTreeUser: function(ret)
    {
        if (ret.context != this.currOrg.data.deptId)
            return;
        var userData = url_data(ret);
        var orgData = this.treeOrg.copyTree(this.currOrg);
        this.makeOrgUserTree(orgData, userData);
        this.treeUser = ax.getElement(this, "treeview-user").treeview(
        {
            data: orgData,
            showIcon: true,
            showCheckbox: true,
            highlightSelected: false
        });
    },
    makeOrgUserTree: function(orgData, userData)
    {
        ax.func.visitTree(orgData, function(nodes, index)
        {
            var node = nodes[index];
            for (var i in userData)
            {
                var u = userData[i];
                if (u.deptId != node.id)
                    continue;
                u = {id:u.userId, pid:u.deptId, data:u, text:u.userName, isuser:true, icon:"fa fa-user", color:"#337ab7"};
                if (node.nodes) 
                {
                    if (node.nodes[0].isgroup)
                        node.nodes[0].nodes.push(u);
                    else if (node.nodes[0].isuser)
                        node.nodes.push(u);
                    else
                        node.nodes.unshift({id:-node.id, pid:node.pid, isgroup:true, text:"< "+node.text+" >", nodes:[u]});
                }
                else 
                    node.nodes = [u];
            }
            if (!node.nodes)
                nodes.splice(index, 1);
        });
    },
    updateSelected: function(data)
    {
        this.treeSelected = ax.getElement(this, "treeview-selected").treeview(
        {
            data: data,
            showIcon: true,
            showCheckbox: true,
            highlightSelected: false
        });
    },
    addUser: function(isall)
    {
        if (!this.treeUser)
            return;
        var checked = isall ? this.treeUser.getData() : this.treeUser.getCheckedData();
        if (!checked.length)
            return;
        var orgs = [];
        var users = [];
        var nodes = this.treeSelected ? this.treeSelected.getData().concat(checked) : checked;
        for (var i in nodes)
        {
            var u = nodes[i];
            if (u.userId && !ax.func.getObject(users, "userId", u.userId))
            {
                users.push(u);
                if (!ax.func.getObject(orgs, "deptId", u.deptId))
                {
                    u = ax.func.getObject(ax.page.home.scope.g_org.data, "deptId", u.deptId);
                    orgs.push({deptId:u.deptId, pDeptId:u.pDeptId, deptName:u.deptName, areaCode:u.areaCode});
                }
            }
        }
        orgs.sort(function(a,b){return a.orderNum>b.orderNum || a.areaCode>b.areaCode;});
        orgs = ax.func.list2tree(orgs, "deptId", "pDeptId", "deptName");
        this.makeOrgUserTree(orgs, users);
        this.updateSelected(orgs);
    },
    addUserAll: function()
    {
        if (this.treeUser)
            this.addUser(true);
    },
    decUser: function()
    {
        if (this.treeSelected)
            this.treeSelected.removeNode(this.treeSelected.getChecked());
    },
    decUserAll: function()
    {
        if (this.treeSelected)
            this.updateSelected();
    },
    submit: function()
    {
        this.scope.AXModalInfo.callback(this.treeSelected && this.treeSelected.getTree());
    }

});
