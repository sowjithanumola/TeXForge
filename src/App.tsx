import {useState, useEffect, useRef} from 'react';
import katex from 'katex';
import {Copy, Download, Trash2, BookOpen, Sigma, X} from 'lucide-react';
import {toPng} from 'html-to-image';

const SYMBOLS = [
  '\\frac', '\\int', '\\sum', '\\sqrt', '\\alpha', '\\beta', '\\infty', '\\pi',
  '\\partial', '\\nabla', '\\vec', '\\lim', '\\sin', '\\cos', '\\tan', '\\log',
  '\\in', '\\subset', '\\forall', '\\exists', '\\rightarrow', '\\Rightarrow', '\\neq', '\\approx',
  '\\Gamma', '\\Omega', '\\wedge', '\\otimes', '\\mathbb{Z}', '\\mathbb{R}', '\\mathbb{C}', '\\oplus',
  '\\cong', '\\langle', '\\rangle', '\\psi', '\\phi', '\\hat{H}', '\\ket', '\\bra'
];
const TEMPLATES = [
  {name: 'Algebra', code: '(a+b)^2 = a^2 + 2ab + b^2'},
  {name: 'Calculus', code: '\\int_a^b f(x) dx'},
  {name: 'Statistics', code: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i'},
  {name: 'Linear Algebra', code: 'A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'},
  {name: 'Quantum Mech', code: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi(r,t) = \\hat{H} \\Psi(r,t)'},
  {name: 'General Relativity', code: 'R_{\\mu\\nu} - \\frac{1}{2}R g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}'},
  {name: 'Diff Geometry', code: '\\Gamma^k_{ij} = \\frac{1}{2}g^{kl}(\\partial_j g_{li} + \\partial_i g_{lj} - \\partial_l g_{ij})'},
  {name: 'Abstract Algebra', code: 'G \\cong H \\iff \\exists \\phi: G \\to H'},
  {name: 'Dirac Notation', code: '\\langle \\psi | \\hat{A} | \\phi \\rangle'},
];

export default function App() {
  const [latex, setLatex] = useState<string>('');
  const [activePanel, setActivePanel] = useState<'symbols' | 'templates' | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      try {
        katex.render(latex || '\\text{Enter LaTeX code to preview...}', previewRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [latex]);

  const insertLatex = (code: string) => {
    setLatex((prev) => prev + code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(latex);
  };

  const downloadImage = () => {
    if (previewRef.current) {
      toPng(previewRef.current).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'equation.png';
        link.href = dataUrl;
        link.click();
      });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#E4E3E0] text-[#141414] font-sans">
      {/* Sidebar */}
      <div className="w-16 border-r border-[#141414]/10 bg-white/30 backdrop-blur-2xl flex flex-col items-center py-4 gap-4 shadow-2xl">
        <div className="font-serif italic text-xl font-bold mb-4">TF</div>
        <button 
          className={`p-2 rounded-xl transition ${activePanel === 'symbols' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/10'}`}
          onClick={() => setActivePanel(activePanel === 'symbols' ? null : 'symbols')}
        >
          <Sigma size={20}/>
        </button>
        <button 
          className={`p-2 rounded-xl transition ${activePanel === 'templates' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/10'}`}
          onClick={() => setActivePanel(activePanel === 'templates' ? null : 'templates')}
        >
          <BookOpen size={20}/>
        </button>
      </div>

      {/* Panels */}
      {activePanel && (
        <div className="w-64 border-r border-[#141414]/20 bg-white/40 backdrop-blur-lg p-4 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-mono text-xs uppercase tracking-wider">Frosted Glass Cards</h2>
            <button onClick={() => setActivePanel(null)}><X size={16}/></button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {activePanel === 'symbols' && SYMBOLS.map(s => (
              <button key={s} onClick={() => insertLatex(s)} className="p-1 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] font-mono text-[10px] truncate" title={s}>
                {s}
              </button>
            ))}
            {activePanel === 'templates' && TEMPLATES.map(t => (
              <button key={t.name} onClick={() => insertLatex(t.code)} className="col-span-4 p-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] text-sm text-left">
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-[#141414] flex items-center justify-between px-4">
          <div className="font-serif italic text-lg font-bold">TeXForge</div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] rounded" onClick={copyToClipboard} title="Copy LaTeX"><Copy size={16}/></button>
            <button className="p-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] rounded" onClick={downloadImage} title="Download Image"><Download size={16}/></button>
            <button 
              className="p-1.5 hover:bg-[#141414] hover:text-[#E4E3E0] rounded text-red-600"
              onClick={() => setLatex('')}
              title="Clear Editor"
            >
              <Trash2 size={16}/>
            </button>
          </div>
        </div>

        {/* Editor & Preview */}
        <div className="flex-1 flex">
          <div className="flex-1 border-r border-[#141414]">
            <textarea
              className="w-full h-full p-6 font-mono text-base leading-relaxed bg-[#F9F8F5] focus:bg-white focus:outline-none transition-colors duration-200 resize-none"
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              spellCheck="false"
            />
          </div>
          <div className="flex-1 p-8 bg-white overflow-auto">
            <div ref={previewRef} className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
