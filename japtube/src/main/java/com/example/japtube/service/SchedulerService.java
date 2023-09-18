package com.example.japtube.service;

import com.example.japtube.entity.*;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.OrderRepository;
import com.example.japtube.repository.RoleRepository;
import com.example.japtube.repository.UserPackageRepository;
import com.example.japtube.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class SchedulerService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPackageRepository userPackageRepository;

    @Autowired
    private MailService mailService;

    //Activate vip package
    @Transactional
    public void activateUserVipPackage(Long expirationTimeMillis, Integer orderId){
        //find order not confirmed yet
        Order order = orderRepository.findByIdAndStatus(orderId,0)
                .orElseThrow(() -> { throw new NotFoundException("Order id " + orderId + " not found or is confirmed");});

        //set userPackage valid == true
        UserPackage userPackage = UserPackage.builder()
                .user(order.getUser())
                .packages(order.getPackages())
                .effectiveDate(LocalDateTime.now())
                .expiredAt(LocalDateTime.now().plusSeconds(expirationTimeMillis/1000))
                .valid(true)
                .build();

        //add user_vip_role
        Role vip_role = roleRepository.findByRole("USER_VIP")
                .orElseThrow(() -> { throw new NotFoundException("Role user_vip not found");});
        List<Role> roles = order.getUser().getRoles();
        roles.add(vip_role);
        order.getUser().setRoles(roles);

        //set User vipActive == true
        order.getUser().setVipActive(true);
        userRepository.save(order.getUser());

        //update order status -> success
        order.setStatus(1);
        orderRepository.save(order);
        userPackageRepository.save(userPackage);

        //send mail
        mailService.sendMail(
                order.getUser().getEmail(),
                "Thông báo kích hoạt thành công gói :" + order.getPackages().getType(),
                "Bạn đã kích hoạt thành công gói :" + order.getPackages().getType() + "\n"
                + "Hạn sử dụng đến: " + userPackage.getExpiredAt());
    }

    //Activate vip package
    @Transactional
    public void deactivateUserVipPackage(Integer orderId) {
        //find order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> { throw new NotFoundException("Order id " + orderId + " not found");});

        //find user & package
        User user = order.getUser();
        Packages packages = order.getPackages();

        //set userPackage valid == false
        UserPackage userPackage = userPackageRepository.findByUser_IdAndPackages_IdAndValid(user.getId(), packages.getId(), true)
                .orElseThrow(() -> { throw new NotFoundException("UserPackage of user id " + user.getId() + " and " + " package id " + packages.getId());});
        userPackage.setValid(false);
        userPackageRepository.save(userPackage);

        //set User vipActive == false
        user.setVipActive(false);
        //remove user_vip_role
        List<Role> roles = user.getRoles();
        List<Role> newRoles = new ArrayList<>();
        for (Role role: roles) {
            if (!Objects.equals(role.getRole(), "USER_VIP")) {
                newRoles.add(role);
            }
        }
        user.setRoles(newRoles);
        userRepository.save(user);

        //send mail
        mailService.sendMail(
                order.getUser().getEmail(),
                "Thông báo hết hạn gói :" + order.getPackages().getType(),
                "Gói kích hoạt của bạn đã hết hạn, vui lòng gia hạn thêm để tiếp tục trải nghiệm tại: http://localhost:3000");
    }
}
