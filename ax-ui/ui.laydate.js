if (typeof laydate != "undefined")
ax.app.directive('axLaydate', function() 
{
	return {
		require : '?ngModel',
		restrict : 'A',
		scope : 
		{
			ngModel : '=',
			maxDate:'@',
			minDate:'@',
			onlyMonth:'@',
			onlytime:'@',
			onlyCurrentmonth:'@'
		},
		link : function(scope, element, attr, ngModel) 
		{
			// Specify how UI should be updated
			ngModel.$render = function() 
			{
				element.val(ngModel.$viewValue || '');
			};

			// Listen for change events to enable binding
			element.on('blur keyup change propertychange', function() 
			{
				scope.$apply(read);
			});

			read(); // initialize

			// Write data to the model
			function read() 
			{
				var val = element.val();
				if (val && '' != val)
					ngModel.$setViewValue(val);
			}

			function readClear() 
			{
				var val = element.val();
				ngModel.$setViewValue(val);
			}

			if (attr.skin)
				laydate.skin(attr.skin);

			function start()
			{
				setTimeout(setDate, 500);
			}

			start();

			function setDate()
			{
				attr.istoday =(attr.istoday=="false"?false:true);
				attr.isclear =(attr.isclear=="true"?true:false);
				laydate(
				{
					elem : '#' + attr.id,
					isclear : attr.isclear != undefined && attr.isclear != '' ? attr.isclear : false,
					istoday : attr.hasOwnProperty('istoday')? attr.istoday: true,
					format : attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
					istime : attr.istime,
					max:attr.hasOwnProperty('maxDate')?attr.maxDate:'', 
					min:attr.hasOwnProperty('minDate')?attr.minDate:'',
					onlyMonth:attr.hasOwnProperty('onlyMonth')?attr.onlyMonth:'',
					onlytime:attr.hasOwnProperty('onlytime')?attr.onlytime:'',
					onlyCurrentMonth:attr.hasOwnProperty('onlyCurrentmonth')?attr.onlyCurrentmonth:'',
					choose : function(data) 
					{
						if (data=="")
							scope.$apply(readClear);
						else
							scope.$apply(read);
					}
				});
			}
		}
	}
});