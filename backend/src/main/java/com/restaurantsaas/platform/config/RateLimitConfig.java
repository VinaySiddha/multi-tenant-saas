package com.restaurantsaas.platform.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Lightweight in-memory sliding-window rate limiter for sensitive, unauthenticated
 * endpoints (login / tenant registration). Suitable for single-instance deployments;
 * behind multiple replicas replace with a Redis-backed bucket4j limiter.
 */
@Configuration
public class RateLimitConfig {

    @Bean
    public FilterRegistrationBean<Filter> authRateLimitFilter() {
        FilterRegistrationBean<Filter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new SlidingWindowRateLimitFilter(10, 60_000L));
        // NOTE: FilterRegistrationBean URL patterns are matched against the raw
        // servlet path, which excludes the server.servlet.context-path prefix.
        registration.addUrlPatterns("/auth/login", "/auth/register-restaurant");
        registration.setName("authRateLimitFilter");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 10);
        return registration;
    }

    static class SlidingWindowRateLimitFilter implements Filter {

        private final int maxRequests;
        private final long windowMillis;
        private final Map<String, Window> buckets = new ConcurrentHashMap<>();
        private final AtomicLong lastSweep = new AtomicLong(Instant.now().toEpochMilli());

        SlidingWindowRateLimitFilter(int maxRequests, long windowMillis) {
            this.maxRequests = maxRequests;
            this.windowMillis = windowMillis;
        }

        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                throws IOException, ServletException {
            HttpServletRequest http = (HttpServletRequest) request;
            String clientIp = resolveClientIp(http);

            long now = Instant.now().toEpochMilli();
            sweepExpiredBuckets(now);

            Window window = buckets.compute(clientIp, (k, existing) -> {
                if (existing == null || existing.isExpired(now, windowMillis)) {
                    return new Window(now);
                }
                return existing;
            });

            if (window.count.incrementAndGet() > maxRequests) {
                HttpServletResponse httpRes = (HttpServletResponse) response;
                httpRes.setStatus(429);
                httpRes.setContentType("application/json");
                httpRes.setHeader("Retry-After", String.valueOf(windowMillis / 1000));
                httpRes.getWriter().write(
                        "{\"success\":false,\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }

            chain.doFilter(request, response);
        }

        private String resolveClientIp(HttpServletRequest request) {
            String forwarded = request.getHeader("X-Forwarded-For");
            if (forwarded != null && !forwarded.isBlank()) {
                return forwarded.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        }

        private void sweepExpiredBuckets(long now) {
            long previous = lastSweep.get();
            // Sweep at most once per window
            if (now - previous < windowMillis) {
                return;
            }
            if (lastSweep.compareAndSet(previous, now)) {
                buckets.entrySet().removeIf(e -> e.getValue().isExpired(now, windowMillis));
            }
        }

        static class Window {
            final long startedAt;
            final AtomicInteger count = new AtomicInteger(0);

            Window(long startedAt) {
                this.startedAt = startedAt;
            }

            boolean isExpired(long now, long windowMillis) {
                return now - startedAt > windowMillis;
            }
        }
    }
}
