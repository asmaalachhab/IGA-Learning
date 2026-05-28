package com.igalearning.servlet;

import com.igalearning.config.Db;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/api/favorites/*")
public class FavoriteServlet extends HttpServlet {
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    try (Connection c = Db.getConnection(); PreparedStatement ps = c.prepareStatement("SELECT f.*, c.title, c.description, c.image, cat.name AS category " +
        "FROM favorites f " +
        "JOIN courses c ON c.id=f.course_id " +
        "LEFT JOIN categories cat ON cat.id=c.category_id " +
        "WHERE f.user_id=? " +
        "ORDER BY f.created_at DESC")) {
      ps.setInt(1, Integer.parseInt(req.getParameter("userId")));
      try (ResultSet rs = ps.executeQuery()) { Json.ok(res, list(rs)); }
    } catch (Exception e) { Json.err(res, 500, e.getMessage()); }
  }
  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
    try {
      Map<String,Object> b = Json.body(req); int userId = asInt(b.get("userId")); int courseId = asInt(b.get("courseId"));
      try (Connection c = Db.getConnection()) {
        try (PreparedStatement del = c.prepareStatement("DELETE FROM favorites WHERE user_id=? AND course_id=?")) { del.setInt(1,userId); del.setInt(2,courseId); if (del.executeUpdate() > 0) { Json.ok(res, Map.of("success", true, "favorite", false)); return; } }
        try (PreparedStatement ins = c.prepareStatement("INSERT INTO favorites(user_id,course_id,created_at) VALUES(?,?,NOW())")) { ins.setInt(1,userId); ins.setInt(2,courseId); ins.executeUpdate(); }
      }
      Json.ok(res, Map.of("success", true, "favorite", true));
    } catch (Exception e) { Json.err(res, 500, e.getMessage()); }
  }
  private int asInt(Object o) { return (int) Double.parseDouble(String.valueOf(o)); }
  private List<Map<String,Object>> list(ResultSet rs) throws SQLException { List<Map<String,Object>> l=new ArrayList<>(); ResultSetMetaData md=rs.getMetaData(); while(rs.next()){Map<String,Object> m=new LinkedHashMap<>(); for(int i=1;i<=md.getColumnCount();i++)m.put(md.getColumnLabel(i),rs.getObject(i)); l.add(m);} return l; }
}
