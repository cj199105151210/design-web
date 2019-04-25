var AXTemplate =
{
    pageRemote:   "ax/html/ax.remote.html",
    modalAlert:   "ax/html/ax.modal.alert.html",
    modalConfirm: "ax/html/ax.modal.confirm.html",
    modalPrompt:  "ax/html/ax.modal.prompt.html",
    modalLock:    "ax/html/ax.modal.lock.html"
};

var ax =
{
	root: {},
    page: {},
    globals: {uid:0},
    filter: undefined,
    func: undefined,
    serv: undefined,
    ui: undefined,
	call: function(url, cb, context)
    {
        var f = function(ret)
        {
            ret.context = context;
            if (cb)
                cb.apply(null, arguments);
        };
        // ax.http.get(url).then(f, f);
        ax.http.post(url).then(f,f);
    },
    modal: function(modalInfo)
    {
        ax.root.AXModalInfo = modalInfo;
        ax.root.AXModalInfoList.push(modalInfo);
        modalInfo._id = "axmodal" + (++ax.globals.uid);
        modalInfo._rand = Math.random(); 
        modalInfo._show = function()
        {
            ax.timeout(function()
            {
                $('#' + modalInfo._id).modal('show');
                $('#' + modalInfo._id).on('hidden.bs.modal', function() 
                {
                    ax.root.AXModalInfoList.splice(ax.root.AXModalInfoList.indexOf(modalInfo), 1);
                    if (ax.root.AXModalInfo == modalInfo)
                        ax.root.AXModalInfo = ax.root.AXModalInfoList.length ? ax.root.AXModalInfoList[ax.root.AXModalInfoList.length-1] : null;
                    ax.root.$apply();
                });
            });
        };
        modalInfo._hide = function()
        {
            $('#' + modalInfo._id).modal('hide');
        };
        return modalInfo;
    },
    alert: function(str, callback)
    {
    	return ax.modal({template:AXTemplate.modalAlert, content:str, callback:callback});
    },
    confirm: function(str, callback, cancel, detail)
    {
        return ax.modal({template:AXTemplate.modalConfirm, content:str, callback:callback, cancel:cancel, detail:detail});
    },
    prompt: function(str, callback)
    {
        return ax.modal({template:AXTemplate.modalPrompt, content:str, callback:callback});
    },
    lock: function(wait, result, callback)
    {
        return ax.modal({template:AXTemplate.modalLock, wait:wait, result:result, locked:true, callback:callback});
    },
    setScopeFromServer: function(scope, model, urlMakeParams, context)
    {
        ax.call(url_make.apply(null, urlMakeParams), function(ret)
        {
            var data = url_data(ret);
            if (data)
                scope[model] = data;
        }, context);
    },
    getAXClass: function(element)
    {
        if (element.attr("ax-class"))
            return AX.Classes[element.attr("ax-class")];
        var dom = element.get(0);
        while (dom = dom.parentNode)
            if (dom.getAttribute && (dom.getAttribute("ng-controller") || dom.getAttribute("ax-class")))
                return dom.getAttribute("ax-class") && AX.Classes[dom.getAttribute("ax-class")];
    },
    touch: function(scope, value)
    {
        for (var i in scope.$$watchers)
        {
            var f = scope.$$watchers[i];
            if (f.exp == value)
            {
                f.fn(scope[value] == undefined ? '' : scope[value], scope[value], scope);
                break;
            }
        }
    },
    getElementById: function(node, tag, id)
    {
        if (!node || !tag)
            return document.getElementById(id);
        var children = node.find(tag);
        for (var i in children)
            if (children[i].id == id)
                return children[i];
        return null;
    },
    getElement: function(ins, id)
    {
        var node = ax.getElementById(ins.attrs.$$element, "DIV", id);
        if (node)
            return angular.element(node);
    },
    removeElementById: function(id)
    {
        var node = this.getElementById(null, null, id);
        if (node)
            if (node.remove)
                node.remove();
            else
                document.body.removeChild(node);
    }
};
