package com.example.japtube.controller.webController;

import com.example.japtube.dto.projection.OrderPublic;
import com.example.japtube.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@AllArgsConstructor
public class OrderController {
    private final OrderService orderService;

    //1. POST: Create order
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestParam("userId") Integer userId,
                                         @RequestParam("packageId") Integer packageId){
        OrderPublic order = orderService.createOrder(userId,packageId);
        return ResponseEntity.ok().body(order);
    }
}
