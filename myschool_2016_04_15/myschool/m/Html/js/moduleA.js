define(['ko'], function(ko) {　　
	function myViewModel() {
		var self = this;
		self.title = 'test title';
		self.searchText = ko.observable('init text');
		self.isDisplayHeader = ko.observable(true);
		self.testData = {
			name: '鱼',
			count: 100,
			description: '234fjsf32'
		};

		self.testArray = ko.observableArray();
		//get data by ajax
		var result = [{
			name: '语文',
			score: 88
		}, {
			name: '数学',
			score: 100
		}, {
			name: '物理',
			score: 96
		}];
		self.testArray(result);

		self.afterRenderListItem = function() {
			console.log("afterRenderListItem.");
		}

		self.testClick = function() {
			console.log("testClick.");
			var isDisplay = self.isDisplayHeader();
			self.isDisplayHeader(!isDisplay);
			var data = self.testArray();
			data.score = 55;
			self.testArray(data);
			console.log(self.searchText());
		};

		ko.bindingHandlers.myCustomBinding = {
			init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
				console.log("myCustomBinding: init method.");
			},
			update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
				console.log('myCustomBinding: update method.');
			}
		};
	}　　
	var add = function(x, y) {　　　　　　
		return x + y;　　　　
	};　　　　
	var sun = ['s', 'u', 'n'];
	//	return {　　　　　　
	//		add: add　　　,
	//		sun: sun　
	//	};　　
	return new myViewModel();
});