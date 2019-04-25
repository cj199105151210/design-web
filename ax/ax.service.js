
// url_make(servname)                                 --servname?t=123456
// url_make(servname, key1, value1, key2, value2...)  --servname?key1=value1&key2=value2&t=123456
// url_make(servname, object)                         --servname?data={}&t=123456
// url_make(servname, "abc", object)                  --servname?abc={}&t=123456
var url_make = function()
{
    var servname = arguments[0];
    if (angular.isObject(c_url) && c_url[servname])
        servname = c_url[servname];
    var url = __start_object.url_root_web || __start_object.url_root_ax;
    if (servname.indexOf("ax:") == 0)
    {
        url = __start_object.url_root_ax;
        servname = servname.substr(3);
    }
    url += servname + "?";
    if (arguments.length == 2 || arguments.length == 3 && angular.isObject(arguments[2])) //对象类型的参数
    {
        //值转为string
        var args = arguments.length == 2 ? arguments[1] : arguments[2];
        args = JSON.stringify(args, function(k, v)
        {
            if (k != "$$hashKey" && v != null && v != undefined)
                return v;
        });
        // log((arguments.length == 3 ? arguments[1] + "=" : "data=") + args);
        url += (arguments.length == 3 ? arguments[1] + "=" : "data=") + encodeURIComponent(args) + "&";
    }
    else 
    {
        for (var i=1; i<arguments.length; i+=2)
            url += arguments[i] + "=" + arguments[i+1] + "&";
    }
    url += "t=" + ax.func.getCurrSecond();
    if (__start_object.js_url_log)
        log(url);
    return url;
};

var url_last_error;
var url_data = function(ret, silent)
{
    var error;
    while (true)
    {
        if (!ret.succ && ret.status != 200)
        {
            error = "网络错误，请重试";
            break;
        }
        var data = ret.data;
        if (!data)
        {
            error = "服务器返回数据格式错误";
            break;
        }
        var code = parseInt(data.code);
        if (code != 1)
        {
            error = " " + data.desc;
            break;
        }
        if ((!__start_object.url_root_web || ret.context && ret.context.lowercase) && ret.status == 200 && data.data)
            ax.serv.jsonKeyTolowerCase(data.data);

        return data.data || true;
    }
    if (error)
    {
        url_last_error = error;
        if (!silent)
            alert(error);
    }
};

