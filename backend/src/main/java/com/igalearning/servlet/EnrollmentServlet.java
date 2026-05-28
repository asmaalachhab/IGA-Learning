package com.igalearning.servlet;

import com.igalearning.dao.EnrollmentDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.*;

@WebServlet(
  urlPatterns = { "/api/enrollments", "/api/progress", "/api/dashboard" }
)
public class EnrollmentServlet extends HttpServlet {

  private final EnrollmentDao dao = new EnrollmentDao();

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      int userId = Integer.parseInt(req.getParameter("userId"));
      if (req.getServletPath().equals("/api/dashboard")) {
        Json.ok(
          res,
          Map.of("stats", dao.stats(userId), "courses", dao.byUser(userId))
        );
      } else {
        Json.ok(res, dao.byUser(userId));
      }
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      Map<String, Object> b = Json.body(req);
      if (req.getServletPath().equals("/api/enrollments")) {
        int studentId = 0;
        int courseId = 0;

        if (b.containsKey("student_id")) studentId = (
          (Number) b.get("student_id")
        ).intValue();
        else if (b.containsKey("userId")) studentId = (
          (Number) b.get("userId")
        ).intValue();
        else if (b.containsKey("studentId")) studentId = (
          (Number) b.get("studentId")
        ).intValue();

        if (b.containsKey("course_id")) courseId = (
          (Number) b.get("course_id")
        ).intValue();
        else if (b.containsKey("courseId")) courseId = (
          (Number) b.get("courseId")
        ).intValue();

        if (studentId == 0 || courseId == 0) {
          Json.err(res, 400, "student_id et course_id sont requis");
          return;
        }

        boolean success = dao.enroll(studentId, courseId);
        if (success) {
          Json.ok(
            res,
            Map.of("message", "Inscription réussie", "success", true)
          );
        } else {
          Json.err(res, 400, "Vous êtes déjà inscrit à ce cours.");
        }
      } else if (req.getServletPath().equals("/api/progress")) {
        int userId = ((Number) b.get("userId")).intValue();
        int courseId = ((Number) b.get("courseId")).intValue();
        int lessonId = ((Number) b.get("lessonId")).intValue();
        boolean completed = Boolean.TRUE.equals(b.get("completed"));
        dao.progress(userId, courseId, lessonId, completed);
        Json.ok(res, Map.of("success", true));
      }
    } catch (java.sql.SQLIntegrityConstraintViolationException e) {
      Json.err(res, 400, "Vous êtes déjà inscrit à ce cours.");
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }
}
