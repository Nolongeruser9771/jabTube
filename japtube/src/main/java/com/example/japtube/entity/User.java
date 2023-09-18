package com.example.japtube.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "user")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password")
    @JsonIgnore
    private String password;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "vip_active")
    private Boolean vipActive;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "user_id")
    @JsonIgnore
    List<UserPackage> packages;

    @OneToMany
    @JoinColumn(name = "user_id")
    @JsonIgnore
    List<Order> orders;

    @PrePersist
    public void prePersist(){
        createAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { //lấy ra danh sách quyền của user
        //Duyệt qua danh sách role
        //Với mỗi role name tạo đối tượng SimpleGrantedAuthority triển khai interface GrantedAuthority
        return roles.stream()
                .map(role ->  new SimpleGrantedAuthority("ROLE_" + role.getRole()))
                .toList();
    }

    @Override
    public String getUsername() {
        //thông tin sử dụng đăng nhập
        return this.email;
    }

    @Override
    public String getPassword() {
        //thông tin sử dụng đăng nhập
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        //tài khoản hết hạn?
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        //tài khoản bị khóa?
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        //password hết hạn?
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}