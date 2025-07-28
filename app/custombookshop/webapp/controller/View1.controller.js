sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m//MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageBox,Fragment,MessageToast,Filter,FilterOperator) {
        "use strict";

        return Controller.extend("custombookshop.controller.View1", {
            onInit() {
            },
            submit: function () {
                // alert("test")
                console.log("Submit function triggered");
                var oView = this.getView();
                var title = oView.byId("_IDGenInput").getValue();
                var author = oView.byId("_IDGenInput1").getValue();
                var price = oView.byId("_IDGenInput2").getValue();
                var stock = oView.byId("stockInput").getValue();
                var location = oView.byId("locationInput").getValue();
                var genre = oView.byId("genreInput").getValue();

                var oModel = oView.getModel();
                //alert(title+ " " + author);
                var oContext = oModel.bindList("/Books").create(
                    {
                        "title": title,
                        "author": author,
                        "price": price,
                        "stock": stock,
                        "loc": location,
                        "genre": genre
                    }
                );
                oContext.created().then(() => {
                    MessageBox.success("Product created successfully");
                    this.getView().byId("_IDGenInput").setValue(null);
                    this.getView().byId("_IDGenInput1").setValue(null);
                    this.getView().byId("_IDGenInput2").setValue(null);
                    this.getView().byId("stockInput").setValue(null);
                    this.getView().byId("locationInput").setValue(null);
                    this.getView().byId("genreInput").setValue(null);
                }).catch((err) => {
                    MessageBox.error("Error creating data");
                    console.error("Error creating data " + err);
                });
            },
            onCollapseExpandPress() {
                const oSideNavigation = this.byId("sideNavigation"),
                    bExpanded = oSideNavigation.getExpanded();
    
                oSideNavigation.setExpanded(!bExpanded);
            },
            onAddBookPressed(){
                this.hideAllPanels();
                var oPanel = this.byId("Panel1");
                oPanel.setVisible(true);
            },
            onViewDetilsBookPressed(){
                this.hideAllPanels();
                // var oModel = this.getView().getModel();
                // oModel.refresh(true);
                var oPanel = this.byId("Panel2");
                oPanel.setVisible(true);
            },
            hideAllPanels(){
                this.byId("Panel1").setVisible(false);
                this.byId("Panel2").setVisible(false);
                this.byId("Panel3").setVisible(false);

            },

//<!--Action sheetlist-->
onActionPressed: function(oEvent){
    var oButton = oEvent.getSource();
    var oContext = oButton.getBindingContext();
    this._oSelectedContext = oContext;

    if(!this._oActionSheet){
        // this._oSelectedContext.openBy(oButton);
        Fragment.load(
            {
                id:this.getView().getId(),
                name:"custombookshop.view.ActionSheet",
                controller:this
            }
        ).then(function(oActionSheet){

            this._oActionSheet = oActionSheet;
            this.getView().addDependent(this._oActionSheet);
            this._oActionSheet.openBy(oButton);
        }.bind(this));
    }
    else{
        this._oActionSheet.openBy(oButton);
    }
},

// Delete action
onDeletePress:function(){
    var oContext = this._oSelectedContext;
    var sBookId = oContext.getProperty("ID");
    MessageBox.confirm("Are you sure want to delete "+sBookId+" ?",
        {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
            onClose: function(oAction){
                if(oAction === MessageBox.Action.OK){
                    // logic to delete
                    oContext.delete("$direct").then(function(){
                        MessageBox.success("Book "+sBookId+" deleted successfully.");
                    }).catch(function(err){
                        MessageBox.error("Error deleteing book "+sBookId+" "+err+ " Please try again later.");
                    })
                }
            }
        }
    );

},
onEditPress:function(){
    var oData = this._oSelectedContext.getObject();
    MessageToast.show("Edit action for item "+ oData.ID );
    this.hideAllPanels();
    var oPanel = this.byId("Panel3");
    oPanel.setVisible(true);
    var that = this;
var product_model = this.getOwnerComponent().getModel();
let aFilters = [
    new Filter("ID",FilterOperator.EQ, oData.ID)
];
let oBinding = product_model.bindList("/Books");
oBinding.filter(aFilters);

oBinding.requestContexts().then((aContexts) => {
    if(aContexts.length > 0 ){
        aContexts.forEach((oContext) => {
            let oUser = oContext.getObject();
            that.getView().byId("_IDGenInput3").setValue(oUser.title);
            that.getView().byId("_IDGenInputu").setValue(oUser.author);
            that.getView().byId("_IDGenInput2u").setValue(oUser.price);
            that.getView().byId("stockInputu").setValue(oUser.stock);
            that.getView().byId("locationInputu").setValue(oUser.loc);
            that.getView().byId("genreupdate").setValue(oUser.genre);
            this.getView().byId("itemCode").setValue(oUser.ID); //For UPDATE
        });
    }
    else{
        MessageBox.error("No book found witht his ID");
    }
}).catch((oError) => {
    MessageBox.error("Error retriving book details "+ oError);
});

},
updateItem:function(){
    var that = this;
    var itemCode = this.getView().byId("itemCode").getValue();
   var title = that.getView().byId("_IDGenInput3").getValue();
    var author = that.getView().byId("_IDGenInputu").getValue();
    var price =that.getView().byId("_IDGenInput2u").getValue();
    var stock =that.getView().byId("stockInputu").getValue();
    var location=that.getView().byId("locationInputu").getValue();
    var genre=that.getView().byId("genreupdate").getValue();

    var update_model = this.getView().getModel();
    var sPath = "/Books('"+itemCode+"')";
var oContext = update_model.bindContext(sPath).getBoundContext();
var oView = this.getView();

function resetBusy(){
    oView.setBusy(false);
}
oView.setBusy(true);
// Updates local MODEL ONLY
oContext.setProperty("title", title);
oContext.setProperty("author",author);
oContext.setProperty("price",price);
oContext.setProperty("stock",stock);
oContext.setProperty("loc",location);
oContext.setProperty("genre",genre);

// UPDATE the model / SQLITE
update_model.submitBatch("auto").then(function(){
    resetBusy();
    MessageBox.success("Product updated successfully");
}).catch(function(err){
    resetBusy();
    MessageBox.error("An error occured while updating the item "+err);
});

} // Update action

        });
    });