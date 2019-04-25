var RightSelectPage = TemplateManagerPage.extend("detailControl",
    {

        initForm: function () {
            this.str = {};
            this.scope.con = {"control_name": "", "control_dbName": ""};
        },
        cotor:function(scope)
        {

        },

        dbNameCheck:function () {
            this.regx = /^[a-zA-Z][a-z_A-Z]*$/;
            if ( !this.regx.test( this.scope.con.control_dbName ) )
            {
                layer.msg("请输入字母");
                this.scope.control_dbName = "";
                return ;
            }
        },

        insertDetails: function () {
            this.scope.source = this.scope.source || [];
            this.scope.source.push({detail_db_name: "", detail_name: ""});
        },
        deleteDetails: function () {
            var radio = $("input[name='checked1']");
            for (var i = radio.length; i > 0; i--) {
                if (radio[i - 1].checked) {
                    this.scope.source.splice(i - 1, 1);
                }
            }
        },
        typeChange: function (row, flag) {
            if (flag) {
                row.detail_db_type = row.detail_type;
            } else {
                row.detail_type = row.detail_db_type;
            }
        },
        detailSave: function () {
            if (!this.scope.con.control_name || !this.scope.con.control_dbName) {
                layer.msg("请查看必填选项");
                return;
            }
            if (this.scope.source && this.scope.source.length > 0) {
                for (var i = 0; i < this.scope.source.length; i++) {
                    if (!this.scope.source[i]["detail_db_name"]
                        || !this.scope.source[i]["detail_name"]
                        || !this.scope.source[i]["detail_type"]
                        || !this.scope.source[i]["detail_db_type"]) {
                        layer.msg("请添加选项值");
                        return;
                    }

                    var reg1=/^[a-zA-Z]+$/g;
                    var reg2=/^[\u0391-\uFFE5]+$/g;
                    if(!reg1.test(this.scope.source[i]["detail_db_name"] )){
                        layer.msg("数据库字段名称只能为英文字母！");
                        return;
                    }
                    if(!reg2.test(this.scope.source[i]["detail_name"] )){
                        layer.msg("字段显示名必须为中文！");
                        return;
                    }
                }
            } else {
                layer.msg("请添加选项");
                return;
            }

            var name = [];
            for (var j=0;j<this.scope.source.length;j++){
                var alldetailname = this.scope.source[j]["detail_name"];
                name.push(alldetailname);
            }
            console.info(name)
            // console.log(alldetailname[j]);
            // console.log(this.scope.source);
            // console.log(this.scope.source.length);
            // console.log(this.scope.source[0].detail_name);

            this.html1 = "";
            this.html1 += "<input name = " + this.scope.con.control_name + " type = 'text' " + " bositype = 'detailControl'"
                        + " ng-model = " + this.scope.con.control_dbName
                        + " bosivalue = " + name
                        // +"bosivalue = (" +name[0] +","+name[1]+")" 不能展示
                // + " bosivalue = (" + this.scope.source[0].detail_name + ","+  this.scope.source[1].detail_name+")"
                        + " value = '{detailControl}'" + "\>";

            console.log(this.html1);
            ue.execCommand('insertHtml',this.html1);
            ax.root.AXModalInfo._hide();

        }

    });
