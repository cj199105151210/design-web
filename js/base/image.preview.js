var ImagePreviewPage = AXBasePage.extend("image.preview",
{
	initForm: function()
	{
		this.scope.img_src = ax.root.AXModalInfo.img_src;
	}
});

ImagePreviewPage.showImage = function(img_src)
{
	ax.modal({template:"page/base/detail.html", title:"预览", axclass:"image.preview", img_src:img_src});
};

ImagePreviewPage.showUIImage = function(page, ui)
{
	var img = ax.getElementById(page.attrs.$$element, "IMG", ui);
	if (img)
		ImagePreviewPage.showImage(img.src);
};

ImagePreviewPage.directiveData =
{
	tblDetail: '<div style="height:480px;" align="center"><img ng-src="{{img_src}}" height="465px" style="max-width:550px"></div>'
};