var app = angular.module("main", []);
app.directive("myUl", [function() {
	return {
		restrict: "A",
		replace: true,
		transclude: true,
		template: '<ul class="left-bottom"><div ng-transclude></div></ul>',
		link: function($scope, el) {
			$(el).on("click", "li", function() {
				$(el).find("li").removeClass("select");
				$(this).addClass("select");
				var that = this;
				$scope.$apply(function() {
					$scope.cu = $(that).index() - 1;
				})
			})
			$(el).on("click", "li input", function() {
				$(el).find("li input").css("background", "#383836");
				$(this).css("background", "#1A1A1A");
			})
			$(document).on("keyup", "input", false);
			$(document).on("keyup", function(e) {
					if(e.keyCode === 46 || e.keyCode === 8) {
						var index = $(".select").index() - 1;
						$scope.$apply(function() {
							if(index == 0) {
								return
							} else {
								$scope.cu = $scope.cu - 1;
								$scope.lists.splice(index, 1);
								$(el).find("li").removeClass("select");
							}
							$scope.saveTolocal();
						})
					}
				})
				//			$scope.borders = function(index) {
				//				$(".tan .tan-box ul li span").removeClass("show");
				//				$(".tan .tan-box ul li span").eq(index).addClass("show")
				//			}
			$scope.count = function() {
				var r = 0;
				$scope.lists[$scope.cu].todos.forEach(function(v, i) {
					if(v.state == 1) {
						r++;
					}
				})
				return r;
			}
			$(document).on("click", function() {
				$(".addinfo").removeClass("show")
				$(".tan").removeClass("show");
			});
			$scope.showTit = function(e) {
				e.preventDefault()
				e.stopPropagation()
				$(".tan").toggleClass("show");
			};
			$(".tan").on("click", false);
			$scope.clearall = function() {
				var newarr = [];
				$scope.lists[$scope.cu].todos.forEach(function(v, i) {
					if(v.state === 0) {
						newarr.push(v);
					}
				})
				$scope.lists[$scope.cu].todos = newarr;
			}
			$scope.borders = function(index) {
				$(".finish .show .neverinfo").on("click", function() {
					$(".finish .show .neverinfo").removeClass("change");
					$(".finish .show .neverinfo .delete").removeClass("chu");
					$(".finish .show .onea").removeClass("change");
					$(".finish .show .onea .delete").removeClass("chu");
					$(this).addClass("change")
					$(this).find(".delete").addClass("chu")
				})
			}
			$scope.borderss = function(index) {
				$(".finish .show .onea").on("click", function() {
					$(".finish .show .neverinfo").removeClass("change");
					$(".finish .show .neverinfo .delete").removeClass("chu");
					$(".finish .show .onea").removeClass("change");
					$(".finish .show .onea .delete").removeClass("chu");
					$(this).addClass("change");
					$(this).find(".delete").addClass("chu")
				})
			}
			$scope.deletes = function() {
				$(document).on("click", "#del", false);
				$scope.lists.splice($scope.lists[$scope.cu], 1)
			}
			$scope.hidNew = function() {
				$(".finish .show .onea").removeClass("show change")
			}
//			$scope.deletess = function(id) {
//				var newarr=[]
//				for(var i = 0; i < $scope.lists[$scope.cu].todos.length; i++) {
//					var index=$(this).index()
//					if($scope.lists[$scope.cu].todos[i].id !== id) {
//						newarr.push($scope.lists[$scope.cu].todos)
//					}
//				}
//				return $scope.lists[$scope.cu].todos=newarr;
//			}
			$scope.deletess = function(index){
				var eventList = $scope.lists[$scope.cu];
				var newlist = [];
				for(var i = 0;i < $scope.lists[$scope.cu].todos.length;i++){
					if(i != index){
						newlist.push($scope.lists[$scope.cu].todos[i]);
					}
				}
				$scope.lists[$scope.cu].todos = newlist;
				$scope.lists[$scope.cu] = eventList;
				$scope.saveTolocal();
			}
		}
	}
}])
app.controller("mainCtrl", ["$scope", function($scope) {
	$scope.colors = ["purple", "green", "blue", "yellow", "brown", "pink", "orange"];
	if(localStorage.lists) {
		$scope.lists = JSON.parse(localStorage.lists);
	} else {
		$scope.lists = [{
				id: 1001,
				name: "默认",
				theme: $scope.colors[0],
				todos: [{
					name: "吃饭",
					state: 1,
					id: 10
				}, {
					name: "睡觉",
					state: 0,
					id: 11
				}]
			}

		];
	}
	$scope.saveTolocal = function() {
		localStorage.lists = JSON.stringify($scope.lists);
	}
	$scope.cu = 0;

	function maxId() {
		var max = -Infinity;
		for(var i = 0; i < $scope.lists.length; i++) {
			var v = $scope.lists[i];
			if(v.id > max) {
				max = v.id;
			}
		}
		return(v.id === -Infinity) ? 1000 : max;
	}

	$scope.addlist = function() {
		var len = $scope.lists.length;
		var index = len % 7;
		var v = {
			id: maxId() + 1,
			name: "新列表" + (len + 1),
			theme: $scope.colors[index],
			todos: []
		}
		$scope.lists.push(v)
	}

	$scope.addshow = function(event) {
		event.stopPropagation()
		$(".addinfo").addClass("show change");
		$(".addinfo input").focus();
	};
	$scope.addinfo = function(e) {
		e.stopPropagation();
		var newid = 0;
		if(e.keyCode === 13) {
			$scope.lists[$scope.cu].todos.forEach(function(v, i) {
				if(newid <= parseInt(v.id)) {
					newid = parseInt(v.id);
				}
			})
			var val = $(".addinfo input").val();
			$(".addinfo input").val("");
			$scope.lists[$scope.cu].todos.push({
				id: newid + 1,
				name: val,
				state: 0
			})
		}
	};
}])