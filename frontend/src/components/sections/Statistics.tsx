import { motion } from "framer-motion";
import { Users, Briefcase, Award, Clock } from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    value: "50+",
    label: "Projects Completed",
    description: "Successfully delivered projects across various industries"
  },
  {
    icon: Users,
    value: "30+",
    label: "Happy Clients", 
    description: "Satisfied clients who trust our expertise"
  },
  {
    icon: Clock,
    value: "5+",
    label: "Years Experience",
    description: "Years of delivering exceptional software solutions"
  },
  {
    icon: Award,
    value: "100%",
    label: "Success Rate",
    description: "Every project delivered on time and within budget"
  }
];

export const Statistics = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Proven <span className="text-gradient">Track Record</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak to our commitment and expertise in software development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="group"
            >
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-card hover:shadow-glow transition-all duration-500 group-hover:-translate-y-2">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-primary">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Value */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    bounce: 0.5
                  }}
                  className="text-4xl font-bold text-gradient mb-2"
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground shadow-primary">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Success Stories?</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Let's discuss how we can help you achieve your project goals with our proven methodology and expert team.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-foreground text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Get Free Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};