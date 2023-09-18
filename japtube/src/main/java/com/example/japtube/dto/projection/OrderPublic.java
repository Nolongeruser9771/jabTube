package com.example.japtube.dto.projection;

import com.example.japtube.entity.Order;
import com.example.japtube.entity.Packages;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

public interface OrderPublic {
    Integer getId();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();

    Integer getStatus();

    String getUserEmail();

    Packages getPackages();

    @RequiredArgsConstructor
    class OrderPublicImpl implements OrderPublic {
        private final Order order;

        @Override
        public Integer getId() {
            return this.order.getId();
        }

        @Override
        public LocalDateTime getCreatedAt() {
            return this.order.getCreatedAt();
        }

        @Override
        public LocalDateTime getUpdatedAt() {
            return this.order.getUpdatedAt();
        }

        @Override
        public Integer getStatus() {
            return this.order.getStatus();
        }

        @Override
        public String getUserEmail() {
            return this.order.getUser().getEmail();
        }

        @Override
        public Packages getPackages() {
            return this.order.getPackages();
        }
    }
    static OrderPublic of(Order order) {return new OrderPublicImpl(order);}
}
