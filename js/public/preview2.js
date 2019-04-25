var DealerAccountPage = TemplateManagerPage.extend("preview2",
    {

        ctor: function(scope)
        {
            this.serv_query = "sys/adconfig/list";
            this.serv_insert = "sys/adconfig/insert";
            this.serv_update = "sys/adconfig/update";
            this.serv_status = "sys/adconfig/updateStatus";
            this.serv_delete = "sys/adconfig/delete";
            this.id_field = "ad_config_id";
            this.nonull_fields = {citys:"适用城市", begin_time:"开始时间", end_time:"结束时间", img_src:"图片"};
            this.commit_ids = {root:"ad_config", ad_config:"ad_config_id"};
        },
        uploaderClick: function()
        {
            this.uploader.selectFile();
        },
        showImage: function()
        {
            ImagePreviewPage.showUIImage(this, "uploaderPreview");
        },
        addOK: function()
        {
            log(11111);
        },
        commit: function()
        {
            if (this.uploader.upload())
                this._super();
        },
        initForm:function () {
            var params =
                {
                    file_type: "image",
                    //   url: url_make("sys/system/uploadFile"),
                    url_headers: undefined,
                    ui_input: "uploaderInput",
                    ui_preview: "uploaderPreview",
                    model_filepath: "modify.img_src",
                    callback_add: this.addOK.bind(this),
                    callback_succ: this.commit.bind(this),
                    callback_error: undefined
                };
            this.uploader = new AXUploaderClass(this, params);
            this._super();
            //使用正则表单式
            var preg =  /(\|-<span(((?!<span).)*plugins=\"(radios|checkboxs|select)\".*?)>(.*?)<\/span>-\||<(img|input|textarea|select).*?(<\/select>|<\/textarea>|\/>))/gi,
                preg_attr =/(\w+)=\"(.?|.+?)\"/gi,
                preg_group =/<input.*?\/>/gi;
            var pno = 0;
            var template = ue.getContent();
            var template_parse = template,template_data = new Array(),add_fields=new Object(),checkboxs=0;
            template.replace(preg, function(plugin,p1,p2,p3,p4,p5,p6){
                var parse_attr = new Array(),attr_arr_all = new Object(),name = '', select_dot = '' , is_new=false;
                var p0 = plugin;
                var tag = p6 ? p6 : p4;
                if(tag == 'radios' || tag == 'checkboxs')
                {
                    plugin = p2;
                }else if(tag == 'select')
                {
                    plugin = plugin.replace('|-','');
                    plugin = plugin.replace('-|','');
                }
                plugin.replace(preg_attr, function(str0,attr,val) {
                    if(attr=='name')
                    {
                        if(val=='NEWFIELD')
                        {
                            is_new=true;
                            fields++;
                            val = 'data_'+fields;
                        }
                        name = val;
                    }

                    if(tag=='select' && attr=='value')
                    {
                        if(!attr_arr_all[attr]) attr_arr_all[attr] = '';
                        attr_arr_all[attr] += select_dot + val;
                        select_dot = ',';
                    }else
                    {
                        attr_arr_all[attr] = val;
                    }
                    var oField = new Object();
                    oField[attr] = val;
                    parse_attr.push(oField);
                })
                /*alert(JSON.stringify(parse_attr));return;*/
                if(tag =='checkboxs') /*复选组  多个字段 */
                {
                    plugin = p0;
                    plugin = plugin.replace('|-','');
                    plugin = plugin.replace('-|','');
                    var name = 'checkboxs_'+checkboxs;
                    attr_arr_all['parse_name'] = name;
                    attr_arr_all['name'] = '';
                    attr_arr_all['value'] = '';

                    attr_arr_all['content'] = '<span plugins="checkboxs" bositype="checkboxs"  title="'+attr_arr_all['title']+'" ng-model="'+attr_arr_all['model']+'">';
                    var dot_name ='', dot_value = '';
                    p5.replace(preg_group, function(parse_group) {
                        var is_new=false,option = new Object();
                        parse_group.replace(preg_attr, function(str0,k,val) {
                            if(k=='name')
                            {
                                if(val=='NEWFIELD')
                                {
                                    is_new=true;
                                    fields++;
                                    val = 'data_'+fields;
                                }

                                attr_arr_all['name'] += dot_name + val;
                                dot_name = ',';

                            }
                            else if(k=='value')
                            {
                                attr_arr_all['value'] += dot_value + val;
                                dot_value = ',';

                            }
                            option[k] = val;
                        });

                        if(!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                        attr_arr_all['options'].push(option);
                        if(!option['checked']) option['checked'] = '';
                        var checked = option['checked'] ? 'checked="checked"' : '';
                        attr_arr_all['content'] +='<input type="checkbox" bositype="checkboxs" name="'+option['name']+'" value="'+option['value']+'" fieldname="' + attr_arr_all['fieldname'] + option['fieldname'] +'" ng-model="'+attr_arr_all['model']+ '" fieldflow="' + attr_arr_all['fieldflow'] + '" '+checked+'/>'+option['value']+'&nbsp;';

                        if(is_new)
                        {
                            var arr = new Object();
                            arr['name'] = option['name'];
                            arr['plugins'] = attr_arr_all['plugins'];
                            arr['fieldname'] = attr_arr_all['fieldname'] + option['fieldname'];
                            arr['fieldflow'] = attr_arr_all['fieldflow'];
                            add_fields[option['name']] = arr;
                        }

                    });
                    attr_arr_all['content'] += '</span>';

                    //parse
                    template = template.replace(plugin,attr_arr_all['content']);
                    template_parse = template_parse.replace(plugin,'{'+name+'}');
                    template_parse = template_parse.replace('{|-','');
                    template_parse = template_parse.replace('-|}','');
                    template_data[pno] = attr_arr_all;
                    checkboxs++;

                }
                else if(name)
                {
                    if(tag =='radios') /*单选组  一个字段*/
                    {
                        plugin = p0;
                        plugin = plugin.replace('|-','');
                        plugin = plugin.replace('-|','');
                        attr_arr_all['value'] = '';
                        attr_arr_all['content'] = '<span plugins="radios" bositype="radios" name="'+attr_arr_all['name']+'" ng-model="'+attr_arr_all['model']+'" title="'+attr_arr_all['title']+'">';
                        var dot='';
                        p5.replace(preg_group, function(parse_group) {
                            var option = new Object();
                            parse_group.replace(preg_attr, function(str0,k,val) {
                                if(k=='value')
                                {
                                    attr_arr_all['value'] += dot + val;
                                    dot = ',';
                                }
                                option[k] = val;
                            });
                            option['name'] = attr_arr_all['name'];
                            if(!attr_arr_all['options']) attr_arr_all['options'] = new Array();
                            attr_arr_all['options'].push(option);
                            if(!option['checked']) option['checked'] = '';
                            var checked = option['checked'] ? 'checked="checked"' : '';
                            attr_arr_all['content'] +='<input type="radio" bositype="radios" name="'+attr_arr_all['name']+'" value="'+option['value']+'" ng-model="'+attr_arr_all['model']+'"  '+checked+'/>'+option['value']+'&nbsp;';

                        });
                        attr_arr_all['content'] += '</span>';

                    }else
                    {
                        attr_arr_all['content'] = is_new ? plugin.replace(/NEWFIELD/,name) : plugin;
                    }
                    template = template.replace(plugin,attr_arr_all['content']);
                    template_parse = template_parse.replace(plugin,'{'+name+'}');
                    template_parse = template_parse.replace('{|-','');
                    template_parse = template_parse.replace('-|}','');
                    if(is_new)
                    {
                        var arr = new Object();
                        arr['name'] = name;
                        arr['plugins'] = attr_arr_all['plugins'];
                        arr['title'] = attr_arr_all['title'];
                        arr['orgtype'] = attr_arr_all['orgtype'];
                        arr['fieldname'] = attr_arr_all['fieldname'];
                        arr['fieldflow'] = attr_arr_all['fieldflow'];
                        add_fields[arr['name']] = arr;
                    }
                    template_data[pno] = attr_arr_all;
                }
                pno++;
            });

            var view = template.replace(/{\|-/g,'');
            view = view.replace(/-\|}/g,'');
            var parse_form = {};
            parse_form['template']= template;
            parse_form['parse']= view;
            parse_form['data']= JSON.stringify(template_data);
            console.log(parse_form);
            $.ajax({
                type:"POST",
                url:"../../../../../form-design/bdzj/createFormTable",
                data:{ "id": "", "data":JSON.stringify(parse_form) },
                dataType:'json',
                success:function (res) {
                    document.getElementById('preview').innerHTML = res.data;
                },
                error:function (res) {

                }
            });
        },
    });

