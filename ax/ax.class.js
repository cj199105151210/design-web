Object.create = Object.create || function(p) 
{
    function f(){};
    f.prototype = p;
    return new f();
};

Function.prototype.bind = Function.prototype.bind || function(oThis) 
{
    if (typeof this !== "function")
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function() {},
        fBound = function() 
        {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
};

var AX = AX || {};
AX.ClassManager = 
{
    id : (0|(Math.random()*998)),
    instanceId : (0|(Math.random()*998)),
    getNewID : function(){ return this.id++; },
    getNewInstanceId : function(){ return this.instanceId++; }
};
AX.Classes = {};
AX.Class = function(){};
AX.Class.extend = function(classId, prop) 
{
    if (!prop) 
    {
        prop = classId;
        classId = undefined;
    }
    var _super = this.prototype;
    initializing = true;
    var prototype = Object.create(_super);
    initializing = false;
    fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    for (var name in prop) 
    {
        prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) 
        {
            return function() 
            {
                var tmp = this._super;
                this._super = _super[name];
                var ret = fn.apply(this, arguments);
                this._super = tmp;
                return ret;
            };
        })(name, prop[name]) : prop[name];
    }
    function Class() 
    {
        if (!initializing) 
        {
            this.__instanceId = AX.ClassManager.getNewInstanceId();
            if (this.ctor) 
                this.ctor.apply(this, arguments);
        }
    }
    classId = classId || AX.ClassManager.getNewID();
    // AX.Classes[classId] = _super;
    AX.Classes[classId] = Class;
    Class.id = classId;
    // Object.defineProperty(prototype, '__pid', {writable:true, enumerable:false, configurable:true, value:classId});
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
};
