sap.ui.define(
        ["sap/ui/core/UIComponent"], 
        function(UIComponent){
            return UIComponent.extend("ibm.hr.payroll.Component",{
                //link the manifest file to load it
                metadata: {
                    manifest: "json"
                },
                init: function(){
                    //call the base class constructor
                    //because the standard base class offers FREE functionality to us
                    UIComponent.prototype.init.apply(this);

                    //Step 1: get the router object
                    var oRouter = this.getRouter();

                    //Step 2: initialize the router
                    oRouter.initialize();
                    
                },
                // createContent: function(){
                    
                //     var oRootView = new sap.ui.view({
                //         id: "idRoot",
                //         viewName: "ibm.hr.payroll.view.App",
                //         type: "XML"
                //     });

                //     //Step 1: Get the container object which is inside the root view
                //     var oAppCon = oRootView.byId("idAppCon");

                //     //Step 2: Create object of child views
                //     var oView1 = new sap.ui.view({
                //         id: "idView1",
                //         viewName: "ibm.hr.payroll.view.View1",
                //         type: "XML"
                //     });

                //     var oView2 = new sap.ui.view({
                //         id: "idView2",
                //         viewName: "ibm.hr.payroll.view.View2",
                //         type: "XML"
                //     });

                //     var oEmpty = new sap.ui.view({
                //         id: "idEmpty",
                //         viewName: "ibm.hr.payroll.view.Empty",
                //         type: "XML"
                //     });
                    
                //     //Step 3: Add our views inside the container control
                //     oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);

                //     return oRootView;
                // },
                destroy: function(){
                    //nothing
                }
            });
});