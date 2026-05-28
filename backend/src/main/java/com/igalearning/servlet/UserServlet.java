package com.igalearning.servlet;

import com.igalearning.dao.UserDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;
import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/api/users/*")
public class UserServlet extends HttpServlet {

  private final UserDao dao = new UserDao();

  private Integer getUserIdFromToken(HttpServletRequest req) {
    String auth = req.getHeader("Authorization");
    if (auth != null && auth.startsWith("Bearer demo-token-")) {
      try {
        return Integer.parseInt(auth.substring("Bearer demo-token-".length()));
      } catch (NumberFormatException e) {
        return null;
      }
    }
    return null;
  }

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if ("/me".equals(path)) {
        Integer userId = getUserIdFromToken(req);
        if (userId == null) {
          Json.err(res, 401, "Non autorisé");
          return;
        }
        Map<String, Object> user = dao.findPublic(userId);
        if (user == null) {
          Json.err(res, 404, "Utilisateur introuvable");
          return;
        }
        Json.ok(res, user);
        return;
      }

      String role = req.getParameter("role");
      if (role != null && !role.isBlank()) {
        Json.ok(res, dao.findByRole(role.toUpperCase()));
      } else {
        Json.ok(res, dao.findAll());
      }
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      Map<String, Object> b = Json.body(req);
      String name = String.valueOf(b.get("name"));
      String email = String.valueOf(b.get("email"));
      String pass = String.valueOf(b.get("password"));
      String role = String.valueOf(
        b.getOrDefault("role", "STUDENT")
      ).toUpperCase();
      if (dao.findByEmail(email) != null) {
        Json.err(res, 409, "Email déjà utilisé");
        return;
      }
      Map<String, Object> u = dao.create(
        name,
        email,
        BCrypt.hashpw(pass, BCrypt.gensalt()),
        role
      );
      Json.send(res, 201, Map.of("success", true, "user", u));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPut(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if ("/me".equals(path)) {
        Integer userId = getUserIdFromToken(req);
        if (userId == null) {
          Json.err(res, 401, "Non autorisé");
          return;
        }

        Map<String, Object> b = Json.body(req);
        String firstName = (String) b.get("firstName");
        String lastName = (String) b.get("lastName");
        String email = (String) b.get("email");
        String password = (String) b.get("password");
        String profileImage = (String) b.get("profileImage");
        String phone = (String) b.get("phone");
        String bio = (String) b.get("bio");

        Map<String, Object> existingUser = dao.findPublic(userId);
        if (existingUser == null) {
          Json.err(res, 404, "Utilisateur introuvable");
          return;
        }

        if (email != null && !email.equals(existingUser.get("email"))) {
          Map<String, Object> checkEmail = dao.findByEmail(email);
          if (checkEmail != null) {
            Json.err(res, 409, "Email déjà utilisé");
            return;
          }
        }

        String passwordHash = null;
        if (password != null && !password.isBlank()) {
          passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());
        }

        boolean updated = dao.updateMe(
          userId,
          firstName,
          lastName,
          email,
          passwordHash,
          profileImage,
          phone,
          bio
        );
        if (updated) {
          Json.ok(res, Map.of("success", true, "user", dao.findPublic(userId)));
        } else {
          Json.err(res, 500, "Erreur lors de la mise à jour");
        }
        return;
      }

      if (path == null || path.length() <= 1) {
        Json.err(res, 400, "ID de l'utilisateur manquant dans l'URL");
        return;
      }
      int id = Integer.parseInt(path.substring(1));
      Map<String, Object> b = Json.body(req);
      dao.update(
        id,
        String.valueOf(b.get("name")),
        String.valueOf(b.get("email")),
        String.valueOf(b.get("role"))
      );
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doDelete(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String pathInfo = req.getPathInfo();
      if (pathInfo == null || pathInfo.length() <= 1) {
        Json.err(res, 400, "ID de l'utilisateur manquant dans l'URL");
        return;
      }
      int id = Integer.parseInt(pathInfo.substring(1));
      dao.delete(id);
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }
}
