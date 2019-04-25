
var __root_origin = (location.origin || (location.protocol + "//" + location.host));
var __start_object = 
{
	home: "page/home.html",
	title: "表单引擎",

	modules: ['angularFileUpload'], //引入模块
	factory: ['FileUploader'],      //引入工厂类

	remote_template: false,

	url_root_ax  : __root_origin + "/form-design/",
	url_root_web : __root_origin + "/form-design/",

	url_page_ui  : __root_origin + "/form-design/ax/page_ui?page_id=#page _id#",
	url_sql      : __root_origin + "/form-design/ax/sql_scode?sql_id=#sql_id#&params=#params#",
	url_template : __root_origin + "/form-design/ax/list?obj=template_simple&category=",

	js_url_log: true,
	js_preload:
	[
		"vendor/jquery/jquery.min.js",
		"vendor/angular/angular.js",
		"vendor/angular/angular-sanitize.min.js",
		"vendor/angular/angular-file-upload.min.js",
		"vendor/jquery/jquery.webcam.min.js",
		"vendor/jquery/jquery.webcam.js",
		"vendor/jquery/jquery.easyui.min.js",
        "vendor/jquery/jquery.cookie.js",
		"vendor/jquery/jquery.form.min.js",
		"vendor/bootstrap/js/bootstrap.min.js",

        "vendor/ueditor/ueditor.config.js",
        "vendor/ueditor/ueditor.all.js",
        "vendor/metisMenu/metisMenu.min.js",
		"vendor/sb-admin-2/js/sb-admin-2.min.js",


		"vendor/echart/echarts.simple.min.js",

		"ax-ui/ui.object.js",
		"ax-ui/ui.translate.js",
		"ax-ui/ui.template.js",

		"ax/ax.class.js",
		"ax/ax.define.js",
		"ax/ax.func.js",
		"ax/ax.prepare.js",
		"ax/ax.service.js",
		"ax/ax.ui.js",
		"ax/ax.filter.js",
		"ax/ax.page.js",
		"ax/ax.uploader.js",

		"js/base/query.js",
		"js/base/manager.js",
		"js/component/treeview.js",
		"js/service.js",
		"js/service.js",
		"js/home.js",
		"js/public/user.select.js",
		"js/public/right.select.js",
		// 引入ztree
		"vendor/ztree/js/jquery.ztree.all.js",
		"vendor/layui/layui.all.js",
		"vendor/ueditor/third-party/webuploader/webuploader.js",
		"js/bosi/formDesign/formDesign.js",
		"js/public/preview2.js",
        "js/public/formmodel.js",
        "js/public/formadd.js",
        "js/public/singletext.js",
        "js/public/textarea.js",
        "js/public/radios.js",
        "js/public/detailControl.js",
		"js/public/select.js",
        "js/public/parentselect.js",
        "js/public/importimage.js",
        "js/public/formdate.js",
		"js/public/checkboxs.js",
		"js/public/select.js"
		],

		js_always_reload:false,
		js_version_log: false,
		js_version:
	{
		"vendor/jquery/jquery.min.js"            : {ver:"20180400.00", always_reload:false},
		"vendor/angular/angular.min.js"          : {ver:"20180400.00", always_reload:false},
		"vendor/angular/angular-sanitize.min.js" : {ver:"20180400.00", always_reload:false},

		"vendor/bootstrap/js/bootstrap.min.js"   : {ver:"20180400.00", always_reload:false},
		"vendor/metisMenu/metisMenu.min.js"      : {ver:"20180400.00", always_reload:false},
		"vendor/sb-admin-2/js/sb-admin-2.min.js" : {ver:"20180400.00", always_reload:false},
		
		"vendor/echart/echarts.simple.min.js"    : {ver:"20180400.00", always_reload:false}
	},
	js_start_time: (new Date()).valueOf()
};

(function()
{
	document.title = __start_object.title;
	document.write('<div ng-app="app" ng-controller="axroot" ng-include="\'ax/html/ax.root.html\'"></div>');
	for (var i in __start_object.js_preload)
	{
		var s = __start_object.js_preload[i];
        var o = __start_object.js_version[s];
        var v = __start_object.js_always_reload ? __start_object.js_start_time : undefined;
        v = o ? (typeof o === 'string' ? (v?v:o) : (o.always_reload ? __start_object.js_start_time : o.ver)) : v;
        if (__start_object.js_version_log)
            console.log("[js_version]: " + s + " = " + v);
        if (v)
            s += "?" + v;
        document.write('<script src="' + s + '"></script>');
	}
})();