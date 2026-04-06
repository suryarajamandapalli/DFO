import { Card } from '../ui/Card';
import { HeartPulse, Shield, MessageCircle } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">What is JanmaSethu?</h2>
          <p className="text-slate-600 text-lg">
            JanmaSethu is a comprehensive parenthood journey platform. We are not a clinic—we are the intelligence layer that empowers clinics. We support critical clinical decisions and seamlessly connect patients to verified experts when they need it most.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card delay={0.1}>
            <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 mb-6">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Intelligent Triage</h3>
            <p className="text-slate-600">
              Continuous support powered by our intelligent systems that provide immediate, localized guidance and triage queries effectively.
            </p>
          </Card>

          <Card delay={0.2}>
            <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 mb-6">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Verified Clinical Connections</h3>
            <p className="text-slate-600">
              Not just an AI chatbot. We bridge the gap to actual medical professionals when risks are detected or human empathy is required.
            </p>
          </Card>

          <Card delay={0.3}>
            <div className="w-12 h-12 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Multilingual Support</h3>
            <p className="text-slate-600">
              Care shouldn't have a language barrier. Our intelligence layer understands context and emotion across multiple local languages.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
