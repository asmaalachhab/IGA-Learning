package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class ResultDao extends BaseDao {

  public int saveResult(int userId, int quizId, int score, boolean passed)
    throws SQLException {
    String sql =
      "INSERT INTO quiz_results(user_id, quiz_id, score, passed) VALUES(?,?,?,?)";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        sql,
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      ps.setInt(1, userId);
      ps.setInt(2, quizId);
      ps.setInt(3, score);
      ps.setBoolean(4, passed);
      ps.executeUpdate();
      ResultSet keys = ps.getGeneratedKeys();
      keys.next();
      return keys.getInt(1);
    }
  }

  public List<Map<String, Object>> getResultsByStudent(int userId)
    throws SQLException {
    String sql =
      "SELECT r.*, q.title quiz_title, c.title course_title, c.id course_id FROM quiz_results r " +
      "JOIN quizzes q ON r.quiz_id = q.id " +
      "JOIN courses c ON q.course_id = c.id " +
      "WHERE r.user_id = ? ORDER BY r.created_at DESC";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(sql)
    ) {
      ps.setInt(1, userId);
      return list(ps.executeQuery());
    }
  }
}
