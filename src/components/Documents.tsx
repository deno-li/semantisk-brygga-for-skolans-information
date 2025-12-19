
import React from 'react';
import { FileText, Download, ExternalLink, Shield, FileCheck } from 'lucide-react';
import { DOCUMENTS_DATA } from '../data/constants';

const Documents: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       {/* Header */}
       <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">Hantera samtycke</h2>
       </div>

       <div className="grid gap-6">
         {DOCUMENTS_DATA.map((section, idx) => (
           <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
             <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
               <h3 className="font-bold text-[#005595] uppercase tracking-wide text-sm">{section.category}</h3>
               <Shield size={14} className="text-gray-400" />
             </div>
             <div className="divide-y divide-gray-100">
               {section.items.map((doc, i) => (
                 <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                   <div className="flex items-start gap-4">
                     <div className="p-2 bg-blue-50 text-[#005595] rounded shrink-0">
                       <FileText size={24} />
                     </div>
                     <div>
                       <h4 className="font-bold text-[#1F1F1F] group-hover:text-[#005595] transition-colors">
                         {doc.title}
                       </h4>
                       <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                         <span className="flex items-center gap-1"><FileCheck size={12}/> {doc.date}</span>
                         <span className="hidden sm:inline">•</span>
                         <span>{doc.author}</span>
                         <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                           doc.status === 'Signerad' || doc.status === 'Aktivt' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                         }`}>
                           {doc.status}
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2 self-end sm:self-center">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">{doc.type}</span>
                     {doc.link ? (
                       <a 
                         href={doc.link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-2 bg-white border border-[#005595] text-[#005595] font-semibold text-sm hover:bg-[#005595] hover:text-white px-4 py-2 rounded transition-all"
                       >
                         Öppna <ExternalLink size={16} />
                       </a>
                     ) : (
                       <button className="flex items-center gap-2 bg-[#F3F3F3] hover:bg-gray-200 text-[#1F1F1F] font-semibold text-sm px-4 py-2 rounded transition-colors">
                         Ladda ner <Download size={16} />
                       </button>
                     )}
                   </div>
                 </div>
               ))}
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};

export default Documents;
