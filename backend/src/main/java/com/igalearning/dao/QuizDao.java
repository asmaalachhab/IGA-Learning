package com.igalearning.dao;

import com.igalearning.config.Db;
import java.sql.*;
import java.util.*;

public class QuizDao extends BaseDao {

  public List<Map<String, Object>> findAll() throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement("SELECT * FROM quizzes")
    ) {
      List<Map<String, Object>> quizzes = list(ps.executeQuery());
      for (Map<String, Object> q : quizzes) {
        q.put("questions", getQuestions(number(q.get("id")).intValue()));
      }
      return quizzes;
    }
  }

  public List<Map<String, Object>> findByCourse(int courseId)
    throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT * FROM quizzes WHERE course_id=?"
      )
    ) {
      ps.setInt(1, courseId);
      List<Map<String, Object>> quizzes = list(ps.executeQuery());
      for (Map<String, Object> q : quizzes) {
        q.put("questions", getQuestions(number(q.get("id")).intValue()));
      }
      return quizzes;
    }
  }

  public void updateQuiz(int id, Map<String, Object> b) throws SQLException {
    String sql = "UPDATE quizzes SET title=?, passing_score=? WHERE id=?";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(sql)
    ) {
      ps.setString(1, String.valueOf(b.get("title")));
      ps.setInt(2, number(b.getOrDefault("passingScore", 70)).intValue());
      ps.setInt(3, id);
      ps.executeUpdate();
    }
  }

  public void deleteQuiz(int id) throws SQLException {
    String sql = "DELETE FROM quizzes WHERE id=?";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(sql)
    ) {
      ps.setInt(1, id);
      ps.executeUpdate();
    }
  }

  private List<Map<String, Object>> getQuestions(int quizId)
    throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT * FROM questions WHERE quiz_id=?"
      )
    ) {
      ps.setInt(1, quizId);
      List<Map<String, Object>> questions = list(ps.executeQuery());
      for (Map<String, Object> q : questions) {
        q.put("answers", getAnswers(number(q.get("id")).intValue()));
      }
      return questions;
    }
  }

  private List<Map<String, Object>> getAnswers(int questionId)
    throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT id, question_id, answer_text, is_correct FROM answers WHERE question_id=?"
      )
    ) {
      ps.setInt(1, questionId);
      return list(ps.executeQuery());
    }
  }

  public int createQuiz(Map<String, Object> b) throws SQLException {
    String sql =
      "INSERT INTO quizzes(course_id, title, passing_score) VALUES(?,?,?)";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        sql,
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      ps.setInt(1, number(b.get("courseId")).intValue());
      ps.setString(2, String.valueOf(b.get("title")));
      ps.setInt(3, number(b.getOrDefault("passingScore", 70)).intValue());
      ps.executeUpdate();
      ResultSet keys = ps.getGeneratedKeys();
      keys.next();
      return keys.getInt(1);
    }
  }

  public int createQuestion(Map<String, Object> b) throws SQLException {
    String sql = "INSERT INTO questions(quiz_id, question) VALUES(?,?)";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        sql,
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      ps.setInt(1, number(b.get("quizId")).intValue());
      ps.setString(2, String.valueOf(b.get("question")));
      ps.executeUpdate();
      ResultSet keys = ps.getGeneratedKeys();
      keys.next();
      return keys.getInt(1);
    }
  }

  public int createAnswer(Map<String, Object> b) throws SQLException {
    String sql =
      "INSERT INTO answers(question_id, answer_text, is_correct) VALUES(?,?,?)";
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        sql,
        Statement.RETURN_GENERATED_KEYS
      )
    ) {
      ps.setInt(1, number(b.get("questionId")).intValue());
      ps.setString(2, String.valueOf(b.get("answerText")));
      ps.setBoolean(
        3,
        Boolean.parseBoolean(String.valueOf(b.getOrDefault("isCorrect", false)))
      );
      ps.executeUpdate();
      ResultSet keys = ps.getGeneratedKeys();
      keys.next();
      return keys.getInt(1);
    }
  }

  public Map<String, Object> getAnswer(int answerId) throws SQLException {
    try (
      Connection cn = Db.getConnection();
      PreparedStatement ps = cn.prepareStatement(
        "SELECT * FROM answers WHERE id=?"
      )
    ) {
      ps.setInt(1, answerId);
      ResultSet rs = ps.executeQuery();
      return rs.next() ? map(rs) : null;
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
