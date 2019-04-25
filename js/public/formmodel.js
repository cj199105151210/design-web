
var RightSelectPage = AXBasePage.extend("formmodel",
{

    sumbit:function () {


       var name = this.scope.name;

        if ( !name )
        {

           layer.msg("表单分类为空,请填写表单");
           return;

        }
        else
        {
            var zTreeVo = {};
            zTreeVo.pId = ax.root.AXModalInfo.guid;
            zTreeVo.name = name;
            ax.call(url_make('bdfl/saveOrUpdateByTree',"zTreeVo",zTreeVo),this.initProvice);
        }

    },
    initProvice:function (res) {

        var data = res.data;
        if( data.code == 1 )
        {
            var formObj = ax.root.AXModalInfo.formObj;
            formObj.initData();
            layer.msg(data.desc);
            ax.root.AXModalInfo._hide();
        }
        else
        {
            layer.msg(data.desc);
            ax.root.AXModalInfo._hide();
        }

    }
});
