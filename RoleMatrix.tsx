
import React, { useState } from 'react';
import { ShieldCheck, Server, Globe, User, Users, Stethoscope, GraduationCap, Building2 } from 'lucide-react';

type RoleType = 'guardian' | 'child' | 'school' | 'health' | 'social' | 'all';

const RoleMatrix: React.FC = () => {
  const [activeRole, setActiveRole] = useState<RoleType>('all');

  const roles = [
    { id: 'all', label: 'Visa Alla', icon: <Users size={16}/>, color: 'bg-gray-800 text-white' },
    { id: 'guardian', label: 'Vårdnadshavare', icon: <User size={16}/>, color: 'bg-yellow-600 text-white' },
    { id: 'child', label: 'Barn (13+)', icon: <User size={16}/>, color: 'bg-orange-500 text-white' },
    { id: 'school', label: 'Skola', icon: <GraduationCap size={16}/>, color: 'bg-blue-600 text-white' },
    { id: 'health', label: 'Vård', icon: <Stethoscope size={16}/>, color: 'bg-green-600 text-white' },
    { id: 'social', label: 'Socialtjänst', icon: <Building2 size={16}/>, color: 'bg-red-600 text-white' },
  ];

  const getOpacity = (columnRole: string) => {
    if (activeRole === 'all') return 'opacity-100';
    return activeRole === columnRole ? 'opacity-100 bg-gray-50' : 'opacity-30 blur-[1px]';
  };

  const getHighlight = (columnRole: string) => {
    return activeRole === columnRole ? 'ring-2 ring-offset-2 ring-blue-500 rounded-lg' : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-fade-in">
       <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">Roller & Behörighet</h2>
          <p className="text-gray-600 max-w-3xl">
            Styrning av åtkomst baseras på Digg:s ramverk för samordnad identitet. 
            Välj en roll nedan för att simulera deras vy.
          </p>
       </div>

       {/* Role Simulator Toggles */}
       <div className="flex flex-wrap gap-3 mb-8">
         {roles.map(role => (
           <button
             key={role.id}
             onClick={() => setActiveRole(role.id as RoleType)}
             className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
               activeRole === role.id ? role.color : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
             }`}
           >
             {role.icon} {role.label}
           </button>
         ))}
       </div>

       <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
             <thead>
                <tr className="bg-[#F3F3F3] text-[#1F1F1F]">
                  <th className="p-4 font-bold border-b-2 border-[#005595] min-w-[200px]">Information</th>
                  <th className={`p-4 font-bold border-b-2 border-gray-300 text-center transition-all ${getHighlight('guardian')}`}>
                    <div className="flex flex-col items-center"><span>Vårdnadshavare</span></div>
                  </th>
                  <th className={`p-4 font-bold border-b-2 border-gray-300 text-center transition-all ${getHighlight('child')}`}>
                    <div className="flex flex-col items-center"><span>Barn (13+)</span></div>
                  </th>
                  <th className={`p-4 font-bold border-b-2 border-gray-300 text-center transition-all ${getHighlight('school')}`}>
                    <div className="flex flex-col items-center"><span>Skola</span></div>
                  </th>
                  <th className={`p-4 font-bold border-b-2 border-gray-300 text-center transition-all ${getHighlight('health')}`}>
                    <div className="flex flex-col items-center"><span>Vård</span></div>
                  </th>
                  <th className={`p-4 font-bold border-b-2 border-gray-300 text-center transition-all ${getHighlight('social')}`}>
                    <div className="flex flex-col items-center"><span>Socialtjänst</span></div>
                  </th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-200 bg-white">
                {/* Skola Section */}
                <tr className="bg-blue-50/50">
                   <td className="p-4 font-bold text-[#005595] uppercase tracking-wider" colSpan={6}>
                     <div className="flex items-center gap-2">
                       <Globe size={16} /> Skola (SS 12000)
                     </div>
                   </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                   <td className="p-4 font-medium">
                     Åtgärdsprogram
                     <div className="text-xs text-gray-500 mt-0.5">Stödinsatser och mål</div>
                   </td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('guardian')}`}>●</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('child')}`}>●</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('school')}`}>●</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('health')}`}>●</td>
                   <td className={`p-4 text-center text-[#E87C00] font-bold transition-opacity ${getOpacity('social')}`}>◐</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                   <td className="p-4 font-medium">
                     Trygghetsenkät (Gävle)
                     <div className="text-xs text-gray-500 mt-0.5">Aggregerad & Individuell</div>
                   </td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('guardian')}`}>●</td>
                   <td className={`p-4 text-center text-[#E87C00] font-bold transition-opacity ${getOpacity('child')}`}>◐</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('school')}`}>●</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('health')}`}>●</td>
                   <td className={`p-4 text-center text-[#E87C00] font-bold transition-opacity ${getOpacity('social')}`}>◐</td>
                </tr>

                {/* Vård Section */}
                <tr className="bg-green-50/50">
                   <td className="p-4 font-bold text-[#378056] uppercase tracking-wider" colSpan={6}>
                      <div className="flex items-center gap-2">
                       <ShieldCheck size={16} /> Vård (PDL/HSL)
                     </div>
                   </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                   <td className="p-4 font-medium">
                     Journal (EMI/BVC)
                     <div className="text-xs text-gray-500 mt-0.5">Hälsosamtal, Vaccinationer</div>
                   </td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('guardian')}`}>●</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('child')}`}>●</td>
                   <td className={`p-4 text-center text-gray-300 font-bold transition-opacity ${getOpacity('school')}`}>○</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('health')}`}>●</td>
                   <td className={`p-4 text-center text-[#E87C00] font-bold transition-opacity ${getOpacity('social')}`}>◐</td>
                </tr>

                {/* Social Section */}
                <tr className="bg-red-50/50">
                   <td className="p-4 font-bold text-[#B00020] uppercase tracking-wider" colSpan={6}>Socialtjänst (SoL)</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                   <td className="p-4 font-medium">
                     BBIC Utredning
                     <div className="text-xs text-gray-500 mt-0.5">Känsliga personuppgifter</div>
                   </td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('guardian')}`}>●</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('child')}`}>●</td>
                   <td className={`p-4 text-center text-[#E87C00] font-bold transition-opacity ${getOpacity('school')}`}>◐</td>
                   <td className={`p-4 text-center text-[#E87C00] font-bold transition-opacity ${getOpacity('health')}`}>◐</td>
                   <td className={`p-4 text-center text-[#378056] font-bold transition-opacity ${getOpacity('social')}`}>●</td>
                </tr>
             </tbody>
          </table>
       </div>
       
       <div className="bg-[#EBF4FA] p-4 rounded mt-6 border border-blue-200 flex flex-wrap gap-6 text-sm text-[#1F1F1F]">
          <div className="font-semibold text-[#005595]">Teckenförklaring:</div>
          <span className="flex items-center gap-2"><span className="text-[#378056] text-lg leading-none">●</span> Full tillgång (Direktåtkomst)</span>
          <span className="flex items-center gap-2"><span className="text-[#E87C00] text-lg leading-none">◐</span> Vid samtycke / SIP (Begränsad vy)</span>
          <span className="flex items-center gap-2"><span className="text-gray-300 text-lg leading-none">○</span> Ingen åtkomst (Sekretess)</span>
       </div>
    </div>
  );
};

export default RoleMatrix;
