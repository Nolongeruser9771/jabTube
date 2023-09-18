package com.example.japtube.service;

import com.example.japtube.dto.projection.OrderPublic;
import com.example.japtube.entity.Order;
import com.example.japtube.entity.Packages;
import com.example.japtube.entity.User;
import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.NotFoundException;
import com.example.japtube.repository.OrderRepository;
import com.example.japtube.repository.PackageRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.scheduling.VipBasicPackageScheduler;
import com.example.japtube.scheduling.VipPremiumPackageScheduler;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private VipBasicPackageScheduler vipBasicPackageScheduler;

    @Autowired
    private VipPremiumPackageScheduler vipPremiumPackageScheduler;

    @Value("${basic.expiration.time.millis}")
    private Long basicExpirationTimeMillis;

    @Value("${premium.expiration.time.millis}")
    Long premiumExpirationTimeMillis;

    //create order
    @Transactional
    public OrderPublic createOrder(Integer userId, Integer packageId){
        //find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { throw new NotFoundException("User id " + userId +" not found");});

        //find package
        Packages packages = packageRepository.findById(packageId)
                .orElseThrow(() -> { throw new NotFoundException("Package id " + packageId + " not found");});

        //check if user is vip activated
        if (user.getVipActive()){
            if (isAbleToExtendVip(packages)) {
                //TODO: Logic to extend vip
            }
            throw new BadRequestException("User id " + userId + " is now VIP member");
        }

        //check if user has any order pending...
        Optional<Order> order = orderRepository.findByStatusAndUser_Id(0, userId);
        if (order.isPresent()){
            Order userOrder = order.get();
            userOrder.setPackages(packages);
            userOrder.setPrice(packages.getPrice());
            userOrder.setUpdatedAt(LocalDateTime.now());
            orderRepository.save(userOrder);
            return OrderPublic.of(userOrder);
        }
        //TODO: Find if order is existed && status==0, update date
        //create new order
        Order newOrder = Order.builder()
                .status(0)
                .price(packages.getPrice())
                .user(user)
                .packages(packages)
                .build();
        orderRepository.save(newOrder);
        return OrderPublic.of(newOrder);
    }

    private boolean isAbleToExtendVip(Packages packages) {
        //TODO: Logic here to enable extend
        return false;
    }

    //admin task: activate vip package
    public OrderPublic activateUserVipPackage(Integer orderId) {
        //find order by id which is confirmed
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> {
                    throw new NotFoundException("Order id " + orderId + " not found");
                });
        //Failed to process order (already activated or be canceled)
        if (order.getStatus() == -1 || order.getStatus() == 1) {
            throw new BadRequestException("Order already confirmed or rejected. Failed to activate vip package.");
        }

        //find package & activate by orderId
        String packageType = order.getPackages().getType();
        if (packageType.equals("basic")){
            vipBasicPackageScheduler.activateUserVipPackage(basicExpirationTimeMillis, orderId);
        }
        if (packageType.equals("premium")){
            vipPremiumPackageScheduler.activateUserVipPackage(premiumExpirationTimeMillis, orderId);
        }

        return OrderPublic.of(order);
    }

    //get all orders
    public List<OrderPublic> getAllOrders(){
        List<Order> orderList = orderRepository.findAll();
        return orderList.stream().map(OrderPublic::of).toList();
    }
}
