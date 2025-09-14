import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useTechnologies } from "@/hooks/useProjects";

export const TechnologyCarousel = () => {
  const { data: technologies = [], isLoading } = useTechnologies();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(technologies.length / itemsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const getCurrentTechnologies = () => {
    const startIndex = currentIndex * itemsPerPage;
    return technologies.slice(startIndex, startIndex + itemsPerPage);
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-3 justify-center min-h-[120px] items-center">
            <div className="animate-pulse text-muted-foreground">Loading technologies...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center min-h-[120px] items-center"
        >
          {getCurrentTechnologies().map((tech, index) => (
            <motion.div
              key={`${currentIndex}-${tech.id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <Badge 
                className="bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow-primary hover:shadow-glow transition-all duration-300"
              >
                {tech.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-primary w-8" 
                : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};