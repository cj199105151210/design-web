
var ui_translate =
    {
        ff: function(axclass, params)
        {
            var r = new RegExp("(.*)#0#(.*)#0#(.*)#1#(.*)#1#(.*)#0#(.*)#0#(.*)");
            var m = params.match(r);
            var s = "";
            for (var i in params)
            {
                s += m[2];
                for (var j in params[i])
                    s += m[4].replace("#x#", ax.ui.translateTemplate(axclass, params[i][j]));
                s += m[6];
            }
            return m[1] + s + m[7];
        },

        any_html: function(axclass, params)
        {
            return params;
        },

        any_array: function(axclass, params)
        {
            var s = "";
            for (var i in params)
                s += ax.ui.translateTemplate(axclass, params[i]);
            return s;
        },

        any_scope: function(axclass, params)
        {
            axclass.scope = axclass.scope || {};
            for (var i in params)
                if (i != "template")
                    axclass.scope[i] = params[i];
            return "";
        },

        any_data: function(axclass, params)
        {
            axclass.directiveData = axclass.directiveData || {};
            for (var i in params)
                if (i != "template")
                    axclass.directiveData[i] = params[i];
            return "";
        },

        table_query_auto: function(axclass, params)
        {
            var template = '<table class="table table-striped table-bordered table-hover"><tbody> \
			#0#<tr>#0# \
			#1#<td style="max-width:500px" valign="middle">#x#</td>#1# \
			#0#</tr>#0# \
			</tbody></table>';
            return ui_translate.ff(axclass, params);
        },

        table: function(axclass, params)
        {
            var table_class = params.table_class || "table-striped table-bordered";
            var td_property0 = params.td_property0 != undefined ? params.td_property0 : 'align="right"';
            var td_property1 = params.td_property1 != undefined ? params.td_property1 : '';
            var head = '<table ' + (params.property?params.property:"") + ' class="table ' + table_class + '"><tbody>';
            var style = 'style="display:table-cell;vertical-align:middle"';
            var tail = '</tbody></table>';
            var s1 = '</tr>';
            var s = '';
            for (var i=0; i<params.rows.length; i++)
            {
                s += '<tr ' + (params.tr_property && params.tr_property["p"+i] || '') + '>';
                for (var j=0; j<params.rows[i].length; j++)
                {
                    var td = ax.ui.translateTemplate(axclass, params.rows[i][j]);
                    if (!params.td_custom)
                        td = '<td ' + (params.td_property && params.td_property["p"+i+"_"+j] || '') + ' ' + (j%2==0 ? td_property0 : td_property1) + ' ' + style + '>' + td + '</td>';
                    s += td;
                }
                s += s1;
            }
            return head + s + tail;
        },

        // //table_class, titles, source, th, td
        // table_source_translate: function(axclass, params)
        // {
        //     var table_class = params.table_class || "table-striped table-bordered table-hover";
        //     var titles = JSON.stringify(params.titles).replace(new RegExp('"', "gm"), "'");
        //     var table = '<div style="padding-bottom:5px" ><table ' + (params.property?params.property:"") + ' class="table ' + table_class +
        //         '" ng-init="titles=' + titles + '" ng-if="(' + params.source + ').length || ' + params.show_header + '">' +
        //         '<thead style="background: #FEF5EF;"><tr>';
        //     for (var i=0; i<params.th.length; i++)
        //         table += params.th[i];
        //     table += '</tr></thead><tbody>';
        //     table += '<tr ng-repeat="row in ' + params.source + '">';
        //     for (var i=0; i<params.td.length; i++)
        //         table += params.td[i];
        //     table += '</tr></tbody></table></div>';
        //     return table;
        // },

        sql_model: function(axclass, params)
        {
            var link = function(scope, element, attr)
            {
                ax.ui.setScopeFromSql(scope, params);
            };
            return {template:"", link:link};
        },

        sql_model_watch: function(axclass, params)
        {
            var link = function(scope, element, attr)
            {
                scope.$watch(params.watch, function(value, oldValue, scope)
                {
                    if (value || value != oldValue)
                        if (ax.ui.checkScopeValid(scope, params))
                            ax.ui.setScopeFromSql(scope, params);
                });
            };
            return {template:"", link:link};
        },

        select_watch: function(axclass, params)
        {
            var s = ax.ui.translateTemplate(axclass, params, ui_template.select);
            var link = function(scope, element, attr)
            {
                scope.$watch(params.watch || params.source, function(value, oldValue, scope)
                {
                    if (value || value != oldValue)
                        scope[params.model] = ax.func.getObject(value, "id", params.selected);
                });
            };
            return {template:s, link:link};
        },

        filter: function(axclass, params)
        {
            var link = function(scope, element, attr)
            {
                scope.$watch(params.watch, function(value, oldValue, scope)
                {
                    if (value || value != oldValue)
                        scope[params.model] = ax.filter[params.filter](value, params.params);
                });
            };
            return {template:"", link:link};
        },

        /*  简单图表
         (id), width, height, charttype, title, legend, sql, field_x, field_value
         watch: 侦听变量，多个条件用+号，如model1.id+model2.id
         watch_sql: 侦听变量变化触发的sql格式，如 category1=#model1.id# and category2=#model3.name#
         */
        chart_simple: function(attr, params)
        {
            if (params.id === undefined)
                params.id = params.charttype + "_" + (++ax.globals.uid);
            var w = params.width.toString().indexOf("%") < 0 ? params.width + "px": params.width;
            var h = params.height.toString().indexOf("%") < 0 ? params.height + "px": params.height;
            var s = '<div id="#id#" style="width:#width#;height:#height#;margin-left:auto;margin-right:auto;"></div>'.replace("#id#", params.id).replace("#width#", w).replace("#height#", h);
            var link = function(scope, element, attr)
            {
                scope.$watch(params.watch, function(value, oldValue, scope)
                {
                    if (!value && value == oldValue)
                        return;
                    var option = ui_template.obj_chart_simple;
                    option.title.text = params.title;
                    option.legend.data = [params.legend];
                    option.xAxis.data = [];
                    option.series[0].data = [];
                    for (var i in value)
                    {
                        option.xAxis.data.push(value[i][params.field_x]);
                        option.series[0].data.push(value[i][params.field_value]);
                    }
                    option.series[0].name = params.legend;
                    option.series[0].type = params.charttype;
                    var chart = ax.getElementById(element, "DIV", params.id);
                    echarts.dispose(chart);
                    echarts.init(chart).setOption(option);
                });
            };
            return {template:s, link:link};
        },
        /***通用数据列表展示表格，params参数说明：
         titles: 表格标题，必填，格式: {}
         source: 表格数据源scope变量，必填
         show_header: 是否没有数据时也显示标题，可选，默认值: false
         table_class: 表格样式，可选，默认值: "table-striped table-bordered table-hover"
         property: 在<table 处内嵌标签，可选，例如: 'style="padding:0px" align="center"'
         th: 自定义标题，可选，格式: 数组，默认值：'<th ng-repeat="title in titles">{{title}}</th>'
         例如：['<th><font color="#ff0000">标题1</font></td>', '<th ng-repeat="title in titles">{{title}}</th>', '<th>标题2</th>']
         当th未定义时，可设置以下属性：
         show_no: 是否显示行号，可选，默认值: false
         th_center: 标题是否居中，可选，默认值: false
         action: 是否添加“操作”标题，可选，默认值: false
         action_width: 操作标题宽度，可选，默认值: 100

         td: 自定义行数据格式，可选，格式: 数组，默认值: '<td style="max-width:500px;display:table-cell;vertical-align:middle" ng-repeat="(k,v) in titles" ng-bind-html="row[k]">{{row[k]}}</td>'
         例如：['<td style="display:table-cell;vertical-align:middle">{{row.field1+"_"+row.filed2}}</td>', '<td ng-repeat="(k,v) in titles">{{row[k]}}</td>']
         当td未定义时，可设置以下属性：
         td_center: 标题是否居中，可选，默认值: false
         action_list: 自定义操作按钮，可选，格式: String，例如: '<button ng-click="c1()">c1</button><button ng-click="c2()">c2</button>'
         action_modify: 是否显示编辑按钮，当action_list未定义时有效，默认值: false
         action_delete: 是否显示删除按钮，当action_list未定义时有效，默认值: false
         modify_click: 编辑按钮的点击事件，例如: 'modifyClick(row)'
         delete_click: 删除按钮的点击事件，例如: 'deleteClick(row)'

         page_info: 是否启用分页查询，可选，默认值: false，格式:{}, 参数：
         {
             serv: 服务名，必填，注:需服务端启用PageHelper
             condition: 查询条件scope变量名，可选
             callback: 回调scope函数名，可选
             init_query: 是否打开页面时就查询，可选，默认值: true
             record_count: 每页数据条数，可选，默认值: 20
         }
         ***/
        table_source: function(axclass, params)
        {

            var table_class = params.table_class || "table-striped table-bordered table-hover";
            var titles = JSON.stringify(params.title).replace(new RegExp('"', "gm"), "'");
            var table = '<div style="margin-bottom:5px"><table ' + (params.property?params.property:"") + ' class="table ' + table_class +
                '" ng-init="titles=' + titles + '"' + (!params.show_header ? ' ng-if="(' + params.source + ').length"' : '') + '>' +
                '<thead style="background: #FEF5EF;" ><tr>';
            var th = params.th || [(params.show_no ? '<th width="60px" style="text-align:center;">序号</th>' : '') +
                (params.show_checkbox ? '<th width="60px" style="text-align:center;"><input type="checkbox" ng-model="checkedAll" ng-change="selectAll('+params.source+','+"_checked"+','+"checkedAll"+')" \></input></th>' : '')+
                '<th ' + (params.th_center ? 'style="text-align:center"' : '') + ' ng-repeat="(field,v) in titles" ng-click="sortData(field)">{{v}}<i ng-class="{true:\'fa fa-sort-asc\', false:\'fa fa-sort-desc\'}[currSort.asc]" ng-show="currSort.field == field" ></i> </th>' +
                (params.action ? '<th width="' + (params.action_width || 100) + 'px" style="text-align:center;">操作</th>' : '')];
            var td = params.td || [(params.show_no ? '<td width="60px" align="center" style="display:table-cell;vertical-align:middle">{{$index+1}}</td>' : '') +
                (params.show_checkbox ? ' <td width="60px" align="center" style="display:table-cell;vertical-align:middle"><input type="checkbox"  ng-model="row._checked" ng-click="row._checked = !row._checked" ></input></td>' : '')+
                '<td ' + (params.td_center ? 'align="center"' : '') + ' style="max-width:500px;display:table-cell;vertical-align:middle" ng-repeat="(k,v) in titles" ng-bind-html="row[k]">{{row[k]}}</td>' +
                (params.action ? '<td width="' + (params.action_width || 100) + 'px" align="center" style="display:table-cell;vertical-align:middle">' + (params.action_list ||
                    (params.action_modify ? '<button type="button" class="btn btn-info btn-xs" style="margin-right:5px" ng-click="' + params.modify_click + '">编辑</button>' : '') +
                    (params.action_delete ? '<button type="button" class="btn btn-warning btn-xs" ng-click="' + params.delete_click + '">删除</button>' : '') || '') +
                    '</td>' : '')];
            for (var i=0; i<th.length; i++)
                table += th[i];
            table += '</tr></thead><tbody>';
            table += '<tr ng-repeat="row in ' + params.source + '" ' + (params.tr_property?params.tr_property:'') + ' ng-click="row._checked = !row._checked" >';
            for (var i=0; i<td.length; i++)
                table += td[i];
            table += '</tr></tbody></table></div>';

            if (!params.page_info)
                return table;

            table += '<nav ng-show="_tablePageInfo.buttons" style="margin-top:-30px;margin-bottom:-10px"><ul class="pagination">' +
                '<li ng-repeat="r in _tablePageInfo.buttons" ng-class="{active:r.active, disabled:r.disabled}">' +
                '<a href="javascript:void(0);" ng-click="_tablePageInfo.click(r)" style="border-top-left-radius:0px;border-bottom-left-radius:0px">{{r.label}}</a></li>' +
                '<span style="position: absolute;padding:8px;-top1:30px">{{_tablePageInfo.hint}}</span></ul></nav>';
            var p =
                {
                    init_query: params.page_info.init_query == undefined || params.page_info.init_query,
                    serv: params.page_info.serv,
                    condition: params.page_info.condition,
                    callback: params.page_info.callback,
                    loading: params.page_info.loading,
                    curr_condition: undefined,
                    curr_start: 1,
                    curr_length: params.page_info.record_count || 20,
                    curr_draw: 0,
                    buttons: undefined,
                    hint: undefined,
                    query: function(isButtonClick)
                    {
                        if (!isButtonClick)
                        {
                            p.curr_condition = p.condition ? (angular.isFunction(p.scope[p.condition]) ? p.scope[p.condition]() : p.scope[p.condition]) : {};
                            p.curr_start = 1;
                        }
                        ax.call(url_make(p.serv, p.curr_condition) + "&start=" + p.curr_start + "&length=" + p.curr_length + "&draw=" + (++p.curr_draw), p.queryOK);
                        if (p.loading)
                            p.scope[p.loading] = true;
                    },
                    queryOK: function(ret)
                    {
                        if (p.loading)
                            p.scope[p.loading] = false;
                        var data = url_data(ret);
                        if (data && data.draw == p.curr_draw)
                        {
                            var rec_from = (p.curr_start-1)*p.curr_length+1;
                            p.hint = "总记录数" + data.recordsTotal + "条，当前第" + rec_from + "至" + (rec_from + (data.data ? data.data.length -1 : 0)) + "条";
                            var buttons = [];
                            var pageCount = Math.ceil(data.recordsTotal/p.curr_length);
                            if (pageCount <= 7) //小于8页全显示
                            {
                                for (var i=1; i<=pageCount; i++)
                                    buttons.push(i);
                            }
                            else if (p.curr_start <= 4)
                                buttons = [1, 2, 3, 4, 5, "..", pageCount];
                            else if (p.curr_start > pageCount-4)
                                buttons = [1, "..", pageCount-4, pageCount-3, pageCount-2, pageCount-1, pageCount];
                            else
                                buttons = [1, "..", p.curr_start-1, p.curr_start, p.curr_start+1, "..", pageCount];
                            for (var i=1; i<=buttons.length; i++)
                            {
                                var b = buttons[i-1];
                                buttons[i-1] = {page:b==".."?i:b, label:b, active:p.curr_start==b, disabled:b==".."};
                            }
                            if (buttons.length)
                                buttons = [{page:1, label:"首页", disabled:p.curr_start==1}, {page:p.curr_start-1, label:"上页", disabled:p.curr_start==1}].concat(buttons)
                                    .concat([{page:p.curr_start+1, label:"下页", disabled:p.curr_start==pageCount}, {page:pageCount, label:"尾页", disabled:p.curr_start==pageCount}]);
                            p.buttons = buttons.length ? buttons : null;
                            if (p.callback)
                                p.scope[p.callback].apply(null, [data.data]);
                        }
                    },
                    click: function(button)
                    {
                        if (!button.disabled)
                        {
                            p.curr_start = button.page;
                            p.query(true);
                        }
                    }
                }
            var link = function(scope, element, attr)
            {
                scope._tablePageInfo = p;
                p.scope = scope;
                if (p.init_query)
                    p.query();
            };
            return {template: table, link: link};
        },
        /**
         * params参数：
         *      1.pagingModel：可选，默认为paginationInfo，存储在scope中的分页信息变量名，在同一页面有多个分页表格时使用
         *      2.pageSize：可选，每页条数，默认20
         *      3.changeSize:可选，默认为false，是否可以修改每页显示数量
         *    以下是客户端分页时的参数
         *      4.source：必填，本地数据源名称
         *    以下是服务端分页时的参数
         *      5.service：必填，服务端数据查询服务
         *      6.paramModel：可选，服务端查询服务需要的参数，可以function(参数为scope)，或者对象，或者字符串（scope变量名）
         *      7.model:必填，返回的数据存储的scope变量
         *      8.callback：可选，查询结束后的回调函数，参数为scope，data
         * @param axclass
         * @param params
         * @returns {{template: string, link: link}}
         */
        pagination:function(axclass, params)
        {
            var pagingModel = params.pagingModel||'paginationInfo';
            var str ='<div><div style="float: left;">第 {{'+pagingModel+'.startRow+1}} 至 {{'+pagingModel+'.endRow}} 条，总数为 {{'+pagingModel+'.totalSize}} 条。';
            if(params.changeSize){
                str+='每页<input type="number" min="1" ng-model="'+pagingModel+'.pageSize" style="width: 60px"></input>条';
            }
            str+='</div><div class="btn-group" style="float: right;">';
            str+='<button type="button" ng-repeat="button in '+pagingModel+'.buttons" ' +
                'ng-class="button.btnClass" ng-show="button.show" ng-disabled="button.disabled"  ' +
                'ng-click="'+pagingModel+'.pageNo=button.pageNo">{{button.text}}</button>';
            str+='</div></div>';
            var link = function($scope, element, attr)
            {
                var pagingModel = params.pagingModel||'paginationInfo';
                var pageSize = params.pageSize || 20;
                if(angular.isString(pageSize)){
                    pageSize = $scope[pageSize];
                }
                if(!pageSize || pageSize<0)
                    pageSize=20;
                var localData = params.source && params.source!=null && params.source!='';
                if(!$scope[pagingModel]){
                    $scope[pagingModel]={};
                }
                $scope[pagingModel].pageSize=pageSize;
                $scope[pagingModel].startRow=0;
                $scope[pagingModel].endRow=pageSize;
                $scope[pagingModel].totalSize=0;
                $scope[pagingModel].totalPages=0;
                if(localData){
                    $scope.$watch(params.source+".length", function(value, oldValue, scope){
                        if (value || value != oldValue){
                            var totalSize = value;
                            var totalPages = Math.floor((totalSize - 1) / pageSize) + 1;
                            scope[pagingModel].totalSize = totalSize;
                            scope[pagingModel].pageSize = pageSize;
                            scope[pagingModel].totalPages = totalPages;
                            scope[pagingModel].startRow = 0;
                            scope[pagingModel].endRow = Math.min(pageSize,totalSize);
                            scope[pagingModel].pageNo = 1;
                            calcButtons(scope,pagingModel);
                        }
                    });
                }
                var calcButtons=function(scope,pagingModel){
                    var pageNo = scope[pagingModel].pageNo;
                    var totalPage = scope[pagingModel].totalPages;
                    scope[pagingModel].buttons=[];
                    scope[pagingModel].buttons.push({
                        pageNo:1,
                        btnClass:"btn btn-default",
                        disabled:pageNo<=1,
                        text:"首页",
                        show:true
                    });
                    scope[pagingModel].buttons.push({
                        pageNo:pageNo-1,
                        btnClass:"btn btn-default",
                        disabled:pageNo<=1,
                        text:"上页",
                        show:true
                    });
                    if(totalPage<=7){
                        for(var i=1;i<=7;i++){
                            var btn={
                                pageNo:i,
                                btnClass:pageNo==i?"btn btn-primary":"btn btn-default",
                                disabled:pageNo==i,
                                text:i,
                                show:i<=totalPage
                            };
                            scope[pagingModel].buttons.push(btn);
                        }
                    }else{
                        scope[pagingModel].buttons.push({
                            pageNo:1,
                            btnClass:pageNo==1?"btn btn-primary":"btn btn-default",
                            disabled:pageNo==1,
                            text:"1",
                            show:true
                        });
                        scope[pagingModel].buttons.push({
                            pageNo:2,
                            btnClass:pageNo==2?"btn btn-primary":"btn btn-default",
                            disabled:pageNo>4,
                            text:pageNo>4?"..":"2",
                            show:true
                        });
                        var pageNo2=(pageNo>4) ? (pageNo<totalPage-2?pageNo-1:totalPage-4):3;
                        scope[pagingModel].buttons.push({
                            pageNo:pageNo2,
                            btnClass:pageNo==pageNo2?"btn btn-primary":"btn btn-default",
                            disabled:false,
                            text:pageNo2,
                            show:true
                        });
                        var pageNo3=(pageNo>4) ? (pageNo<totalPage-2?pageNo:totalPage-3):4;
                        scope[pagingModel].buttons.push({
                            pageNo:pageNo3,
                            btnClass:pageNo==pageNo3?"btn btn-primary":"btn btn-default",
                            disabled:false,
                            text:pageNo3,
                            show:true
                        });
                        var pageNo4=(pageNo>4) ? (pageNo<totalPage-2?pageNo+1:totalPage-2):5;
                        scope[pagingModel].buttons.push({
                            pageNo:pageNo4,
                            btnClass:pageNo==pageNo4?"btn btn-primary":"btn btn-default",
                            disabled:false,
                            text:pageNo4,
                            show:true
                        });
                        scope[pagingModel].buttons.push({
                            pageNo:totalPage-1,
                            btnClass:pageNo==totalPage-1?"btn btn-primary":"btn btn-default",
                            disabled:pageNo<totalPage-3,
                            text:(pageNo<totalPage-3)?"..":totalPage-1,
                            show:true
                        });
                        scope[pagingModel].buttons.push({
                            pageNo:totalPage,
                            btnClass:pageNo==totalPage?"btn btn-primary":"btn btn-default",
                            disabled:false,
                            text:totalPage,
                            show:true
                        });
                    }
                    scope[pagingModel].buttons.push({
                        pageNo:pageNo+1,
                        btnClass:"btn btn-default",
                        disabled:pageNo>=totalPage,
                        text:"下页",
                        show:true
                    });
                    scope[pagingModel].buttons.push({
                        pageNo:totalPage,
                        btnClass:"btn btn-default",
                        disabled:pageNo>=totalPage,
                        text:"末页",
                        show:true
                    });
                };
                $scope.$watchGroup([pagingModel+".pageNo",pagingModel+".pageSize"], function(newVal, oldVal, scope){
                    if(localData){
                        if (newVal && newVal[0] && newVal[1] && newVal != oldVal){
                            var pageNo = newVal[0];
                            var pageSize = newVal[1];
                            var totalPages =scope[pagingModel].totalPages;
                            if(pageNo<1)pageNo=1;
                            if(pageNo>totalPages) pageNo=totalPages;
                            var startRow = (pageNo - 1) * pageSize;
                            var endRow = startRow + pageSize;
                            scope[pagingModel].pageNo = pageNo;
                            scope[pagingModel].startRow = startRow;
                            scope[pagingModel].endRow = Math.min(endRow,scope[pagingModel].totalSize);
                            calcButtons(scope,pagingModel);
                        }
                    }else{
                        if(!newVal || !newVal[0]){
                            scope[pagingModel].pageNo = 1;
                        }else if (newVal && newVal[0] && newVal[1] && newVal != oldVal) {
                            var service = scope[params.service];
                            if(!service || service == null || service == ''){
                                service = params.service;
                            }
                            if (service && service != null && service != '') {
                                var pageSize = newVal[1];
                                var pageNo = newVal[0];
                                var callParams=null;
                                if(angular.isFunction(params.paramModel)) {
                                    callParams = params.paramModel.apply(null,[scope]);
                                }else if(angular.isObject(params.paramModel)){
                                    callParams = params.paramModel;
                                }else{
                                    callParams = scope[params.paramModel];
                                }
                                if(callParams && angular.isObject(callParams)){
                                    var url = url_make(service, callParams);
                                    if(url.indexOf('?')!=-1){
                                        url+="&";
                                    }else{
                                        url+="?";
                                    }
                                    var startRow = (pageNo - 1) * pageSize;
                                    url+="start="+startRow+"&length="+pageSize+"&draw=1";
                                    ax.call(url, function (ret) {
                                        var data = url_data(ret);
                                        var totalSize = data.recordsTotal;
                                        var totalPages = Math.floor((totalSize - 1) / pageSize) + 1;
                                        scope[pagingModel].totalSize = totalSize;
                                        scope[pagingModel].totalPages = totalPages;
                                        var startRow = (pageNo - 1) * pageSize;
                                        var endRow = startRow + pageSize;
                                        scope[pagingModel].startRow = startRow;
                                        scope[pagingModel].endRow = Math.min(endRow,totalSize);
                                        if (params.model) {
                                            scope[params.model] = data.data;
                                        }
                                        calcButtons(scope,pagingModel);
                                        if (params.callback && angular.isFunction(params.callback)) {
                                            params.callback.apply(null,[scope,data.data]);
                                        }
                                    });
                                }
                            }
                        }
                    }
                });

            };
            return {template:str,link:link};
        },
        /**
         * params参数：
         *  1.title：按钮标题
         *  2.right：弹出层是否右对齐，默认左对齐
         *  3.btnclass：按钮样式
         *  4.menus：下拉菜单列表，为对象数组，如果该对象为"-",则直接显示分隔符,对象的属性包括：
         *      1) header:是否为分组抬头,默认为否
         *      2) hide:是否隐藏
         *      3) show:是否显示
         *      4) disabled:是否禁用
         *      5) title:标题
         *      6) action:单击事件响应
         * @param axclass
         * @param params
         * @returns {string}
         */
        dropdown : function(axclass, params){
            var title = params.title || "操作";
            var isRight = params.right ||false;
            var btnClass=params.btnclass || "default";
            var str ="<div class='dropdown' style='display: inline-block'><button type='button' class='btn btn-"+btnClass+" dropdown-toggle' data-toggle='dropdown'>"
                +title+" <span class='caret'></span></button><ul class='dropdown-menu "+(isRight?"dropdown-menu-right":"")+"'>";
            for (var idx in params.menus) {
                var menu = params.menus[idx];
                if (menu == "-") {
                    str += "<li class='divider'></li>";
                } else if (menu.header) {
                    str += "<li class='dropdown-header'>" + menu.title + "</li>";
                } else {
                    str += "<li";
                    if (menu.hide && menu.hide.length > 0) {
                        str += " ng-hide='" + menu.hide.replace(/'/g, "\\'") + "'";
                    }
                    if (menu.show && menu.show.length > 0) {
                        str += " ng-show='" + menu.show.replace(/'/g, "\\'") + "'";
                    }
                    if (menu.disabled && menu.disabled.length > 0) {
                        str += " ng-disabled='" + menu.disabled.replace(/'/g, "\\'") + "'";
                    }
                    str += ">\
				<a style='cursor: pointer;color:#337ab7' \
				onmouseover='this.style.backgroundColor=\"#E7E7E7\"' \
				onmouseout='this.style.backgroundColor=\"#FFFFFF\"' \
				ng-click='" + menu.action + "'>" + menu.title + "</a></li>";
                }
            }
            str+="</ul></div>";
            $(document).on('shown.bs.dropdown',".dropdown", function(){
                // calculate the required sizes, spaces
                var $ul = $(this).children(".dropdown-menu");
                var $button = $(this).children(".dropdown-toggle");
                var ulOffset = $ul.offset();
                // how much space would be left on the top if the dropdown opened that direction
                var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
                // how much space is left at the bottom
                var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
                // switch to dropup only if there is no space at the bottom AND there is space at the top, or there isn't either but it would be still better fit
                if (spaceDown < 10 && (spaceUp >= 0 || spaceUp > spaceDown))
                    $(this).addClass("dropup");
            });
            $(document).on("hidden.bs.dropdown",".dropdown", function () {
                // always reset after close
                $(this).removeClass("dropup");
            });
            return str;
        },

        /**
         * params参数：
         *      1.model:必填，附件对应的业务数据的scope变量
         *      2.bizKey:必填，业务的主键名字
         *      3.state:必填，用于判断是否显示上传附件按钮，!=detail时都会显示上传按钮
         * @param axclass
         * @param params
         * @returns {{template: string, link: link}}
         */
        attachment:function(axclass, params){
            params.property = params.property || "";
            var bizKeyStr = params.model + '.' + params.bizKey;
            var str = '<ul class="list-inline"><li ng-repeat="row in _fileList[' + bizKeyStr +'] | ff:\'find\':{_del:\'N\'}"><a href="javascript:void(0)" ng-click="download(row)" title="点击下载附件"><i class="glyphicon glyphicon-file"></i> {{row.fileName}}</a> <i ng-show="' + params.state + ' != \'detail\'" ng-click="row._del = \'Y\'" class="glyphicon glyphicon-remove" style="cursor:pointer" title="点击删除附件"></i></li></ul>'
            str += '<button type="button" class="btn btn-primary" ng-show="' + params.state + ' != \'detail\'" ' + params.property + 'ng-click="fileUpload()"><i class="glyphicon glyphicon-file"></i> 附件上传</button>';
            var link = function($scope, element, attr){
                //给scope添加上传的弹出框，也可不用模板，直接在对应的业务中添加此方法，返回的是上传成功的附件数组
                $scope.fileUpload = function() {
                    ax.modal({template:"page/base/file.upload.html",bizKeyVal:$scope._currBizVal, callback:function(files){
                        $scope._fileList[$scope._currBizVal] = ($scope._fileList[$scope._currBizVal]).concat(files);
                    }});
                };
                $scope.download = function(row) {
                    window.open(__start_object.url_root_web + "/sys/common/download?id=" + row.uploadFileId);
                }
                $scope.$watch(bizKeyStr, function(newVal, oldVal, scope) {
                    //if(newVal && $scope._fileList[newVal] === undefined) {
                    ax.call(url_make("api/common/getFileList",{bizKeyVal:newVal}),function(ret) {
                        if(ret.data.code == 1) {
                            for(var i = 0; i < ret.data.data.length; i++) {
                                ret.data.data[i]._del = "N";
                            }
                            $scope._fileList[newVal] = ret.data.data || [];
                        }
                    })
                    //}
                    $scope._currBizVal = newVal;
                });
                $scope._fileList = $scope._fileList || {};
            };
            return {template:str,link:link};
        }
    };

