package com.igalearning.servlet;

import com.igalearning.config.Db;
import com.igalearning.dao.BaseDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@WebServlet("/api/teacher/*")
public class TeacherServlet extends HttpServlet {

  private final TeacherDao dao = new TeacherDao();

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if ("/students".equals(path)) {
        String teacherIdStr = req.getParameter("teacherId");
        if (teacherIdStr != null) {
          Json.ok(
            res,
            dao.getStudentsByTeacher(Integer.parseInt(teacherIdStr))
          );
        } else {
          Json.err(res, 400, "teacherId is required");
        }
      } else {
        Json.err(res, 404, "Endpoint introuvable");
      }
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  private static class TeacherDao extends BaseDao {

    public List<Map<String, Object>> getStudentsByTeacher(int teacherId)
      throws SQLException {
      try (
        Connection cn = Db.getConnection();
        PreparedStatement ps = cn.prepareStatement(
          "SELECT DISTINCT u.id, u.name, u.email, c.title as course_title " +
            "FROM users u " +
            "JOIN enrollments e ON u.id = e.user_id " +
            "JOIN courses c ON e.course_id = c.id " +
            "WHERE c.teacher_id = ? AND u.role = 'STUDENT' " +
            "ORDER BY u.name ASC"
        )
      ) {
        ps.setInt(1, teacherId);
        return list(ps.executeQuery());
      }
    }
  }
}
