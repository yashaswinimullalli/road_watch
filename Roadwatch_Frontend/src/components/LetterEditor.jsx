import { useState } from 'react';
import { Send, FileText, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

export default function LetterEditor({ initialContent, onSubmit }) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Wait a moment then trigger callback
      setTimeout(() => {
        if (onSubmit) onSubmit();
      }, 2500);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Report Officially Filed!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md px-6">
          Your formal complaint has been securely forwarded to the municipal authorities. A vote has also been automatically added to the Community Poll.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex flex-col w-full mt-4 max-w-full">
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Formal Complaint Draft</span>
        </div>
        <span className="text-xs bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 px-2 py-1 rounded font-medium">Editable A4 Format</span>
      </div>
      
      <div className="p-4 md:p-6 bg-slate-100 dark:bg-slate-800/50 flex justify-center">
        {/* A4 Paper Styling */}
        <div className="bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-700 p-6 md:p-8 w-full max-w-lg aspect-[1/1.414] font-serif text-slate-800 dark:text-slate-300">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 leading-relaxed text-sm"
          />
        </div>
      </div>
      
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Please verify the details before submitting.</p>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            type="button"
            className="btn-secondary py-2.5 px-4 text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={() => {/* Hook for future AI integration */}}
          >
            <RefreshCw className="w-4 h-4" /> Re-write
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</>
            ) : (
              <><Send className="w-4 h-4" /> Finalize & Submit Letter</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
