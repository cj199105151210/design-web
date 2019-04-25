var SingleTextPage = TemplateManagerPage.extend("checkboxs",
    {

        initForm:function()
        {
            this.str = {};
            this.scope.con ={"text_name":"","text_dbname":"","radiocheck":1};
        },
        textareasave:function()
        {

            if (  !this.scope.con.text_name  ||  !this.scope.con.text_dbname )
            {
                layer.msg("请查看必填选项");
                return ;
            }
            if (  this.scope.source )
            {
                for (  var i = 0; i < this.scope.source.length; i++ )
                {
                    if ( !this.scope.source[i]["radio_name"] )
                    {
                        layer.msg("请添加选项值");
                        return false;
                    }
                }
            }
            this.str["condition"] = this.scope.con;
            this.str["source"] = this.scope.source;
            this.fnParseOptions(this.str);
        },
        //radios的组合
        fnParseOptions: function (str) {


            if ( ue.getContent() )
            {
                var regex = /ng-model="(.+?)"/g;
                var regex1 = /name="(.+?)"/g;
                while (  (reslut = regex.exec(ue.getContent())) != null  )
                {
                    if ( str.condition.text_dbname == reslut[1] )
                    {
                        layer.msg("字段英文名重复，请注意");
                        return false
                    }
                }
                while (  (reslut = regex1.exec(ue.getContent())) != null  )
                {
                    if ( str.condition.text_name == reslut[1] )
                    {
                        layer.msg("控件名称重复");
                        return false
                    }
                }

            }
            var radio=document.getElementsByName("checked1");
            for ( var  i = 0; i < radio.length; i++ )
            {
                if ( radio[i].checked )
                {
                    str.source[i]["radio_check"] = true;
                }
                else
                {
                    str.source[i]["radio_check"] = false;
                }
            }
            this.html = "";
            if ( str.source != undefined  ) {
                for (var i = 0; i < str.source.length; i++) {
                    if (str.source[i]["radio_check"] == true)
                        this.html += "<input name = " + str.condition.text_name + " type = \'checkbox\'"+" ng-model=" + str.condition.text_dbname+" " + "checked  "  + "ng-checked=\'true\' " + " ng-value = " + str.source[i]["radio_name"] +" "+ "\/> " + str.source[i]["radio_name"];
                    else
                        this.html += "<input name = " + str.condition.text_name + " type = \'checkbox\'"+" ng-model=" + str.condition.text_dbname+" "   + " ng-value = " + str.source[i]["radio_name"] +" "+ "\/> " + str.source[i]["radio_name"];
                    //如果是横排
                    if (str.condition["radiocheck"] == 0)
                        this.html += "<br/>";
                }

            }
            this.html2 = ""
            this.html2 = '{|-<span bositype = "checkboxs" bosiplugins="checkboxs" title="'+str.condition.text_name+'"  name= "' + str.condition.text_name + '" ng-model="' + str.condition.text_dbname + '">';
            this.html2 +=  this.html;
            this.html2 +='</span>-|}';

            ue.execCommand('insertHtml',this.html2);
            ax.root.AXModalInfo._hide();

        },

        dbNameCheck:function () {
            this.regx = /^[a-zA-Z][a-z_A-Z]*$/;
            if ( !this.regx.test( this.scope.con.text_dbname ) )
            {
                layer.msg("请输入字母");
                this.scope.text_dbname = "";
                return ;
            }
        },
        insertRadios:function () {
            this.scope.source = this.scope.source || [];
            this.scope.source.push({dealer_id:"",radio_check:"",radio_name:""});
        },
        deleteAccount: function(row)
        {
            this.scope.source.splice(this.scope.source.indexOf(row), 1);
        }

    });