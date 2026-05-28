package com.igalearning.util;

import com.google.gson.*;
import jakarta.servlet.http.*;
import java.io.*;
import java.util.*;

public class Json {

  public static final Gson gson = new GsonBuilder()
    .setDateFormat("yyyy-MM-dd HH:mm:ss")
    .create();

  public static Map<String, Object> body(HttpServletRequest req)
    throws IOException {
    try (BufferedReader br = req.getReader()) {
      Map m = gson.fromJson(br, Map.class);
      return m == null ? new HashMap<>() : m;
    }
  }

  public static void send(HttpServletResponse res, int status, Object data)
    throws IOException {
    res.setStatus(status);
    res.setContentType("application/json;charset=UTF-8");
    res.getWriter().write(gson.toJson(data));
  }

  public static void ok(HttpServletResponse res, Object data)
    throws IOException {
    send(res, 200, data);
  }

  public static void err(HttpServletResponse res, int s, String m)
    throws IOException {
    send(res, s, Map.of("success", false, "message", m));
  }
}
