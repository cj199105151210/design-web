var RightSelectPage = TemplateManagerPage.extend("formadd",
    {

        initForm: function () {

            this.forname1 = {};
            this.nodeId = ax.root.AXModalInfo.nodeId;
            this.serv = "bdlb/queryAllForm";
            ax.call(url_make('bdlb/queryFromByTypeId', "id", this.nodeId), this.initProvice);
            this.repeatFlag = false;
        },
        initProvice: function (res) {

            var data = res.data;

            if (data.code == 1) {

                this.scope.formname = url_data(res);

            } else {
                layer.msg(data.desc);
            }

        },

        sumbit: function () {
            if (this.repeatFlag) {
                layer.msg("该名称已存在！");
                return;
            }
            this.forname1.name = this.scope.name;
            if (!this.scope.name) {
                layer.msg("请填写表单名称");
                return;
            }
            this.forname1.typeId = this.nodeId;
            this.forname1.id = this.scope.selectedName;
            this.forname1.userid = $.cookie('userId');
            this.forname1.createname = $.cookie('the_cookie');
            ax.call(url_make('bdlb/saveForm', "form", this.forname1), this.updataForm);

        },


        checkRepeat: function () {
            if (this.scope.name) {
                ax.call(url_make('bdlb/checkFormName', "formName", this.scope.name), this.checkResult);
            }
        },
        checkResult: function (ret) {
            if (ret.data.code == 0) {
                $('#checkMsg').html("该名称已存在！");
                this.repeatFlag = true;
            } else {
                $('#checkMsg').html("");
                this.repeatFlag = false;
            }
        },
        updataForm: function (ret) {
            this.scope.AXModalInfo.callback(ret);
        },
        updataForm1: function (ret) {
            this.scope.AXModalInfo.callback(ret);
        }
    });