package com.example.japtube.controller.adminController;

import com.example.japtube.modal.DashBoardData;
import com.example.japtube.service.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/admin/dashboard")
@AllArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    //1. GET: Get data dashboard by year
    @GetMapping("/search")
    public ResponseEntity<?> getDashboardDataByYear(@RequestParam Integer year){
        List<DashBoardData> data = dashboardService.getDashBoardDataByYear(year);
        return ResponseEntity.ok().body(data);
    }

    //2. GET: Get all data
    @GetMapping("")
    public ResponseEntity<?> getAllDashboardData(){
        DashBoardData data = dashboardService.getAllDashboardData();
        return ResponseEntity.ok().body(data);
    }
}
