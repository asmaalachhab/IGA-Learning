package com.igalearning.servlet;

import com.igalearning.dao.GradeDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebServlet("/api/grades/*")
public class GradeServlet extends HttpServlet {

  private final GradeDao dao = new GradeDao();

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if (path != null && path.startsWith("/teacher/")) {
        int teacherId = Integer.parseInt(path.substring(9));
        Json.ok(res, dao.findByTeacher(teacherId));
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
      Map<String, Object> b = Json.body(req);
      int id = dao.create(b);
      Json.send(res, 201, Map.of("success", true, "id", id));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPut(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      int id = Integer.parseInt(req.getPathInfo().substring(1));
      dao.update(id, Json.body(req));
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doDelete(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      int id = Integer.parseInt(req.getPathInfo().substring(1));
      dao.delete(id);
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }
}
