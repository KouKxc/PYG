package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;
import java.util.Map;

public interface BrandService {
    /**
     * 品牌全部查询
     * @return
     */
    List<TbBrand> findAll();

    /**
     * 品牌的分页
     * @param pageNum 当前页面
     * @param pageSize 没有记录数
     * @return
     */
    PageResult findPage(int pageNum,int pageSize);

    /**
     * 品牌的增加
     * @param brand
     */
    void add(TbBrand brand);

    /**
     * 根据id查询
     * @param id
     * @return
     */
    TbBrand findOne(Long id);

    /**
     * 品牌的修改
     * @param brand
     */
    void update(TbBrand brand);
    /**
     * 品牌的删除
     */
    void delete(Long[] ids);

    /**
     * 品牌的查询+分页
     * @param brand
     * @param pageNum
     * @param pageSize
     * @return
     */
    PageResult findPage(TbBrand brand,int pageNum,int pageSize);

    /**
     * 下拉框列表数据
     * @return
     */
    List<Map> selectOptionList();
}
