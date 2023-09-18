package com.example.japtube.controller;

import com.example.japtube.exception.BadRequestException;
import com.example.japtube.exception.ErrorMessage;
import com.example.japtube.exception.FileHandleException;
import com.example.japtube.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandleController {

    @ExceptionHandler
    public ErrorMessage NotFoundExceptionHandler(NotFoundException ex) {
        return new ErrorMessage(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    @ExceptionHandler
    public ErrorMessage BadRequestExceptionHandler(BadRequestException ex) {
        return new ErrorMessage(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    @ExceptionHandler
    public ErrorMessage FileHandleExceptionHandler (FileHandleException ex) {
        return new ErrorMessage(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage()
        );
    }
}
