
var log = typeof console != "undefined" ? console.log : function(){};

ax.app = angular.module("app", ["ngSanitize"].concat(__start_object.modules||[]))

.controller("axroot", ["$scope", "$location", "$window", "$http", "$timeout"].concat(__start_object.factory||[]).concat([function($scope, $location, $window, $http, $timeout)
{
    $scope.AXHomePage = __start_object.home;
    $scope.AXAppReady = ax.root.AXAppReady || !__start_object.remote_template;
    $scope.ax = function(){return ax;};
    ax.root = $scope;
    ax.root.AXModalInfoList = [];
    ax.location = $location;
    ax.window = $window;
    ax.timeout = $timeout;
    ax.http = $http;
    ax.urlParams = ax.func.parseKeyValue($window.location.search);
    ax.factory = {};
    for (var i in __start_object.factory)
        ax.factory[__start_object.factory[i]] = arguments[parseInt(i)+arguments.length-__start_object.factory.length];
}]))

.controller("axnone", function(){})

.controller("axpage", ["$scope", "$attrs", function($scope, $attrs)
{
    $scope.axclass = $attrs.axClass;
    var AXClass = $attrs.axClass && AX.Classes[$attrs.axClass] ? AX.Classes[$attrs.axClass] : AX.Class;
    var ins = new AXClass($scope);
    if ($attrs.axPage && !ax.page[$attrs.axPage])
        ax.page[$attrs.axPage] = ins;
    for (var i in ins)
        if (typeof ins[i] == "function" && i != "constructor" && i != "ctor")
            $scope[i] = ins[i] = ins[i].bind(ins);
    ins.scope = $scope;
    ins.attrs = $attrs;
    if (ins.initForm)
        ins.initForm.apply(ins, []);
    if (AXClass.links)
        for (var i in AXClass.links)
            AXClass.links[i]($scope, $attrs.$$element, $attrs);
}])

.directive("directive", function()
{
    return {
        template: function(element, attr)
        {
            var axclass = ax.getAXClass(element);
            var directiveData = axclass && axclass.directiveData;
            if (directiveData)
            {
                if (angular.isFunction(directiveData))
                    return directiveData(axclass, attr);
                if (attr.key)
                    return ax.ui.translateTemplate(axclass, directiveData[attr.key]);
            }
            return ax.ui.translateTemplate(axclass, attr);
        }
    };
})

.directive("directiveAxremote", function()
{
    return {
        template: function(element, attr)
        {
            var axclass = ax.getAXClass(element);
            return !axclass ? undefined : (axclass.template ?
                '<div ng-controller="axpage" ax-class="' + axclass.id + '"><div ng-include="\'' + axclass.template + '\'"></div></div>' :
                '<div ng-controller="axpage" ax-class="' + axclass.id + '">' + axclass.html + '</div>');
        }
    };
})

.directive('directiveValid', function() 
{
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) 
        {
            var axclass = ax.getAXClass(element);
            if (axclass && axclass.directiveValid)
                axclass.directiveValid.apply(null, [scope, element, attrs, ctrl]);
        }
    };
})


//过滤器用法：object | ff:'find':{id:5,name:'test'}
.filter('ff', function() 
{
    return function(e, f, p) 
    {
        return ax.filter[f].apply(null, [e, p]);
    }
});
