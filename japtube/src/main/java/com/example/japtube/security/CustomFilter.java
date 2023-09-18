package com.example.japtube.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//kiểm tra quyền của user đối với mỗi request
@Component
@Slf4j
public class CustomFilter extends OncePerRequestFilter {
    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            String jwt = parseJwt(request);

            log.info("jwt: {}", jwt);
            if (jwt!= null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUsernameFromJwtToken(jwt);

                UserDetails userDetails = customUserDetailService.loadUserByUsername(username);
                log.info("user: {}", username);
                log.info("roles: {}", userDetails.getAuthorities());

                //Tạo đối tượng phân quyền
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        userDetails.getUsername(),
                        null,
                        userDetails.getAuthorities() //danh sách roles của user
                );

                //Lưu vào security context holder -> chuyển qua filter tiếp theo
                SecurityContextHolder.getContext().setAuthentication(token);
            }
        }catch (Exception e) {
            log.info("Cannot set user authentication: {}", e);
        }
        filterChain.doFilter(request, response);
    }

    //get jwt token
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        log.info("header: {}", request.getHeader("Authorization"));

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
