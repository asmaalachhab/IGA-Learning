package com.igalearning.servlet;

import com.igalearning.dao.UserDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.*;
import org.mindrot.jbcrypt.BCrypt;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {

  private final UserDao dao = new UserDao();

  protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      Map<String, Object> b = Json.body(req);
      String email = (String) b.get("email"),
        pass = (String) b.get("password");
      if (email == null || pass == null) {
        Json.err(res, 400, "Email et mot de passe obligatoires");
        return;
      }

      if ("/register".equals(path)) {
        if (dao.findByEmail(email) != null) {
          Json.err(res, 409, "Email déjà utilisé");
          return;
        }
        String name = (String) b.getOrDefault("name", "Etudiant IGA");
        // Pour un projet scolaire, on accepte le script SQL en clair, mais les nouveaux comptes sont hashés.
        Map<String, Object> u = dao.create(
          name,
          email,
          BCrypt.hashpw(pass, BCrypt.gensalt()),
          "STUDENT"
        );
        Json.send(res, 201, Map.of("success", true, "user", u));
      } else if ("/login".equals(path)) {
        Map<String, Object> u = dao.findByEmail(email);
        if (u == null) {
          Json.err(res, 401, "Identifiants incorrects");
          return;
        }
        String stored = String.valueOf(u.get("password"));
        boolean ok = stored.startsWith("$2")
          ? BCrypt.checkpw(pass, stored)
          : stored.equals(pass);
        if (!ok) {
          Json.err(res, 401, "Identifiants incorrects");
          return;
        }
        u.remove("password");
        Json.ok(
          res,
          Map.of(
            "success",
            true,
            "user",
            u,
            "token",
            "demo-token-" + u.get("id")
          )
        );
      } else Json.err(res, 404, "Endpoint introuvable");
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }
}
