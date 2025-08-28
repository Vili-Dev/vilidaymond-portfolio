'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Github } from 'lucide-react';
import ParallaxSection from './ParallaxSection';
import { useAnimations } from '@/utils/animations';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const { fadeInUp, staggerContainer, defaultTransition } = useAnimations();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    
    setTimeout(() => {
      setSubmitStatus('idle');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@vilidaymond.com',
      href: 'mailto:hello@vilidaymond.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'New York, NY',
      href: '#',
    },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-300' },
  ];


  return (
    <section id="contact" className="relative py-20 lg:py-32" style={{ marginTop: '50px', marginBottom: '50px' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary-black via-primary-darkGray to-primary-black"></div>
      
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-red to-transparent"></div>
      
      <ParallaxSection speed={0.5}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 items-center flex flex-col">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-center mb-20 max-w-5xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              transition={defaultTransition}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-shadow"
            >
              <span className="text-secondary-white">Get In</span>{' '}
              <span className="gradient-text">Touch</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              transition={defaultTransition}
              className="text-lg text-secondary-lightGray max-w-2xl mx-auto"
            >
              Ready to collaborate on something mysterious and beautiful? 
              Let's bring your dark visions to life together.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 xl:gap-24 items-start justify-center max-w-7xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="space-y-8 max-w-lg mx-auto lg:mx-0"
            >
              <motion.div 
                variants={fadeInUp}
                transition={defaultTransition}
              >
                <h3 className="font-display text-2xl font-semibold text-secondary-white mb-6">
                  Let's Connect
                </h3>
                <p className="text-secondary-lightGray mb-8 leading-relaxed">
                  Whether you're looking for custom artwork, collaboration opportunities, 
                  or just want to discuss the mysteries of creative expression, I'd love to hear from you.
                </p>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                transition={defaultTransition}
                className="space-y-6"
              >
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 glass-effect rounded-lg hover:red-glow transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary-red/20 rounded-lg flex items-center justify-center group-hover:bg-primary-red/30 transition-colors duration-300">
                      <info.icon className="w-6 h-6 text-primary-red group-hover:text-accent-crimson" />
                    </div>
                    <div>
                      <p className="text-secondary-lightGray text-sm">{info.label}</p>
                      <p className="text-secondary-white font-medium group-hover:text-primary-red transition-colors duration-300">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                transition={defaultTransition}
                className="pt-8"
              >
                <h4 className="font-display text-xl text-secondary-white mb-4">Follow My Journey</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 bg-secondary-gray/20 rounded-lg flex items-center justify-center text-secondary-lightGray ${social.color} transition-all duration-300 hover:bg-secondary-gray/30`}
                    >
                      <social.icon className="w-6 h-6" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              transition={defaultTransition}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="glass-effect rounded-2xl p-8 red-glow max-w-xl mx-auto lg:mx-0"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className="text-secondary-lightGray text-sm font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      className="w-full px-4 py-3 bg-primary-darkGray border border-secondary-gray rounded-lg text-secondary-white placeholder-secondary-gray focus:border-primary-red focus:outline-none focus:ring-2 focus:ring-primary-red/20 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <label className="text-secondary-lightGray text-sm font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-primary-darkGray border border-secondary-gray rounded-lg text-secondary-white placeholder-secondary-gray focus:border-primary-red focus:outline-none transition-colors duration-300"
                      placeholder="your@email.com"
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="text-secondary-lightGray text-sm font-medium">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-primary-darkGray border border-secondary-gray rounded-lg text-secondary-white placeholder-secondary-gray focus:border-primary-red focus:outline-none transition-colors duration-300"
                    placeholder="What's this about?"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="text-secondary-lightGray text-sm font-medium">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-primary-darkGray border border-secondary-gray rounded-lg text-secondary-white placeholder-secondary-gray focus:border-primary-red focus:outline-none transition-colors duration-300 resize-none"
                    placeholder="Tell me about your vision..."
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(220, 38, 38, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full px-8 py-4 rounded-lg font-medium text-secondary-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    submitStatus === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gradient-to-r from-primary-red to-primary-darkRed hover:from-primary-darkRed hover:to-primary-bloodRed'
                  }`}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-secondary-white border-t-transparent rounded-full"
                    />
                  ) : submitStatus === 'success' ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 text-white"
                      >
                        ✓
                      </motion.div>
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>
    </section>
  );
}