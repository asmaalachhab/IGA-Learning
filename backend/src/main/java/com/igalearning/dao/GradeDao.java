package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class GradeDao extends BaseDao {

  public List<Map<String, Object>> findByTeacher(int teacherId)
    throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement p = c.prepareStatement(
        "SELECT g.*, s.name as student_name, cr.title as course_title " +
          "FROM grades g " +
          "JOIN users s ON g.student_id = s.id " +
          "JOIN courses cr ON g.course_id = cr.id " +
          "WHERE g.teacher_id = ? ORDER BY g.created_at DESC"
      )
    ) {
      p.setInt(1, teacherId);
      return list(p.executeQuery());
    }
  }

  public int create(Map<String, Object> data) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement p = c.prepareStatement(
        "INSERT INTO grades(student_id, course_id, teacher_id, grade, comments) VALUES (?, ?, ?, ?, ?)",
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      p.setInt(1, Integer.parseInt(String.valueOf(data.get("studentId"))));
      p.setInt(2, Integer.parseInt(String.valueOf(data.get("courseId"))));
      p.setInt(3, Integer.parseInt(String.valueOf(data.get("teacherId"))));
      p.setDouble(4, Double.parseDouble(String.valueOf(data.get("grade"))));
      p.setString(5, String.valueOf(data.get("comments")));
      p.executeUpdate();
      ResultSet rs = p.getGeneratedKeys();
      return rs.next() ? rs.getInt(1) : -1;
    }
  }

  public void update(int id, Map<String, Object> data) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement p = c.prepareStatement(
        "UPDATE grades SET grade = ?, comments = ? WHERE id = ?"
      )
    ) {
      p.setDouble(1, Double.parseDouble(String.valueOf(data.get("grade"))));
      p.setString(2, String.valueOf(data.get("comments")));
      p.setInt(3, id);
      p.executeUpdate();
    }
  }

  public void delete(int id) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement p = c.prepareStatement(
        "DELETE FROM grades WHERE id = ?"
      )
    ) {
      p.setInt(1, id);
      p.executeUpdate();
    }
  }
}
