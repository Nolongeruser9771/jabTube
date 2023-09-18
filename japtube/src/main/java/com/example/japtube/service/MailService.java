package com.example.japtube.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@EnableAutoConfiguration
public class MailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendMail(String user, String subject, String content) {
        // Create a Simple MailMessage.
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(user);
        message.setSubject(subject);
        message.setText(content);

        // Send Message!
        emailSender.send(message);
    }
}
