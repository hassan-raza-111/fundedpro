"use client";

import { useState, useCallback } from "react";

// Types
interface FormData {
  name: string;
  email: string;
  message: string;
}

type SubmitStatus = "idle" | "success" | "error";

// Constants
const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  message: "",
};

const SUBMISSION_DELAY = 1500;

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  // Callbacks
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, SUBMISSION_DELAY));
      setSubmitStatus("success");
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Component renderers
  const renderFormField = (field: keyof FormData, label: string, type: string, placeholder: string, isTextarea = false) => {
    const commonClasses = "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30 transition-colors duration-300";
    
    return (
      <div>
        <label htmlFor={field} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
        {isTextarea ? (
          <textarea
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            rows={5}
            className={`${commonClasses} resize-none`}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className={commonClasses}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const renderSubmitButton = () => (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-cyan/40 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Sending..." : "Send Message"}
    </button>
  );

  const renderStatusMessage = () => {
    if (submitStatus === "success") {
      return <p className="text-green-400 text-sm text-center">✅ Message sent successfully!</p>;
    }
    if (submitStatus === "error") {
      return <p className="text-red-400 text-sm text-center">❌ Failed to send. Try again.</p>;
    }
    return null;
  };

  const renderContactForm = () => (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFormField("name", "Full Name", "text", "Your full name")}
            {renderFormField("email", "Email Address", "email", "your.email@example.com")}
            {renderFormField("message", "Message", "text", "How can we help you?", true)}
            {renderSubmitButton()}
            {renderStatusMessage()}
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2d1b69] to-[#1a237e] text-white scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Get In <span className="text-brand-cyan">Touch</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Have questions about our funding programs? Reach out for fast, personalized support.
          </p>
        </div>

        {/* Contact Form */}
        {renderContactForm()}
      </div>
    </section>
  );
}


