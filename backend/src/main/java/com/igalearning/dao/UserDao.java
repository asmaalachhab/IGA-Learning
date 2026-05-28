package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class UserDao extends BaseDao {

  public Map<String, Object> findByEmail(String email) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "SELECT id,name,first_name AS firstName,last_name AS lastName,profile_image AS profileImage,phone,bio,email,role,password FROM users WHERE email=?"
      )
    ) {
      ps.setString(1, email);
      ResultSet rs = ps.executeQuery();
      return rs.next() ? map(rs) : null;
    }
  }

  public Map<String, Object> create(
    String name,
    String email,
    String hash,
    String role
  ) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "INSERT INTO users(name,first_name,last_name,email,password,role) VALUES(?,?,?,?,?,?)",
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      ps.setString(1, name);
      ps.setString(2, name.split(" ")[0]);
      ps.setString(
        3,
        name.contains(" ") ? name.substring(name.indexOf(" ") + 1) : ""
      );
      ps.setString(4, email);
      ps.setString(5, hash);
      ps.setString(6, role);
      ps.executeUpdate();
      ResultSet k = ps.getGeneratedKeys();
      k.next();
      return findPublic(k.getInt(1));
    }
  }

  public Map<String, Object> findPublic(int id) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "SELECT id,name,first_name AS firstName,last_name AS lastName,profile_image AS profileImage,phone,bio,email,role,created_at FROM users WHERE id=?"
      )
    ) {
      ps.setInt(1, id);
      ResultSet rs = ps.executeQuery();
      return rs.next() ? map(rs) : null;
    }
  }

  public List<Map<String, Object>> findAll() throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "SELECT id,name,first_name AS firstName,last_name AS lastName,profile_image AS profileImage,phone,bio,email,role,created_at FROM users ORDER BY id DESC"
      )
    ) {
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> l = new ArrayList<>();
      while (rs.next()) l.add(map(rs));
      return l;
    }
  }

  public List<Map<String, Object>> findByRole(String role) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "SELECT id,name,first_name AS firstName,last_name AS lastName,profile_image AS profileImage,phone,bio,email,role,created_at FROM users WHERE role=? ORDER BY id DESC"
      )
    ) {
      ps.setString(1, role);
      ResultSet rs = ps.executeQuery();
      List<Map<String, Object>> l = new ArrayList<>();
      while (rs.next()) l.add(map(rs));
      return l;
    }
  }

  public boolean update(int id, String name, String email, String role)
    throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "UPDATE users SET name=?, email=?, role=? WHERE id=?"
      )
    ) {
      ps.setString(1, name);
      ps.setString(2, email);
      ps.setString(3, role);
      ps.setInt(4, id);
      return ps.executeUpdate() > 0;
    }
  }

  public boolean delete(int id) throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement("DELETE FROM users WHERE id=?")
    ) {
      ps.setInt(1, id);
      return ps.executeUpdate() > 0;
    }
  }

  public boolean updateMe(
    int id,
    String firstName,
    String lastName,
    String email,
    String passwordHash,
    String profileImage,
    String phone,
    String bio
  ) throws SQLException {
    String name =
      (firstName != null ? firstName : "") +
      " " +
      (lastName != null ? lastName : "");
    name = name.trim();
    boolean hasPass = passwordHash != null && !passwordHash.isBlank();
    String sql =
      "UPDATE users SET first_name=?, last_name=?, name=?, email=?, profile_image=?, phone=?, bio=?" +
      (hasPass ? ", password=?" : "") +
      " WHERE id=?";
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(sql)
    ) {
      ps.setString(1, firstName);
      ps.setString(2, lastName);
      ps.setString(3, name);
      ps.setString(4, email);
      ps.setString(5, profileImage);
      ps.setString(6, phone);
      ps.setString(7, bio);
      int idx = 8;
      if (hasPass) ps.setString(idx++, passwordHash);
      ps.setInt(idx, id);
      return ps.executeUpdate() > 0;
    }
  }
}
