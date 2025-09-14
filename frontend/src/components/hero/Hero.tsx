import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { ProjectCarousel } from "./ProjectCarousel";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Coding vibe background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating code snippets */}
        <div className="absolute top-20 left-10 text-primary/30 font-mono text-sm animate-pulse">
          <div>const project = &#123;</div>
          <div className="ml-4">status: 'building',</div>
          <div className="ml-4">progress: 100</div> 
          <div>&#125;;</div>
        </div>

        <div className="absolute top-40 right-20 text-accent/30 font-mono text-sm animate-pulse delay-500">
          <div>function deploy() &#123;</div>
          <div className="ml-4">return success;</div>
          <div>&#125;</div>
        </div>

        <div className="absolute bottom-40 left-20 text-purple-400/30 font-mono text-sm animate-pulse delay-1000">
          <div>// Building dreams</div>
          <div>npm run build</div>
        </div>

        <div className="absolute bottom-60 right-10 text-green-400/30 font-mono text-sm animate-pulse delay-1500">
          <div>&lt;CoreNet /&gt;</div>
          <div>Ready to launch!</div>
        </div>

        {/* Binary background pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 text-primary font-mono text-xs leading-none select-none pointer-events-none">
          <div className="flex flex-wrap gap-1 h-full animate-pulse">
            {Array.from({ length: 150 }, (_, i) => (
              <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Terminal window mockup */}
        <div className="absolute top-32 right-32 w-64 h-32 bg-black/20 rounded-lg border border-primary/20 backdrop-blur-sm opacity-30">
          <div className="flex items-center gap-2 p-2 border-b border-primary/10">
            <div className="w-3 h-3 bg-red-400/50 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400/50 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400/50 rounded-full"></div>
          </div>
          <div className="p-2 font-mono text-xs text-primary/60">
            <div>$ git commit -m "success"</div>
            <div>$ npm run deploy</div>
            <div className="animate-pulse">Building...</div>
          </div>
        </div>
      </div>

      {/* Enhanced container with coding aesthetic */}
      <div className="container mx-auto px-4 relative z-10 backdrop-blur-[1px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center justify-center min-h-screen py-20 text-foreground">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:text-left text-center"
          >
            <div className="space-y-4">

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl lg:text-7xl font-bold dark:text-white text-primary-foreground leading-tight"
              >
                {t('WeBuild')}
                <span className="dark:text-gradient block">{t('digitalDreams')}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl dark:text-white text-primary-foreground max-w-lg leading-relaxed"
              >
                {t('heroSubtitle')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 shadow-primary group"
              >
                {t('startProject')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 dark:text-black bg-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3"
              >
                <Rocket className="mr-2 w-5 h-5" />
                {t('viewWork')}
              </Button>
            </motion.div>

          </motion.div>

          {/* Right side - Project carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <ProjectCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};