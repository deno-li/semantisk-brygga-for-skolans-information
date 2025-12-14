
import React, { useState } from 'react';
import { SHANARRI_DATA } from '../constants';
import { X, BookOpen, ExternalLink, Info, Database, Layers, FileText, Settings } from 'lucide-react';

interface CodeStandardInfo {
  type: 'classification' | 'framework'; // New field to distinguish type
  title: string;
  description: string;
  childContext: string;
  link: string;
  color: string;
}

const STANDARD_INFO: Record<string, CodeStandardInfo> = {
  'ICF': {
    type: 'classification',
    title: 'ICF (Funktionstillstånd)',
    description: 'Internationell klassifikation av funktionstillstånd, funktionshinder och hälsa. Ett kodverk från WHO som skiftar fokus från diagnos ("vad är fel") till funktion ("hur fungerar vardagen").',
    childContext: 'I skolan används ICF-CY (Children & Youth) för att beskriva hinder och möjligheter i lärmiljön (e-koder) samt barnets förmåga att delta i aktiviteter (d-koder).',
    link: 'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/icf/',
    color: 'text-purple-700 bg-purple-50 border-purple-200'
  },
  'BBIC': {
    type: 'framework',
    title: 'BBIC (Socialtjänst)',
    description: 'Barns Behov i Centrum. Detta är inte ett kodverk utan ett enhetligt ledningssystem och arbetssätt för socialtjänstens handläggning. BBIC strukturerar informationen men använder inte egna diagnoskoder.',
    childContext: 'BBIC-triangeln används för att kartlägga "Barnets behov", "Föräldrarnas förmåga" och "Familj & Miljö". Det säkrar att utredningen täcker hela barnets livssituation.',
    link: 'https://www.socialstyrelsen.se/utveckla-verksamhet/barn-och-unga/bbic/',
    color: 'text-red-700 bg-red-50 border-red-200'
  },
  'IBIC': {
    type: 'framework',
    title: 'IBIC (Omsorg)',
    description: 'Individens Behov i Centrum. Ett arbetssätt (ej kodverk) för att utreda och följa upp behov av stöd enligt LSS och SoL. IBIC använder klassifikationen ICF för att beskriva funktionstillstånd.',
    childContext: 'Genom att använda IBIC (arbetssättet) och ICF (koderna) säkerställer vi att insatserna matchar exakt de behov och mål barnet har i sin vardag.',
    link: 'https://www.socialstyrelsen.se/utveckla-verksamhet/aldre/ibic/',
    color: 'text-orange-700 bg-orange-50 border-orange-200'
  },
  'KVÅ': {
    type: 'classification',
    title: 'KVÅ (Vårdåtgärder)',
    description: 'Klassifikation av vårdåtgärder. Socialstyrelsens kodverk för att beskriva åtgärder som utförs inom hälso- och sjukvården.',
    childContext: 'Inom elevhälsan (EMI) används KVÅ för att dokumentera hälsosamtal (t.ex. AU120), vaccinationer och bedömningar, vilket möjliggör uppföljning av preventivt arbete.',
    link: 'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/kva/',
    color: 'text-green-700 bg-green-50 border-green-200'
  },
  'ICD': {
    type: 'classification',
    title: 'ICD-10 (Diagnos)',
    description: 'International Classification of Diseases. Det globala kodverket för att klassificera sjukdomar och hälsoproblem.',
    childContext: 'Används för att säkerställa medicinska rättigheter (t.ex. vid dyslexi eller allergi), men kompletteras ofta med ICF för att beskriva hur diagnosen påverkar vardagen.',
    link: 'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/icd-10/',
    color: 'text-red-700 bg-red-50 border-red-200'
  },
  'Snomed CT': {
    type: 'classification',
    title: 'Snomed CT (Terminologi)',
    description: 'Systematized Nomenclature of Medicine – Clinical Terms. Världens mest omfattande kliniska terminologi. Används för att detaljerat beskriva vårdens innehåll oberoende av språk.',
    childContext: 'Genom att använda Snomed CT kan vi beskriva detaljer som "oro inför skolstart" eller "behov av bildstöd" på ett sätt som alla system förstår, vilket minskar risken för missförstånd.',
    link: 'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/snomed-ct/',
    color: 'text-teal-700 bg-teal-50 border-teal-200'
  },
  'KSI': {
    type: 'classification',
    title: 'KSI (Klassifikation)',
    description: 'Kommunernas Socialtjänsts Informationssystem. Ett kodverk specifikt för officiell statistikrapportering till Socialstyrelsen.',
    childContext: 'Dessa koder används för nationell uppföljning och anger typen av insats (t.ex. "Kontaktfamilj") snarare än det individuella innehållet i stödet.',
    link: 'https://www.socialstyrelsen.se/statistik-och-data/statistik/alla-statistikamnen/socialtjanstinsatser-till-barn-och-unga/',
    color: 'text-gray-700 bg-gray-50 border-gray-200'
  }
};

