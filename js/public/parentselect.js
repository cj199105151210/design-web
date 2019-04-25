var SingleTextPage = TemplateManagerPage.extend("parentselect",
{

    initForm:function()
    {
        this.str = {};
        this.scope.con ={};
        this.data =  ax.root.AXModalInfo.guid;
        this.parent = [];
        for ( var i = 0; i <  this.data.data.length ; i++)
        {
            this.result = this.data.data[i].value.split(",");
            for (  var j = 0; j < this.result.length; j++ )
            {
                 this.name = {};
                 this.name["name"] = this.result[j];
                this.parent.push(this.name);
            }
        }
        this.scope.source = this.parent;
    },
    insertSonSelect:function (row) {

        this.scope.source1 = this.scope.source1 || [];
        if (  !this.scope.source1[row.name] )
        {
             this.scope.source1[row.name] = {dealer_id:"",radio_check:"",radio_name:""}
        }else
        {

        }

        this.scope.source1.push();
        console.log( this.scope.source1.length);
    }


});