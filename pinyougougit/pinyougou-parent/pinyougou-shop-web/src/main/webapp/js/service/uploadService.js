//文件上传服务器
app.service("uploadService",function ($http) {
    this.uploadFile = function () {
        var formData = new FormData();
        formData.append("file",document.getElementById("file").files[0]);
        return $http({
            method:'POST',
            url:"../upload.do",
            data:formData,
            headers:{'Content-Type':undefined},//这样设置浏览器会帮我们把Context-Type设置为multipart/form-data
            transformRequest:angular.identity//这样anjularjs transformRequest function 将序列化我们的formdata object.
        })
    }
})