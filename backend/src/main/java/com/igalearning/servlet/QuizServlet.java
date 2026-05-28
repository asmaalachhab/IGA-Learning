package com.igalearning.servlet;

import com.igalearning.dao.QuizDao;
import com.igalearning.dao.ResultDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/api/quizzes/*")
public class QuizServlet extends HttpServlet {

  private final QuizDao dao = new QuizDao();
  private final ResultDao resultDao = new ResultDao();

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      if (path != null && path.startsWith("/course/")) {
        int courseId = Integer.parseInt(path.substring(8));
        Json.ok(res, dao.findByCourse(courseId));
      } else if (path == null || path.equals("/") || path.isEmpty()) {
        Json.ok(res, dao.findAll());
      } else {
        Json.err(res, 404, "Endpoint introuvable");
      }
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPost(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String path = req.getPathInfo();
      Map<String, Object> b = Json.body(req);

      if ("/submit".equals(path)) {
        int userId = number(b.get("userId")).intValue();
        int quizId = number(b.get("quizId")).intValue();
        List<Map<String, Object>> answers = (List<Map<String, Object>>) b.get(
          "answers"
        );

        int score = 0;
        int total = answers != null ? answers.size() : 0;
        if (answers != null) {
          for (Map<String, Object> ans : answers) {
            int answerId = number(ans.get("answerId")).intValue();
            Map<String, Object> dbAns = dao.getAnswer(answerId);
            if (dbAns != null && Boolean.TRUE.equals(dbAns.get("is_correct"))) {
              score++;
            }
          }
        }

        int percentage = total > 0 ? ((score * 100) / total) : 0;
        boolean passed = percentage >= 70; // 70% passing score

        resultDao.saveResult(userId, quizId, percentage, passed);
        Json.ok(
          res,
          Map.of("success", true, "score", percentage, "passed", passed)
        );
        return;
      }

      // Create quiz
      int quizId = dao.createQuiz(b);
      // also create questions
      List<Map<String, Object>> questions = (List<Map<String, Object>>) b.get(
        "questions"
      );
      if (questions != null) {
        for (Map<String, Object> q : questions) {
          q.put("quizId", quizId);
          int questionId = dao.createQuestion(q);
          List<Map<String, Object>> answers = (List<Map<String, Object>>) q.get(
            "answers"
          );
          if (answers != null) {
            for (Map<String, Object> a : answers) {
              a.put("questionId", questionId);
              dao.createAnswer(a);
            }
          }
        }
      }
      Json.send(res, 201, Map.of("success", true, "id", quizId));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doPut(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String pathInfo = req.getPathInfo();
      if (pathInfo == null || pathInfo.length() <= 1) {
        Json.err(res, 400, "ID du quiz manquant dans l'URL");
        return;
      }
      int id = Integer.parseInt(pathInfo.substring(1));
      dao.updateQuiz(id, Json.body(req));
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }

  protected void doDelete(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      String pathInfo = req.getPathInfo();
      if (pathInfo == null || pathInfo.length() <= 1) {
        Json.err(res, 400, "ID du quiz manquant dans l'URL");
        return;
      }
      int id = Integer.parseInt(pathInfo.substring(1));
      dao.deleteQuiz(id);
      Json.ok(res, Map.of("success", true));
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
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
