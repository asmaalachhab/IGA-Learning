package com.igalearning.servlet;

import com.igalearning.dao.ResultDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/api/results/*")
public class ResultServlet extends HttpServlet {

  private final ResultDao dao = new ResultDao();

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if (path != null && path.startsWith("/student/")) {
        int userId = Integer.parseInt(path.substring(9));
        Json.ok(res, dao.getResultsByStudent(userId));
      } else {
        Json.err(res, 404, "Endpoint introuvable");
      }
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }
}
