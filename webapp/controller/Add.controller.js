sap.ui.define(["ibm/hr/payroll/controller/BaseController",
               "sap/m/MessageBox",
               "sap/m/MessageToast",
               "sap/ui/core/Fragment",
               "sap/ui/model/Filter",
               "sap/ui/model/FilterOperator"
],
    function(BaseController, MessageBox, MessageToast, Fragment, Filter, FilterOperator){
        return BaseController.extend("ibm.hr.payroll.controller.Add",{
            onInit: function(){
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("add").attachMatched(this.herculis, this);

                //create a local json model which has the payload which we need to send
                //to backend so we can call POST of the odata
                this.oLocalModel = new sap.ui.model.json.JSONModel({
                    "prodData": {
                        "PRODUCT_ID": "",
                        "TYPE_CODE": "PR",
                        "CATEGORY": "Notebooks",
                        "NAME": "",
                        "DESCRIPTION": "",
                        "SUPPLIER_ID": "0100000046",
                        "SUPPLIER_NAME": "SAP",
                        "TAX_TARIF_CODE": "1 ",
                        "MEASURE_UNIT": "EA",
                        "PRICE": "0.00",
                        "CURRENCY_CODE": "USD"
                    }
                });

                ///Set the model at view level as named model - local
                this.getView().setModel(this.oLocalModel, "local");
                this.setMode("Create");
                
            },
            //This is a special function which we coded gets called
            //every time the route change   
            herculis: function(oEvent){
                
            },
            setMode: function(sMode){
                this.mode = sMode;
                this.getView().byId("idSave").setText(sMode);
                if(sMode === "Create"){
                    this.getView().byId("prodId").setEnabled(true);
                    this.getView().byId("idDelete").setEnabled(false);
                }else{
                    this.getView().byId("prodId").setEnabled(false);
                    this.getView().byId("idDelete").setEnabled(true);
                }
            },
            onDelete: function(){
                var that = this;
                this.getOwnerComponent().getModel()
                    .remove("/ProductSet('" + this.prodId + "')",{
                        success: function(){
                            MessageBox.confirm("deletion was done");
                            that.onClear();
                        },
                        error: function(){

                        }
                    });
            },
            onClear: function(){
                this.setMode("Create");
                this.oLocalModel.setProperty("/",{
                    "prodData": {
                        "PRODUCT_ID": "",
                        "TYPE_CODE": "PR",
                        "CATEGORY": "Notebooks",
                        "NAME": "",
                        "DESCRIPTION": "",
                        "SUPPLIER_ID": "0100000046",
                        "SUPPLIER_NAME": "SAP",
                        "TAX_TARIF_CODE": "1 ",
                        "MEASURE_UNIT": "EA",
                        "PRICE": "0.00",
                        "CURRENCY_CODE": "USD"
                    }
                });
            },
            mode: "Create",
            prodId : "",
            onSubmit: function(oEvent){
                //Step 1: get the value entered by user on the input field
                var sValue = oEvent.getParameter("value");
                this.prodId = sValue;
                //Step 2: Build the request to load single record data
                var sPath = "/ProductSet('" + sValue + "')";
                //Step 3: get the odata model object
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 4: trigger the call to SAP system to read single product data
                var that = this;
                oDataModel.read(sPath, {
                    //Step 5: Handle callback - set the data to local model
                    success: function(data){
                        that.oLocalModel.setProperty("/prodData", data);
                        that.getView().byId("myImage")
                            .setSrc("/sap/opu/odata/sap/ZMAR_ODATA_SRV/ProductImgSet('" + that.prodId + "')/$value");
                        that.setMode("Update");
                    },
                    error: function(oError){
                        that.setMode("Create");
                        that.onClear();
                        MessageBox.error("No data found for product Id");
                    }
                });
                
            },
            onConfirmPopup: function(oEvent){
                let aFilter = [];
                var sId = oEvent.getSource().getId();
                var oSelItem = oEvent.getParameter("selectedItem");
                this.oLocalModel.setProperty("/prodData/SUPPLIER_ID",oSelItem.getTitle());
                this.oLocalModel.setProperty("/prodData/SUPPLIER_NAME",oSelItem.getDescription());
            },
            onLoadExp: function(){
                var that = this;
                this.getOwnerComponent().getModel().callFunction("/GetMostExpensiveProduct",{
                    urlParameters:{
                        I_CATEGORY: this.oLocalModel.getProperty("/prodData/CATEGORY")
                    },
                    success: function(data){
                        that.oLocalModel.setProperty("/prodData", data);
                    }
                })
            },
            oSupplierPopup: null,
            onF4Help: function(){   
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
                        that.oSupplierPopup.bindAggregation("items",{
                            path: '/SupplierSet',
                            template: new sap.m.StandardListItem({
                                icon: 'sap-icon://supplier',
                                title: "{BP_ID}",
                                description: "{COMPANY_NAME}"
                            })
                        });
                        that.oSupplierPopup.open();
                    });
                }else{
                    this.oSupplierPopup.open();
                }
                
            },  
            onGoBack: function(){
                this.getView().getParent().to("idView1");
            },
            onSave: function(){
                //Step 1: get the payload data from local model
                var productData = this.oLocalModel.getProperty("/prodData")
                //Step 2: Validate data
                if(!productData){
                    MessageBox.error("Invalid product Id");
                    return;
                }
                //Step 3: Get the odata model object to call backend
                var oDataModel = this.getOwnerComponent().getModel();
                //Step 4: Trigger the backend call
                if(this.mode === "Create"){
                    oDataModel.create("/ProductSet", productData, {
                        //Step 5: Callback functions to handle response
                        success: function(data){
                            
                            MessageToast.show("Wahalla! The data is saved in SAP now");
                        },
                        error:function(oError){
                            var sMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                            MessageBox.error("There was an issue in save " + sMessage);
                        }
                    });
                }else{
                    oDataModel.update("/ProductSet('" + this.prodId + "')", productData, {
                        //Step 5: Callback functions to handle response
                        success: function(data){
                            MessageToast.show("Whoa! the data was updated");
                        },
                        error:function(oError){
                            var sMessage = JSON.parse(oError.responseText).error.innererror.errordetails[0].message;
                            MessageBox.error("There was an issue in save " + sMessage);
                        }
                    });
                }

            }
            
        });
    }
)