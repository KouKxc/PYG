app.controller('baseController',function ($scope) {
    //分页控件
    $scope.paginationConf = {
        currentPage: 1, //当前页
        totalItems: 100, //总记录数
        itemsPerPage: 10,//每页记录数
        perPageOptions: [10, 20, 30, 40, 50],//分页选项
        onChange: function () { //当页面变动后自动触发的方法
            $scope.reloadList();
        }
    };

    //刷新列表
    $scope.reloadList = function () {
        // $scope.findPage($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
        $scope.search($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
    };

    //用户勾选复选框
    $scope.selectIds=[];//选中的ID集合
    //更新复选
    $scope.updateSelection = function ($event, id) {
        if ($event.target.checked){//如果是被选中，则增加到数组
            $scope.selectIds.push(id);
        } else{
            var idx = $scope.selectIds.indexOf(id);//查找值的位置
            $scope.selectIds.splice(idx,1);//第一个参数是移除的位置 第二个参数是移除的个数
        }
    };
});