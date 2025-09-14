import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/sections/Footer";
import { formatViewCount } from "@/lib/formatters";
import {
  useProjects,
  useProjectTypes,
  useTechnologies,
} from "@/hooks/useProjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 9;

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();

  // Build API query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage,
      size: ITEMS_PER_PAGE,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (selectedType !== "all") {
      params.project_type = selectedType;
    }

    if (selectedTechnologies.length > 0) {
      params.technologies = selectedTechnologies.join(", ");
    }

    return params;
  }, [searchTerm, selectedType, selectedTechnologies, currentPage]);

  // Fetch data using custom hooks
  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useProjects(queryParams);
  const { data: projectTypes, isLoading: typesLoading } = useProjectTypes();
  const { data: technologiesData, isLoading: techLoading } = useTechnologies();

  // Handle errors
  if (projectsError) {
    toast.error("Failed to load projects. Please try again.");
  }

  // Get all unique technologies for filtering (from API data)
const allTechnologies = useMemo(() => {
  if (!technologiesData) return [];

  const list = Array.isArray(technologiesData)
    ? technologiesData
    : technologiesData.results || [];

  return list.sort((a, b) => a.name.localeCompare(b.name));
}, [technologiesData]);

  // Get project types with "All" option
    const projectTypeOptions = useMemo(() => {
  const options = [{ id: "all", name: "All Types", slug: "all" }];

  if (Array.isArray(projectTypes)) {
    options.push(...projectTypes);
  } else if (projectTypes?.results) {
    options.push(...projectTypes.results);
  }

  return options;
}, [projectTypes]);

  const toggleTechnology = (techSlug: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(techSlug)
        ? prev.filter((t) => t !== techSlug)
        : [...prev, techSlug]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedTechnologies([]);
    setCurrentPage(1);
  };

  // Calculate pagination info
  const totalPages = projectsData
    ? Math.ceil(projectsData.count / ITEMS_PER_PAGE)
    : 0;
  const projects = projectsData?.results || [];

  // Loading state
  if (projectsLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-foreground">
                {t("loadingProjects")}
              </span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl dark:text-white/70  md:text-6xl font-bold text-foreground mb-4"
            >
              {t("projectsTitle")}{" "}
              <span className="text-gradient">Portfolio</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              {t("projectsSubtitle")}
            </motion.p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder={t("searchProjects")}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="lg:w-48">
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t("projectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypeOptions.map((type) => (
                      <SelectItem key={type.id} value={type.slug}>
                        {type.id === "all" ? t("allTypes") : type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Technology Filters */}
            <div className="mt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    Technologies:
                  </span>
                </div>
                {(selectedTechnologies.length > 0 ||
                  selectedType !== "all" ||
                  searchTerm) && (
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    {t("clearAllFilters")}
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <motion.button
                    key={tech.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTechnology(tech.slug)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTechnologies.includes(tech.slug)
                        ? "bg-primary text-primary-foreground shadow-primary"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {tech.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                {t("showing")} {projects.length} {t("of")}{" "}
                {projectsData?.count || 0} {t("results")}
                {projectsLoading && (
                  <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section id="projects-list" className="py-12">
          <div className="container mx-auto px-4">
            <AnimatePresence mode="wait">
              {projects.length > 0 ? (
                <motion.div
                  key={`${currentPage}-${viewMode}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "space-y-6"
                  }
                >
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card
                        className={`bg-card border border-border shadow-card transition-all duration-300 group overflow-hidden cursor-pointer relative ${
                          viewMode === "list" ? "flex" : ""
                        } ${
                          project.cover_image || project.images?.length > 0
                            ? "hover:shadow-glow"
                            : ""
                        }`}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {/* Project Image */}
                        <div
                          className={`relative overflow-hidden ${
                            viewMode === "list" ? "w-1/3" : "h-48"
                          }`}
                        >
                          {project.cover_image ? (
                            <img
                              src={`${project.cover_image}`}
                              alt={
                                typeof project.title === "string"
                                  ? project.title
                                  : project.title[
                                      currentLanguage.code as keyof typeof project.title
                                    ] ??
                                    project.title.en ??
                                    ""
                              }
                              className={`w-full h-full object-cover transition-transform duration-300 ${
                                project.cover_image
                                  ? "group-hover:scale-105"
                                  : ""
                              }`}
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
                          {(project.cover_image ||
                            project.images?.length > 0) && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                              {project.live_url && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(project.live_url, "_blank");
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
                                    window.open(
                                      project.repository_url,
                                      "_blank"
                                    );
                                  }}
                                >
                                  <Github className="w-5 h-5 text-accent-foreground" />
                                </motion.button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Project Content */}
                        <div
                          className={`p-6 ${
                            viewMode === "list" ? "flex-1" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {typeof project.title === "string"
                                ? project.title
                                : project.title[
                                    currentLanguage.code as keyof typeof project.title
                                  ] ??
                                  project.title.en ??
                                  ""}
                            </h3>
                            <Badge
                              className={`text-xs ${
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

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {typeof project.description === "string"
                              ? project.description
                              : project.description[
                                  currentLanguage.code as keyof typeof project.description
                                ] ??
                                project.description.en ??
                                ""}
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
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-muted/50 text-muted-foreground"
                                >
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
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {t("noProjectsFound")}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t("tryAdjustingFilters")}
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    {t("clearAllFilters")}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex justify-center items-center gap-2 mt-12"
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                    // Scroll to projects section
                    const projectsSection =
                      document.getElementById("projects-list");
                    if (projectsSection) {
                      projectsSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        // Scroll to projects section
                        const projectsSection =
                          document.getElementById("projects-list");
                        if (projectsSection) {
                          projectsSection.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="w-10 h-10 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    // Scroll to projects section
                    const projectsSection =
                      document.getElementById("projects-list");
                    if (projectsSection) {
                      projectsSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
