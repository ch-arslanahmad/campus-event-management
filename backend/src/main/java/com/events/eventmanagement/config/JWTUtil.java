package com.events.eventmanagement.config;

import com.events.eventmanagement.models.User.ROLE;
import io.jsonwebtoken.Claims;
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
        } catch (Exception e) {
            System.err.println("Error parsing token: " + e.getMessage());
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    public record TokenClaims(Long userId, ROLE role) {}

    public TokenClaims verify(String token) {
        Claims claims = getClaims(token); // parse + sig + exp, throws if bad
        return new TokenClaims(
            Long.valueOf(claims.getSubject()),
            ROLE.valueOf(claims.get("role", String.class))
        );
    }

    public ROLE getRole(String token) {
        return ROLE.valueOf(getClaims(token).get("role", String.class));
    }

    public long getUserID(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }

    // get the expiration time in seconds
    public long ttlSeconds() {
        return expiration;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            // it throws an exception if the token is invalid.
            return true;
        } catch (Exception e) {
            System.err.println("Error verifying token: " + e.getMessage());
            return false;
        }
    }
}
