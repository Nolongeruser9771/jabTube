package com.example.japtube.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true //(role allowed)
)
@AllArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    private final CustomFilter customFilter;

    //Tạo đối tượng Password Encoder (cc pp so sánh và mã hóa mật khẩu)
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    //Tạo đối tượng AuthenticationProvider, set các chức năng mã hóa mật khẩu và tìm kiếm user
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return daoAuthenticationProvider;
    }

    //Tạo đối tượng AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        //List route công khai, ai cũng vào được
        String[] PUBLIC_ROUTE ={"/api/v1/comments/**", "/api/v1/categories/**", "/api/v1/films/**", "/api/v1/images/**",
                "/api/v1/orders/**", "api/v1/packages/**", "/api/v1/subtitles/**", "/api/v1/users/**", "/api/v1/subtitles/**",
                "/api/v1/auth/**", "/api/v1/shorts", "/api/v1/playlists", "/api/v1/videos/**", "/api/v1/admin/videos/preview/**",
                "/api/v1/shorts/search", "/api/v1/playlists/search", "/api/v1/shorts/view-short/**", "/api/v1/notes/**"};

        String[] ADMIN_ROUTE= {"/api/v1/admin/**", "/api/v1/admin/videos/upload/chunk/**"};

        http
                .csrf(c -> c.disable()) //Disable bảo vệ trước tấn công ủy quyền
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers(PUBLIC_ROUTE).permitAll()
                        .requestMatchers(ADMIN_ROUTE).hasRole("ADMIN")
                        .anyRequest().authenticated())

                .authenticationProvider(authenticationProvider()) //cung cấp pp xác thực username, password, tìm kiểm user
                .addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
