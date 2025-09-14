import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Code2, Rocket, CheckCircle, TestTube, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Animated Code Component
const AnimatedCode = ({ isActive }: { isActive: boolean }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const codeLines = [
    "const project = new Project();",
    "project.design().develop();", 
    "project.test().optimize();",
    "project.deploy().succeed();"
  ];

  useEffect(() => {
    if (!isActive) {
      setVisibleLines(0);
      return;
    }
    
    const timer = setInterval(() => {
      setVisibleLines(prev => prev < codeLines.length ? prev + 1 : prev);
    }, 500);

    return () => clearInterval(timer);
  }, [isActive]);

  return (
    <div className="bg-gray-900 rounded-lg p-4 text-left text-xs font-mono max-w-xs mx-auto">
      {codeLines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, width: 0 }}
          animate={{ 
            opacity: index < visibleLines ? 1 : 0,
            width: index < visibleLines ? "auto" : 0
          }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-green-400 whitespace-nowrap overflow-hidden"
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
};

// Blueprint Drawing Animation
const BlueprintDrawing = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.path
          d="M20 20 L80 20 L80 80 L20 80 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M30 30 L70 30 M30 40 L60 40 M30 50 L65 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isActive ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// Testing Progress Bars
const TestingBars = ({ isActive }: { isActive: boolean }) => {
  const tests = ["Unit Tests", "Integration", "UI Tests"];
  
  return (
    <div className="space-y-2 max-w-xs mx-auto">
      {tests.map((test, index) => (
        <div key={test} className="flex items-center gap-2 text-xs">
          <span className="w-16 text-left">{test}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isActive ? "100%" : 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isActive ? 1 : 0 }}
            transition={{ delay: (index * 0.3) + 1 }}
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
          </motion.div>
        </div>
      ))}
    </div>
  );
};

// Rocket Launch Animation
const RocketLaunch = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative w-24 h-24 mx-auto overflow-hidden">
      <motion.div
        initial={{ y: 20, rotate: 0 }}
        animate={{ 
          y: isActive ? -40 : 20,
          rotate: isActive ? -15 : 0
        }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative"
      >
        <Rocket className="w-8 h-8 text-purple-400" />
        {/* Particle trail */}
        {isActive && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-orange-400 rounded-full"
                initial={{ 
                  x: 4, 
                  y: 8,
                  opacity: 0 
                }}
                animate={{
                  x: Math.random() * 20 - 10,
                  y: 15 + Math.random() * 10,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </div>
  );
};

// Celebration Animation
const CelebrationEffect = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
      >
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
      </motion.div>
      
      {/* Confetti particles */}
      {isActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'][i % 4],
                left: '50%',
                top: '50%'
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos(i * 45 * Math.PI / 180) * 30,
                y: Math.sin(i * 45 * Math.PI / 180) * 30,
              }}
              transition={{
                duration: 1.5,
                delay: 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export const DevelopmentProcess = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const { t } = useLanguage();

  const processSteps = [
    {
      icon: Lightbulb,
      title: t('stepIdea'),
      description: "We analyze your requirements and create a detailed plan with interactive blueprints",
      color: "text-amber-400",
      bgColor: "bg-amber-400/20",
      component: BlueprintDrawing
    },
    {
      icon: Code2,
      title: t('stepCoding'),
      description: "Our expert team brings your vision to life with clean, efficient code",
      color: "text-blue-400", 
      bgColor: "bg-blue-400/20",
      component: AnimatedCode
    },
    {
      icon: TestTube,
      title: "Testing & QA",
      description: "Comprehensive testing ensures reliability and performance before launch",
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/20",
      component: TestingBars
    },
    {
      icon: Rocket,
      title: t('stepDeployment'),
      description: "We deploy your application with optimal performance and monitoring",
      color: "text-purple-400",
      bgColor: "bg-purple-400/20",
      component: RocketLaunch
    },
    {
      icon: CheckCircle,
      title: t('stepReady'),
      description: t('stepReadyDescription'),
      color: "text-green-400",
      bgColor: "bg-green-400/20",
      component: CelebrationEffect
    }
  ];

  useEffect(() => {
    if (!isInView) return;

    const duration = 15000; // 15 seconds total (3 seconds per step)
    const steps = processSteps.length;
    const stepDuration = duration / steps;
    
    let startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      const newCurrentStep = Math.min(Math.floor(elapsed / stepDuration), steps - 1);
      
      setProgress(newProgress);
      setCurrentStep(newCurrentStep);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      }
    };
    
    const timer = setTimeout(() => {
      animate();
    }, 800); // Increased delay for better effect

    return () => clearTimeout(timer);
  }, [isInView]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onViewportEnter={() => setIsInView(true)}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('fromIdeaTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('fromIdeaSubtitle')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">

          {/* Current step details with enhanced animations */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1],
              type: "spring",
              bounce: 0.3
            }}
            className="text-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-500"
          >
            {/* Enhanced step animation */}
            <div className="mb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  {(() => {
                    const StepComponent = processSteps[currentStep].component;
                    return <StepComponent isActive={true} />;
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground mb-4"
            >
              {processSteps[currentStep].title}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto"
            >
              {processSteps[currentStep].description}
            </motion.p>
          </motion.div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold shadow-primary hover:shadow-glow transition-all duration-300"
          >
            {t('startProject')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};