var MyLogin = TemplateManagerPage.extend("myLogin",{

	initForm:function(){
		this.scope.source1=[
						 {id:1, name:"2222xxx1"},
				            {id:2, name:"2222xxx2"},
				            {id:3, name:"222xxx3"},
				            {id:4, name:"2222xxx4"}];
	}

});

MyLogin.directiveData={

	lab1:{ template:"select_dic", model:"model1", source:"source1", value:"id", name:"name"},
	lab2:{ template:"label_size", size:3, text:"这里是一个实例22222：{{model1}}"}
}