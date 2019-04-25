var AXUploaderClass = AX.Class.extend(
{
	/* properties:
		waitUpload: boolean, 已加载文件，等待调用服务上传
		previewData: 图片预览数据
		filepath: 上传后服务返回的文件名
		fileUploader: 上传类实例
	*/
	ctor: function(page, params)
	{
		/* params:
			file_type: "image",
			url: url_make("sys/system/uploadFile"), //服务接口
			url_headers: undefined,                 //请求头
			ui_input: "uploaderInput",              //点击input
			ui_preview: "uploaderPreview",          //图片预览img
			model_filepath: "modify.img_src",       //文件名model 
			callback_add: undefined,                //文件加载成功
			callback_succ: undefined,               //文件上传成功
			callback_error: undefined,              //文件上传失败
		*/
		this.page = page;
		this.params = params;
		this.fileUploader = new ax.factory.FileUploader(
		{
			url: params.url,
			headers: params.headers || ax.http.defaults.headers.common
		});
		this.fileUploader.onAfterAddingFile = this.onAfterAddingFile.bind(this);
		this.fileUploader.onSuccessItem = this.onSuccessItem.bind(this);
		this.fileUploader.onErrorItem = this.onErrorItem.bind(this);
		if (page.scope)
			page.scope.uploader = this.fileUploader;
	},
	setFileType: function(filetype)
	{
		var obj = {};
		if (filetype == "image")
		{
			obj.name = "imageFilter";
			obj.fn = function(item, options)
			{
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			};
		}
		this.fileUploader.filters.push(obj);
	},
	selectFile: function()
	{
		var inputFile = ax.getElementById(this.page.attrs.$$element, "INPUT", this.params.ui_input);
		if (inputFile)
			inputFile.click();
	},
	clearInput: function()
	{
		var inputFile = ax.getElementById(this.page.attrs.$$element, "INPUT", this.params.ui_input);
		if (inputFile)
		{
			inputFile = angular.element(inputFile);
			inputFile.wrap('<form></form>');
			inputFile.parent()[0].reset();
			inputFile.unwrap();
		}
	},
	showPreview: function(data)
	{
		if (!this.params.ui_preview)
			return;
		var imgPreview = ax.getElementById(this.page.attrs.$$element, "IMG", this.params.ui_preview);
		if (imgPreview)
			imgPreview.src = data;
	},
	clearPreview: function()
	{
		if (!this.params.ui_preview)
			return;
		var imgPreview = ax.getElementById(this.page.attrs.$$element, "IMG", this.params.ui_preview);
		if (imgPreview)
			imgPreview.src = AXTemplate.imageDefault;
	},
	reset: function(filepath)
	{
		this.clearInput();
		this.clearPreview();
		if (filepath)
		{
			this.filepath = filepath;
			this.showPreview(filepath);
		}
	},
	upload: function()
	{
		if (this.waitUpload && this.previewData)
		{
			this.waitUpload = false;
			this.fileUploader.uploadAll();
			return false;
		}
		return true;
	},
	onAfterAddingFile: function(fileItem) 
	{
		this.previewData = null;
		this.waitUpload = false;
		var that = this;
		var reader = new FileReader();
		reader.addEventListener("load", function(e) 
		{
			that.previewData = e.target.result;
			that.waitUpload = true;
			var ret;
			if (that.params.callback_add)
				ret = that.params.callback_add.apply(that.page, [that.previewData, fileItem._file.name]);
			if (!ret)
			{
				that.showPreview(that.previewData);
				that.filepath = "未保存";
				if (that.params.model_filepath)
				{
					eval("that.page.scope." + that.params.model_filepath + "=that.filepath;");
					that.page.scope.$apply();
				}
			}
		}, false);
		reader.readAsDataURL(fileItem._file);
	},
	onSuccessItem: function(fileItem, response, status, headers) 
	{
		this.filepath = response.data;
		if (this.params.model_filepath)
			eval("this.page.scope." + this.params.model_filepath + "=this.filepath");
		if (this.params.callback_succ)
			this.params.callback_succ.apply(this.page, [response]);
	},
	onErrorItem: function(fileItem, response, status, headers) 
	{
		var ret;
		if (this.params.callback_error)
			ret = this.params.callback_error.apply(this.page, [response]);
		if (!ret)
		{
			ax.alert("文件上传失败");
			this.uploader.clearInput();
			this.uploader.clearPreview();
		}
	},
	onCancelItem: function(fileItem, response, status, headers) 
	{
		console.info('onCancelItem', fileItem, response, status, headers);
	},
	onCompleteItem: function(fileItem, response, status, headers) 
	{
		console.info('onCompleteItem', fileItem, response, status, headers);
	},
	onCompleteAll: function() 
	{
		console.info('onCompleteAll');
	}
});
