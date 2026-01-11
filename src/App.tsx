import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LearningModeProvider, useLearningMode } from "@/contexts/LearningModeContext";
import { Onboarding } from "@/components/Onboarding";
import { Dashboard } from "@/components/Dashboard";
import { LessonsPage } from "@/pages/LessonsPage";
import { LessonQuiz } from "@/pages/LessonQuiz";
import { GamesPage } from "@/pages/GamesPage";
import { GamePlay } from "@/pages/GamePlay";
import { ProgressPage } from "@/pages/ProgressPage";
import { ReadAloudPage } from "@/pages/ReadAloudPage";
import { VisualLearningPage } from "@/pages/VisualLearningPage";
import { AudioPage } from "@/pages/AudioPage";
import { SettingsPage } from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isOnboarded } = useLearningMode();

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/lessons/:gradeId/:subjectId" element={<LessonQuiz />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/games/:gameId" element={<GamePlay />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/read-aloud" element={<ReadAloudPage />} />
      <Route path="/visual-learning" element={<VisualLearningPage />} />
      <Route path="/audio" element={<AudioPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LearningModeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </LearningModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
