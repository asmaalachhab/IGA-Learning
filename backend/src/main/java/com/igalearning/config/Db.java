package com.igalearning.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class Db {

  private static final HikariDataSource dataSource;

  static {
    try {
      Class.forName("com.mysql.cj.jdbc.Driver");

      HikariConfig config = new HikariConfig();
      String url = System.getenv().getOrDefault(
        "DB_URL",
        "jdbc:mysql://localhost:3306/iga_learning?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
      );
      String user = System.getenv().getOrDefault("DB_USER", "root");
      String pass = System.getenv().getOrDefault("DB_PASS", "root");

      config.setJdbcUrl(url);
      config.setUsername(user);
      config.setPassword(pass);

      // Optimizations recommandées pour MySQL
      config.addDataSourceProperty("cachePrepStmts", "true");
      config.addDataSourceProperty("prepStmtCacheSize", "250");
      config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
      config.addDataSourceProperty("useServerPrepStmts", "true");
      config.addDataSourceProperty("useLocalSessionState", "true");
      config.addDataSourceProperty("rewriteBatchedStatements", "true");
      config.addDataSourceProperty("cacheResultSetMetadata", "true");
      config.addDataSourceProperty("cacheServerConfiguration", "true");
      config.addDataSourceProperty("elideSetAutoCommits", "true");
      config.addDataSourceProperty("maintainTimeStats", "false");

      // Pool sizing
      config.setMaximumPoolSize(20);
      config.setMinimumIdle(5);
      config.setIdleTimeout(300000);
      config.setConnectionTimeout(20000);
      config.setMaxLifetime(1200000);

      dataSource = new HikariDataSource(config);
    } catch (Exception e) {
      throw new RuntimeException(
        "Erreur d'initialisation du pool de connexions HikariCP",
        e
      );
    }
  }

  private Db() {} // Prevent instantiation

  public static Connection getConnection() throws SQLException {
    return dataSource.getConnection();
  }
}
