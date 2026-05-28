package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class CourseDao extends BaseDao {

  public List<Map<String, Object>> all(String q, String category)
    throws SQLException {
    String sql =
      "SELECT c.*, cat.name category_name FROM courses c LEFT JOIN categories cat ON cat.id=c.category_id WHERE 1=1";
    List<Object> params = new ArrayList<>();
    if (q != null && !q.isBlank()) {
      sql += " AND (c.title LIKE ? OR c.description LIKE ?)";
      params.add("%" + q + "%");
      params.add("%" + q + "%");
    }
    if (category != null && !category.isBlank()) {
      sql += " AND (cat.name LIKE ? OR c.category_id=?)";
      params.add("%" + category + "%");
      try {
        params.add(Integer.parseInt(category));
      } catch (Exception e) {
        params.add(-1);
      }
    }
    sql += " ORDER BY c.id ASC";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(sql)
    ) {
      for (int i = 0; i < params.size(); i++) ps.setObject(
        i + 1,
        params.get(i)
      );
      return list(ps.executeQuery());
    }
  }

  public Map<String, Object> find(int id) throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT c.*, cat.name category_name FROM courses c LEFT JOIN categories cat ON cat.id=c.category_id WHERE c.id=?"
      )
    ) {
      ps.setInt(1, id);
      ResultSet rs = ps.executeQuery();
      return rs.next() ? map(rs) : null;
    }
  }

  public List<Map<String, Object>> lessons(int courseId) throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT * FROM lessons WHERE course_id=? ORDER BY ordre"
      )
    ) {
      ps.setInt(1, courseId);
      return list(ps.executeQuery());
    }
  }

  public List<Map<String, Object>> findByTeacher(int teacherId)
    throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT c.*, cat.name category_name FROM courses c LEFT JOIN categories cat ON cat.id=c.category_id WHERE c.teacher_id=? ORDER BY c.id ASC"
      )
    ) {
      ps.setInt(1, teacherId);
      return list(ps.executeQuery());
    }
  }

  public int create(Map<String, Object> b) throws SQLException {
    String sql =
      "INSERT INTO courses(title,description,objectives,prerequisites,category_id,teacher_id,level,duration,image,rating,students_count) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        sql,
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      ps.setString(1, String.valueOf(b.getOrDefault("title", "Nouveau cours")));
      ps.setString(2, String.valueOf(b.getOrDefault("description", "")));
      ps.setString(
        3,
        String.valueOf(
          b.getOrDefault(
            "objectives",
            "Comprendre; pratiquer; projet; QCM; certificat"
          )
        )
      );
      ps.setString(
        4,
        String.valueOf(
          b.getOrDefault("prerequisites", "Ordinateur; bases; motivation")
        )
      );
      ps.setInt(5, number(b.getOrDefault("categoryId", 1)).intValue());
      ps.setInt(6, number(b.getOrDefault("teacherId", null)).intValue());
      ps.setString(7, String.valueOf(b.getOrDefault("level", "Debutant")));
      ps.setString(8, String.valueOf(b.getOrDefault("duration", "0h")));
      ps.setString(9, String.valueOf(b.getOrDefault("image", "")));
      ps.setDouble(10, number(b.getOrDefault("rating", 0)).doubleValue());
      ps.setInt(11, number(b.getOrDefault("studentsCount", 0)).intValue());
      ps.executeUpdate();
      ResultSet keys = ps.getGeneratedKeys();
      keys.next();
      return keys.getInt(1);
    }
  }

  public void update(int id, Map<String, Object> b) throws SQLException {
    String sql =
      "UPDATE courses SET title=?,description=?,objectives=?,prerequisites=?,category_id=?,teacher_id=?,level=?,duration=?,image=?,rating=?,students_count=? WHERE id=?";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(sql)
    ) {
      ps.setString(1, String.valueOf(b.getOrDefault("title", "Cours")));
      ps.setString(2, String.valueOf(b.getOrDefault("description", "")));
      ps.setString(
        3,
        String.valueOf(
          b.getOrDefault(
            "objectives",
            "Comprendre; pratiquer; projet; QCM; certificat"
          )
        )
      );
      ps.setString(
        4,
        String.valueOf(
          b.getOrDefault("prerequisites", "Ordinateur; bases; motivation")
        )
      );
      ps.setInt(5, number(b.getOrDefault("categoryId", 1)).intValue());
      ps.setInt(6, number(b.getOrDefault("teacherId", null)).intValue());
      ps.setString(7, String.valueOf(b.getOrDefault("level", "Debutant")));
      ps.setString(8, String.valueOf(b.getOrDefault("duration", "0h")));
      ps.setString(9, String.valueOf(b.getOrDefault("image", "")));
      ps.setDouble(10, number(b.getOrDefault("rating", 0)).doubleValue());
      ps.setInt(11, number(b.getOrDefault("studentsCount", 0)).intValue());
      ps.setInt(12, id);
      ps.executeUpdate();
    }
  }

  public void delete(int id) throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "DELETE FROM courses WHERE id=?"
      )
    ) {
      ps.setInt(1, id);
      ps.executeUpdate();
    }
  }

  private Number number(Object o) {
    if (o instanceof Number) return (Number) o;
    try {
      return Double.parseDouble(String.valueOf(o));
    } catch (Exception e) {
      return 0;
    }
  }
}
