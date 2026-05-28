package com.igalearning.servlet;

import com.igalearning.dao.CertificateDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet("/api/certificates/*")
public class CertificateServlet extends HttpServlet {

  private final CertificateDao dao = new CertificateDao();

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if (path != null && path.startsWith("/student/")) {
        int userId = Integer.parseInt(path.substring(9));
        Json.ok(res, dao.getCertificatesByStudent(userId));
      } else {
        Json.err(res, 404, "Endpoint introuvable");
      }
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if ("/generate".equals(path)) {
        Map<String, Object> b = Json.body(req);
        int userId = number(b.get("userId")).intValue();
        int courseId = number(b.get("courseId")).intValue();
        String studentName = String.valueOf(b.get("studentName"));
        String courseName = String.valueOf(b.get("courseName"));
        int score = number(b.get("score")).intValue();

        Map<String, Object> cert = dao.generateCertificate(
          userId,
          courseId,
          studentName,
          courseName,
          score
        );
        Json.send(res, 201, Map.of("success", true, "certificate", cert));
      } else {
        Json.err(res, 404, "Endpoint introuvable");
      }
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  private Number number(Object o) {
    if (o instanceof Number) return (Number) o;
    try {
      return Double.parseDouble(String.valueOf(o));
    } catch (Exception e) {
      return 0;
    }
  }
}
