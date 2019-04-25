var ui_template = ui_template || {};

ax.ui = new (AX.Class.extend(
{
    ctor: function()
    {
        this.url_page_ui  = __start_object.url_page_ui;
        this.url_sql      = __start_object.url_sql;
        this.url_template = __start_object.url_template;

        if (__start_object.remote_template)
            ax.serv.call(this.url_template, function(ret)
            {
                if (!ret.succ)
                    return;
                var data = ret.data.data;
                if (angular.isArray(data))
                    for (var i in data)
                    {
                        var rec = data[i];
                        ui_template[rec.template] = rec.scode_type == "string" ? rec.scode : eval("(" + rec.scode + ")");
                    }
                ax.root.AXAppReady = true;
            });
    },
    querySql: function(scope, params, callback)
    {
        var s = this.replaceObjectValue(scope, params, params.params);
        var sql_id = params.sql.substr(0, params.sql.indexOf(":"));
        ax.serv.call(this.url_sql.replace("#sql_id#", sql_id).replace("#params#", s), function(ret)
        {
            var data = url_data(ret);
            if (data && callback)
                callback(data);
        });
    },
    queryPage: function(page_id, callback, context)
    {
        ax.serv.call(this.url_page_ui.replace("#page_id#", page_id), (function(ret)
        {
            var data = url_data(ret);
            if (data && callback)
                callback(this.createClassFromJson(data), context);
        }).bind(this));
    },
    createClassFromJson: function(json)
    {
        var ui, obj, html = "", attr = {};
        for (var i in json.ui)
        {
            ui = json.ui[i];
            obj = ui.params_object.charAt(0) == "{" ? eval("(" + ui.params_object + ")") : {params:ui.params_object};
            obj.template = ui.template;
            html += this.translateTemplate(attr, obj);
        }
        var AXClass = json.controller && AX.Classes[json.controller] || AX.Class;
        var axclass = AXClass.extend("remote" + json.page_id, attr.scope || {});
        if (AXClass.directiveData)
            axclass.directiveData = angular.copy(AXClass.directiveData);
        if (attr.directiveData)
        {
            axclass.directiveData = axclass.directiveData || {};
            for (var i in attr.directiveData)
                axclass.directiveData[i] = attr.directiveData[i];
        }
        axclass.links = attr.links;
        axclass.html = html;
        return axclass;
    },
    setScopeFromSql: function(scope, params)
    {
        this.querySql(scope, params, function(data)
        {
            scope[params.model] = angular.isString(data) ? eval("(" + data + ")") : data;
            scope.$apply();
        });
    },
    replaceUndefinedValue: function(template)
    {
        if (!template)
            return template;
        var p;
        var s = template;
        while (true)
        {
            p = s.match(/#(\w*)#/); //匹配##之间的单词（有效单词 = 字母、数字、_）
            if (!p)
                break;
            s = s.replace(new RegExp(p[0], "gm"), "");
        }
        return s;
    },
    replaceObjectValue: function(scope, params, obj)
    {
        if (obj == undefined)
            return "";
        var s = angular.isString(obj) ? obj : JSON.stringify(obj);
        if (s.indexOf("function()") >= 0)
            return JSON.stringify(eval("(" + s + ")()"));
        var p, v;
        while (true)
        {
            p = s.match(/#(.*)#/); //匹配##之间的变量或表达式
            if (!p)
                break;
            v = eval("scope." + p[1]);
            s = s.replace(new RegExp(p[0], "gm"), v==undefined?"":v);
        }
        return s;
    },
    translateString: function(data, template)
    {
        for (var i in data)
            template = template.replace(new RegExp("#" + i + "#", "gm"), data[i]);
        return template;
    },
    translateTemplate: function(axclass, data, template)
    {
        if (angular.isString(data))
            return data;
        if (angular.isFunction(data))
            data = data();
        if (!angular.isObject(data) || !data.template || !ui_template[data.template])
            return "";
        template = template || ui_template[data.template];
        if (angular.isString(template))
        {
            for (var i in data)
                if (i != "template")
                {
                    var v = data[i];
                    if (angular.isArray(v))
                    {
                        var s = "";
                        for (var j in v)
                            s += this.translateTemplate(axclass, v[j]) + " ";
                        v = s;
                    }
                    else if (angular.isObject(v))
                        if (v.template && ui_template[v.template])
                            v = this.translateTemplate(axclass, v);
                        else
                            v = JSON.stringify(v).replace(new RegExp('"', "gm"), "'");
                    template = template.replace(new RegExp("#" + i + "#", "gm"), v);
                }
            template = this.replaceUndefinedValue(template);
        }
        else if (angular.isFunction(template))
            template = template.apply(null, [axclass, data.params || data]);
        if (axclass && angular.isObject(template))
        {
            axclass.links = axclass.links || [];
            axclass.links.push(template.link);
            template = template.template;
        }
        if (data.prefix)
            template = this.translateTemplate(axclass, data.prefix) + template;
        if (data.suffix)
            template += this.translateTemplate(axclass, data.suffix);
        return template;
    },
    checkScopeValid: function(scope, params)
    {
        if (!params.valid)
            return true;
        for (var i in params.valid)
        {
            var v = eval("scope." + params.valid[i]);
            if (v == undefined)
            {
                ax.alert(params.valid_hint);
                return;
            }
        }
        return true;
    }


}))();

