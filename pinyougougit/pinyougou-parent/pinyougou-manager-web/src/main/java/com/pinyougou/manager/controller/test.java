package com.pinyougou.manager.controller;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class test {
    @SuppressWarnings("resource")
    public static void main(String[] args) throws IOException {
        DatagramSocket da = new DatagramSocket();
        //for (int i = 0; i < 10; i++) {

        while(true){
            String a="1_lbt4_0#128#000C29D68D8F#0#0#0#2.5a:1399716676:%s:%s:209:.";
            byte[] by = a.getBytes();
            while(true){
                DatagramPacket daPacket = new DatagramPacket(by, by.length,
                        InetAddress.getByName("192.168.12.59"), 2425);
                da.send(daPacket);
            }
        }

    }
}
