sap.ui.define([
    "ibm/hr/payroll/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function(BaseController, Filter, FilterOperator){
        return BaseController.extend("ibm.hr.payroll.controller.View1",{
            onInit: function(){
                //Inisde any controller we can go to Component and obtain our 
                //Router object
                this.oRouter = this.getOwnerComponent().getRouter();
            },
            onGoTo: function(sPath){
                // //Step 1: Go to mother - get the object of app container control
                // var oAppCon = this.getView().getParent().getParent();
                // //Step 2: call the function to navigate
                // oAppCon.toDetail("idView2");
                //sPath = /fruits/3 - extract 3 from here - sPath.split("/")[sPath.split("/").length - 1]
                var sIndex = sPath.split("/")[sPath.split("/").length - 1];
                this.oRouter.navTo("superman",{
                    fruitId: sIndex
                });

            },
            onDeleteItem: function(oEvent){
                //Step 1: get the object of the item on which delete was fired
                var oItemToBeDeleted = oEvent.getParameter("listItem");
                //Step 2: get the objject of the list control and perform delete
                oEvent.getSource().removeItem(oItemToBeDeleted);
            },
            onSearch: function(oEvent){
                ///Step 1: get the data which user is searching
                var sText = oEvent.getParameter("query");
                //Step 2: Create the search filter object
                var oFilter1 = new Filter("CATEGORY", FilterOperator.Contains, sText);
                //Step 4: Apply the filter to items binding
                this.getView().byId("myList").getBinding("items").filter([oFilter1]);
            },
            onAdd: function(){
                this.oRouter.navTo("add");
            },
            onItemPress: function(oEvent){
                //Step 1: Obtain the address of selected item and its path - element path
                var sPath = oEvent.getParameter("listItem").getBindingContextPath();
                //Step 2: Get the object of View2 -
                //Use of App container control
                //var oView2 = this.getView().getParent().getPages()[1];
                //Use of SplitApp Container control
                //var oView2 = this.getView().getParent().getParent().getDetailPage("idView2");
                //Step 3: Bind element with View2 so the view 2 gets the selected item data
                //oView2.bindElement(sPath);
                
                this.onGoTo(sPath);
            }
        });
    }
)