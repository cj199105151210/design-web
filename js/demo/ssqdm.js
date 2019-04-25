var MySsqdmb = function () {
    function dialogOpen(id){
        $.ajax({
            type:'post',
            url:'gateway/yxxt/ssqdmb/queryById',
            data:{fid:id},
            dataType:'json',
            success:function (res) {
                $('#ssqdmbForm_fid').attr('value',res.fid);
                $('#fsqdm').attr('value',res.fsqdm);
                $('#fsqmc').attr('value',res.fsqmc);
                console.log(res);
            }
        })

        $('#ssqdmbDialog').dialog('open');
    }


    function deleteSsqdmbData(id) {
        $.messager.confirm('删除','确认删除吗？',function (r) {
            if (r){
                $.ajax({
                    type:'post',
                    url:'gateway/yxxt/ssqdmb/doDelete.do',
                    data:{fid:id},
                    dataType:'json',
                    success:function (res) {
                        if (res.code==500){
                            $.messager.alert('报错',res.desc);
                        }
                        $('#ssqdmb').datagrid('reload');
                    },
                    error:function (res) {
                        console.log(123)
                    }
                })
            }
        })
    }

    return {
        dialogOpen:function (id) {
            dialogOpen(id);
        },
        deleteSsqdmbData:function (id) {
            deleteSsqdmbData(id);
        }
    }

}();


var ssqdmData = TemplateManagerPage.extend("ssqdm",{
    initForm:function(){
        function optSsqdmb(val,row){
            var rowId = row.fid;
            var btn = '<button onclick="MySsqdmb.dialogOpen(\''+rowId+'\')">编辑</button>'+
                '<button onclick="MySsqdmb.deleteSsqdmbData(\''+rowId+'\')">删除</button>';

            return btn;
        }

        $('#ssqdmb').datagrid({

            title: '省市区代码',  //表格名称
            iconCls: 'icon-edit',  //图标
            fit:"true",
            width:1088,   //表格宽度
            height:'auto',   //表格高度，可指定高度，可自动
            border:true,  //表格是否显示边框
            url:'gateway/yxxt/ssqdmb/query.do',   //获取表格数据时请求的地址
            columns:[[
                {field:'fid',title:'主键',width:200,hidden:true},
                {field:'fsqdm',title:'省市区代码', align:'center',width:200},
                {field:'fsqmc', title:'省市区名称', align:'center',width:400},
                {field:'dispose',title:'操作',width:425,align:'center',formatter:optSsqdmb}

            ]],
            pagination:true,// 如果表格需要支持分页，必须设置该选项为true
            pageNumber:1,
            pageSize:50,   // 表格中每页显示的行数
            pageList:[10,50,100,200,500],
            rownumbers:true,   // 是否显示行号
            nowrap: false,
            collapsible: true,
            striped: true,  // 奇偶行是否使用不同的颜色
            method:'post',   // 表格数据获取方式,请求地址是上面定义的url
            // sortName: 'ID', //按照ID列的值排序
            remoteSort:"true",
            idField: 'id',
            loadMsg:'数据正在努力加载，请稍后...',   // 加载数据时显示提示信息
            beforePageText:'第',
            afterPageText:'页 共{pages}页',
            displayMsg:'当前显示{from}-{to}条记录，共{total}条记录',
            showRefresh:false,
            follow:'all',
            frozenColumns: [[  // 固定在表格左侧的栏
                {field: 'ck', checkbox: true},
            ]],
        });

        $('#addSsqdmb').click(function () {
            console.log('新增');
            $('#ssqdmbForm_fid').attr('value','');
            $('#fsqdm').attr('value','');
            $('#fsqmc').attr('value','');
            $('#ssqdmbDialog').dialog('open');
        })

        $('#ssqdmbDialog').dialog({
            autoOpen: false,
            title: '省市区代码',
            maximizable: true,
            resizable: true,
            width: 300,
            height: 300,
            modal: true,
            buttons : [ {
                text : '保存',
                handler : function() {
                    var fid =  $('#ssqdmbForm_fid').val();
                    var fsqdm =  $('#fsqdm').val();
                    var fsqmc = $('#fsqmc').val();
                    var obj = {};
                    obj.fid=fid;
                    obj.fsqdm = fsqdm;
                    obj.fsqmc = fsqmc;
                    $.ajax({
                        type:'post',
                        url:'gateway/yxxt/ssqdmb/update.do',
                        data:{data:JSON.stringify(obj)},
                        dataType:'json',
                        success:function (res) {
                            if (res.code==500){
                                $.messager.alert('报错',res.desc);
                                $('#ssqdmbForm').form('reset');
                            }
                            $("#ssqdmbDialog").dialog('close');
                            $('#ssqdmb').datagrid('reload');

                        },
                        error:function (res) {
                            console.log(123+res);

                        }

                    })

                }
            }, {
                text : '取消',
                handler : function() {
                    $("#ssqdmbDialog").dialog('close');
                }
            } ],
        });
        $("#ssqdmbDialog").dialog('close');
    },
    initTable: function(res){

    }

});


ssqdmData.directiveData={
		
}