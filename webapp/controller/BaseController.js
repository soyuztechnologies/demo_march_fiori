sap.ui.define(["sap/ui/core/mvc/Controller",
               "ibm/hr/payroll/util/formatter"
],
    function(Controller, Formatter){
        return Controller.extend("ibm.hr.payroll.controller.BaseController",{
            formatter: Formatter
        });
    }
)