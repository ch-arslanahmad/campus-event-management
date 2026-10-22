package com.events.eventmanagement.config;

import static org.springframework.security.config.Customizer.withDefaults;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JWTFilter jwtFilter;

    public SecurityConfig(JWTFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(withDefaults())
                .csrf(csrf -> csrf.disable()) // disable CSRF protection
                .authorizeHttpRequests(auth -> auth
                        // Public endpoint (/api/auth/login) + wrong method (GET) → 405 → app hands you
                        // to /error → /error not in your permit list → falls under
                        // anyRequest().authenticated() → anon blocked → 403.
                        .dispatcherTypeMatchers(DispatcherType.ERROR)
                        .permitAll()
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/register")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                // handle exception of unauthorized access (401) and forbidden access (403)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(
                                (request, response, authException) -> {
                                    response.setStatus(
                                            HttpServletResponse.SC_UNAUTHORIZED); // 401
                                    response.setContentType(
                                            "application/json;charset=UTF-8");
                                    response
                                            .getWriter()
                                            .write(
                                                    "{\"status\":401,\"error\":\"Unauthorized\"," +
                                                            "\"message\":\"Authentication required\"}");
                                })
                        .accessDeniedHandler(
                                (request, response, accessDeniedException) -> {
                                    response.setStatus(
                                            HttpServletResponse.SC_FORBIDDEN); // 403
                                    response.setContentType(
                                            "application/json;charset=UTF-8");
                                    response
                                            .getWriter()
                                            .write(
                                                    "{\"status\":403,\"error\":\"Forbidden\"," +
                                                            "\"message\":\"Access denied\"}");
                                }))
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class)

                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
