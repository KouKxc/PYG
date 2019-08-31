package com.pinyougou.shop.controller;

import entity.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;
import util.FastDFSClient;

@RestController
public class UploadController {
    @Value("${FILE_SERVER_URL}")
    private String FILE_SERVER_URL;//文件服务地址
    @RequestMapping("/upload")
    public Result upload(MultipartFile file){
        //获取文件扩展名
        String originalFilename = file.getOriginalFilename();//先获取文件全名
        String extName = originalFilename.substring(originalFilename.lastIndexOf(".")+1);//通过 . 进行切割 切割完后带着点 所以从点的后一位截取
        try {
            //创建一个FastDFS客户端
            FastDFSClient fastDFSClient = new FastDFSClient("classpath:config/fdfs_client.conf");
            //执行上传处理
            String path = fastDFSClient.uploadFile(file.getBytes(),extName);//指定上传的文件和存储格式 返回一个路径url
            //拼接返回的url和ip地址 拼装成完完整的url
            String url = FILE_SERVER_URL + path;
            return new Result(true,url);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"上传失败");
        }


    }

}
