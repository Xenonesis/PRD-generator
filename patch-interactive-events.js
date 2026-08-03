const fs = require('fs');
let code = fs.readFileSync('components/InteractiveForm.tsx', 'utf8');

const target = "const [searchQuery, setSearchQuery] = useState<string>('');";
const replacement = `const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleSetTab = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('SET_ACTIVE_TAB', handleSetTab);
    return () => window.removeEventListener('SET_ACTIVE_TAB', handleSetTab);
  }, []);`;

if (code.includes(target) && !code.includes('SET_ACTIVE_TAB')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('components/InteractiveForm.tsx', code);
  console.log('Patched InteractiveForm with SET_ACTIVE_TAB');
} else {
  console.log('Target not found or already patched.');
}
