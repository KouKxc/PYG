//控制层
app.controller('goodsController', function ($scope, $controller, goodsService, itemCatService, uploadService, typeTemplateService, $location) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    /*
    $scope.findOne = function (id) {
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }*/
    $scope.findOne = function () {
        var id = $location.search()['id'];//获取参数值
        if (id == null) {return;}

        goodsService.findOne(id).success(function (response) {
            $scope.entity = response;

            //富文本编辑器的回显  （向富文本编辑器添加商品介绍）
            editor.html($scope.entity.goodsDesc.introduction);

            //回显图片  （返回的是一个图片链接字符串 只需将其转换为json格式即可）
            $scope.entity.goodsDesc.itemImages = JSON.parse($scope.entity.goodsDesc.itemImages);

            //回显扩展属性 (只需将返回的字符串数据转换为json格式即可){由于与新增时的代码可能有冲突}
            $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);

            //回显规格列表
            $scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);
            //根据规格名称和选项名称返回是否被勾选
            $scope.checkAttributeValue = function (specName, optionName) {

                var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', specName);
                if (object == null) {
                    return false
                } else {
                    return object.attributeValue.indexOf(optionName) >= 0
                }

            };
            for (var i = 0; i < $scope.entity.itemList.length; i++) {
                $scope.entity.itemList[i].spec = JSON.parse($scope.entity.itemList[i].spec)
            }
        })
    };

    //保存
    $scope.save = function () {
        $scope.entity.goodsDesc.introduction=editor.html();//提取文本编辑器的值
        var serviceObject;//服务层对象
        if ($scope.entity.goods.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    alert('保存成功');
                    $scope.entity={};//清空
                    editor.html("");//清空富文本编辑器
                    location.href='goods.html'//保存成功后跳转到商品列表页
                } else {
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //保存
    /*$scope.add = function () {
        $scope.entity.goodsDesc.introduction = editor.html();
        goodsService.add($scope.entity).success(
            function (response) {
                if (response.success) {
                    alert('保存成功')
                    $scope.entity = {};
                    editor.html("");//清空富文本内容
                    window.location.reload()
                } else {
                    alert(response.message);
                }
            }
        )
    }*/
    /**
     * 图片上传阶段
     */
    //图片的上传
    $scope.uploadFile = function () {
        uploadService.uploadFile().success(
            function (response) {
                if (response.success) {//如果上传成功，取出url
                    $scope.image_entity.url = response.message;//设置文件地址
                } else {
                    alert(response.message);
                }
            }).error(function () {
            alert("哦豁，上传出了一点小错误哦")
        })
    }
    //定义页面实体结构
    $scope.entity = {
        goods: {},
        goodsDesc: {itemImages: []}
    };
    //添加图片列表
    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity)

    }
    //删除图片
    $scope.remove_image_entity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1)
    }
    /**
     * 分类显示阶段
     */
    //一级分类
    $scope.selectItemCat1List = function () {
        itemCatService.findByParentId(0).success(
            function (response) {
                $scope.itemCat1List = response
            }
        )
    }
    //二级分类  $watch方法用于监控某个变量的值，当被监控的值发生变化，就自动执行相应的函数。
    $scope.$watch('entity.goods.category1Id', function (newValue, oldValue) {
        //根据选择的值，查询二级分类
        itemCatService.findByParentId(newValue).success(function (response) {
            $scope.itemCat2List = response
        })
    })
    //三级分类
    $scope.$watch('entity.goods.category2Id', function (newValue, oldValue) {
        //根据选择的值，查询三级分类
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat3List = response
            }
        )
    })
    //设置模板id   当三级分类改变后加载
    $scope.$watch('entity.goods.category3Id', function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(
            function (response) {
                $scope.entity.goods.typeTemplateId = response.typeId;//更新模板
            }
        )
    })
    /**
     * 商品录入
     */
    //模板Id选择后 更新品牌列表 更新模板对象
    $scope.$watch('entity.goods.typeTemplateId', function (newValue, oldValue) {
        //赌气品牌列表和扩展属性
        typeTemplateService.findOne(newValue).success(
            function (response) {
                $scope.typeTemplate = response;//获取类型模板
                $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);//品牌列表
                //模板Id选择后 更新模板对象
                //$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems)//扩展属性

                //如果没有ID，则加载模板中的数据
                if ($location.search()['id'] == null) {
                    $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems)//扩展属性
                }
            }
        );
        typeTemplateService.findSpecList(newValue).success(
            function (response) {
                $scope.specList = response;
            }
        )
    });
    //保存选中的规格
    //定义格式
    $scope.entity = {goodsDesc: {itemImages: [], specificationItems: []}};
    $scope.updateSpecAttribute = function ($event, name, value) {
        var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', name);
        if (object != null) {
            if ($event.target.checked) {
                //勾选了
                object.attributeValue.push(value);
            } else {
                //取消勾选
                object.attributeValue.splice(object.attributeValue.indexOf(value), 1);
                //如果选项都取消了 就将此记录移除
                if (object.attributeValue.length == 0) {
                    $scope.entity.goodsDesc.specificationItems.splice(
                        $scope.entity.goodsDesc.specificationItems.indexOf(object), 1)
                }
            }
        } else {
            //如果没有对象 则创建对象
            //[{“attributeName”:”规格名称”,”attributeValue”:[“规格选项1”,“规格选项2”.... ]},....]
            $scope.entity.goodsDesc.specificationItems.push(
                {"attributeName": name, "attributeValue": [value]}
            )
        }
    }
    //创建SKU列表
    $scope.createItemList = function () {
        //定义初始格式
        $scope.entity.itemList = [{spec: {}, price: 0, num: 99999, status: '0', isDefault: '0'}];
        var items = $scope.entity.goodsDesc.specificationItems;
        for (var i = 0; i < items.length; i++) {
            $scope.entity.itemList = addColumn($scope.entity.itemList, items[i].attributeName, items[i].attributeValue)
        }
    };
    //添加列值
    addColumn = function (list, columnName, columnValues) {
        var newList = []; //定义一个新的集合
        for (var x = 0; x < list.length; x++) {
            var oldRow = list[x];
            for (var j = 0; j < columnValues.length; j++) {
                var newRow = JSON.parse(JSON.stringify(oldRow)); //深克隆
                newRow.spec[columnName] = columnValues[j];
                newList.push(newRow)
            }
        }
        return newList;
    };
    //定义一个数组 显示状态   在页面上传入索引获取状态
    $scope.status = ['未审核', '以审核', '审核未通过', '关闭'];//商品状态

    $scope.itemCatList = [];//商品分类列表
    //加载商品分类列表
    $scope.findItemCatList = function () {
        itemCatService.findAll().success(function (response) {
            for (var i = 0; i < response.length; i++) {
                $scope.itemCatList[response[i].id] = response[i].name
            }
        })
    }

    $scope.itemListDelete=function (a) {
        if (a =="1"){
           $scope.entity.itemList = [];
        }
    }
});