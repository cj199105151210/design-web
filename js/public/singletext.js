var SingleTextPage = TemplateManagerPage.extend("singletext",
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
       this.str["text_type"] = this.scope.text_type;
       this.str["text_align"] = this.scope.text_align;
       this.str["text_value"] = this.scope.text_value;
       this.scope.AXModalInfo.callback1(this.str);

    },

    dbNameCheck:function () {
        this.regx = /^[a-zA-Z][a-z_A-Z]*$/;
        if ( !this.regx.test( this.scope.text_dbname ) )
        {
            layer.msg("请输入字母");
            this.scope.text_dbname = "";
            return ;
        }
    }

});