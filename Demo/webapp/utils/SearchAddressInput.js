sap.ui.define(
	[
		'sap/m/SearchField',
		'sap/m/SearchFieldRenderer',
		'sap/m/SuggestionItem',
		'sap/ui/model/json/JSONModel'
	],
	function(SearchField, SearchFieldRenderer, SuggestionItem, JSONModel) {
		return SearchField.extend("ch.saphir.ui.controls.SearchAddressInput", {
			_GoogleAPIUrl: "/maps/api/place/autocomplete/json",

			init: function() {
				var oControl = this;
				SearchField.prototype.init.apply(oControl, arguments);

				/** Event override **/
				oControl.attachSuggest("suggest", oControl._onSuggest);
				oControl.attachSearch("search", oControl._onSearch);

				/** Propertiesy **/
				oControl.setEnableSuggestions(true);
				oControl.setModel(new JSONModel({Value: null, Autocomplete: [] }), "GoogleAPI");
				//oControl.bindValue("GoogleAPI>/Value");
				
				/** Aggregation **/
				var oItemListTemplate = new SuggestionItem({
					description: "{GoogleAPI>description}"
				});
				oControl.bindAggregation("suggestionItems", {
					path: 'GoogleAPI>/Autocomplete',
					template: oItemListTemplate
				});

			},

			_onSearch: function(oEvent) {
				var oModel = this.getModel("GoogleAPI");
				var sValue = oEvent.getParameter("suggestionItem").getDescription();
				
				oModel.setProperty("/Value", sValue);
				this.setValue(sValue);
			},

			renderer: "sap.m.SearchFieldRenderer",
			metadata: {
				properties: {
					"GoogleAPI": "string",
					"ProxyPattern": "string"
				}
			},

			_onSuggest: function(oEvent) {
				var value = oEvent.getParameter("suggestValue");
				var oInput = oEvent.getSource();
				var jModel = new sap.ui.model.json.JSONModel();

				jModel.attachRequestCompleted(function(event) {
					var jResponse = event.getSource().getData();
					var oInput = this;

					if (jResponse.status !== "INVALID_REQUEST") {
						var jData = {
							'Autocomplete': jResponse.predictions
						};
						var jGoogleAPIModel = this.getModel("GoogleAPI"); //new sap.ui.model.json.JSONModel(jData);
						jGoogleAPIModel.setData(jData);
						this.setModel(jGoogleAPIModel, "GoogleAPI");
					}

				}.bind(this));

				jModel.loadData(this._getURL(), {
					"key": this.getGoogleAPI(),
					"input": value
				}, false);

				oInput.suggest();
			},

			_getURL: function() {
				var sPrefix = this.getProxyPattern() ? "/" + this.getProxyPattern() : 'https://maps.googleapis.com';

				return sPrefix + this._GoogleAPIUrl;
			}
		});
	}
);