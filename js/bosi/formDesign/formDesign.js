var DealerAccountPage = TemplateManagerPage.extend("formdesign",
    {

        ctor: function(scope)
        {
            this.setting = {
                view: {
                    addHoverDom: this.addHoverDom.bind(this),
                    removeHoverDom: this.removeHoverDom,
                    selectedMulti: false
                },

                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    showRemoveBtn: this.showRemoveBtn,
                    showRenameBtn: this.showRenameBtn,
                    removeTitle : "删除",
                    renameTitle : "重命名"
                },

                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeDrag: false,
                    onClick:this.onclick.bind(this),
                    beforeRemove: this.beforeRemove,
                    onRemove: null,
                    onRename: this.onRename
                }
            };
            this.node = "";
            scope.condition = {};
            this.list = [];
            this.num = 0;
            this.serv_delete = "bdlb/deleteFormList";
            this.serv = "bdlb/queryAllForm";
            this.node.id = "";


        },
        deleteRecord: function(rec)
        {
            ax.confirm("确认删除记录吗？", (function()
            {
                ax.call(url_make(this.serv_delete, "id", rec.id), this.deleteRecordOK,rec);
            }).bind(this));

        },

        deleteRecordOK: function (ret) {
            if (url_data(ret))
            {
                layer.msg(ret.data.desc);
                this.queryRecord();
            }
            else
            {
                layer.msg(ret.desc);
                this.queryRecord();
            }

        },

        initForm:function () {
            this.scope.show = true;
            this.scope.formshow = false;
            this.scope.currSort = {"asc":true,"field":"createname"};
            this.scope.falge = false;

            //查询所有的表单分类
            ax.call(url_make('bdfl/queryAllType'),this.initProvice);

        },

        editorFunction:function (ret) {

            $(document).ready(function () {
                ue = UE.getEditor('myFormDesign',{
                    toolleipi:true,//是否显示，设计器的 toolbars
                    textarea: 'design_content',
                    //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                    toolbars:[[
                        'fullscreen', 'source', '|', 'undo', 'redo', '|','bold', 'italic', 'underline', 'fontborder', 'strikethrough',  'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist','|', 'fontfamily', 'fontsize', '|', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',  'link', 'unlink',  '|',  'horizontal',  'spechars',  'wordimage', '|', 'inserttable', 'deletetable',  'mergecells',  'splittocells',
                        'preview2','|','returnkey','save']],
                    labelMap:{
                        'save':'保存',
                        'preview2':'预览',
                        'returnkey':'返回'
                    },
                    //focus时自动清空初始化时的内容
                    //autoClearinitialContent:true,
                    //关闭字数统计
                    wordCount:false,
                    //关闭elementPath
                    elementPathEnabled:false,
                    //默认的编辑区域高度
                    initialFrameHeight:400
                    //,iframeCssUrl:"css/bootstrap/css/bootstrap.css" //引入自身 css使编辑器兼容你网站css
                    //更多其他参数，请参考ueditor.config.js中的配置项
                });
            });

            //保存
            UE.commands['save'] = {
                execCommand : function(){
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
                        url:"form-design/bdzj/createFormTable",
                        data:{ "id": ret.data.data, "data":JSON.stringify(parse_form) },
                        dataType:'json',
                        success:function (res) {
                            layer.msg(res.desc);
                        },
                        error:function (res) {

                        }
                    });
                },

            };
            //对返回键进行事件设置
            UE.commands['preview2'] = {
                execCommand : function () {
                    ax.modal({template:"page/public/preview2.html","id":ret.data.data});
                    ax.root.$apply();
                },
            };
            //对返回键进行事件设置
            UE.commands['returnkey'] = {
                execCommand : function () {
                    ue.setContent("");
                    this.scope.show = true;
                    this.scope.formshow = false;
                    ax.root.$apply();
                }.bind(this),
            };




        },

        exec : function (method) {
            ue.execCommand(method)
        },

        initData:function () {
            ax.call(url_make('bdfl/queryAllType'),this.initProvice);
        },

        selectAll:function(source,p, value)
        {
            for (var i in source)
                source[i]["_checked"] = value;
            console.log(source);

        },

        initFormData:function (ret) {

            this.recordList = url_data(ret);

        },
        //表单重命名
        onRename: function (e, treeId, treeNode, isCancel) {

            ax.call(url_make('bdfl/saveOrUpdateByTree',"zTreeVo",treeNode),function (res) {
                var data = res.data;
                if ( data.code == 1 )
                {
                    layer.msg(data.desc);
                }else
                {
                    layer.msg(data.desc);
                }
            });

        },

        queryRecord: function()
        {
            this.scope.loading = true;
            if (this.scope._tablePageInfo)
                this.scope._tablePageInfo.query();
            else
                ax.call(url_make(this.serv, this.condition), this.queryRecordOK);
        },

        queryRecordOK: function(ret)
        {
            this.scope.loading = false;
            this.scope.recordList = angular.isArray(ret) ? ret:url_data(ret);
        },

        addHoverDom: function(treeId, treeNode)
        {

            if (  !treeNode.pId )
            {
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                var addStr = "<span class = 'button remove' id='addBtn_" + treeNode.tId
                    + "' title='添加节点' ></span>";
                sObj.after(addStr);
                var that = this;
                var btn = $("#addBtn_"+treeNode.tId);
                if (btn) btn.bind("click", function(){

                    ax.modal({template:"page/public/formmodel.html","guid":treeNode.id,formObj:that});
                    ax.root.$apply();
                });
            }

        },

        beforeRemove: function(treeId, treeNode) {
            if (confirm('确认删除吗？')) {
                if ( treeNode.isParent ) {
                    var msg = "还有子节点，请先删除子节点";
                    layer.msg(msg)
                    return false;
                }
                else
                {

                    ax.call(url_make('bdfl/deleteTypeById',"guid",treeNode.id),function(res){

                        if ( res.data.code == 1 )
                        {
                            layer.msg(res.data.desc);
                            ax.call(url_make(this.serv, this.scope.condition), this.queryRecordOK);
                        }
                        else
                        {
                            layer.msg(res.data.desc);
                        }

                    });

                }
            }
            else

                return false;
        },

        onclick: function (event, treeId, treeNode){

            this.scope.condition = {};
            this.node = "";
            if ( treeNode.pId )
            {
                this.node.pId = treeNode.pId;
                this.node = treeNode;
                this.scope.condition.typeId= treeNode.id
            }

            this.queryRecord();

        },
        removeHoverDom: function(treeId, treeNode){

            $("#addBtn_"+treeNode.tId).unbind().remove();

        },
        //复选框删除
        delete : function () {

            var that = this.num
            var that1 = this.list
            $.each(this.scope.recordList,function (index,element) {

                if (  element._checked   )
                {
                    that1.push(element) ;

                }
            });
            if (  that1.length == 0  )
            {
                layer.msg("请选中对应的表单");
                return;
            }

            ax.confirm("确认删除记录吗？", (function()
            {
                ax.call(url_make("bdlb/deleteForm", "id", that1), this.deleteRecordOK);
            }).bind(this));

        },

        initProvice: function(res){

            var tree =  $.fn.zTree.init($("#mainTree"), this.setting, res.data);
            var data = "";
            $.each(res.data,function (index,elemenet) {
                //匹配成功跳出循环
                if ( elemenet.pId == "1" )
                {
                    data = elemenet.id;
                    return false ;
                }
            })
            var nodes = tree.getNodeByParam("id",data );
            this.node = nodes;
            tree.selectNode(nodes);
            tree.expandAll(tree);//默认是展开的

        },
        showRemoveBtn:  function (treeId, treeNode) {
            if ( !treeNode.pId  )
            {
                return false;
            }
            else
                return true;
        },
        showRenameBtn: function(treeId, treeNode) {

            if ( !treeNode.pId  )
            {
                return false;
            }
            else
                return true;
        },

        insertAccount:function () {
            if ( !this.node.pId  )
            {
                layer.msg("请选择表单分类");
                return;
            }
            else
            {
                ax.modal({template:"page/public/formadd.html","nodeId":this.node.id, callback:this.callbackFunction });
            }
        },
        modifyRecord:function (row) {
            ax.call(url_make("bdlb/queryHtml", "id", row.id), this.selectOk);
        },
        selectOk:function (ret) {
            this.editorFunction(ret);
            this.scope.show = false;
            this.scope.formshow = true;
            window.setTimeout(function () {
                ue.execCommand('insertHtml',  ret.data.desc);
             },500);//延迟一段时间后再加载
        },

        selectOk1:function (ret) {
            this.editorFunction(ret);
            this.scope.show = false;
            this.scope.formshow = true;
            window.setTimeout(function () {
                ue.execCommand('insertHtml',  ret.data.desc);
             },500);//延迟一段时间后再加载
        },

        callbackFunction:function (ret) {
            var data = ret.data;
            if (  data.code == 1 )
            {
                this.queryRecord();
                $(document).ready(function () {

                    ue = UE.getEditor('myFormDesign',{
                        toolleipi:true,//是否显示，设计器的 toolbars
                        textarea: 'design_content',
                        //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                        toolbars:[[
                            'fullscreen', 'source', '|', 'undo', 'redo', '|','bold', 'italic', 'underline', 'fontborder', 'strikethrough',  'removeformat', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist','|', 'fontfamily', 'fontsize', '|', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',  'link', 'unlink',  '|',  'horizontal',  'spechars',  'wordimage', '|', 'inserttable', 'deletetable',  'mergecells',  'splittocells',
                            'preview2','|','returnkey','save']],
                        labelMap:{
                            'save':'保存',
                            'preview2':'预览',
                            'returnkey':'返回'
                        },
                        //focus时自动清空初始化时的内容
                        //autoClearinitialContent:true,
                        //关闭字数统计
                        wordCount:false,
                        //关闭elementPath
                        elementPathEnabled:false,
                        //默认的编辑区域高度
                        initialFrameHeight:400
                        //,iframeCssUrl:"css/bootstrap/css/bootstrap.css" //引入自身 css使编辑器兼容你网站css
                        //更多其他参数，请参考ueditor.config.js中的配置项
                    });

                });
                layer.msg(data.desc);
                ax.root.AXModalInfo._hide();
                 this.scope.show = false;
                 this.scope.formshow = true;
                //保存
                UE.commands['save'] = {
                    execCommand : function(){
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
                                    attr_arr_all['content'] +='<input type="checkbox" bositype="checkboxs" name="'+option['name']+'" value="'+option['value']+'" fieldname="' + attr_arr_all['fieldname'] + option['fieldname'] + '" fieldflow="' + attr_arr_all['fieldflow'] + '" ng-model="'+attr_arr_all['model']+'" '+checked+'/>'+option['value']+'&nbsp;';

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
                                    attr_arr_all['content'] = '<span plugins="radios" bositype="radios"  name="'+attr_arr_all['name']+ '" ng-model="'+attr_arr_all['model']+'" title="'+attr_arr_all['title']+'">';
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
                                        attr_arr_all['content'] +='<input type="radio" bositype="radios" name="'+attr_arr_all['name']+'" value="'+option['value']+'"  '+checked+'/>'+option['value']+'&nbsp;';

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
                        $.ajax({
                            type:"POST",
                            url:"form-design/bdzj/createFormTable",
                            data:{ "id": ret.data.data, "data":JSON.stringify(parse_form) },
                            dataType:'json',
                            success:function (res) {
                                layer.msg(res.desc);
                            },
                            error:function (res) {

                            }
                        });
                    },

                };
                //对返回键进行事件设置
                UE.commands['returnkey'] = {
                    execCommand : function () {
                        ue.setContent("");
                       this.scope.show = true;
                       this.scope.formshow = false;
                       ax.root.$apply();
                    }.bind(this),
                };
                //对返回键进行事件设置
                UE.commands['preview2'] = {
                    execCommand : function () {
                        ax.modal({template:"page/public/preview2.html"});
                        ax.root.$apply();
                    },
                };
             ax.call(url_make('bdlb/queryHtml',"id",ret.data.data),this.selectOk1);
            }
            else
            {
                this.queryRecord();
                layer.msg(data.desc);
                ax.root.AXModalInfo._hide();
            }
        },
        sortData:function (field) {

            this.scope.currSort = this.scope.currSort || {};
            this.scope.currSort.asc = this.scope.currSort.field == field ? !this.scope.currSort.asc : true;
            this.scope.currSort.field = field;
            this.scope.condition.sortField = this.scope.currSort;
            this.queryRecord();
        },

        //保存事件
        save:function () {
            ax.modal({template:"page/public/save.html"});
        },
        //保存并提交
        saveAndCommit:function () {
            ax.modal({template:"page/public/saveAndCommit.html"});
        },
        //单行文本
        textalert:function () {

            ax.modal({template:"page/public/singletext.html",callback1:this.textFunction});

        },
        // 文本框
        multilinetext:function () {
            ax.modal({template:"page/public/textarea.html",callback:this.multilinetextFunction});
        },
        // 单选
        radios:function () {
            ax.modal({template:"page/public/radios.html",callback:this.radiosFunction});
        },
        // 多选
        checkboxs:function()
        {
            ax.modal({template:"page/public/checkboxs.html",callback:this.checkboxsFunction});
        },

        checkboxsFunction:function(ret){
            console.log(ret);
        },
        radiosFunction:function (ret) {
            console.log(ret);

        },
        multilinetextFunction:function (ret) {

            if ( ret.text_value == undefined )
            {
                ret.text_value = "";
            }
            var str = "<textarea title= '多行文本框' name="+'"'+ ret.text_name+'"'+" "+"bositype=textarea "+" "+ "ng-model="+ '"'+ret.text_dbname+'"'+"ng-value="+ '"'+ret.text_value+ '"'
                +'"'+ "style= font-size:"+ret.text_size+"px"+";"+"width:"+ret.text_length1+"px"+";"+"height:"+ret.text_length2+"px"+";"
                +'"'+">"+ret.text_value+"</textarea>";
            if ( ue.getContent() )
            {
                var regex = /ng-model="(.+?)"/g;
                var regex1 = /name="(.+?)"/g;

                while (  (reslut = regex.exec(ue.getContent())) != null  )
                {
                    if ( ret.text_dbname == reslut[1] )
                    {
                        layer.msg("字段英文名重复，请注意");
                        return false
                    }
                }
                while (  (reslut = regex1.exec(ue.getContent())) != null  )
                {
                    if ( ret.text_name == reslut[1] )
                    {
                        layer.msg("控件名称重复");
                        return false
                    }
                }

            }

            ue.execCommand('insertHtml', str);
            ax.root.AXModalInfo._hide();

        },
        // 单行文本
        textFunction:function (ret) {

            if (  ret.text_type == "varchar" )
            {
                ret.text_type = "text";
            }
            else
            {
                ret.text_type = "number";
            }
            if ( ret.text_value == undefined )
            {
                ret.text_value = "";
            }

            var str =  "<input name = "+'"'+ ret.text_name+'"'+" ng-model = "
                +'"'+ret.text_dbname+'"'+"value="+'"'+ret.text_value+'"'+" "+"bositype=text "+" "+" type = "+'"'+ret.text_type +'"'+" style =" +'\"'+"text-align:"+ret.text_align+"; width:"+ret.text_length1+"px;";
            if (  ret.text_length2 != undefined )
            {
                str += " "+" height: "+ret.text_length2+"px";
            }
            str += '\"'+"/>";
            //正则表达式
            if ( ue.getContent() )
            {
                var regex = /ng-model="(.+?)"/g;
                var regex1 = /name="(.+?)"/g;

                while (  (reslut = regex.exec(ue.getContent())) != null  )
                {
                    if ( ret.text_dbname == reslut[1] )
                    {
                        layer.msg("字段英文名重复，请注意");
                        return false
                    }
                }
                while (  (reslut = regex1.exec(ue.getContent())) != null  )
                {
                    if ( ret.text_name == reslut[1] )
                    {
                        layer.msg("控件名称重复");
                        return false
                    }
                }

            }
            ue.execCommand('insertHtml', str);
            ax.root.AXModalInfo._hide();
        },
        menualert:function () {
            ax.modal({template:"page/public/select.html"});
        },
        //日期
        datetime:function () {
            ax.modal({template:"page/public/formdate.html"});
        },

        parentselect:function () {

            if ( ue.getContent() )
            {
                var regx = /(\|-<span(((?!<span).)*plugins=\"(select)\".*?)>(.*?)<\/span>-\||<(select).*?(<\/select>))/gi;
                var preg_attr =/(\w+)=\"(.?|.+?)\"/gi;
                var preg_group =/<input.*?\/>/gi;
                var pno = 0;
                var template = ue.getContent();
                var template_parse = template,template_data = new Array(),add_fields=new Object(),checkboxs=0;
                var flag = false;
                template.replace(regx, function(plugin,p1,p2,p3,p4,p5,p6){
                    flag = true;
                    var parse_attr = new Array(),attr_arr_all = new Object(),name = '', select_dot = '' , is_new=false;
                    var p0 = plugin;
                    var tag = p6 ? p6 : p4;
                    if(tag == 'select')
                    {
                        plugin = plugin.replace('|-','');
                        plugin = plugin.replace('-|','');
                    }
                    plugin.replace(preg_attr, function(str0,attr,val) {

                        if(attr=='name')
                        {
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
                    if(name)
                    {

                        template = template.replace(plugin,attr_arr_all['content']);
                        template_parse = template_parse.replace(plugin,'{'+name+'}');
                        template_parse = template_parse.replace('{|-','');
                        template_parse = template_parse.replace('-|}','');
                        template_data[pno] = attr_arr_all;
                    }
                    pno++;
                });
                if ( flag )
                {
                    var view = template.replace(/{\|-/g,'');
                    view = view.replace(/-\|}/g,'');
                    var parse_form = new Object({
                        'data':template_data,//控件属性
                    });

                    ax.modal({template:"page/public/parentselect.html","guid": parse_form});

                }

                if ( !flag )
                {
                    layer.msg("没有对应的父节点的表单");
                }

            }else
            {
                layer.msg("编辑器中没有内容");
            }

        },
        importimage: function () {
            ax.modal({template: "page/public/importimage.html"});
        },
        detailControl: function () {
            ax.modal({template: "page/public/detailControl.html"});
        },

        //表单内预览
        previewRecord:function (row) {
            ax.modal({template:"page/public/preview2.html","id":row.id,"flag":"preview"});
        },

        // 表单在流程中带数据展示（测试用接口）
        formDetailMsg:function (row) {
            ax.modal({template:"page/public/preview2.html","id":row.id,"flag":"c71187fd80d84a4e8d5b2c10b71bb859"});
        }

    });

//ax中通过变量改变属性
//city选择的时候
//行点击的事件
//行点击时间的为td_Property
//ax主要放在变量当中
DealerAccountPage.directiveData =
    {
        lblTitle: {template:"label_title", text:"查询条件"},
        imgLoading: {template:"img_loading", show:"loading"},
        tblQuery:
            {
                template:"table",
                params:
                    {
                        tr_property:{p1:'ng-if="customCount>0"',p2:'ng-if="customCount>1"',p3:'ng-if="customCount>2"',p4:'ng-if="customCount>3"'},
                        rows:
                            [
                                ["表单名称：", {template:"input", model:"condition.FORM_NAME"},{template:"button_query", click:"queryRecord()"}]
                            ]

                    }
            },
        tblResult:
            {
                template:"table_source",
                title: 	 { createname:"申请人", inserttime:"创建时间", updatetime:"修改时间", classification:"表单分类", name:"表单名称"},
                source:"recordList",
                show_header:true,
                show_no:true,
                action:true,
                show_checkbox:true,
                action_width:150,
                action_list:'<button type="button" class="btn btn-danger btn-xs" ng-click="updateStatus(row, 2)" ng-show="row.status==0">禁用</button>' +
                '<button type="button" class="btn btn-success btn-xs" ng-click="updateStatus(row, 0)" ng-show="row.status==2">启用</button>' +
                    '<button type="button" class="btn btn-info btn-xs" ng-click="formDetailMsg(row)" style="margin-left:5px">详情</button>'+
                    '<button type="button" class="btn btn-info btn-xs" ng-click="previewRecord(row)" style="margin-left:5px">预览</button>'+
                '<button type="button" class="btn btn-info btn-xs" ng-click="modifyRecord(row)" style="margin-left:5px">编辑</button>' +
                '<button type="button" class="btn btn-warning btn-xs" ng-click="deleteRecord(row)" style="margin-left:5px">删除</button>',
                page_info:
                    {
                        serv: "bdlb/queryAllForm",
                        condition: "condition",
                        callback: "queryRecordOK",
                        loading: "loading",
                        init_query:true
                    }
            },

    };
