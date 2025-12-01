package com.schat.schatapi.security;

import com.schat.schatapi.service.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component  // ← Add this annotation
public class AuthTokenFilter extends OncePerRequestFilter {
    
    static {
        System.out.println("========================================");
        System.out.println("AuthTokenFilter CLASS LOADED");
        System.out.println("========================================");
    }
    
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);
    
    public AuthTokenFilter() {
        System.out.println("========================================");
        System.out.println("AuthTokenFilter CONSTRUCTOR CALLED");
        System.out.println("========================================");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        System.out.println("========================================");
        System.out.println("FILTER IS RUNNING!!!");
        System.out.println("Path: " + request.getRequestURI());
        System.out.println("========================================");
        
        String path = request.getRequestURI();
        logger.info("====== AuthTokenFilter Processing: {} {} ======", request.getMethod(), path);
        
        try {
            String jwt = parseJwt(request);
            
            if (jwt != null) {
                logger.info("✓ JWT token extracted, length: {}", jwt.length());
                
                if (jwtUtils.validateJwtToken(jwt)) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    logger.info("✓ Valid JWT for user: {}", username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("✓✓✓ Authentication set for user: {} ✓✓✓", username);
                } else {
                    logger.error("✗ JWT validation failed");
                }
            } else {
                logger.info("No JWT token in request to: {}", path);
            }
        } catch (Exception e) {
            logger.error("✗ Cannot set user authentication: {}", e.getMessage(), e);
        }

        logger.info("====== Continuing filter chain ======");
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        
        logger.debug("Authorization header: {}", headerAuth != null ? "present" : "null");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            logger.debug("✓ Token extracted from Bearer header");
            return token;
        }

        return null;
    }
}
