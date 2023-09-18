package com.example.japtube.repository;

import com.example.japtube.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByIdAndStatus(Integer id, Integer status);

    List<Order> findByUser_EmailContains(String username);

    List<Order> findByStatusOrderByUpdatedAtDesc(Integer status);

    Optional<Order> findByStatusAndUser_Id(Integer status, Integer userId);

    List<Order> findByCreatedAtBetween(LocalDateTime createdAtStart, LocalDateTime createdAtEnd);

    List<Order> findByStatusAndCreatedAtBetween(Integer status, LocalDateTime createdAtStart, LocalDateTime createdAtEnd);

    List<Order> findByStatus(Integer status);


}