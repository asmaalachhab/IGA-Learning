package com.igalearning.servlet;

import com.igalearning.config.Db;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/api/course-reviews/*")
public class ReviewServlet extends HttpServlet {
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    int courseId = courseId(req);
    try (Connection c = Db.getConnection(); PreparedStatement ps = c.prepareStatement("SELECT r.*, u.name AS student_name FROM course_reviews r LEFT JOIN users u ON u.id=r.user_id WHERE r.course_id=? ORDER BY r.created_at DESC")) {
      ps.setInt(1, courseId); try (ResultSet rs = ps.executeQuery()) { Json.ok(res, list(rs)); }
    } catch (Exception e) { Json.err(res, 500, e.getMessage()); }
  }
  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
    try {
      int courseId = courseId(req); Map<String,Object> b = Json.body(req);
      try (Connection c = Db.getConnection(); PreparedStatement ps = c.prepareStatement("INSERT INTO course_reviews(course_id,user_id,rating,comment,created_at) VALUES(?,?,?,?,NOW())")) {
        ps.setInt(1, courseId); ps.setInt(2, asInt(b.get("userId"))); ps.setInt(3, asInt(b.get("rating"))); ps.setString(4, String.valueOf(b.getOrDefault("comment", ""))); ps.executeUpdate();
      }
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) { Json.err(res, 500, e.getMessage()); }
  }
  private int courseId(HttpServletRequest req) {
    String servletPath = req.getServletPath();
    String pathInfo = req.getPathInfo();
    if (servletPath != null && servletPath.startsWith("/api/courses")) {
      // Mapping used by the React service: /api/courses/{id}/reviews
      String[] parts = pathInfo == null ? new String[0] : pathInfo.split("/");
      for (String part : parts) {
        if (part != null && part.matches("\\d+")) return Integer.parseInt(part);
      }
    }
    String[] p = pathInfo == null ? new String[0] : pathInfo.split("/");
    if (p.length > 1) return Integer.parseInt(p[1]);
    throw new IllegalArgumentException("courseId manquant dans l'URL");
  }
  private int asInt(Object o) { return (int) Double.parseDouble(String.valueOf(o)); }
  private List<Map<String,Object>> list(ResultSet rs) throws SQLException { List<Map<String,Object>> l=new ArrayList<>(); ResultSetMetaData md=rs.getMetaData(); while(rs.next()){Map<String,Object> m=new LinkedHashMap<>(); for(int i=1;i<=md.getColumnCount();i++)m.put(md.getColumnLabel(i),rs.getObject(i)); l.add(m);} return l; }
}
