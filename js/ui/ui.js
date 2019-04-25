
var UILabelPage = AXBasePage.extend("ui.label",
{
    initForm: function()
    {
        this.scope.code = 'html:' + '\n' +
            '<h5 class="text-info">默认标签</h5>' + '\n' +
            '<h5 class="text-info"><span class="glyphicon glyphicon-th"></span> 标题标签</h5>' + '\n' +
            '<h6 class="text-info">自定义尺寸标签</h6>' + '\n' +
            '<h6 class="text-info"><span class="fa fa-music"></span> 自定义尺寸和图标标签</h6>' + '\n' +
            '\nJS:' + '\n' +
            'label: {template:"label", text:"默认标签"}' + '\n' +
            'label_title: {template:"label_title", text:"标题标签"}' + '\n' +
            'label_size: {template:"label_size", text:"自定义尺寸标签", size:6}' + '\n' +
            'label_icon: {template:"label_icon", text:"自定义尺寸和图标标签", size:6, icon:"fa fa-music"}';
    }
});

var UIButtonPage = AXBasePage.extend("ui.button",
{
    initForm: function()
    {
        this.scope.code = 'html:' + '\n' +
            '<button type="button" class="btn btn-primary" ng-click="">默认按钮</button>' + '\n' +
            '<button type="button" class="btn btn-info" ng-click="" ng-disabled="true">禁用按钮</button>' + '\n' +
            '<button type="button" class="btn btn-primary pull-right" style="width:120px" ng-click=""><i class="fa fa-search"></i> 查询</button>' + '\n' +
            '<button type="button" class="btn btn-primary btn-outline pull-left" ng-click=""><i class="fa fa-plus"></i> 新增</button>' + '\n' +
            '<button type="button" class="btn btn-success" style="width:160px" ng-click="">确定</button>' + '\n' +
            '<button type="button" class="btn btn-default" style="width:160px" ng-click="">取消</button>' + '\n' +
            '<button type="button" class="btn btn-default btn-xs pull-right" style="margin-top:-25px;float:right;color:#777" ng-click=""><i class="fa fa-eraser"></i> 重置</button>' + '\n' +
            '\nJS:' + '\n' +
            '//btnclass: bootstrap按钮类型default、primary、info、warning...' + '\n' +
            '//property: 自定义附加属性，如property:\'style="xxx"\'' + '\n' +
            '//模板原型请参见ui.template.js' + '\n' +
            'button: {template:"button", btnclass:"primary", click:"", label:"默认按钮", property:""}' + '\n' +
            'button_disabled: {template:"button_disabled", btnclass:"primary", click:"", label:"禁用按钮", property:"", disabled:"true"}' + '\n' +
            'button_query:  {template:"button_query", click:""}  //查询(查询页面)' + '\n' +
            'button_insert: {template:"button_insert", click:""} //新增(查询页面)' + '\n' +
            'button_submit: {template:"button_submit", click:""} //确定(编辑页面的确定)' + '\n' +
            'button_cancel: {template:"button_cancel", click:""} //取消(编辑页面的取消)' + '\n' +
            'button_reset:  {template:"button_reset", click:""}  //重置(查询页面)';
        this.scope.codeInTable = 'html:' + '\n' +
            '<td width="100px" align="center" style="display:table-cell;vertical-align:middle">' + '\n' +
            '    <button type="button" class="btn btn-info btn-xs">编辑</button>' + '\n' +
            '    <button type="button" class="btn btn-warning btn-xs">删除</button>' + '\n' +
            '</td>' + '\n' +
            '<td width="100px" align="center" style="display:table-cell;vertical-align:middle">' + '\n' +
            '    <button type="button" class="btn btn-outline btn-info btn-xs"><i class="fa fa-arrow-up"></i></button>' + '\n' +
            '</td>' + '\n' +
            '<td width="200px" style="display:table-cell;vertical-align:middle">' + '\n' +
            '    <div class="row" style="width:200px;padding-left:15px">' + '\n' +
            '        <input value="这是一个编辑框" style="width:150px;border:0px;background:none;padding:0px">' + '\n' +
            '        <button type="button" class="btn btn-info btn-xs btn-outline pull-right"><b>...</b></button>' + '\n' +
            '    </div>' + '\n' +
            '</td>' + '\n' +
            '\nJS: 无' + '\n';
        this.scope.codeGroup = 'html:' + '\n' +
            '<div class="btn-group" role="group" style="height:50px" ng-init="currPanel=1">' + '\n' +
            '   <button type="button" class="btn btn-default" ng-click="currPanel=1">按钮1</button>' + '\n' +
            '   <button type="button" class="btn btn-default" ng-click="currPanel=2">按钮2</button>' + '\n' +
            '   <button type="button" class="btn btn-default" ng-click="currPanel=3">按钮3</button>' + '\n' +
            '   <button type="button" class="btn btn-default" ng-click="currPanel=4">按钮4</button>' + '\n' +
            '</div>' + '\n' +
            '<div class="panel panel-default">' + '\n' +
            '   <div class="panel-body" ng-show="currPanel==1">' + '\n' +
            '       当前显示的是：按钮1对应的panel<br>' + '\n' +
            '       按钮组用于两个方面：<br>' + '\n' +
            '       。替代tab导航，避免出现两层导航，影响美观<br>' + '\n' +
            '       。同一系列业务功能的按钮' + '\n' +
            '   </div>' + '\n' +
            '   <div class="panel-body" ng-show="currPanel==2">' + '\n' +
            '       当前显示的是：按钮2对应的panel' + '\n' +
            '   </div>' + '\n' +
            '   <div class="panel-body" ng-show="currPanel==3">' + '\n' +
            '       当前显示的是：按钮3对应的panel' + '\n' +
            '   </div>',
            '   <div class="panel-body" ng-show="currPanel==4">' + '\n' +
            '       当前显示的是：按钮4对应的panel' + '\n' +
            '   </div>' + '\n' +
            '</div>' + '\n' +
            '\nJS: 无' + '\n';
    }
});

