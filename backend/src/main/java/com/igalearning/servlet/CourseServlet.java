package com.igalearning.servlet;

import com.igalearning.dao.CourseDao;
import com.igalearning.config.Db;
import java.sql.*;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.*;

@WebServlet("/api/courses/*")
public class CourseServlet extends HttpServlet {

  CourseDao dao = new CourseDao();

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String p = req.getPathInfo();
      if (p == null || "/".equals(p)) {
        String t = req.getParameter("teacher_id");
        if (t != null && !t.isBlank()) {
          Json.ok(res, dao.findByTeacher(Integer.parseInt(t)));
          return;
        }
        Json.ok(
          res,
          dao.all(req.getParameter("q"), req.getParameter("category"))
        );
        return;
      }
      String[] parts = p.substring(1).split("/");
      int id = Integer.parseInt(parts[0]);
      if (parts.length > 1 && "reviews".equals(parts[1])) {
        Json.ok(res, reviews(id));
        return;
      }
      Map<String, Object> c = dao.find(id);
      if (c == null) {
        Json.err(res, 404, "Cours introuvable");
        return;
      }
      c.put("lessons", dao.lessons(id));
      Json.ok(res, c);
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String p = req.getPathInfo();
      if (p != null && p.contains("/reviews")) {
        String[] parts = p.substring(1).split("/");
        int courseId = Integer.parseInt(parts[0]);
        Map<String,Object> b = Json.body(req);
        try (Connection cn = Db.getConnection(); PreparedStatement ps = cn.prepareStatement("INSERT INTO course_reviews(course_id,user_id,rating,comment,created_at) VALUES(?,?,?,?,NOW())")) {
          ps.setInt(1, courseId);
          ps.setInt(2, toInt(b.get("userId")));
          ps.setInt(3, toInt(b.get("rating")));
          ps.setString(4, String.valueOf(b.getOrDefault("comment", "")));
          ps.executeUpdate();
        }
        Json.ok(res, Map.of("success", true));
        return;
      }
      int id = dao.create(Json.body(req));
      Json.send(res, 201, Map.of("success", true, "id", id));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPut(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String pathInfo = req.getPathInfo();
      if (pathInfo == null || pathInfo.length() <= 1) {
        Json.err(res, 400, "ID du cours manquant dans l'URL");
        return;
      }
      int id = Integer.parseInt(pathInfo.substring(1));
      Map<String, Object> b = Json.body(req);
      Object tidObj = b.get("teacher_id");
      if (tidObj == null) tidObj = b.get("teacherId");
      int teacherId = -1;
      if (tidObj != null && !String.valueOf(tidObj).isBlank()) {
        try {
          teacherId = Integer.parseInt(String.valueOf(tidObj));
        } catch (Exception ex) {}
      }
      if (teacherId <= 0) {
        Map<String, Object> existing = dao.find(id);
        if (existing != null && existing.get("teacher_id") != null) {
          teacherId = Integer.parseInt(
            String.valueOf(existing.get("teacher_id"))
          );
        }

      }
      if (teacherId > 0) {
        com.igalearning.dao.UserDao userDao = new com.igalearning.dao.UserDao();
        Map<String, Object> u = userDao.findPublic(teacherId);
        if (u == null) {
          Json.err(
            res,
            400,
            "Professeur (teacher_id) invalide ou introuvable."
          );
          return;
        }
        b.put("teacherId", teacherId);
      } else {
        Json.err(res, 400, "Veuillez sélectionner un professeur valide.");
        return;
      }
      dao.update(id, b);
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
        Json.err(res, 400, "ID du cours manquant dans l'URL");
        return;
      }
      int id = Integer.parseInt(pathInfo.substring(1));
      dao.delete(id);
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  private int toInt(Object o) {
    if (o == null) return 0;
    return (int) Double.parseDouble(String.valueOf(o));
  }

  private List<Map<String, Object>> reviews(int courseId) throws SQLException {
    try (Connection cn = Db.getConnection(); PreparedStatement ps = cn.prepareStatement("SELECT r.*, u.name AS student_name FROM course_reviews r LEFT JOIN users u ON u.id=r.user_id WHERE r.course_id=? ORDER BY r.created_at DESC")) {
      ps.setInt(1, courseId);
      try (ResultSet rs = ps.executeQuery()) {
        List<Map<String, Object>> out = new ArrayList<>();
        ResultSetMetaData md = rs.getMetaData();
        while (rs.next()) {
          Map<String, Object> m = new LinkedHashMap<>();
          for (int i = 1; i <= md.getColumnCount(); i++) m.put(md.getColumnLabel(i), rs.getObject(i));
          out.add(m);
        }
        return out;
      }
    }
  }
}
