
var TemplateManagerPage = TemplateQueryPage.extend("TemplateManagerPage",
{
    initForm: function()
    {

        /*
        this.serv_query = "";
        this.serv_insert = "";
        this.serv_update = "";
        this.serv_delete = "";
        this.id_field = "";
        this.nonull_fields = {};
        */
    },
    insertRecord: function()
    {
        this.scope.modify = {};
        this.scope.modify_state = "insert";
    },
    modifyRecord: function(rec)
    {
        this.scope.modify = ax.func.copyObject(rec);
        this.scope.modify_state = "modify";

    },
	modifyRecordChange: function(rec)
    {

       ax.modal({template:"page/bosi/baseData/ssqdmEdit.html", callback:null,  fsqdm:rec.fsqdm, fsqmc:rec.fsqmc, fid:rec.fid});

    },
    modifyRecordChangeTzydmb: function(rec)
   {

    ax.modal({template:"page/bosi/baseData/tzydmbEdit.html", callback:null,  fxl:rec.fxl, fkl:rec.fkl, fjhxzdm:rec.fjhxzdm,
        fzynbdm:rec.fzynbdm,fzydm:rec.fzydm,fzymc:rec.fzymc,fxydm:rec.fxydm,fid:rec.fid});

   },
    modifyRecordChangeTxydmb: function(rec)
    {
     ax.modal({template:"page/bosi/baseData/txydmbEdit.html", callback:null,  fxydm:rec.fxydm, fxymc:rec.fxymc, fxybz:rec.fxybz, fid:rec.fid});

    },
    modifyRecordChangeSdjzyb: function(rec)
    {
        ax.modal({template:"page/bosi/baseData/sdjzybEdit.html", callback:null,  fdjzy:rec.fdjzy, fdjzymc:rec.fdjzymc, fdjzymclong:rec.fdjzymclong, fid:rec.fid});

    },
    modifyRecordChangeSkldmb: function(rec)
    {
        ax.modal({template:"page/bosi/baseData/skldmbEdit.html", callback:null, fkl:rec.fkl,fklmc:rec.fklmc, fid:rec.fid});

    },
    modifyRecordInsert: function(rec)
    {
    	 ax.modal({template:"page/bosi/baseData/ssqdmInsert.html", callback:null});

    },
    modifyRecordInsertTzydmb: function(rec)
    {
        ax.modal({template:"page/bosi/baseData/tzydmbInsert.html", callback:null});

    },
    modifyRecordInsertTxydmb: function(rec)
    {
        ax.modal({template:"page/bosi/baseData/txydmbInsert.html", callback:null});

    },
    modifyRecordInsertSdjzyb: function(rec)
    {
        ax.modal({template:"page/bosi/baseData/sdjzybInsert.html", callback:null});

    },
    modifyRecordInsertSkldmb: function(rec)
    {
        ax.modal({template:"page/bosi/baseData/skldmbInsert.html", callback:null});

    },
    modifyRecordTzshLayout: function(rec)
    {
        ax.modal({template:"page/bosi/notificationManage/tzshLayout.html", callback:null});

    },
    modifydjyxInsert: function()
    {
    	alert(111);
    	 ax.modal({template:"page/bosi/baseData/djyxInsert.html", callback:null});

    },
    modifydjyxChange: function(rec)
    {

       ax.modal({template:"page/bosi/baseData/djyxEdit.html", callback:null,  fdjyx:rec.fdjyx, fdjyxmc:rec.fdjyxmc, fdjyxmclong:rec.fdjyxmclong,  fid:rec.fid});

    },

    deleteRecord: function(rec)
    {
        ax.confirm("确认删除记录吗？", (function()
        {
            ax.call(url_make(this.serv_delete, this.id_field, rec[this.id_field]), this.deleteRecordOK, rec);
        }).bind(this));
    },

    deleteRecordOK: function(ret)
    {
        if (url_data(ret))
            this.scope.recordList.splice(this.scope.recordList.indexOf(ret.context), 1);
    },
    checkValid: function()
    {
        for (var i in this.nonull_fields)
            if (!this.scope.modify[i])
            {
                ax.alert("请填写：" + ax.func.getObjectValues(this.nonull_fields));
                return false;
            }
        return true;
    },
    commit: function()
    {
        if (this.checkValid())
        {
            ax.call(url_make(this.scope.modify_state=="insert" ? this.serv_insert : this.serv_update, this.scope.modify), this.commitOK, {lowercase:true});
            ax.modal({template:AXTemplate.modalLock, wait:'正在保存...', result:'保存成功', locked:true, callback:this.cancel});
        }
    },
    commitOK: function(ret)
    {
        ax.root.AXModalInfo.locked = false;
        var data = url_data(ret, true);
        if (!data)
        {
            ax.root.AXModalInfo.result = url_last_error;
            ax.root.AXModalInfo.callback = null;
        }
        else if (this.scope.modify_state == "insert")
            this.insertRecordOK(data);
        else
            this.updateRecordOK(data);
    },
    insertRecordOK: function(data)
    {
        this.scope.modify[this.id_field] = data;
        if (!this.scope.recordList)
            this.scope.recordList = [this.scope.modify];
        else
            this.scope.recordList.unshift(this.scope.modify);
    },
    updateRecordOK: function(data)
    {
        var rec = ax.func.getObject(this.scope.recordList, this.id_field, this.scope.modify[this.id_field]);
        ax.func.updateObject(rec, this.scope.modify);
    },
    cancel: function()
    {
        this.scope.modify_state = false;
    }

});
/*
TemplateQueryPage.directiveData =
{
    lblTitle: {template:"label_icon", size:"5", icon:"glyphicon glyphicon-th", text:"查询条件"},
    tblQuery:
    {
        template:"table",
        params:
        {
            td_property: {p0_1:'colspan="3"'},
            rows:
            [
                ["所属区域：", {template:"input_select", value:"condition.region_name", click:"selectRegion()"}],
                ["用户账号：", '<input ng-model="condition.user_no"></input>'  , "手机号码：", '<input ng-model="condition.phone"></input>'],
                ["用户姓名：", '<input ng-model="condition.user_name"></input>', "身份证号：", '<input ng-model="condition.card_no"></input>']
            ]
        }
    },
    btnInsert: {template:"button_insert", click:"insertRecord()"},
    btnQuery: {template:"button_query", click:"queryRecord()"},
    tblResult:
    {
        template:"table_source",
        titles:{user_id:"ID", user_no:"用户账号", user_name:'用户姓名', region_name:"所属区域", phone:'手机号码', card_no:'身份证号'},
        source:"recordList",
        action:true,
        action_modify:true,
        action_delete:true,
        modify_click:"modifyRecord(row)",
        delete_click:"deleteRecord(row)"
    },

    ////编辑页
    lblModify: {template:"label_icon", size:"5", icon:"glyphicon glyphicon-th", text:"编辑"},
    tblModify:
    {
        template:"table",
        params:
        {
            td_property: {p0_1:'colspan="3"', p4_1:'colspan="3"'},
            rows:
            [
                ["ID：", '<b>{{modify.user_id}}</b>'],
                ["用户账号：", '<input ng-model="modify.user_no"></input> ※'  , "所属区域：", {template:"input_select", value:"modify.region_name", click:"selectRegion()"}],
                ["用户密码：", '<input ng-model="modify.user_pwd"></input> ※' , "手机号码：", '<input ng-model="modify.phone"></input>'],
                ["用户姓名：", '<input ng-model="modify.user_name"></input>', "身份证号：", '<input ng-model="modify.card_no"></input>'],
                ["备注："   , '<textarea ng-model="modify.remark" class="form-control" rows="3" style="resize:none"></textarea>']
            ]
        }
    },
    btnSubmit: {template:"button_submit", click:"commit()"},
    btnCancel: {template:"button_cancel", click:"cancel()"}
};
*/