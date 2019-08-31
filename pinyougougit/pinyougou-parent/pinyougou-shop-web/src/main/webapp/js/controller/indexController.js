app.controller('indexController',function ($scope,$controller,loginService) {
    //读取登录人
    $scope.showLoginName=function () {
        loginService.loginName().success(
            function (response) {
                $scope.loginName=response.loginName;
            }
        )
    }
})