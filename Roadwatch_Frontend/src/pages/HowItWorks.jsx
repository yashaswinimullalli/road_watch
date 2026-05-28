import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Compass, Cpu, FileEdit, ShieldCheck, ThumbsUp, LineChart, ChevronDown } from 'lucide-react';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
      title: "GPS Location Detection",
      desc: "Requests coordinates from your browser. Nominatim OpenStreetMap reverse-geocodes it into a precise, human-readable address."
    },
    {
      icon: <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: "Overpass API Road Detection",
      desc: "Queries the OpenStreetMap database to identify the road classification (residential, secondary, primary, etc.) and jurisdiction."
    },
    {
      icon: <Cpu className="w-5 h-5 text-red-600 dark:text-red-400" />,
      title: "AI Road Damage Analysis",
      desc: "Runs YOLOv8 computer vision model on the uploaded image to classify the road hazard type and verify the severity level."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: "Transparency Data Mapping",
      desc: "Retrieves municipal transparency records: local contractor name, budget allocated, amount spent, and last relaying date."
    },
    {
      icon: <FileEdit className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: "Complaint Letter Generation",
      desc: "Compiles a formal citizen complaint letter detailing coordinates, damage type, contractor info, and budget discrepancies."
    },
    {
      icon: <ThumbsUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: "Poll & Support Vote System",
      desc: "Detects existing reports within 150m. If matched, it increments the support vote instead of creating a duplicate."
    },
    {
      icon: <LineChart className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      title: "Dashboard Tracking",
      desc: "Aggregates reports, status levels (Pending, In Progress, Resolved) and community votes on the public dashboard."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-500 font-medium transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      {/* Header */}
      <div className="text-center mb-8 md:mb-16">
        <span className="px-3 py-1 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-brand-200 dark:border-brand-500/20">
          Platform Architecture Flow
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
          How Road Sathi Works
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto text-sm md:text-base">
          Follow the sequential flow of data, API triggers, and AI verification from user submission to dashboard action.
        </p>
      </div>

      {/* Vertical Flowchart Timeline */}
      <div className="relative min-h-[500px]">
        {/* Central connecting flowchart line */}
        <div className="absolute left-5 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-500 via-indigo-500 via-emerald-500 to-amber-500 transform md:-translate-x-1/2 rounded-full"></div>

        {/* Step List */}
        <div className="space-y-8 md:space-y-12">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <div 
                key={idx} 
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Central Flow Node with index number */}
                <div className="absolute left-5 md:left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-900 dark:bg-slate-800 text-white border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center font-bold text-xs md:text-sm shadow-md transition-transform hover:scale-110">
                    {idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="absolute top-9 md:top-10 flex flex-col items-center">
                      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-600 animate-bounce mt-1" />
                    </div>
                  )}
                </div>

                {/* Flowchart Card Panel */}
                <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="flowchart-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-default">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 shadow-inner shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="font-bold text-sm md:text-lg text-slate-900 dark:text-white leading-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Spacer for large screens */}
                <div className="hidden md:block w-1/2"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