var UIInputPage = AXBasePage.extend("ui.input",
{
    initForm: function()
    {
        this.scope.code = 'html:' + '\n\n' +
            '//默认输入框，宽度220，可全显示16个汉字' + '\n' +
            '<input class="form-control ax-input"></input>' + '\n\n' +

            '//后面带提示的输入框' + '\n' +
            '<input class="form-control ax-input"></input> ※' + '\n\n' +

            '//弹窗选择输入框' + '\n' +
            '<input class="form-control ax-input-select" readonly>' + '\n' +
            '   <i class="fa fa-search" style="margin-left:-20px;cursor:pointer"></i>' + '\n' +
            '</input>' + '\n\n' +

            '//后面带提示的弹窗选择输入框' + '\n' +
            '<input class="form-control ax-input-select" readonly>' + '\n' +
            '   <i class="fa fa-search" style="margin-left:-20px;padding-right:8px;cursor:pointer"></i>' + '\n' +
            '</input> ※' + '\n\n' +

            '//搜索输入框' + '\n' +
            '<input class="form-control ax-input" placeholder="请输入内容">' + '\n' +
            '<i class="fa fa-search" style="pointer-events:none;margin-left:-20px"></i></input>' + '\n\n' +

            '//////////以下指令见 ui.js - UIInputPage, 注意外层需要form包含：' + '\n\n' +

            '<form name="UIInputPage" novalidate>' + '\n\n' +

            '//校验示例(非空)' + '\n' +
            '<directive key="input_valid_nonull"></directive>' + '\n\n' +

            '//校验示例(长度范围)' + '\n' +
            '<directive key="input_valid_length"></directive>' + '\n\n' +

            '//校验示例(手机)' + '\n' +
            '<directive key="input_valid_phone"></directive>' + '\n\n' +

            '//校验示例(邮箱)' + '\n' +
            '<directive key="input_valid_email"></directive>' + '\n\n' +

            '//校验示例(身份证号)' + '\n' +
            '<directive key="input_valid_idcard"></directive>' + '\n\n' +

            '</form>' + '\n\n' +

            '\nJS:' + '\n';
    }
});

UIInputPage.directiveData =
{
    input_valid_nonull:
    {
        template:"input_valid", model:"modifyRecord.userCode", form:"UIInputPage", name:"userCode", property:"required",
        errorMessages:
        {
            required:"账号不能为空"
        }
    },
    input_valid_length:
    {
        template:"input_valid", model:"modifyRecord.password", form:"UIInputPage", name:"password", property:"ng-minlength=6 ng-maxlength=20",
        errorMessages:
        {
            minlength:"密码不能少于6位字符",
            maxlength:"密码不能超过20位字符"
        }
    },
    input_valid_phone: 
    {
        template:"input_valid", model:"modifyRecord.mobile", type:"", form:"UIInputPage", name:"mobile", property:"pattern='1\\d{10}'",
        errorMessages:
        {
            pattern:"手机号码错误"
        }
    },
    input_valid_email:
    {
        template:"input_valid", model:"modifyRecord.email", type:"email", form:"UIInputPage", name:"email", property:"",
        errorMessages:
        { 
            email:"邮箱格式错误"
        }
    },
    input_valid_idcard:
    {
        template:"input_valid", model:"modifyRecord.idCard", form:"UIInputPage", name:"idCard", property:"directive-valid",
        errorMessages:
        {
            idCard:"身份证号错误"
        }
    }
};

