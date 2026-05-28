package com.igalearning.dao;

import java.sql.*;
import java.util.*;

public class BaseDao {

  protected Map<String, Object> map(ResultSet rs) throws SQLException {
    Map<String, Object> m = new LinkedHashMap<>();
    ResultSetMetaData md = rs.getMetaData();
    for (int i = 1; i <= md.getColumnCount(); i++) m.put(
      md.getColumnLabel(i),
      rs.getObject(i)
    );
    return m;
  }

  protected List<Map<String, Object>> list(ResultSet rs) throws SQLException {
    List<Map<String, Object>> l = new ArrayList<>();
    while (rs.next()) l.add(map(rs));
    return l;
  }
}
