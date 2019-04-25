
var RightSelectPage = TemplateManagerPage.extend("importimage",
    {

        initForm:function () {

        },
        imagesave:function () {

            if (  !this.scope.con.image_dbname  ||  !this.scope.con.image_name )
            {
                layer.msg("请查看必填选项");
                return ;
            }
            this.html1 = "";
            this.html1 += "<input name = "+this.scope.con.image_name+" "+ "type = 'text' "+ " "+"bositype = 'image'"+
           " "+ "bosiimagelength = "+this.scope.con.image_length+" "+"bosiimagewitdh = "+this.scope.con.image_height+" "+"value = '{image}'"
            +" "+"ng-model="+this.scope.con.image_dbname+" "+"\/>";
            ue.execCommand('insertHtml',this.html1);
            ax.root.AXModalInfo._hide();
        },

        dbNameCheck:function () {
            this.regx = /^[a-zA-Z][a-z_A-Z]*$/;
            if ( !this.regx.test( this.scope.con.image_dbname ) )
            {
                layer.msg("请输入字母");
                this.scope.con.image_dbname = "";
                return ;
            }
        },

        length:function (con) {

            var re = /^[1-9]+\d*$/;

            if ( !re.test(con.image_length)  )
            {
                layer.msg("请输入正整数");
                con.image_length = 100;
                return;

            }
            if (  !re.test(con.image_height) )
            {
                layer.msg("请输入正整数");
                con.image_height = 100;
                return;

            }

        }
    });