UIInputPage.directiveValid = function(scope, elm, attrs, ctrl) 
{
    ctrl.$validators.idCard = function(modelValue, viewValue) 
    {
        if (ctrl.$isEmpty(modelValue)) 
            return true;
        if (viewValue.length != 18)
            return false;
        var IDCARD_18 = /^\d{17}[0-9|x|X]$/;
        if (!viewValue.match(IDCARD_18))
            return false;
        if (viewValue.substr(6,4)<1900 || viewValue.substr(6,4)>2100 ||
            viewValue.substr(10,2)>12 || viewValue.substr(10,2)<1 ||
            viewValue.substr(12,2)>31||viewValue.substr(12,2)<1)
            return false;
        var Wi = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
        var Ai = new Array('1','0','X','9','8','7','6','5','4','3','2');
        if (viewValue.charAt(17) == 'x')
            viewValue = viewValue.replace("x","X");
        var strSum = 0;
        for (var i=0; i<viewValue.length-1; i++)
            strSum = strSum + viewValue.charAt(i)*Wi[i];
        return viewValue.charAt(17) == Ai[strSum%11];
    };
};

var UISelectPage = AXBasePage.extend("ui.select",
{
    initForm: function()
    {
        this.scope.staticList = [{id:"1", name:"选项1"}, {id:"2", name:"选项2"}, {id:"3", name:"选项3"}];
        this.scope.objList = [{id:"1", name:"字典1"}, {id:"2", name:"字典2"}, {id:"3", name:"字典3"}];
        this.scope.strList = ["字串1", "字串2", "字串3"];
        this.scope.selected_obj_id = "2"; //注意要用字串匹配，不能是数字
        this.scope.selected_obj = this.scope.objList[1];
        this.scope.selected_str = "字串2";
        this.scope.value_str1 = "女";
        this.scope.value_str2 = 0;
        this.scope.code = 'html:' + '\n\n' +
            '//字串选择1：' + '\n' +
            '<div class="form-group" style="height:22px;margin:0px;padding-top:2px">' + '\n' +
            '    <label class="radio-inline" style="padding-right:20px"><input type="radio" style="margin-top:2px" name="sex1" ng-value="\'男\'" ng-model="value_str1">男</label>' + '\n' +
            '    <label class="radio-inline" style="padding-right:20px"><input type="radio" style="margin-top:2px" name="sex1" ng-value="\'女\'" ng-model="value_str1">女</label>' + '\n' +
            '</div>' + '\n\n' +

            '//字串选择2：' + '\n' +
            '<div class="form-group" style="height:22px;margin:0px;padding-top:2px">' + '\n' +
            '    <label class="radio-inline" style="padding-right:20px"><input type="radio" style="margin-top:2px" name="sex2" ng-value="1" ng-model="value_str2">男</label>' + '\n' +
            '    <label class="radio-inline" style="padding-right:20px"><input type="radio" style="margin-top:2px" name="sex2" ng-value="0" ng-model="value_str2">女</label>' + '\n' +
            '</div>' + '\n\n' +

            '//默认选项(无初始选中)：' + '\n' +
            '<select class="form-control ax-input" ng-model="selected_static" ng-options="x.name for x in staticList"></select>' + '\n\n' +

            '//字典选择(对象型，可初始选中)：' + '\n' +
            '<select class="form-control ax-input" ng-model="selected_obj_id">' + '\n' +
            '    <option ng-repeat="x in objList" value="{{x.id}}" ng-selected="x.id==selected_obj_id">{{x.name}}</option>' + '\n' +
            '</select>' + '\n\n' +

            '//字典选择(字符型，可初始选中)：' + '\n' +
            '<select class="form-control ax-input" ng-model="selected_str">' + '\n' +
            '    <option ng-repeat="x in strList" value="{{x}}" ng-selected="x==selected_str">{{x}}</option>' + '\n' +
            '</select>' + '\n\n' +

            '//字典选择(带空行)：' + '\n' +
            '<select class="form-control ax-input" ng-model="selected_obj_id">' + '\n' +
            '    <option value=""></option>' + '\n' +
            '    <option ng-repeat="x in objList" value="{{x.id}}" ng-selected="x.id==selected_obj_id">{{x.name}}</option>' + '\n' +
            '</select>' + '\n\n' +
            '\nJS:' + '\n';
    }
});









