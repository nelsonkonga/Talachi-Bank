package com.talachibank.api.security;

import com.talachibank.api.service.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

// [FIX] Restored @Component for Dependency Injection
// We will disable auto-registration in WebSecurityConfig
@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Skip JWT filter for public endpoints
        // [NOTE] Ensure these match your controller paths EXACTLY or use wildcards if
        // implemented
        boolean shouldSkip = path.startsWith("/api/auth/register") ||
                path.startsWith("/api/auth/login") ||
                path.startsWith("/api/auth/refreshtoken") ||
                path.startsWith("/api/sdith/demo") ||
                path.startsWith("/api/test"); // Added /error just in case

        if (shouldSkip) {
            logger.debug("🔓 Skipping JWT filter for public endpoint: {}", path);
        }

        return shouldSkip;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String jwt = parseJwt(request);

            if (jwt != null) {
                if (jwtUtils.validateJwtToken(jwt)) {
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.debug("✓ Auth set for user: {}", username);
                } else {
                    // Invalid token found - Do NOT set context.
                    // Request remains 'anonymous'. behavior depends on WebSecurityConfig.
                    logger.warn("✗ Invalid/Expired JWT token found in request to {}", request.getRequestURI());
                }
            }
        } catch (Exception e) {
            logger.error("✗ Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
