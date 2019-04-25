
var TemplateQueryPage = AXBasePage.extend("TemplateQueryPage",
{
    ctor: function(scope)
    {
        this.node = "";

       this.serv =  "bdlb/queryAllForm";

    },
    initForm: function()
    {
        /*
        this.serv_query = "user/query";
        */
    },
    resetCondition: function()
    {
        this.scope.condition = {};
    },
    queryRecord: function()
    {
        this.scope.loading = true;
        if (this.scope._tablePageInfo)
            this.scope._tablePageInfo.query();
        else
            ax.call(url_make(this.serv, this.scope.condition), this.queryRecordOK);
    },
    queryRecordOK: function(ret)
    {
        this.scope.loading = false;
        this.scope.recordList = angular.isArray(ret) ? ret:url_data(ret);
    }
});
/*
TemplateQueryPage.directiveData =
{
    lblTitle: {template:"label_icon", size:"5", icon:"glyphicon glyphicon-th", text:"查询条件"},
    lblDesc: {template:"label_icon", size:"6", icon:"", text:"<br>这里是描述<br>"},
    tblQuery:
    {
        template:"table",
        params:
        {
            table_class: undefined,
            td_custom: undefined,
            td_property0: undefined,
            td_property1: undefined,
            td_property: {p0_1:'colspan="3"'},
            rows:
            [
                ["所属区域：", '<input ng-model="condition.region_id"></input>'],
                ["用户账号：", '<input ng-model="condition.user_no"></input>'  , "手机号码：", '<input ng-model="condition.phone"></input>'],
                ["用户姓名：", '<input ng-model="condition.user_name"></input>', "身份证号：", '<input ng-model="condition.card_no"></input>']
            ]
        }
    },
    btnQuery:  {template:"button_query" , click:"queryRecord()"},
    tblResult: 
    {
        template:"table_source", 
        titles:{user_id:"ID", user_no:"用户账号", user_name:'用户姓名', region_name:"所属区域", phone:'手机号码', card_no:'身份证号'}, 
        source:"recordList", 
        show_no:undefined,
        action:true, 
        action_modify:true, 
        action_delete:true, 
        modify_click:"modifyRecord(row)", 
        delete_click:"deleteRecord(row)"
    }
};
*/