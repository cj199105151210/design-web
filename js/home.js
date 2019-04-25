var HomePage = AXBasePage.extend("home",
{
    initForm: function()
    {
        this.scope.g_org = {};
        this.scope.tabs = [];
        var userCode = $.cookie('the_cookie');
        if (!userCode) {
             window.location.href='login.html';
            return;
        }

        ax.call(url_make("getMenuData",{userCode:userCode}), this.querySystemOK);

    },
    querySystemOK: function(ret)
    {
        // $(function(){$("#side-menu").metisMenu()});
        ax.removeElementById("axLoading");
        var data = url_data(ret);
        if (data)
        {
            data = angular.isString(data) ? eval("(" + data + ")") : data;
            document.title = data.document_title;
            this.scope.system = data;
        }

        $(function() {
            $('#side-menu').metisMenu();
        });

    },

    //退出登录
    loginOut: function(){
        var storage = window.localStorage;
        storage.removeItem('userData');
       location.replace('login.html');
    },
    menuClick: function(menu)
    {

        if (this.scope.tabs.indexOf(menu) < 0)
        {
            if (menu.axclass)
                menu.url = AXTemplate.pageRemote;
            else if (menu.page_id)
            {
                menu.url = undefined;
                ax.ui.queryPage(menu.page_id, this.createPage.bind(this), menu);
            }
            this.scope.tabs.push(menu);
        }
        this.scope.currTab = menu;
    },
    createPage: function(axclass, menu)
    {
        menu.axclass = axclass.id;
        menu.url = AXTemplate.pageRemote;
        this.scope.$apply();
    },
    tabClick: function(tab)
    {
        this.scope.currTab = tab;
    },
    tabClose: function(tab)
    {
        var tabs = this.scope.tabs;
        var index = tabs.indexOf(tab);
        tabs.splice(index, 1);
        if (this.scope.currTab == tab)
            this.scope.currTab = tabs.length > index ? tabs[index] : (tabs.length>0?tabs[index-1]:null);
        if (tab.page && ax.page[tab.page])
            delete ax.page[tab.page];
    },
    getContentHeight: function()
    {
        return window.innerHeight - 50 - $("#page-tabs").height() - 41;
    },
    // initOrganization: function(callback)
    // {
    //     if (!this.scope.g_org.data)
    //         ax.call(url_make("sys/dept/qryChildList", {deptId:"00000000000000000000000000004313"}), this.initOrganizationOK, callback);
    //     else if (callback)
    //         callback();
    // },
    // initOrganizationOK: function(ret)
    // {
    //     this.scope.g_org.data = url_data(ret);
    //     this.scope.g_org.data.sort(function(a,b){return a.orderNum>b.orderNum || a.areaCode>b.areaCode;});
    //     this.scope.g_org.tree = ax.func.list2tree(this.scope.g_org.data, "deptId", "pDeptId", "deptName");
    //     if (ret.context)
    //         ret.context();
    // },
    // selectedOrganization: function(event, node)
    // {
    //     this.scope.g_org.selected = node;
    // },
    // new1: function()
    // {
    //     return 2;
    // }

});

