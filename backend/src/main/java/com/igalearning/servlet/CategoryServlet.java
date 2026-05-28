package com.igalearning.servlet;

import com.igalearning.dao.CategoryDao;
import com.igalearning.util.Json;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.*;

@WebServlet("/api/categories")
public class CategoryServlet extends HttpServlet {

  protected void doGet(HttpServletRequest req, HttpServletResponse res)
    throws IOException {
    try {
      Json.ok(res, new CategoryDao().all());
    } catch (Exception e) {
      Json.err(res, 500, e.getMessage());
    }
  }
}
