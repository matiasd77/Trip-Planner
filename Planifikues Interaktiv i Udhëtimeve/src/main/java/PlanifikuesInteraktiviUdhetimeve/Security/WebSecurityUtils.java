package PlanifikuesInteraktiviUdhetimeve.Security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import PlanifikuesInteraktiviUdhetimeve.Entity.User;
import jakarta.servlet.http.HttpSession;

@Component
public class WebSecurityUtils {

    /**
     * Get the currently authenticated user's email
     */
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    /**
     * Check if the current user has a specific role
     */
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && 
               authentication.isAuthenticated() && 
               authentication.getAuthorities().stream()
                   .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    /**
     * Check if a user is currently authenticated
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }

    /**
     * Store user data in session
     */
    public static void storeUserInSession(HttpSession session, User user) {
        session.setAttribute("userId", user.getId());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userRole", user.getRole().name());
    }

    /**
     * Clear user data from session
     */
    public static void clearUserSession(HttpSession session) {
        session.removeAttribute("userId");
        session.removeAttribute("userEmail");
        session.removeAttribute("userRole");
    }

    /**
     * Check if current user has admin privileges
     */
    public static boolean isAdmin() {
        return hasRole("ADMIN");
    }
}
