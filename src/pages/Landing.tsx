import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { DFOArchitecture } from '../components/sections/DFOArchitecture';
import { ThreadClassification } from '../components/sections/ThreadClassification';
import { RoleBasedSystem } from '../components/sections/RoleBasedSystem';
import { CoreFeatures } from '../components/sections/CoreFeatures';
import { SystemIntelligence } from '../components/sections/SystemIntelligence';
import { CTASection } from '../components/sections/CTASection';

export function Landing() {
  return (
    <>
      <HeroSection />
      <div id="about">
        <AboutSection />
      </div>
      <DFOArchitecture />
      <div id="intelligence">
        <ThreadClassification />
      </div>
      <div id="roles">
        <RoleBasedSystem />
      </div>
      <div id="features">
        <CoreFeatures />
      </div>
      <SystemIntelligence />
      <CTASection />
    </>
  );
}
