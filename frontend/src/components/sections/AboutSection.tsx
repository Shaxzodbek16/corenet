import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Users, Target, Zap, Award, Clock } from "lucide-react";
import { TechnologyCarousel } from "@/components/ui/technology-carousel";
import { useLanguage } from "@/contexts/LanguageContext";

export const AboutSection = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Code,
      title: t('innovation'),
      description: t('innovationDesc')
    },
    {
      icon: Users,
      title: t('collaboration'),
      description: t('collaborationDesc')
    },
    {
      icon: Target,
      title: t('quality'),
      description: t('qualityDesc')
    },
    {
      icon: Zap,
      title: t('fastDelivery'),
      description: t('fastDeliveryDesc')
    }
  ];

  const achievements = [
    { icon: Award, title: t('industryRecognition'), description: t('industryRecognitionDesc') },
    { icon: Clock, title: t('onTimeDelivery'), description: t('onTimeDeliveryDesc') },
    { icon: Users, title: t('clientSatisfaction'), description: t('clientSatisfactionDesc') }
  ];

  const technologies = [
    "React", "Vue.js", "Angular", "Node.js", "Python", "Django",
    "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes", "GraphQL",
    "TypeScript", "Next.js", "Express", "FastAPI", "Redis", "Nginx"
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('aboutTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('aboutSubtitle')}
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <Card className="bg-gradient-primary p-8 text-primary-foreground shadow-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">{t('aboutTitle')}</h3>
                <p className="text-primary-foreground/90 leading-relaxed mb-4">
                  {t('aboutDescription')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <achievement.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-primary-foreground/80">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">
            {t('ourValues')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-card border border-border p-6 text-center shadow-card hover:shadow-glow transition-all duration-500 group">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-primary">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold text-foreground text-center mb-8">
            {t('technologiesTitle')}
          </h3>
          <TechnologyCarousel />
        </motion.div>
      </div>
    </section>
  );
};