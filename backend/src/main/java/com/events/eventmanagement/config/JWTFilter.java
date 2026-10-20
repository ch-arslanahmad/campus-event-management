package com.events.eventmanagement.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String token = null; // null

        // 1. get cookies from the request
        Cookie[] cookies = request.getCookies(); // get all cookies

        // 2. check if cookies are null
        if (cookies == null) {
            System.out.println("No cookies found");
            return;
        }

        // 3. fetch the JWT token if available
        for (Cookie c : cookies) {
            if ("jwt_token".equals(c.getName())) {
                System.out.println(c.getName() + " : " + c.getValue());
                // check if the cookie name is "access"
                token = c.getValue(); // get the value of the access cookie
                break;
            }
        }

        // if token not fetched correctly
        if (token == null) {
            filterChain.doFilter(request, response);
            System.err.println("No token found in cookies");
            response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                "No token found"
            );
        }

        // 4. validate the token
        if (!jwtUtil.validateToken(token)) {
            System.err.println("Invalid token found in cookies");
            response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                "Invalid token"
            );
            return;
        }

        // 5. fetch UserID and Role from the token (to add it in the authentication object)
        long userID = jwtUtil.getUserID(token);
        var role = jwtUtil.getRole(token);

        // password null, because not needed for authentication
        // // this creates authentication object with the userID (who made the request) and role (role of the requester), which can be used for authorization check in the application
        var auth = new UsernamePasswordAuthenticationToken(
            userID,
            null,
            List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name().toLowerCase())
            )
        );

        SecurityContextHolder.getContext().setAuthentication(auth); // set the authentication object in the security context

        filterChain.doFilter(request, response); // continue the filter chain
    }
}
