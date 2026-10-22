package com.events.eventmanagement.config;

import com.events.eventmanagement.models.User.ROLE;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
// Spring imports
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;

    @Value("${app.jwt.ttl-seconds}")
    private long expiration;

    // get the SECRET KEY (from env)
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // generate JWT token
    public String generateToken(Long userID, String userRole) {
        try {
            return Jwts.builder()
                .subject(userID.toString())
                .issuedAt(new Date())
                .expiration(Date.from(Instant.now().plusSeconds(expiration)))
                .claim("role", userRole)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
        } catch (Exception e) {
            System.err.println("Error generating token: " + e.getMessage());
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parser()
                .verifyWith(getSigningKey()) // Your signing key
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Error parsing token: " + e.getMessage());
            throw new InvalidTokenException("Invalid JWT token", e);
        }
    }

    public record TokenClaims(Long userId, ROLE role) {}

    public TokenClaims verify(String token) {
        Claims claims = getClaims(token); // parse + sig + exp, throws if bad

        String sub = claims.getSubject();
        String role = claims.get("role", String.class);

        if (sub == null || role == null) {
            throw new InvalidTokenException("Missing userID or role");
        }

        try {
            return new TokenClaims(Long.valueOf(sub), ROLE.valueOf(role));
        } catch (IllegalArgumentException e) {
            throw new InvalidTokenException("Malformed claims", e);
        }
    }

    // get the expiration time in seconds
    public long ttlSeconds() {
        return expiration;
    }

    // A custom ExceptionHandler for JWT
    public static class InvalidTokenException extends JwtException {

        public InvalidTokenException(String message) {
            super(message);
        }

        public InvalidTokenException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
