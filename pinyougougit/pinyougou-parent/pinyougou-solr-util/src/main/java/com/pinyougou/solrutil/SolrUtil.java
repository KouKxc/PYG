package com.pinyougou.solrutil;


import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.pinyougou.mapper.TbItemMapper;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.pojo.TbItemExample;
import com.pinyougou.pojo.TbItemExample.Criteria;

@Component
public class SolrUtil {

    @Autowired
    private TbItemMapper itemMapper;

    @Autowired
    private SolrTemplate solrTemplate;
    /**
     * 导入商品数据
     */
    public void importItemData(){


        TbItemExample example = new TbItemExample();
        Criteria criteria = example.createCriteria();
        criteria.andStatusEqualTo("1");//设置状态为 “1” 就是 以审核
        List<TbItem> tbItems = itemMapper.selectByExample(example); //查询出所有以审核的数据
        System.out.println("***///***///商品列表、、、***、、、***");
        for (TbItem item : tbItems) {
            System.out.println(item.getSpec());
            //将spec中的json字符串转换为map
            Map specMap = JSON.parseObject(item.getSpec(), Map.class);
            item.setSpecMap(specMap);//给带注解的字段赋值
        }
        solrTemplate.saveBeans(tbItems);//给solr中存入查询出的list集合
        solrTemplate.commit();//提交事务
        System.out.println("***///***///结束、、、***、、、***");

    }

    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("classpath*:spring/applicationContext*.xml");
        SolrUtil solrUtil = (SolrUtil) context.getBean("solrUtil");
        solrUtil.importItemData();

    }

}
