package com.fiec.voz_cidada.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class LoggingAspectConfig {

    @Before("@within(org.springframework.web.bind.annotation.RestController)")
    public void logControllerAccess(JoinPoint joinPoint) {
        log.info("{} > {} > {}", joinPoint.getTarget().getClass().getName(), joinPoint.getSignature().getName(), joinPoint.getArgs());
    }

}