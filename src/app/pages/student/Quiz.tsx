import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function Quiz() {
  const { id } = useParams(); // course_id
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // questionId -> answerId
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getQuizzesByCourse(Number(id)).then((data: any) => {
        setQuizzes(data);
        if(data.length > 0) setCurrentQuiz(data[0]);
      }).catch(console.error)
      .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!user || !currentQuiz) return;
    
    const payload = Object.entries(answers).map(([qId, aId]) => ({
      questionId: Number(qId),
      answerId: Number(aId)
    }));

    try {
      const result = await api.submitQuiz(user.id, currentQuiz.id, payload);
      navigate('/quiz-result', { state: result });
    } catch (err) {
      alert("Erreur lors de la soumission du quiz");
    }
  };

  if (loading) return <div className="p-12 text-center">Chargement...</div>;
  if (!currentQuiz) return <div className="p-12 text-center">Aucun quiz disponible pour ce cours.</div>;

  return (
    <div className="min-h-screen bg-muted py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold mb-6">{currentQuiz.title || 'Quiz de fin de cours'}</h1>
        
        {currentQuiz.questions?.map((q: any, idx: number) => (
          <div key={q.id} className="mb-8 p-6 bg-muted/30 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">{idx + 1}. {q.question}</h3>
            <div className="space-y-3">
              {q.answers?.map((a: any) => (
                <label key={a.id} className="flex items-center gap-3 p-3 border rounded hover:bg-muted cursor-pointer transition">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={a.id}
                    checked={answers[q.id] === a.id}
                    onChange={() => setAnswers({...answers, [q.id]: a.id})}
                    className="size-4"
                  />
                  <span>{a.answer_text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
          >
            Terminer le quiz
          </button>
        </div>
      </div>
    </div>
  );
}
