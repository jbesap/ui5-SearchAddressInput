sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"ch/saphirDemo/utils/SearchAddressInput"
], function(Controller, SearchAddressInput) {
	"use strict";

	return Controller.extend("ch.saphirDemo.controller.DemoView", {
	onInit: function(){
		var oCtrl = new SearchAddressInput({
			GoogleAPI: "AIzaSyBFXRi1HKVSrjL_Qy932KyMWXr3-M1x4rU"
		});
		
		this.getView().byId("idMaPage").addContent(oCtrl);
	}
	});
});