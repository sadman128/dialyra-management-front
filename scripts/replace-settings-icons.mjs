import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/app/(dashboard)/settings/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import { Icon }')) {
  content = content.replace(
    'import { useBusiness } from "@/context/BusinessContext";',
    'import { useBusiness } from "@/context/BusinessContext";\nimport { Icon } from "@/components/ui/Icon";'
  );
}

// Replace pattern:
// <span className="material-symbols-outlined...">...</span>
content = content.replace(/<span\s+className=["']material-symbols-outlined\s*([^"']*)["']>\s*([\w_]+)\s*<\/span>/g, (match, extraClasses, iconName) => {
  const cleanClasses = extraClasses.trim();
  return `<Icon name="${iconName}"${cleanClasses ? ` className="${cleanClasses}"` : ''} />`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Settings icons replaced successfully!');
