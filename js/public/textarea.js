var SingleTextPage = TemplateManagerPage.extend("textarea",
{

    initForm:function()
    {
      this.str = {};
    },
    textareasave:function()
    {
        if (  !this.scope.text_name  ||  !this.scope.text_dbname )
        {
             layer.msg("请查看必填选项");
             return ;
        }

       this.str["text_name"] = this.scope.text_name;
       this.str["text_dbname"] = this.scope.text_dbname;
       this.str["text_length1"] = this.scope.text_length1;
       this.str["text_length2"] = this.scope.text_length2;
       this.str["text_size"] = this.scope.orgfontsize;
       this.str["text_value"] = this.scope.orgvalue;
       this.scope.AXModalInfo.callback(this.str);

    },
    dbNameCheck:function () {
        this.regx = /^[a-zA-Z][a-z_A-Z]*$/;

        if ( !this.regx.test( this.scope.text_dbname ) )
        {
            layer.msg("以字母开头");
            this.scope.text_dbname = "";
            return ;
        }
    },
    fontSizeCheck:function(){
     this.regx = /^\+?\d+$/;
        if ( !this.regx.test( this.scope.orgfontsize ) )
        {
            layer.msg("请输入正整数");
            this.scope.orgfontsize = 0;
            return ;
        }

    }

});