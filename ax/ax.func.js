ax.func = new (AX.Class.extend(
{
    uuid: function()
    {
        var date = new Date();
        var s = date.getFullYear() + 
            this.prefix(date.getMonth()+1) + 
            this.prefix(date.getDate()) +
            this.prefix(date.getHours()) +
            this.prefix(date.getMinutes()) +
            this.prefix(date.getSeconds()) + 
            this.prefixLen(date.getMilliseconds(), 3) + "_";

        var t = date.getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function')
            t += performance.now();
        
        s += 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
        {
            var r = (t + Math.random() * 16) % 16 | 0;
            t = Math.floor(t/16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        }).toUpperCase();
        return s;
    },
    saveToFile: function(file, content)
    {
        if (angular.isString(content))
            window.localStorage.setItem(file, content);
        else
        {
            var fr = new FileReader();
            fr.onload = function(e) 
            {
                window.localStorage.setItem(file, e.target.result);
            };
            fr.readAsDataURL(content);
        }
    },
    parseKeyValue: function(value) 
    {
        var obj = {};
        if (!value)
            return obj;
        var arr = value.substr(1).split('&');
        for (var i in arr)
        {
            var keyValue = arr[i];
            if (!keyValue)
                continue;
            var splitPoint, key, val;
            key = keyValue = keyValue.replace(/\+/g,'%20');
            splitPoint = keyValue.indexOf('=');
            if (splitPoint !== -1) 
            {
                key = keyValue.substring(0, splitPoint);
                val = keyValue.substring(splitPoint + 1);
            }
            key = decodeURIComponent(key);
            if (key) 
                obj[key] = val ? decodeURIComponent(val) : "";
        }
        return obj;
    },
    randomRange: function(min, max)
    {
        if (min >= max)
            return min;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    setIndexOf: function(arr)
    {
        arr.indexOf = function(obj)
        {
            for (var i=0; i<this.length; i++)
                if (this[i] == obj)
                    return i;
            return -1;
        }
    },
    copyObject: function(src, isProto)
    {
        if (isProto)
            return Object.create(src);
        var obj = {};
        //注意：只适用于单层拷贝，对于2层以上的对象为指针
        for (var i in src)
            obj[i] = src[i];
        return obj;
    },
    updateObject: function(obj, newObj)
    {
        for (var i in newObj)
            obj[i] = newObj[i];
    },
    getObject: function(arr, key, value)
    {
        for (var i in arr)
            if (arr[i][key] == value)
                return arr[i];
        return null;
    },
    getObjects: function(arr, key, value)
    {
        var data = [];
        for (var i in arr)
            if (arr[i][key] == value)
                data.push(arr[i]);
        return data;
    },
    getObjectIndex: function(arr, key, value)
    {
        for (var i in arr)
            if (arr[i][key] == value)
                return i;
        return -1;
    },
    getObjectValues: function(obj)
    {
        var s = "";
        for (var i in obj)
            if (i.charAt(0) != "$")
                s += "," + obj[i];
        return s && s.substr(1);
    },
    logObject: function(obj)
    {
        log("========logobj=======")
        for (var i in obj)
            log(i + ":" + obj[i]);
        log("=====================")
    },
    prefix: function(v)
    {
        return (''+v).length < 2 ? "0" + v : v;
    },
    prefixLen: function(v, n)
    {
        v += '';
        while (v.length < n)
            v = "0" + v;
        return v;
    },
    formatTime: function(time, format)
    {
        var s = (format || "%Y-%m-%d %X").replace("%Y", time.getFullYear());
        s = s.replace("%m", this.prefix(time.getMonth()+1));
        s = s.replace("%d", this.prefix(time.getDate()));
        s = s.replace("%X", this.prefix(time.getHours())+":"+this.prefix(time.getMinutes())+":"+this.prefix(time.getSeconds()));
        s = s.replace("%x", this.prefix(time.getHours())+""+this.prefix(time.getMinutes())+""+this.prefix(time.getSeconds()));
        return s;
    },
    getCurrSecond: function()
    {
        return Math.floor(new Date().getTime()*0.001);
    },
    strToSecond: function(stime)
    {
        return Date.parse(stime.replace(/[^0-9: ]/mg, '/')).valueOf()*0.001;
    },
    secondToStr: function(second, format)
    {
        var date = new Date();
        date.setTime(second * 1000);
        return this.formatTime(date, format);
    },
    getCurrDate: function(format)
    {
        return this.formatTime(new Date(), format || "%Y-%m-%d");
    },
    getCurrTime: function(format)
    {
        return this.formatTime(new Date(), format);
    },
    getDiffDate: function(diff, format)
    {
        return this.secondToStr(this.getCurrSecond() + diff, format || "%Y-%m-%d");
    },
    getDiffTime: function(diff, format)
    {
        return this.secondToStr(this.getCurrSecond() + diff, format);
    },
    md5: function(s)
    {
        return hex_md5(s);
    },
    list2tree: function(data, f_id, f_pid, f_name, style)
    {
        var d, o, t = {};
        for (var i in data)
        {
            d = data[i];
            if (t[d[f_id]] && t[d[f_id]].id)
                continue;
            o = {id:d[f_id], pid:d[f_pid], data:d};
            for (var i in style)
                o[i] = style[i];
            if (f_name)
                o.text = d[f_name];
            if (d.nodes)
            {
                o.nodes = d.nodes;
                delete d.nodes;
            }
            if (o.pid)
                if (!t[o.pid])
                    t[o.pid] = {nodes:[o]};
                else if (!t[o.pid].nodes)
                    t[o.pid].nodes = [o];
                else
                    t[o.pid].nodes.push(o);
            if (t[o.id])
                o.nodes = o.nodes ? o.nodes.concat(t[o.id].nodes) : t[o.id].nodes;
            t[o.id] = o;
        }
        var tree = [];
        for (var i in t)
            if (!t[i].data)
                tree = tree.concat(t[i].nodes);
            else if (!t[i].data[f_pid])
                tree.push(t[i]);
        return tree;
    },
    tree2list: function(tree)
    {
        var o, t, data = [];
        tree = angular.isArray(tree) ? tree : [tree];
        for (var i in tree)
        {
            t = tree[i];
            o = {};
            for (var j in t.data)
                o[j] = t.data[j];
            data.push(o);
            if (t.nodes)
                data = data.concat(ax.func.tree2list(t.nodes));
        }
        return data;
    },
    visitTree: function(tree, eachHandler)
    {
        for (var i=tree.length-1; i>=0; i--)
        {
            if (tree[i].nodes)
                ax.func.visitTree(tree[i].nodes, eachHandler);
            eachHandler(tree, i);
        }
    },
    filterTree: function(tree, eachHandler)
    {
        for (var i=tree.length-1; i>=0; i--)
        {
            if (!eachHandler(tree[i]))
                tree.splice(i, 1);
            else if (tree[i].nodes)
                ax.func.filterTree(tree[i].nodes, eachHandler);
        }
    },
    //从一组自关联的数组数据中，指定若干项id，返回该项所有的父级和子级
    getReleateList: function(data, f_id, f_pid, ids)
    {
        var pushChildren = function(node)
        {
            for (var i in data)
                if (data[i][f_pid].toString() == node[f_id].toString())
                {
                    list.push(data[i]);
                    pushChildren(data[i]);
                }
        }
        var pushParent = function(node)
        {
            for (var i in data)
                if (data[i][f_id].toString() == node[f_pid].toString() && !ax.func.getObject(list, f_id, data[i][f_id]))
                {
                    list.unshift(data[i]);
                    pushParent(data[i]);
                    break;
                }
        }
        var list = [];
        ids = angular.isArray(ids) ? ids : [ids];
        for (var i in ids)
        {
            var node = ax.func.getObject(data, f_id, ids[i]);
            pushParent(node);
            list.push(node);
            pushChildren(node);
        }
        return list;
    },
    isNumber: function(num, min, max)
    {
        var exp = /^(([1-9]\d*)|\d)(\.\d{1,6})?$/;
        return exp.test(num) && (!min || num>=min) && (!max || num<max);
    },
    isCurrency: function(num, min, max)
    {
        var exp = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
        return exp.test(num) && (!min || num>=min) && (!max || num<max);
    },
    isIdCard:function(viewValue)
    {
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
    }
}))();
