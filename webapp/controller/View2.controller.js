sap.ui.define(["ibm/hr/payroll/controller/BaseController",
               "sap/m/MessageBox",
               "sap/m/MessageToast",
               "sap/ui/core/Fragment",
               "sap/ui/model/Filter",
               "sap/ui/model/FilterOperator"
],
    function(BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator){
        return BaseController.extend("ibm.hr.payroll.controller.View2",{
            onInit: function(){
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("superman").attachMatched(this.herculis, this);
            },
            //This is a special function which we coded gets called
            //every time the route change   
            herculis: function(oEvent){
                var sIndex = oEvent.getParameter("arguments").fruitId;
                //we reconstruct the element path from fruitId
                var sPath = "/" + sIndex;
                //We will now set this to the view
                this.getView().bindElement(sPath,{
                    expand: 'ToSupplier'
                });
            },
            onGoBack: function(){
                this.getView().getParent().to("idView1");
            },
            oField: null,
            onF4Help: function(oEvent){
                //capture the cell on which F4 was pressed
                this.oField = oEvent.getSource();
                //a local variable which will be accessed in promise/callback as a reference to controller object
                var that = this;
                if(!this.oCityPopup){
                    Fragment.load({
                        id: "city",
                        fragmentName: "ibm.hr.payroll.fragments.popup",
                        type: "XML",
                        controller: this
                    })
                    //here will add the promise function
                    .then(function(oFragment){
                        //inside a callback/promise function, the 'this' object wont point to controller class
                        //to be access the controller object inside the promise/callback, we need to create a local variable
                        //outside the promise and use that local variable to refer to controller object
                        that.oCityPopup = oFragment;
                        //Please grant access of the model to the fragment
                        that.getView().addDependent(that.oCityPopup);
                        that.oCityPopup.bindAggregation("items",{
                            path: '/cities',
                            template: new sap.m.StandardListItem({
                                icon: 'sap-icon://home',
                                title: "{name}",
                                description: "{state}"
                            })
                        });
                        that.oCityPopup.open();
                    });
                }else{
                    this.oCityPopup.open();
                }
            },  
            //to safe guard creating alv again and again - lo_alv IS NOT BOUND
            //Similarly we will create a global variable to track if the fragment was already created or not
            oSupplierPopup: null,
            oCityPopup: null,
            onConfirmPopup: function(oEvent){
                let aFilter = [];
                var sId = oEvent.getSource().getId();
                if(sId.indexOf("city") !== -1){
                    var oSelItem = oEvent.getParameter("selectedItem");
                    this.oField.setValue(oSelItem.getTitle());
                }else{
                    //Step 1: obtain the selected items in the popup
                    var selectedItems = oEvent.getParameter("selectedItems");
                    //step 2: loop over these items and construct a filter
                    for (let i = 0; i < selectedItems.length; i++) {
                        const element = selectedItems[i];
                        //get the title property for the list item
                        var sText = element.getTitle();
                        //Now we will build a filter object
                        var oFilter = new Filter("name", FilterOperator.EQ, sText);
                        //Append this filter to an array
                        aFilter.push(oFilter);
                    }
                    var oNewFilter = new Filter({
                        filters: aFilter,
                        and: false
                    });
                    debugger;
                    //here 'this' pointer will not point to our controller object
                    //rather it will point to fragment only
                    //we need to pass the controller object to the fragment
                    this.getView().byId("tabSupp").getBinding("items").filter(oNewFilter);
                }
                
            },
            onFilterSupplier: function(){
                //a local variable which will be accessed in promise/callback as a reference to controller object
                var that = this;
                if(!this.oSupplierPopup){
                    Fragment.load({
                        id: "supplier",
                        fragmentName: "ibm.hr.payroll.fragments.popup",
                        type: "XML",
                        controller: this
                    })
                    //here will add the promise function
                    .then(function(oFragment){
                        //inside a callback/promise function, the 'this' object wont point to controller class
                        //to be access the controller object inside the promise/callback, we need to create a local variable
                        //outside the promise and use that local variable to refer to controller object
                        that.oSupplierPopup = oFragment;
                        //Please grant access of the model to the fragment
                        that.getView().addDependent(that.oSupplierPopup);
                        that.oSupplierPopup.setMultiSelect(true);
                        that.oSupplierPopup.bindAggregation("items",{
                            path: '/supplier',
                            template: new sap.m.StandardListItem({
                                icon: 'sap-icon://supplier',
                                title: "{name}",
                                description: "{city}"
                            })
                        });
                        that.oSupplierPopup.open();
                    });
                }else{
                    this.oSupplierPopup.open();
                }
                
                //MessageToast.show("This functionality is under construction");
            },
            onSave: function(){
                MessageBox.confirm("Hey! would you like to save?",{
                    onClose: function(state){
                        if(state === "OK"){
                            MessageToast.show("Wallah! Thank you for your order ❤️");
                        }else{
                            MessageBox.error("Oh No! you broke my heart 💔");
                        }
                    }
                });
            },
            onCancel: function(){

            }
        });
    }
)