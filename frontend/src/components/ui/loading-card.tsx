import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface LoadingCardProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LoadingCard = ({ children, isLoading = false, className = "", onClick }: LoadingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative group ${className}`}
      onClick={onClick}
    >
      <Card className={`
        bg-card border border-border shadow-card 
        hover:shadow-glow transition-all duration-500 
        cursor-pointer overflow-hidden
        ${isLoading ? 'animate-pulse' : ''}
      `}>
        {/* Loading shimmer effect */}
        {isLoading && (
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {children}
      </Card>
    </motion.div>
  );
};