const DataProfile: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<{ type: string; code: string } | null>(null);

  const handleCloseModal = () => setSelectedCode(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">🔄 Gemensam Informationsprofil</h2>
          <p className="text-sm text-gray-500">
            Tvärsektoriell datamodell som skiljer på <span className="font-semibold text-[#005595]">Arbetssätt</span> (BBIC, IBIC) och <span className="font-semibold text-purple-700">Kodverk</span> (ICF, KVÅ, KSI, Snomed CT).
          </p>
        </div>
      </div>

      <div className="mb-8 flex gap-4">
        <a 
          href="https://docs.google.com/spreadsheets/d/1fvYiSUY7hLiLOr1QpWGif9_GD7KUo-KS/edit?gid=1173368630#gid=1173368630" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
        >
          <Database size={16} /> Källdata: Mappning Behovskompass (Google Sheets) <ExternalLink size={14} />
        </a>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Matris: Från Behov till Struktur</h3>
        <p className="text-sm text-gray-600 mb-4">
          Klicka på en cell i tabellen för att se definitionen av ramverket eller kodverket.
        </p>
        
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="p-3 border-b border-r min-w-[150px]">Behovskompass</th>
                <th className="p-3 border-b bg-purple-50 text-purple-800 border-r border-purple-100 w-1/6 min-w-[150px]">ICF (Kodverk)</th>
                <th className="p-3 border-b border-r w-1/6 min-w-[120px]">BBIC (Arbetssätt)</th>
                <th className="p-3 border-b border-r w-1/6 min-w-[120px]">IBIC (Arbetssätt)</th>
                <th className="p-3 border-b border-r w-1/6 min-w-[120px]">KVÅ (Kodverk)</th>
                <th className="p-3 border-b border-r bg-teal-50 text-teal-800 border-teal-100 w-1/6 min-w-[150px]">Snomed CT</th>
                <th className="p-3 border-b w-1/6 min-w-[120px]">KSI (Klassifikation)</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {SHANARRI_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 group transition-colors">
                  <td className="p-3 border-r font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: row.color }}></div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  
                  {/* ICF Cell */}
                  <td className="p-3 border-r font-mono text-xs bg-purple-50/30 group-hover:bg-purple-50/60 transition-colors">
                    <button 
                      onClick={() => setSelectedCode({ type: 'ICF', code: row.icf })}
                      className="w-full text-left hover:bg-purple-100 rounded px-1 py-0.5 text-purple-700 font-semibold"
                    >
                      {row.icf}
                    </button>
                  </td>

                  {/* BBIC Cell */}
                  <td className="p-3 border-r text-xs">
                    <button 
                       onClick={() => setSelectedCode({ type: 'BBIC', code: row.bbic })}
                       className="w-full text-left hover:bg-red-50 rounded px-1 py-0.5 hover:text-red-800"
                    >
                      {row.bbic}
                    </button>
                  </td>

                  {/* IBIC Cell */}
                  <td className="p-3 border-r text-xs">
                    <button 
                       onClick={() => setSelectedCode({ type: 'IBIC', code: row.ibic })}
                       className="w-full text-left hover:bg-orange-50 rounded px-1 py-0.5 hover:text-orange-800"
                    >
                      {row.ibic}
                    </button>
                  </td>

                  {/* KVÅ/ICD Cell */}
                  <td className="p-3 border-r text-xs font-mono text-gray-600">
                    <button 
                       onClick={() => setSelectedCode({ type: 'KVÅ', code: row.kva })}
                       className="w-full text-left hover:bg-green-50 rounded px-1 py-0.5 hover:text-green-800"
                    >
                      {row.kva}
                    </button>
                    {row.icd && (
                      <button 
                        onClick={() => setSelectedCode({ type: 'ICD', code: row.icd || '' })}
                        className="mt-1 w-full text-left bg-red-50 text-red-700 px-1 py-0.5 rounded hover:bg-red-100"
                      >
                        {row.icd}
                      </button>
                    )}
                  </td>

                  {/* Snomed CT Cell */}
                  <td className="p-3 border-r text-xs font-mono bg-teal-50/30 group-hover:bg-teal-50/60 transition-colors">
                     <button 
                       onClick={() => setSelectedCode({ type: 'Snomed CT', code: row.snomed })}
                       className="w-full text-left hover:bg-teal-100 rounded px-1 py-0.5 text-teal-700 font-semibold"
                    >
                      {row.snomed}
                    </button>
                  </td>

                  {/* KSI Cell */}
                  <td className="p-3 text-xs font-mono text-gray-500">
                     <button 
                       onClick={() => setSelectedCode({ type: 'KSI', code: row.ksi })}
                       className="w-full text-left hover:bg-gray-100 rounded px-1 py-0.5 hover:text-gray-900"
                    >
                      {row.ksi}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Details Modal */}
      {selectedCode && STANDARD_INFO[selectedCode.type] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className={`px-6 py-4 flex justify-between items-center border-b ${STANDARD_INFO[selectedCode.type].color.split(' ')[1]}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/50 ${STANDARD_INFO[selectedCode.type].color.split(' ')[0]}`}>
                  {STANDARD_INFO[selectedCode.type].type === 'framework' ? <Settings size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-70">
                    {STANDARD_INFO[selectedCode.type].type === 'framework' ? 'Ramverk / Arbetssätt' : 'Klassifikation / Kodverk'}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{STANDARD_INFO[selectedCode.type].title}</h3>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Selected Code Display */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                  {STANDARD_INFO[selectedCode.type].type === 'framework' ? 'Fokusområde / Domän' : 'Vald Kod'}
                </div>
                <div className={`font-mono font-bold text-gray-800 break-words ${STANDARD_INFO[selectedCode.type].type === 'framework' ? 'text-lg' : 'text-xl'}`}>
                  {selectedCode.code}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Info size={16} className="text-gray-400" />
                  Beskrivning
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {STANDARD_INFO[selectedCode.type].description}
                </p>
              </div>

              {/* ICF Specific Explanation */}
              {selectedCode.type === 'ICF' && (
                 <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="font-bold text-purple-900 mb-3 text-xs uppercase tracking-wide flex items-center gap-2">
                    <Layers size={14} />
                    Kodnyckel: ICF-Struktur
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                       <span className="font-mono text-lg font-bold text-purple-700 bg-purple-100 w-8 h-8 flex items-center justify-center rounded shrink-0">b</span>
                       <div>
                         <strong className="block text-purple-900">Kropp</strong>
                         <span className="text-purple-700 text-xs leading-tight block">Funktioner (body) t.ex. minne.</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-2">
                       <span className="font-mono text-lg font-bold text-purple-700 bg-purple-100 w-8 h-8 flex items-center justify-center rounded shrink-0">d</span>
                       <div>
                         <strong className="block text-purple-900">Aktivitet</strong>
                         <span className="text-purple-700 text-xs leading-tight block">Delaktighet (doing) t.ex. leka.</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-2">
                       <span className="font-mono text-lg font-bold text-purple-700 bg-purple-100 w-8 h-8 flex items-center justify-center rounded shrink-0">e</span>
                       <div>
                         <strong className="block text-purple-900">Miljö</strong>
                         <span className="text-purple-700 text-xs leading-tight block">Omgivning (environment).</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-xl">👶</span>
                  Barnperspektivet (Varför gör vi detta?)
                </h4>
                <div className={`p-4 rounded-lg border text-sm ${STANDARD_INFO[selectedCode.type].color}`}>
                  {STANDARD_INFO[selectedCode.type].childContext}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <a 
                href={STANDARD_INFO[selectedCode.type].link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#005595] hover:underline flex items-center gap-1"
              >
                Läs mer hos Socialstyrelsen <ExternalLink size={14} />
              </a>
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataProfile;