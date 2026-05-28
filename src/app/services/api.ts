// Service API : React/Vite <-> Backend Java EE (Tomcat)

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:18080/iga-learning-api/api";

type JsonBody = Record<string, unknown>;

function getToken(): string | null {
  return (
    localStorage.getItem("iga_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken")
  );
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      credentials: "include",
      ...options,
    });

    const text = await response.text();

    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        data ||
        `Erreur API ${response.status}`
      );
    }

    return data as T;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("NetworkError") ||
      error.message?.includes("Load failed")
    ) {
      throw new Error("Serveur indisponible ou problème de connexion à l'API");
    }

    throw error;
  }
}

export const api = {
  login: (email: string, password: string) =>
    request<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getCourses: (search?: string, category?: string, teacherId?: number) => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (teacherId) params.append("teacher_id", String(teacherId));

    const qs = params.toString();
    return request<any[]>(`/courses${qs ? `?${qs}` : ""}`);
  },

  getCategories: () => request<any[]>("/categories"),

  getMe: () => request<any>("/users/me"),

  updateMe: (data: any) =>
    request<any>("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getTeacherStudents: (teacherId: number) =>
    request<any[]>(`/teachers/${teacherId}/students`),

  getTeacherGrades: (teacherId: number) =>
    request<any[]>(`/teachers/${teacherId}/grades`),

  createGrade: (data: any) =>
    request<any>("/grades", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateGrade: (id: number, data: any) =>
    request<any>(`/grades/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteGrade: (id: number) =>
    request<any>(`/grades/${id}`, {
      method: "DELETE",
    }),

  getQuizzesByCourse: (courseId: number) =>
    request<any[]>(`/courses/${courseId}/quizzes`),

  submitQuiz: (userId: number, quizId: number, data: any) =>
    request<any>(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ userId, answers: data }),
    }),

  getUsers: () => request<any[]>("/users"),

  getDashboard: (studentId: number) =>
    request<any>(`/students/${studentId}/dashboard`),

  getAllQuizzes: () => request<any[]>("/quizzes"),

  getResultsByStudent: (studentId: number) =>
    request<any[]>(`/students/${studentId}/results`),

  getCertificatesByStudent: (studentId: number) =>
    request<any[]>(`/students/${studentId}/certificates`),

  getCertificatesAdmin: () => request<any[]>("/certificates"),

  verifyCertificateByCode: (code: string) =>
    request<any>(`/certificates?code=${encodeURIComponent(code)}`),

  getAdminStatistics: () => request<any>("/statistics"),

  createUser: (data: any) =>
    request<any>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateUser: (id: number, data: any) =>
    request<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteUser: (id: number) =>
    request<any>(`/users/${id}`, {
      method: "DELETE",
    }),

  getCourse: (id: number) => request<any>(`/courses/${id}`),

  createCourse: (data: any) =>
    request<any>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCourse: (id: number, data: any) =>
    request<any>(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCourse: (id: number) =>
    request<any>(`/courses/${id}`, {
      method: "DELETE",
    }),

  createQuiz: (data: any) =>
    request<any>("/quizzes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuiz: (id: number, data: any) =>
    request<any>(`/quizzes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteQuiz: (id: number) =>
    request<any>(`/quizzes/${id}`, {
      method: "DELETE",
    }),

  enroll: (studentId: number, courseId: number) =>
    request<any>(`/students/${studentId}/enroll`, {
      method: "POST",
      body: JSON.stringify({ courseId }),
    }),


  getProgress: (userId: number, courseId: number) =>
    request<any>(`/progress?userId=${userId}&courseId=${courseId}`),

  saveProgress: (data: any) =>
    request<any>("/progress", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateLessonProgress: (data: any) =>
    request<any>("/progress/lesson", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getFavorites: (userId: number) => request<any[]>(`/favorites?userId=${userId}`),

  toggleFavorite: (userId: number, courseId: number) =>
    request<any>("/favorites", {
      method: "POST",
      body: JSON.stringify({ userId, courseId }),
    }),

  getReviews: (courseId: number) => request<any[]>(`/course-reviews/${courseId}`),

  addReview: (courseId: number, data: any) =>
    request<any>(`/course-reviews/${courseId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getNotifications: (userId: number) => request<any[]>(`/notifications?userId=${userId}`),

  sendContactMessage: (data: JsonBody) =>
    request<any>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};