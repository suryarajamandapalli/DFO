import os

paths = [
    'src/pages/onboarding/SelectRole.tsx',
    'src/pages/onboarding/DoctorOnboarding.tsx',
    'src/pages/onboarding/CroOnboarding.tsx',
    'src/pages/onboarding/NurseOnboarding.tsx',
]

for p in paths:
    if os.path.exists(p):
        with open(p, 'r') as f:
            c = f.read()
        
        # Patch supabase import
        c = c.replace("from '../../lib/supabase'", "from '../../lib/supabaseClient'")
        c = c.replace('from "../../lib/supabase"', 'from "../../lib/supabaseClient"')
        
        # Patch shadcn elements
        c = c.replace("from '@/components/ui/button'", "from '@/components/ui/button'") 
        
        # Patch motion/react
        c = c.replace('framer-motion', 'motion/react')
        
        # Patch React
        if 'import React' not in c:
            c = 'import React from "react";\n' + c

        with open(p, 'w') as f:
            f.write(c)
        print(f"Patched {p}")
