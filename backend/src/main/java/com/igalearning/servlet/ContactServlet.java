package com.igalearning.servlet;

import com.igalearning.util.Json;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet("/api/contact")
public class ContactServlet extends HttpServlet {

  protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      Map<String, Object> body = Json.body(req);
      String name = String.valueOf(body.get("name"));
      String email = String.valueOf(body.get("email"));
      String subject = String.valueOf(body.get("subject"));
      String message = String.valueOf(body.get("message"));

      if (name.isBlank() || email.isBlank() || message.isBlank()) {
        Json.err(res, 400, "Veuillez remplir tous les champs obligatoires.");
        return;
      }

      // Dans un projet réel, on insèrerait cela dans la DB ou on enverrait un email.
      // Pour IGA Learning, on retourne simplement un succès.
      Json.send(res, 201, Map.of("success", true, "message", "Message reçu avec succès."));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }
}
