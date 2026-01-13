import React, { memo } from 'react';
import { Construction, Calendar } from 'lucide-react';

const AnnualQualityWheel: React.FC = () => {
  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto p-8 text-center">
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Construction className="w-24 h-24 text-[#005595]" />
              <Calendar className="w-12 h-12 text-orange-500 absolute -bottom-2 -right-2" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-[#1F1F1F] mb-4">
            Årshjul - Under uppbyggnad
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            Gävlemodellens systematiska trygghetsarbete är under utveckling
          </p>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-[#005595] mb-3">Kommande funktioner:</h3>
            <ul className="text-left text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#005595] font-bold">•</span>
                <span>Årscykel med fyra faser: Kartläggning, Analys, Implementering och Uppföljning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#005595] font-bold">•</span>
                <span>Gävlemodellens fyra hörnstenar: Kartläggning, Samverkan, Uppföljning och Utveckling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#005595] font-bold">•</span>
                <span>Lagkrav och efterlevnad (SoL, HSL, Skollagen, Barnkonventionen)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#005595] font-bold">•</span>
                <span>Aktiviteter, milstolpar och framstegsspårning</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Denna vy kommer snart att innehålla ett komplett årshjul för systematiskt kvalitetsarbete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AnnualQualityWheel);
