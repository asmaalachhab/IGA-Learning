package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class EnrollmentDao extends BaseDao {

  public boolean enroll(int userId, int courseId) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "INSERT IGNORE INTO enrollments(student_id,course_id) VALUES(?,?)"
      )
    ) {
      ps.setInt(1, userId);
      ps.setInt(2, courseId);
      return ps.executeUpdate() > 0;
    } catch (Exception e) {
      try (
        Connection c = Db.getConnection();
        PreparedStatement ps = c.prepareStatement(
          "INSERT IGNORE INTO enrollments(user_id,course_id,status) VALUES(?,?,'ACTIVE')"
        )
      ) {
        ps.setInt(1, userId);
        ps.setInt(2, courseId);
        return ps.executeUpdate() > 0;
      }
    }
  }

  public List<Map<String, Object>> byUser(int userId) throws SQLException {
    String sql =
      "SELECT e.*, c.title, c.image, c.level, c.duration, c.rating, cat.name category_name, " +
      "ROUND(100 * SUM(CASE WHEN p.completed=1 THEN 1 ELSE 0 END) / GREATEST(COUNT(l.id),1)) AS progress_percent " +
      "FROM enrollments e JOIN courses c ON c.id=e.course_id LEFT JOIN categories cat ON cat.id=c.category_id " +
      "LEFT JOIN lessons l ON l.course_id=c.id LEFT JOIN progress p ON p.lesson_id=l.id AND p.user_id=COALESCE(e.student_id, e.user_id) " +
      "WHERE COALESCE(e.student_id, e.user_id)=? GROUP BY e.id,c.id ORDER BY COALESCE(e.created_at, e.enrolled_at) DESC";
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(sql)
    ) {
      ps.setInt(1, userId);
      return list(ps.executeQuery());
    } catch (Exception ex) {
      // Fallback for older schema if it exists
      String sql2 =
        "SELECT e.*, c.title, c.image, c.level, c.duration, c.rating, cat.name category_name, " +
        "ROUND(100 * SUM(CASE WHEN p.completed=1 THEN 1 ELSE 0 END) / GREATEST(COUNT(l.id),1)) AS progress_percent " +
        "FROM enrollments e JOIN courses c ON c.id=e.course_id LEFT JOIN categories cat ON cat.id=c.category_id " +
        "LEFT JOIN lessons l ON l.course_id=c.id LEFT JOIN progress p ON p.lesson_id=l.id AND p.user_id=e.user_id " +
        "WHERE e.user_id=? GROUP BY e.id,c.id ORDER BY e.enrolled_at DESC";
      try (
        Connection c = Db.getConnection();
        PreparedStatement ps = c.prepareStatement(sql2)
      ) {
        ps.setInt(1, userId);
        return list(ps.executeQuery());
      }
    }
  }

  public void progress(
    int userId,
    int courseId,
    int lessonId,
    boolean completed
  ) throws SQLException {
    String sql =
      "INSERT INTO progress(user_id,course_id,lesson_id,completed,completed_at) VALUES(?,?,?,?,IF(?,NOW(),NULL)) " +
      "ON DUPLICATE KEY UPDATE completed=VALUES(completed), completed_at=IF(VALUES(completed)=1,NOW(),NULL)";
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(sql)
    ) {
      ps.setInt(1, userId);
      ps.setInt(2, courseId);
      ps.setInt(3, lessonId);
      ps.setBoolean(4, completed);
      ps.setBoolean(5, completed);
      ps.executeUpdate();
    }
  }

  public Map<String, Object> stats(int userId) throws SQLException {
    String sql =
      "SELECT COUNT(DISTINCT e.course_id) total_courses, " +
      "COUNT(DISTINCT CASE WHEN e.status='COMPLETED' THEN e.course_id END) completed_courses, " +
      "COUNT(DISTINCT ce.id) certificates_count, " +
      "COALESCE(ROUND(AVG(x.pct)),0) avg_progress " +
      "FROM enrollments e " +
      "LEFT JOIN certificates ce ON ce.user_id=COALESCE(e.student_id, e.user_id) AND ce.course_id=e.course_id " +
      "LEFT JOIN (SELECT e2.id eid, 100*SUM(CASE WHEN p.completed=1 THEN 1 ELSE 0 END)/GREATEST(COUNT(l.id),1) pct FROM enrollments e2 JOIN lessons l ON l.course_id=e2.course_id LEFT JOIN progress p ON p.lesson_id=l.id AND p.user_id=COALESCE(e2.student_id, e2.user_id) WHERE COALESCE(e2.student_id, e2.user_id)=? GROUP BY e2.id) x ON x.eid=e.id " +
      "WHERE COALESCE(e.student_id, e.user_id)=?";
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(sql)
    ) {
      ps.setInt(1, userId);
      ps.setInt(2, userId);
      ResultSet rs = ps.executeQuery();
      return rs.next() ? map(rs) : Map.of();
    } catch (Exception ex) {
      // Fallback
      return Map.of(
        "total_courses",
        0,
        "completed_courses",
        0,
        "certificates_count",
        0,
        "avg_progress",
        0
      );
    }
  }
}
