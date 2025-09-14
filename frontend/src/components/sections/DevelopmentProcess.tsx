import { motion } from "framer-motion";
import { Lightbulb, Code2, Rocket, CheckCircle } from "lucide-react";

const processSteps = [
  {
    icon: Lightbulb,
    title: "Your Idea",
    description: "We analyze your requirements and create a detailed plan",
    color: "text-amber-400",
    bgColor: "bg-amber-400/20"
  },
  {
    icon: Code2,
    title: "Development",
    description: "Our expert team brings your vision to life with clean code",
    color: "text-blue-400", 
    bgColor: "bg-blue-400/20"
  },
  {
    icon: Rocket,
    title: "Deployment",
    description: "We deploy your application with optimal performance",
    color: "text-purple-400",
    bgColor: "bg-purple-400/20"
  },
  {
    icon: CheckCircle,
    title: "Ready!",
    description: "Your project is live and ready to serve your users",
    color: "text-green-400",
    bgColor: "bg-green-400/20"
  }
];

export const DevelopmentProcess = () => {
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
            From Idea to <span className="text-gradient">Reality</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our proven development process ensures your project succeeds every step of the way
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-primary opacity-30 transform -translate-y-1/2 hidden lg:block"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step card */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-500 group">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shadow-primary">
                    {index + 1}
                  </div>
                </div>

                {/* Arrow connector (desktop only) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.2 + 0.3 }}
                      className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-primary"
                    >
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
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
            Start Your Project Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};