ax.serv = new (AX.Class.extend(
{
	ctor: function()
	{
		this.m_servGroup = 0;
        this.m_loaderCount = 0;
        this.m_maxLoader = 5; 
        this.m_servs = [];
        this.m_urlkey = "";
	},
	registServGroup: function()
	{
		return ++this.m_servGroup;
	},
	removeServ: function(groupid)
	{
        for (var i=this.m_servs.length-1; i>=0; i--)
        {
            var serv = this.m_servs[i];
            if (serv.groupid == (groupid?groupid:1))
            {
                if (serv.state == 0)
                    this.m_servs.splice(i, 1);
                else
                    serv.state = 2;
            }
        }
	},
    idle: function()
    {
        return this.m_loaderCount <= 0;
    },
    loadFile: function(url, callback, groupid, bin, key, value)
    {
        this.internalRequest(url, callback, 0, groupid, bin, key, value, null, null, null);
    },
	callSingle: function(url, callback, context, postdata, setting)
	{
        for (var i in this.m_servs)
            if (this.m_servs[i].servtype == 1)
                return;
        this.internalRequest(url, callback, 1, 1, false, null, null, context, postdata, setting);
    },
    call: function(url, callback, context, postdata, setting)
    {
        this.internalRequest(url, callback, 2, 0, false, null, null, context, postdata, setting);
    },
    internalRequest: function(url, callback, servtype, groupid, bin, key, value, context, postdata, setting)
    {
        var serv = 
        {
            groupid: groupid,
            state: 0,
            servtype: servtype,
            postdata: postdata,
            bin: bin,
            key: key,
            value: value,
            url: url,
            callback: callback,
            context: context,
            setting: setting?setting:""
        };
        this.m_servs.push(serv);
        if (servtype != 0 || this.m_loaderCount < this.m_maxLoader)
            this.startRequest(serv);
    },
    startRequest: function(serv)
    {
        serv.state = 1;
        if (serv.servtype == 0)
            this.m_loaderCount++;
        
        var http = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
        if (serv.bin)
            http.responseType = "blob";
        http.__userData = serv;

        var isPost = serv.postdata || serv.setting.indexOf("#post#") >= 0;
        var url = serv.url;
        
        if (__start_object.js_url_log)
            log("ax.serv: " + url);

        if (serv.setting.indexOf("no_encodeURI") < 0)
            url = encodeURI(url);
        if (serv.setting.indexOf("no_encode") < 0)
            url = this.makeEncodeUrl(url);

        http.open(isPost?"POST":"GET", url, true);

        if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) 
        {
            // IE-specific logic here
            http.setRequestHeader("Accept-Charset", "utf-8");
            http.onreadystatechange = this.onload.bind(this);
        } 
        else 
        {
            if (http.overrideMimeType) 
                http.overrideMimeType("text\/plain; charset=utf-8");
            http.onload = this.onload.bind(this);
            http.onerror = this.onerror.bind(this);
        }
        http.send(null);
	},
    onload: function(evt) 
    {
        var http = evt.currentTarget;
        if (http.readyState != 4)
            return;
        var serv = http.__userData;
        if (serv.servtype == 0)
            this.m_loaderCount--;

        var data = {};
        data.succ = http.status == 200;
        data.cancel = serv.state == 2;
        data.key = serv.key;
        data.value = serv.value;
        data.context = serv.context;
        data.str = "";
        data.image = null;

        if (data.succ && !data.cancel && !serv.bin)
        {
            data.str = http.responseText;
            if (data.str == "" || data.str == null)
                data.succ = false;
            else if (data.str.charAt(0) == "{")
            {
                data.data = JSON.parse(data.str);
                this.jsonKeyTolowerCase(data.data);
            }
        }
        else if (data.succ && serv.bin && !(data.cancel && !data.key)) 
        {
            if (data.key)
                ax.func.saveToFile(data.key, http.response);

            var isImage = this.checkIsImageURL(serv.url) || data.key && this.checkIsImageURL(data.key);
            if (isImage && !data.cancel)
            {
                var img = new Image();
                img.onload = function(e) 
                {
                    data.image = img;
                    window.URL.revokeObjectURL(img.src);
                    if (serv.callback)
                        serv.callback(data);
                };
                img.src = window.URL.createObjectURL(http.response);
                data.cancel = true;
            }
        }

        if (!data.cancel && serv.callback)
            serv.callback(data);
        this.m_servs.splice(this.m_servs.indexOf(serv), 1);
        for (var i in this.m_servs)
            if (this.m_servs[i].state == 0)
            {
                this.startRequest(this.m_servs[i]);
                break;
            }
    },
    onerror: function(evt)
    {
        var http = evt.currentTarget;
        var ret = {};
        ret.str = '{"result_desc":"error","desc":"error"}';
        ret.succ = false;
        if (http.__userData.callback)
            http.__userData.callback(ret);
    },
    setUrlEncode: function(key)
    {
        this.m_urlkey = key;
    },
	encode: function(content, key)
	{
		return content;
	},
	decode: function(content, key)
	{
		return content;
	},
    makeEncodeUrl: function(url)
    {
        return url;
    },
    checkIsImageURL: function (url) 
    {
        var ext = /(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(url);
        return (ext != null);
    },
    jsonKeyTolowerCase: function(obj, cancel)
    {
        var li;
        for (var i in obj)
        {
            li = i.toLowerCase();
            if (typeof(obj[i]) == "object")
                this.jsonKeyTolowerCase(obj[i], li != i);
            if (li == i)
                continue;
            obj[li] = obj[i];
            if (!cancel)
                delete(obj[i]);
        }
    }
}))();

