package com.example.japtube.dto.projection;

import com.example.japtube.entity.Packages;
import com.example.japtube.entity.UserPackage;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

public interface PackagePublic {
    Integer getId();

    Packages getPackage();

    Boolean getValid();

    LocalDateTime getEffectiveDate();

    LocalDateTime getExpiredAt();

    @RequiredArgsConstructor
    class PackagePublicImpl implements PackagePublic {
        private final UserPackage userPackage;

        @Override
        public Integer getId() {
            return this.userPackage.getId();
        }

        @Override
        public Packages getPackage() {
            return this.userPackage.getPackages();
        }

        @Override
        public Boolean getValid() {
            return this.userPackage.getValid();
        }

        @Override
        public LocalDateTime getEffectiveDate() {
            return this.userPackage.getEffectiveDate();
        }

        @Override
        public LocalDateTime getExpiredAt() {
            return this.userPackage.getExpiredAt();
        }
    }
    static PackagePublic of (UserPackage userPackage) {
        return new PackagePublicImpl(userPackage);
    }
}
