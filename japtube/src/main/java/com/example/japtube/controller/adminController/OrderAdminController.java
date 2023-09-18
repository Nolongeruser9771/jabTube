package com.example.japtube.controller.adminController;

import com.example.japtube.dto.projection.OrderPublic;
import com.example.japtube.service.MailService;
import com.example.japtube.service.OrderService;
import lombok.AllArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/orders")
@AllArgsConstructor
public class OrderAdminController {
    private final OrderService orderService;

    //1. POST: Order confirm, active package
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmOrder(@RequestParam Integer orderId){
        OrderPublic confirmedOrder = orderService.activateUserVipPackage(orderId);
        return ResponseEntity.ok().body(confirmedOrder);
    }

    //2. GET: Get all orders
    @GetMapping("")
    public ResponseEntity<?> getAllOrders(){
        List<OrderPublic> orders = orderService.getAllOrders();
        return ResponseEntity.ok().body(orders);
    }
}
