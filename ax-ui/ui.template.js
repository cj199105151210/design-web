var ui_template =
{
    any_html: ui_translate.any_html,
    any_array: ui_translate.any_array,
    any_scope: ui_translate.any_scope,
    any_data: ui_translate.any_data,
    sql_model: ui_translate.sql_model,
    sql_model_watch: ui_translate.sql_model_watch,
    select_watch: ui_translate.select_watch,
    filter: ui_translate.filter,
    obj_chart_simple: ui_object.obj_chart_simple,
    chart_simple: ui_translate.chart_simple,
    img_loading: '<img ng-show="#show#" style="-webkit-user-select:none;margin:auto;" src="ax/css/icon_loading.gif">',

	label: '<h5 class="text-info">#text#</h5>',
    label_title: '<h5 class="text-info"><span class="glyphicon glyphicon-th"></span> #text#</h5>',
    label_size: '<h#size# class="text-info">#text#</h#size#>',
	label_icon: '<h#size# class="text-info"><span class="#icon#"></span> #text#</h#size#>',

    select: '<select #property# class="form-control ax-input" ng-model="#model#" ng-options="x.name for x in #source#"></select>',
    select_dic:'<select #property# class="form-control ax-input" ng-model="#model#"><option ng-repeat="x in #source#" value="{{x.#value#}}" ng-selected="x.#value#==#model#">{{x.#name#}}</option></select>',
    select_str:'<select #property# class="form-control ax-input" ng-model="#model#"><option ng-repeat="x in #source#" value="{{x}}" ng-selected="x==#model#">{{x}}</option></select>',
    select_blank: '<select #property# class="form-control ax-input" ng-model="#model#" ng-options="x.name for x in #source#"><option value=""></option></select>',
    select_dic_blank:'<select #property# class="form-control ax-input" ng-model="#model#"><option value=""></option><option ng-repeat="x in #source#" value="{{x.#value#}}" ng-selected="x.#value#==#model#">{{x.#name#}}</option></select>',
    select_str_blank:'<select #property# class="form-control ax-input" ng-model="#model#"><option value=""></option><option ng-repeat="x in #source#" value="{{x}}" ng-selected="x==#model#">{{x}}</option></select>',
    select_radio:'<div class="form-group" style="height:22px;margin:0px;padding-top:2px">\
        <label class="radio-inline" style="padding-right:20px"><input type="radio" name="#name##model#" style="margin-top:2px;cursor:pointer" ng-model="#model#" ng-value="#value0#">#label0#</label>\
        <label class="radio-inline" style="padding-right:20px"><input type="radio" name="#name##model#" style="margin-top:2px;cursor:pointer" ng-model="#model#" ng-value="#value1#">#label1#</label></div>',
    select_radio_blank:'<div class="form-group" style="height:22px;margin:0px;padding-top:2px">\
        <label class="radio-inline" style="padding-right:20px"><input type="radio" name="#name##model#" style="margin-top:2px;cursor:pointer" ng-model="#model#" ng-value="">全部</label>\
        <label class="radio-inline" style="padding-right:20px"><input type="radio" name="#name##model#" style="margin-top:2px;cursor:pointer" ng-model="#model#" ng-value="#value0#">#label0#</label>\
        <label class="radio-inline" style="padding-right:20px"><input type="radio" name="#name##model#" style="margin-top:2px;cursor:pointer" ng-model="#model#" ng-value="#value1#">#label1#</label></div>',
    select_dic_valid:'<div ng-class="{\'has-error\':#form#.#field_name#.$invalid && !#form#.#field_name#.$pristine}">\
        <select #property# class="form-control ax-input" name="#field_name#" ng-model="#model#"><option ng-repeat="x in #source#" value="{{x.#value#}}" ng-selected="x.#value#==#model#">{{x.#name#}}</option></select>\
        <span ng-repeat="(k,v) in #errorMessages#" ng-show="#form#.#field_name#.$error[k]" style="pointer-events:none;color:#ff0000;font-size:12px"><i class="fa fa-times-circle" style="font-size:13px"></i> {{v}}</span></div>',

    button: '<button #property# type="button" class="btn btn-#btnclass#" ng-click="#click#">#label#</button>',
    button_disabled: '<button type="button" class="btn btn-#btnclass#" ng-click="#click#" ng-disabled="#disabled#">#label#</button>',
    button_query: '<button type="button" class="btn btn-primary pull-right" style="width:120px" ng-click="#click#"><i class="fa fa-search"></i> 查询</button>',
    button_insert: '<button type="button" class="btn btn-primary btn-outline pull-left" ng-click="#click#"><i class="fa fa-plus"></i> 新增</button>',
    button_submit: '<button type="button" class="btn btn-success" style="width:160px" ng-click="#click#">确定</button>',
    button_cancel: '<button type="button" class="btn btn-default" style="width:160px" ng-click="#click#">取消</button>',
    button_reset: '<button type="button" class="btn btn-default btn-xs pull-right" style="margin-top:-25px;float:right;color:#777" ng-click="#click#"><i class="fa fa-eraser"></i> 重置</button>',
    button_layout: '<button type="button" class="btn btn-primary btn-outline pull-left" ng-click="#click#"> 编排通知书号</button>',
    button_export: '<button type="button" class="btn btn-primary btn-outline pull-left" ng-click="#click#"> 导出Excel</button>',
    button_export1: '<button type="button" class="btn btn-primary">查询</button>',

    input: '<input #property# class="form-control ax-input" ng-model="#model#"></input>',
    input_hint: '<input #property# class="form-control ax-input" ng-model="#model#"></input> #hint#',
    input_select: '<input #property# class="form-control ax-input-select" ng-value="#value#" ng-click="#click#" readonly><i class="fa fa-search" style="margin-left:-20px;cursor:pointer" ng-click="#click#"></i></input>',
    input_select_hint: '<input #property# class="form-control ax-input-select" ng-value="#value#" ng-click="#click#" readonly><i class="fa fa-search" style="margin-left:-20px;padding-right:8px;cursor:pointer" ng-click="#click#"></i></input> #hint#',
    input_search: '#label#<input #property# class="form-control ax-input" ng-model="#model#" placeholder="#placeholder#"><i class="fa fa-search" style="pointer-events: none;margin-left:-20px"></i></input>',
    input_valid: '<div ng-class="{\'has-error\':#form#.#name#.$invalid && !#form#.#name#.$pristine}"><input class="form-control ax-input" ng-model="#model#" type="#type#" name="#name#" #property#></input> \
        <span ng-repeat="(k,v) in #errorMessages#" ng-show="#form#.#name#.$error[k]" style="pointer-events:none;color:red;font-size:12px"><i class="fa fa-times-circle" style="font-size:13px"></i> {{v}}</span></div>',
    input_area: '<textarea #property# ng-model="#model#" class="form-control ax-area" rows="#row#"></textarea>',
    input_area_valid: '<div ng-class="{\'has-error\':#form#.#name#.$invalid && !#form#.#name#.$pristine}"><textarea  ng-model="#model#" class="form-control ax-area" rows="#row#"  name="#name#" #property#></textarea>' +
	' <span ng-repeat="(k,v) in #errorMessages#" ng-show="#form#.#name#.$error[k]" style="pointer-events:none;color:red;font-size:12px"><i class="fa fa-times-circle" style="font-size:13px"></i> {{v}}</span></div>',

    table: ui_translate.table,
    table_td0: '<td #property# align="center" style="display:table-cell;vertical-align:middle">#content#</td>',
    table_td1: '<td #property# style="display:table-cell;vertical-align:middle">#content#</td>',
    table_source: ui_translate.table_source,
    table_source_check: '<div><h5></h5><table class="table table-striped table-bordered table-hover" ng-init="titles=#titles#" ng-if="#source#.length || \'#show_header#\'"> \
        <thead style="background: #FEF5EF;"> \
            <tr> \
                <th width="60px" style="text-align:center;" ng-show="#show_check#" ng-checked="select_all" ng-click="selectAll()">选择</th>\
                <th width="60px" style="text-align:center;" ng-show="#show_no#">序号</th> \
                <th ng-repeat="title in #titles#">{{title}}</th> \
                <th width="100px" ng-show="#action#" style="text-align:center;">操作</th> \
                <th width="100px" ng-show="#myAction#" style="text-align:center;">操作</th> \
            </tr> \
        </thead> \
        <tbody> \
            <tr ng-repeat="row in #source#"> \
                <td><input type="checkbox" ng-show="#show_check#" class="#checkClass#" name="selected" ng-click="#checkClick#"><span style="display: none">{{row.fid}}</span></input></td>\
                <td width="60px" align="center" ng-show="#show_no#" style="display:table-cell;vertical-align:middle">{{$index+1}}</td> \
                <td style="max-width:500px;display:table-cell;vertical-align:middle" ng-repeat="(k,v) in titles" ng-bind-html="row[k]">{{row[k]}}</td> \
                <td width="100px" 	ng-show="#action#" align="center" style="display:table-cell;vertical-align:middle"> \
                    <button type="button" class="btn btn-info btn-xs" ng-show="#action_modify#" ng-click="#modify_click#">编辑</button> \
                    <button type="button" class="btn btn-warning btn-xs" ng-show="#action_delete#" ng-click="#delete_click#">删除</button> \
                </td> \
                <td width="100px" 	ng-show="#myAction#" align="center" style="display:table-cell;vertical-align:middle"> \
                    <button type="button" class="btn btn-info btn-xs" ng-show="#action_1#" ng-click="#action1_click#">#action1_name#</button> \
                    <button type="button" class="btn btn-warning btn-xs" ng-show="#action_2#" ng-click="#action2_click#">#action2_name#</button> \
                </td> \
            </tr> \
        </tbody></table></div>',
    table_source_action: '<div><h5></h5><table class="table table-striped table-bordered table-hover" ng-init="titles=#titles#" ng-if="#source#.length || \'#show_header#\'"> \
    	<thead style="background: #FEF5EF;"> \
            <tr> \
                <th width="60px" style="text-align:center;" ng-show="#show_no#">序号</th> \
                <th ng-repeat="title in #titles#">{{title}}</th> \
                <th width="#action_width#px" ng-show="#action#" style="text-align:center;">操作</th> \
            </tr> \
        </thead> \
        <tbody> \
            <tr ng-repeat="row in #source#"> \
                <td width="60px" align="center" ng-show="#show_no#" style="display:table-cell;vertical-align:middle">{{$index+1}}</td> \
                <td style="max-width:500px;display:table-cell;vertical-align:middle" ng-repeat="(k,v) in titles" ng-bind-html="row[k]">{{row[k]}}</td> \
                <td width="#action_width#px" ng-show="#action#" align="center" style="display:table-cell;vertical-align:middle"> \
                	#action_list# \
                </td> \
            </tr> \
        </tbody></table></div>',
    table_source_translate: ui_translate.table_source_translate,
    pagination:ui_translate.pagination,
    dropdown:ui_translate.dropdown,
    attachment:ui_translate.attachment
};
