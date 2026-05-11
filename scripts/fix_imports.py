import os

paths = [
    'src/pages/Landing.tsx',
    'src/components/sections/HeroSection.tsx',
    'src/components/sections/AboutSection.tsx',
    'src/components/sections/DFOArchitecture.tsx',
    'src/components/sections/RoleBasedSystem.tsx',
    'src/components/sections/CoreFeatures.tsx',
    'src/components/sections/CTASection.tsx',
    'src/components/sections/Footer.tsx',
    'src/components/sections/Navbar.tsx',
]

for p in paths:
    if os.path.exists(p):
        with open(p, 'r') as f:
            c = f.read()
        
        c = c.replace("from '../ui/Card'", "from './Card'")
        c = c.replace('from "../ui/Card"', 'from "./Card"')
        c = c.replace('framer-motion', 'motion/react')
        c = c.replace("from '../../lib/utils'", "from '@/lib/utils'")
        
        with open(p, 'w') as f:
            f.write(c)
        print(f"Processed {p}")
