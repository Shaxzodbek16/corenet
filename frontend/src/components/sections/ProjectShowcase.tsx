import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjects } from "@/hooks/useProjects";
import { formatViewCount } from "@/lib/formatters";

interface ProjectShowcaseProps {
  onViewAllProjects: () => void;
}

export const ProjectShowcase = ({ onViewAllProjects }: ProjectShowcaseProps) => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  
  // Fetch featured projects
  const { data: projectsData, isLoading } = useProjects({ 
    is_featured: true, 
    size: 6,
    status: 'completed'
  });

  const projects = projectsData?.results || [];
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('projectsTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('projectsSubtitle')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-foreground">Loading projects...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card 
                className="bg-card border border-border shadow-card hover:shadow-glow transition-all duration-500 group overflow-hidden cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Project image */}
                <div className="relative h-48 overflow-hidden">
                  {project.cover_image ? (
                    <img 
                      src={`http://localhost:8000${project.cover_image}`}
                      alt={typeof project.title === 'string' ? project.title : project.title.en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-primary/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <ExternalLink className="w-6 h-6 text-primary-foreground" />
                        </div>
                      </div>
                    </>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.live_url && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.live_url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-5 h-5 text-primary-foreground" />
                      </motion.button>
                    )}
                    {project.repository_url && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-glow"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.repository_url, '_blank');
                        }}
                      >
                        <Github className="w-5 h-5 text-accent-foreground" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Project content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {typeof project.title === 'string' ? project.title : project.title.en}
                    </h3>
                    <Badge 
                      className={`text-xs ${
                        project.status === "completed" ? "bg-accent/20 text-accent border-accent/30" :
                        project.status === "in_progress" ? "bg-primary/20 text-primary border-primary/30" :
                        "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {typeof project.description === 'string' ? project.description : project.description.en}
                  </p>

                  <div className="space-y-3">
                    {/* Project Type */}
                    <Badge variant="outline" className="text-xs">
                      {project.project_type.name}
                    </Badge>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge 
                          key={tech.id}
                          variant="secondary"
                          className="text-xs bg-muted/50 text-muted-foreground"
                        >
                          {tech.name}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-muted-foreground">
                        {formatViewCount(project.views)} views
                      </div>
                      <div className="flex gap-2">
                        {project.live_url && (
                          <motion.a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </motion.a>
                        )}
                        {project.repository_url && (
                          <motion.a
                            href={project.repository_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-4 h-4" />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            ))}
          </div>
        )}

        {/* View all projects button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button 
            onClick={onViewAllProjects}
            size="lg" 
            className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 group px-8 py-3"
          >
            {t('viewAllProjects')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};