package com.example.japtube.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class JwtUtils {
    @Value("${application.security.jwt.secret-key}") //lấy thông tin trong config
    private String secretKey;

    @Value("${application.security.jwt.expiration}") //lấy thông tin trong config
    private long jwtExpiration;

    // TODO: Tạo token từ thông tin của user
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>(); //lưu các thông tin cần thiết
        claims.put("authorities", userDetails.getAuthorities());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey()) //mã hóa dựa trên thông tin nào
                .compact(); //để build ra một chuỗi
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token)
                .getBody().getSubject();
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            log.info("invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.info("invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.info("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.info("JWT token is unsupported: {}", e.getMessage());
        }
        return false;
    }

    // Build secret key jwt
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
