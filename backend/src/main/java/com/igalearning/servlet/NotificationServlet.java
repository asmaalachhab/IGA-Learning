package com.igalearning.servlet;

import com.igalearning.config.Db;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.*;

@WebServlet("/api/notifications/*")
public class NotificationServlet extends HttpServlet {
  protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
    try (Connection c = Db.getConnection(); PreparedStatement ps = c.prepareStatement("SELECT * FROM notifications WHERE user_id=? OR user_id IS NULL ORDER BY created_at DESC LIMIT 20")) {
      ps.setInt(1, Integer.parseInt(req.getParameter("userId")));
      try (ResultSet rs = ps.executeQuery()) { Json.ok(res, list(rs)); }
    } catch (Exception e) { Json.err(res, 500, e.getMessage()); }
  }
  private List<Map<String,Object>> list(ResultSet rs) throws SQLException { List<Map<String,Object>> l=new ArrayList<>(); ResultSetMetaData md=rs.getMetaData(); while(rs.next()){Map<String,Object> m=new LinkedHashMap<>(); for(int i=1;i<=md.getColumnCount();i++)m.put(md.getColumnLabel(i),rs.getObject(i)); l.add(m);} return l; }
}
