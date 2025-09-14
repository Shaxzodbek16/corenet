import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Phone, MessageCircle, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactFormData {
  name: string;
  email: string;
  phone_number: string;
  telegram_username?: string;
  project_description: string;
}

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone_number: "",
    telegram_username: "",
    project_description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's a valid length (between 7 and 15 digits)
    return cleaned.length >= 7 && cleaned.length <= 15;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhoneNumber(formData.phone_number)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number with 7-15 digits.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for reaching out. We'll contact you within 24 hours to discuss your project.
        </p>
        <Button 
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className="bg-card border border-border shadow-card p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              {t('nameLabel')} *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('namePlaceholder')}
              required
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              {t('emailLabel')}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('emailPlaceholder')}
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              <Phone className="w-4 h-4 inline mr-2" />
              {t('phoneLabel')} *
            </label>
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder={t('phonePlaceholder')}
              required
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          {/* Telegram */}
          <div className="space-y-2">
            <label htmlFor="telegram" className="text-sm font-medium text-foreground">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              {t('telegramLabel')}
            </label>
            <Input
              id="telegram_username"
              name="telegram_username"
              value={formData.telegram_username}
              onChange={handleInputChange}
              placeholder={t('telegramPlaceholder')}
              className="bg-background border-border focus:ring-primary"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-foreground">
            {t('messageLabel')} *
          </label>
          <Textarea
            id="project_description"
            name="project_description"
            value={formData.project_description}
            onChange={handleInputChange}
            placeholder={t('messagePlaceholder')}
            required
            rows={6}
            className="bg-background border-border focus:ring-primary resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 group py-3"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Sending Message...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                {t('sendMessage')}
              </div>
            )}
          </Button>
        </motion.div>

        {/* Additional info */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            We typically respond within 24 hours. For urgent inquiries, please call us directly.
          </p>
        </div>
      </form>
    </Card>
  );
};

export const ContactSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('contactTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contactSubtitle')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Phone</div>
                    <div className="text-muted-foreground">+1 (555) 123-4567</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Telegram</div>
                    <div className="text-muted-foreground">@corenet_contact</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-primary p-6 rounded-2xl text-primary-foreground">
              <h4 className="text-lg font-bold mb-2">{t('whyChooseUs')}</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/90">
                <li>• {t('experienceYears')}</li>
                <li>• {t('successRate')}</li>
                <li>• {t('supportHours')}</li>
                <li>• {t('competitivePricing')}</li>
                <li>• {t('latestTechnologies')}</li>
              </ul>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};