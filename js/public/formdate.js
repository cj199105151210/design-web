
var RightSelectPage = TemplateManagerPage.extend("formdate",
    {

        initForm:function () {

        },
        cotor:function(scope)
        {

        },
        selectsave:function () {

            if (  !this.scope.con.date_name  ||  !this.scope.con.date_dbname )
            {
                layer.msg("请查看必填选项");
                return ;
            }

            if ( ue.getContent() )
            {
                var regex = /ng-model="(.+?)"/g;
                var regex1 = /name="(.+?)"/g;
                while (  (reslut = regex.exec(ue.getContent())) != null  )
                {
                    if ( this.scope.con.date_dbname == reslut[1] )
                    {
                        layer.msg("字段英文名重复，请注意");
                        return false
                    }
                }
                while (  (reslut = regex1.exec(ue.getContent())) != null  )
                {
                    if ( this.scope.con.date_name == reslut[1] )
                    {
                        layer.msg("控件名称重复");
                        return false
                    }
                }
            }
            console.log(this.scope.con.selected);

            this.html1 = "";

            this.html1 += "<input name = "+this.scope.con.date_name+" "+ "type = 'text' "+ "bositype = 'date'"+
                "bosidatelength = "+this.scope.con.length+" "+"value = "+this.scope.con.selected
                +" "+"ng-model="+this.scope.con.date_dbname+" "+"\/>";



            ue.execCommand('insertHtml',this.html1);
            ax.root.AXModalInfo._hide();
        },


        dbNameCheck:function () {
            this.regx = /^[a-zA-Z][a-z_A-Z]*$/;
            if ( !this.regx.test( this.scope.con.date_dbname ) )
            {
                layer.msg("请输入字母");
                this.scope.con.date_dbname = "";
                return ;
            }
        },

        length:function (con) {

            var re = /^[1-9]+\d*$/;

            if ( !re.test(con.length)  )
            {
                layer.msg("请输入正整数");
                con.length = 100;
                return;
            }

        }

    });
