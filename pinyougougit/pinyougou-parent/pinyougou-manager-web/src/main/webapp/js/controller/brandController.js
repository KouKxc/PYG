app.controller('brandController', function ($scope,$controller,$http,brandService) {

    $controller('baseController',{$scope:$scope});//伪继承 相当于把baseController的$scope拿过来等于当前js的$scope

    //品牌的查询
    $scope.findAll = function () {
        brandService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    };

    //分页
    $scope.findPage = function (page, size) {
        brandService.findPage(page, size).success(
            function (response) {
                $scope.list = response.rows;//显示当前页数
                $scope.paginationConf.totalItems = response.total;//更新总记录数
                //$scope.paginationConf.perPageOptions.forEach()
            }
        );
    };

    //新增 & 修改
    $scope.save = function () {
        var object=null;
        if ($scope.entity.id != null) {
            object = brandService.update($scope.entity);
        } else {
            object = brandService.add($scope.entity);
        }
        object.success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新
                } else {
                    alert(response.message);
                }
            }
        );
    };
    //根据id查询
    $scope.findOne = function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    };

    //批量删除
    $scope.dele=function () {
        //获取选中的复选框
        if (confirm('确定要删除吗？')) {
            brandService.dele($scope.selectIds).success(
                function (response) {
                    if (response.success) {
                        $scope.reloadList();//刷新列表
                        $scope.selectIds=[];
                    }else{
                        alert(response.message);
                    }
                }
            )
        }
    };

    $scope.searchEntity={};//定义搜索对象
    //条件查询
    $scope.search=function(page,size){
        brandService.search(page,size,$scope.searchEntity).success(
            function (response) {
                $scope.paginationConf.totalItems=response.total;//总记录数
                $scope.list=response.rows;//给列表变量赋值

            }
        )
    }
});