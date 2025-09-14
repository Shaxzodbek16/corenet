import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/sections/Footer";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  Loader2,
  Clock,
} from "lucide-react";
import defaultProjectImage from "@/assets/default-project.jpg";
import { formatViewCount } from "@/lib/formatters";
import { useProject } from "@/hooks/useProjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentLanguage, t } = useLanguage();

  const getLocalized = useCallback(
    (field: unknown) => {
      if (field == null) return "";
      if (typeof field === "string") return field;
      if (typeof field === "object") {
        try {
          const f = field as Record<string, string | undefined>;
          return (
            f[currentLanguage.code] ??
            f["ru"] ??
            f["en"] ??
            Object.values(f)[0] ??
            ""
          );
        } catch {
          return "";
        }
      }
      return "";
    },
    [currentLanguage.code]
  );

  // Fetch project data using the API
  const { data: project, isLoading, error } = useProject(id || "");

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Failed to load project details. Please try again.");
      navigate("/projects");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (project) {
      const title =
        getLocalized(project.title) ||
        getLocalized((project as any).slug) ||
        "Project";
      document.title = `${title} - CoreNet Projects`;
    }
  }, [project, currentLanguage.code]);

  // Auto-advance images every 5 seconds
  useEffect(() => {
    if (!project || project.images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [project]);

  const nextImage = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + project.images.length) % project.images.length
      );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("notSpecified");
    return new Date(dateString).toLocaleDateString(
      currentLanguage.code === "en"
        ? "en-US"
        : currentLanguage.code === "ru"
        ? "ru-RU"
        : "uz-UZ",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-foreground">
                {t("loadingProjectDetails")}
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no project found
  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t("projectNotFound")}
            </h1>
            <Button onClick={() => navigate("/projects")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToProjects")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = getLocalized(project.title);
  const description = getLocalized(project.description);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Back button */}
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToProjects")}
          </Button>
        </div>

        {/* Project header */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Project info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    {project.project_type.name}
                  </Badge>
                  <Badge
                    className={`px-3 py-1 ${
                      project.status === "completed"
                        ? "bg-accent/20 text-accent border-accent/30"
                        : project.status === "in_progress"
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
                  {title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Project Meta Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatViewCount(project.views)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                  <span className="capitalize">
                    {project.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Project Timeline */}
              {(project.start_date || project.end_date) && (
                <div className="bg-card/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{t("timeline")}</span>
                  </div>
                  <div className="space-y-2">
                    {project.start_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-primary" />
                        <span className="text-sm text-foreground">
                          {t("startDate")}: {formatDate(project.start_date)}
                        </span>
                      </div>
                    )}
                    {project.end_date && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-accent" />
                        <span className="text-sm text-foreground">
                          {t("endDate")}: {formatDate(project.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {t("technologiesUsed")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech.id}
                        className="bg-gradient-primary/10 text-primary border-primary/20 px-3 py-1"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {project.live_url && (
                  <Button
                    asChild
                    className="bg-gradient-primary text-primary-foreground"
                  >
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t("viewLiveDemo")}
                    </a>
                  </Button>
                )}
                {project.repository_url && (
                  <Button variant="outline" asChild>
                    <a
                      href={project.repository_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      {t("viewSourceCode")}
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Image carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-card border border-border shadow-card overflow-hidden">
                <div className="relative aspect-video">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      {project.images.length > 0 &&
                      project.images[currentImageIndex]?.image ? (
                        <img
                          src={project.images[currentImageIndex].image}
                          alt={
                            project.images[currentImageIndex].alt_text ||
                            `Project image ${currentImageIndex + 1}`
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={defaultProjectImage}
                          alt="Default project image"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation buttons - only show if there are actual images */}
                  {project.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image counter - only show if there are actual images */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {project.images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail navigation - only show if there are actual images */}
                {project.images.length > 1 && (
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2 overflow-x-auto">
                      {project.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-colors overflow-hidden ${
                            index === currentImageIndex
                              ? "border-primary"
                              : "border-transparent hover:border-muted-foreground/30"
                          }`}
                        >
                          {image.image ? (
                            <img
                              src={image.image}
                              alt={image.alt_text || `Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-primary/10 rounded-md flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                {index + 1}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
