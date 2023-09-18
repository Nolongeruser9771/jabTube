package com.example.japtube.service;

import com.example.japtube.dto.projection.FilmPublic;
import com.example.japtube.entity.Film;
import com.example.japtube.entity.Order;
import com.example.japtube.modal.DashBoardData;
import com.example.japtube.repository.FilmRepository;
import com.example.japtube.repository.OrderRepository;
import com.example.japtube.repository.UserRepository;
import com.example.japtube.repository.WatchedVideoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class DashboardService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FilmRepository filmRepository;

    @Autowired
    private WatchedVideoRepository watchedVideoRepository;

    //get dashboard data by timestamp
    public List<DashBoardData> getDashBoardDataByYear(Integer year){
        List<DashBoardData> datas = new ArrayList<>();
        int[] months = {1,2,3,4,5,6,7,8,9,10,11,12};
        int totalUsers;
        int totalActiveUsers;
        int totalOrders;
        double totalRevenue = 0d;
        long totalViews = 0;

        for (Integer month: months) {
            LocalDateTime originTime = LocalDateTime.of(year, 1, 1, 0, 0, 0);

            LocalDateTime start = LocalDateTime.of(year, month, 1, 0,0, 0);

            totalUsers = userRepository.findByCreateAtBetween(originTime, start.plusMonths(1L)).size();

            totalActiveUsers = userRepository.findByVipActiveTrueAndCreateAtBetween(originTime, start.plusMonths(1L)).size();

            List<Order> orders = orderRepository.findByCreatedAtBetween(start, start.plusMonths(1L));
            totalOrders = orders.size();

            List<Order> confirmedOrders = orderRepository.findByStatusAndCreatedAtBetween(1, start, start.plusMonths(1L));
            for (Order confirmOrder: confirmedOrders) {
                totalRevenue += confirmOrder.getPrice();
            }

            totalViews = watchedVideoRepository.findByWatchedAtBetween(start, start.plusMonths(1L)).size();

            DashBoardData data = new DashBoardData(month, totalUsers, totalActiveUsers, totalRevenue, totalOrders, totalViews);
            datas.add(data);

            //reset data
            totalUsers = 0;
            totalActiveUsers = 0;
            totalOrders = 0;
            totalViews = 0;
            totalRevenue = 0;
        }
        return datas;
    }

    //get all data dashboard
    public DashBoardData getAllDashboardData(){
        Integer totalUsers = userRepository.findAll().size();

        Integer totalActiveUsers = userRepository.findByVipActive(true).size();

        Integer totalOrder = orderRepository.findAll().size();

        double totalRevenue = 0;

        List<Order> confirmedOrders = orderRepository.findByStatus(1).stream().toList();
        for (Order confirmOrder: confirmedOrders) {
            totalRevenue += confirmOrder.getPrice();
        }

        long totalViews = 0;
        List<Film> films = filmRepository.findAll();
        for (Film film: films) {
            totalViews += FilmPublic.of(film).getTotalViews();
        }

        return DashBoardData.builder()
                .totalUsers(totalUsers)
                .totalActiveUsers(totalActiveUsers)
                .totalOrders(totalOrder)
                .totalRevenue(totalRevenue)
                .totalViews(totalViews)
                .build();
    }
}
