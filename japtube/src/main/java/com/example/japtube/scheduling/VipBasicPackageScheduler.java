package com.example.japtube.scheduling;

import com.example.japtube.repository.UserRepository;
import com.example.japtube.service.MailService;
import com.example.japtube.service.SchedulerService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class VipBasicPackageScheduler {
    private Boolean vipPackageEnabled = false;
    private Integer orderId;

    @Autowired
    private SchedulerService schedulerService;

    //Activate vip package
    @Transactional
    public void activateUserVipPackage(Long expirationTimeMillis, Integer orderId){
        schedulerService.activateUserVipPackage(expirationTimeMillis,orderId);

        //set attributes for schedule
        this.vipPackageEnabled = true;
        this.orderId = orderId;
    }

    //Deactivate premium vip package
    @Scheduled(fixedDelayString = "${basic.expiration.time.millis}")
    public void checkUserVipPackage_Premium() {
        //check if vip package enable, but expired;
        if (vipPackageEnabled) {
            //deactivate
            schedulerService.deactivateUserVipPackage(orderId);

            //reset attributes
            this.vipPackageEnabled = false;
            log.info("deactivate: {}", LocalDateTime.now());
        }
    }
}
