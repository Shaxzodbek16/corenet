import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { formatViewCount } from "@/lib/formatters";
import { useProjects } from "@/hooks/useProjects";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProjectCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  // Fetch latest 3 projects
  const {
    data: projectsData,
    isLoading,
    error,
  } = useProjects({
    size: 3,
    ordering: "-created_at",
  });

  const projects = projectsData?.results || [];

  // Debug logging
  console.log("Projects data:", projectsData);
  console.log("Projects array:", projects);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

  useEffect(() => {
    if (projects.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [projects.length]);

  // Filter projects with meaningful content
  const validProjects = projects.filter((project) => {
    const title =
      typeof project.title === "string"
        ? project.title
        : project.title[currentLanguage.code as keyof typeof project.title] ??
          project.title.en ??
          "";
    const description =
      typeof project.description === "string"
        ? project.description
        : project.description[
            currentLanguage.code as keyof typeof project.description
          ] ??
          project.description.en ??
          "";
    return title && description;
  });

  if (isLoading) {
    return (
      <div className="relative h-[500px] w-full">
        <Card className="bg-card/10 backdrop-blur-lg border-primary-foreground/20 shadow-card h-full p-6 flex items-center justify-center">
          <div className=" text-center">
            <div className="w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8  text-primary-foreground animate-pulse" />
            </div>
            <p className="text-primary-foreground/70">Loading projects...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="relative h-[500px] w-full">
        <Card className="bg-card/10 backdrop-blur-lg border-primary-foreground/20 shadow-card h-full p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-destructive/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive/70">
              Error loading projects: {error.message}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // If no valid projects, show placeholder
  if (validProjects.length === 0) {
    return (
      <div className="relative h-[500px] w-full">
        <Card className="bg-card/10 backdrop-blur-lg border-primary-foreground/20 shadow-card h-full p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <ExternalLink className="w-8 h-8 text-primary-foreground/50" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary-foreground/80 mb-2">
                No Featured Projects
              </h3>
              <p className="text-primary-foreground/60 text-sm">
                Check out our projects page to see all available work
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentProject = projects[currentIndex];
  // Handle both string and object formats for title/description
  const title =
    typeof currentProject.title === "string"
      ? currentProject.title
      : currentProject.title[
          currentLanguage.code as keyof typeof currentProject.title
        ] ??
        currentProject.title.en ??
        "";
  const description =
    typeof currentProject.description === "string"
      ? currentProject.description
      : currentProject.description[
          currentLanguage.code as keyof typeof currentProject.description
        ] ??
        currentProject.description.en ??
        "";

  return (
    <div className="relative h-[500px] w-full">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Card className="bg-card/10  backdrop-blur-lg border-primary-foreground/20 shadow-card h-full group hover:shadow-glow transition-all duration-500 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Project image */}
              <div
                className="relative h-48 bg-muted/20 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/projects/${currentProject.id}`)}
              >
                {currentProject.cover_image ? (
                  <img
                    src={`${currentProject.cover_image}`}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="absolute  inset-0 bg-gradient-primary opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                  </>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="text-white text-sm font-medium">
                    View Project
                  </div>
                </div>
              </div>

              {/* Project info */}
              <div className="flex-1 p-6 space-y-4">
                <div className="space-y-2">
                  <h3
                    className="text-xl dark:text-white font-bold text-primary-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/projects/${currentProject.id}`)}
                  >
                    {title}
                  </h3>
                  <p className=" dark:text-white text-primary-foreground/70 text-sm line-clamp-3 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Technologies */}
                {currentProject.technologies &&
                  currentProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentProject.technologies.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech.id}
                          variant="secondary"
                          className="dark:text-white  bg-primary/20 text-primary-foreground border-primary/30 text-xs"
                        >
                          {tech.name}
                        </Badge>
                      ))}
                      {currentProject.technologies.length > 4 && (
                        <Badge
                          variant="secondary"
                          className=" dark:text-white bg-muted/20 text-muted-foreground text-xs"
                        >
                          +{currentProject.technologies.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}

                {/* View count and date */}
                <div className="flex items-center justify-between text-xs text-primary-foreground/60">
                  <span className="dark:text-white ">{formatViewCount(currentProject.views)} views</span>
                  <span>
                    {new Date(currentProject.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Action buttons */}
                {(currentProject.live_url || currentProject.repository_url) && (
                  <div className="flex gap-3 pt-2 border-t border-primary-foreground/10">
                    {currentProject.live_url && (
                      <motion.a
                        href={currentProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Live Demo</span>
                      </motion.a>
                    )}
                    {currentProject.repository_url && (
                      <motion.a
                        href={currentProject.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">Source</span>
                      </motion.a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Carousel indicators */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {validProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-primary-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
