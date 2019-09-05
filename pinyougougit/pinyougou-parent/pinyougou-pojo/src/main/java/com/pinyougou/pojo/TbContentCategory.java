package com.pinyougou.pojo;

import java.io.Serializable;
import java.security.SecureRandom;

public class TbContentCategory implements Serializable {
    private Long id;

    private String name;

    //Student s = new Student();
    //s.name = "zhangsan";

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }
}