package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class CategoryDao extends BaseDao {

  public List<Map<String, Object>> all() throws SQLException {
    try (
      Connection c = Db.getConnection();
      PreparedStatement ps = c.prepareStatement(
        "SELECT * FROM categories ORDER BY name"
      )
    ) {
      return list(ps.executeQuery());
    }
  }
}
