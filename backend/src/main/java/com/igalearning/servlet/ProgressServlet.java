package com.igalearning.servlet;

import com.igalearning.config.Db;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/api/progress/*")
public class ProgressServlet extends HttpServlet {
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    String userId = req.getParameter("userId");
    String courseId = req.getParameter("courseId");
    if (userId == null || courseId == null) { Json.err(res, 400, "userId et courseId sont requis"); return; }
    try (Connection c = Db.getConnection(); PreparedStatement ps = c.prepareStatement("SELECT * FROM course_progress WHERE user_id=? AND course_id=? ORDER BY updated_at DESC LIMIT 1")) {
      ps.setInt(1, Integer.parseInt(userId)); ps.setInt(2, Integer.parseInt(courseId));
      try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
          Map<String,Object> m = new LinkedHashMap<>();
          ResultSetMetaData md = rs.getMetaData();
          for (int i=1;i<=md.getColumnCount();i++) m.put(md.getColumnLabel(i), rs.getObject(i));
          Json.ok(res, m); return;
        }
      }
      Json.ok(res, Map.of("last_position", 0, "watched_seconds", 0, "completed", false));
    } catch (Exception e) { Json.err(res, 500, e.getMessage()); }
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException { upsert(req, res); }
  protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException { upsert(req, res); }

  private void upsert(HttpServletRequest req, HttpServletResponse res) throws IOException {
    try {
      Map<String,Object> b = Json.body(req);
      int userId = asInt(b.get("userId")); int courseId = asInt(b.get("courseId")); int lessonId = asInt(b.get("lessonId"));
      int last = asInt(b.getOrDefault("lastPosition", b.get("last_position"))); int watched = asInt(b.getOrDefault("watchedSeconds", b.get("watched_seconds")));
      boolean completed = Boolean.parseBoolean(String.valueOf(b.getOrDefault("completed", false)));
      try (Connection c = Db.getConnection(); PreparedStatement ps = c.prepareStatement("INSERT INTO course_progress(user_id,course_id,lesson_id,last_position,watched_seconds,completed,updated_at) VALUES(?,?,?,?,?,?,NOW()) ON DUPLICATE KEY UPDATE lesson_id=VALUES(lesson_id), last_position=VALUES(last_position), watched_seconds=GREATEST(watched_seconds,VALUES(watched_seconds)), completed=VALUES(completed), updated_at=NOW()")) {
        ps.setInt(1,userId); ps.setInt(2,courseId); ps.setInt(3,lessonId); ps.setInt(4,last); ps.setInt(5,watched); ps.setBoolean(6,completed); ps.executeUpdate();
      }
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) { Json.err(res, 500, e.getMessage()); }
  }
  private int asInt(Object o) { if (o == null) return 0; return (int) Double.parseDouble(String.valueOf(o)); }
}
