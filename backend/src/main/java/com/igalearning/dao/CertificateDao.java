package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class CertificateDao extends BaseDao {

  public Map<String, Object> generateCertificate(
    int userId,
    int courseId,
    String studentName,
    String courseName,
    int score
  ) throws SQLException {
    String code = UUID.randomUUID().toString().substring(0, 13).toUpperCase();
    String sql =
      "INSERT INTO certificates(user_id, course_id, student_name, course_name, issue_date, score, verification_code) VALUES(?,?,?,?,CURDATE(),?,?)";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        sql,
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      ps.setInt(1, userId);
      ps.setInt(2, courseId);
      ps.setString(3, studentName);
      ps.setString(4, courseName);
      ps.setInt(5, score);
      ps.setString(6, code);
      ps.executeUpdate();
      ResultSet keys = ps.getGeneratedKeys();
      keys.next();
      return find(keys.getInt(1));
    }
  }

  public List<Map<String, Object>> getCertificatesByStudent(int userId)
    throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT * FROM certificates WHERE user_id=? ORDER BY issue_date DESC"
      )
    ) {
      ps.setInt(1, userId);
      return list(ps.executeQuery());
    }
  }

  public Map<String, Object> find(int id) throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT * FROM certificates WHERE id=?"
      )
    ) {
      ps.setInt(1, id);
      ResultSet rs = ps.executeQuery();
      return rs.next() ? map(rs) : null;
    }
  }
}
