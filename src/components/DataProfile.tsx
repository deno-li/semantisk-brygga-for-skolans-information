
import React, { useState, memo, useMemo } from 'react';
import { SHANARRI_DATA } from '../data/constants';
import { X, BookOpen, ExternalLink, Info, Database, Layers, FileText, Settings, ArrowRight } from 'lucide-react';
import BBICTriangle from './BBICTriangle';

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
    childContext: 'I skolan kan ICF används för att beskriva hinder och möjligheter i lärmiljön (e-koder) samt barnets förmåga att delta i aktiviteter (d-koder).',
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

interface DataProfileProps {
  selectedProfileId?: string;
}

const DataProfile: React.FC<DataProfileProps> = ({ selectedProfileId = 'erik' }) => {
  const [selectedCode, setSelectedCode] = useState<{ type: string; code: string } | null>(null);

  const handleCloseModal = () => setSelectedCode(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white mb-4 shadow-lg">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gemensam Informationsprofil</h1>
        <p className="text-gray-600">
          Tvärsektoriell datamodell • Semantisk brygga
        </p>
      </div>

      {/* Semantic Bridge Flow Visualization */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Semantisk brygga</h3>
            <p className="text-sm text-gray-500">Från skolinformation till Socialstyrelsens informationsmängder</p>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 items-stretch mb-5">
          {/* Step 1: School Data */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">1. Skolinformation</div>
            <div className="space-y-2">
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg text-gray-700">
                📊 Frånvaro: 15%
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg text-gray-700">
                📚 Betyg: E
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg text-gray-700">
                👥 Social: Utmanande
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="text-purple-400" size={20} />
          </div>

          {/* Step 2: ICF Mapping */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2">2. ICF</div>
            <div className="space-y-2">
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg font-mono text-gray-700">
                <strong className="text-purple-600">d8</strong> - Skola
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg font-mono text-gray-700">
                <strong className="text-purple-600">d1</strong> - Lärande
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg font-mono text-gray-700">
                <strong className="text-purple-600">d710</strong> - Interaktion
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="text-red-400" size={20} />
          </div>

          {/* Step 3: ICD Diagnoses */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="text-xs font-medium text-red-600 uppercase tracking-wide mb-2">3. ICD-10/11</div>
            <div className="space-y-2">
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg font-mono text-gray-700">
                <strong className="text-red-600">F81.0</strong> - Läsnedsättning
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg font-mono text-gray-700">
                <strong className="text-red-600">F90</strong> - ADHD
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg font-mono text-gray-700">
                <strong className="text-red-600">Z00.1</strong> - Hälsokontroll
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <ArrowRight className="text-teal-400" size={20} />
          </div>

          {/* Step 4: Socialstyrelsen & Vård */}
          <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
            <div className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-2">4. Ramverk & Koder</div>
            <div className="space-y-2">
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg text-gray-700">
                <strong className="text-red-600">BBIC:</strong> Utbildning
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg text-gray-700">
                <strong className="text-orange-600">IBIC:</strong> Delaktighet
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg font-mono text-gray-700">
                <strong className="text-teal-600">SNOMED:</strong> 266981006
              </div>
              <div className="text-xs bg-white px-2 py-1.5 rounded-lg text-gray-700">
                <strong className="text-gray-600">KSI:</strong> Öppen insats
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-gray-700">
              <strong className="text-blue-700">Varför detta är viktigt:</strong> Genom att använda <strong>ICF och KSI</strong> som gemensam "översättare" kan information från skolan automatiskt
              struktureras så att socialtjänsten (BBIC/IBIC) och vården förstår den - utan att varje organisation behöver tolka rådata på nytt. Detta skapar den <strong>semantiska bryggan</strong> mellan systemen.
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Matris: Från Behov till Struktur</h3>
            <p className="text-sm text-gray-500">Klicka på en cell för att se definitionen</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="p-3 border-b border-r border-gray-200 min-w-[150px]">Behovskompass</th>
                <th className="p-3 border-b bg-purple-50/50 text-purple-700 border-r border-gray-200 min-w-[150px]">ICF</th>
                <th className="p-3 border-b border-r border-gray-200 min-w-[120px]">BBIC</th>
                <th className="p-3 border-b border-r border-gray-200 min-w-[120px]">IBIC</th>
                <th className="p-3 border-b border-r border-gray-200 min-w-[120px]">KVÅ</th>
                <th className="p-3 border-b bg-red-50/50 text-red-700 border-r border-gray-200 min-w-[130px]">ICD-10/11</th>
                <th className="p-3 border-b bg-teal-50/50 text-teal-700 border-r border-gray-200 min-w-[150px]">Snomed CT</th>
                <th className="p-3 border-b border-gray-200 min-w-[120px]">KSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {SHANARRI_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 group transition-colors">
                  <td className="p-3 border-r border-gray-200 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }}></div>
                      <span className="text-gray-900">{row.name}</span>
                    </div>
                  </td>

                  {/* ICF Cell */}
                  <td className="p-3 border-r border-gray-200 font-mono text-xs bg-purple-50/30 group-hover:bg-purple-50/60 transition-colors">
                    <button
                      onClick={() => setSelectedCode({ type: 'ICF', code: row.icf })}
                      className="w-full text-left hover:bg-purple-100 rounded-md px-1.5 py-0.5 text-purple-700 font-medium"
                    >
                      {row.icf}
                    </button>
                  </td>

                  {/* BBIC Cell */}
                  <td className="p-3 border-r border-gray-200 text-xs">
                    <button
                       onClick={() => setSelectedCode({ type: 'BBIC', code: row.bbic })}
                       className="w-full text-left hover:bg-red-50 rounded-md px-1.5 py-0.5 hover:text-red-700"
                    >
                      {row.bbic}
                    </button>
                  </td>

                  {/* IBIC Cell */}
                  <td className="p-3 border-r border-gray-200 text-xs">
                    <button
                       onClick={() => setSelectedCode({ type: 'IBIC', code: row.ibic })}
                       className="w-full text-left hover:bg-orange-50 rounded-md px-1.5 py-0.5 hover:text-orange-700"
                    >
                      {row.ibic}
                    </button>
                  </td>

                  {/* KVÅ Cell */}
                  <td className="p-3 border-r border-gray-200 text-xs font-mono text-gray-600">
                    <button
                       onClick={() => setSelectedCode({ type: 'KVÅ', code: row.kva })}
                       className="w-full text-left hover:bg-green-50 rounded-md px-1.5 py-0.5 hover:text-green-700"
                    >
                      {row.kva}
                    </button>
                  </td>

                  {/* ICD Cell */}
                  <td className="p-3 border-r border-gray-200 text-xs font-mono bg-red-50/30 group-hover:bg-red-50/60 transition-colors">
                    {row.icd ? (
                      <button
                        onClick={() => setSelectedCode({ type: 'ICD', code: row.icd || '' })}
                        className="w-full text-left hover:bg-red-100 rounded-md px-1.5 py-0.5 text-red-700 font-medium"
                      >
                        {row.icd}
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>

                  {/* Snomed CT Cell */}
                  <td className="p-3 border-r border-gray-200 text-xs font-mono bg-teal-50/30 group-hover:bg-teal-50/60 transition-colors">
                     <button
                       onClick={() => setSelectedCode({ type: 'Snomed CT', code: row.snomed })}
                       className="w-full text-left hover:bg-teal-100 rounded-md px-1.5 py-0.5 text-teal-700 font-medium"
                    >
                      {row.snomed}
                    </button>
                  </td>

                  {/* KSI Cell */}
                  <td className="p-3 text-xs font-mono text-gray-500">
                     <button
                       onClick={() => setSelectedCode({ type: 'KSI', code: row.ksi })}
                       className="w-full text-left hover:bg-gray-100 rounded-md px-1.5 py-0.5 hover:text-gray-900"
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

      {/* BBIC Triangle Visualization */}
      <BBICTriangle selectedProfileId={selectedProfileId} />

      {/* Code Details Modal */}
      {selectedCode && STANDARD_INFO[selectedCode.type] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className={`px-6 py-4 flex justify-between items-center border-b border-gray-100 ${STANDARD_INFO[selectedCode.type].color.split(' ')[1]}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${STANDARD_INFO[selectedCode.type].color.split(' ')[1]} ${STANDARD_INFO[selectedCode.type].color.split(' ')[0]}`}>
                  {STANDARD_INFO[selectedCode.type].type === 'framework' ? <Settings size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    {STANDARD_INFO[selectedCode.type].type === 'framework' ? 'Ramverk / Arbetssätt' : 'Klassifikation / Kodverk'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{STANDARD_INFO[selectedCode.type].title}</h3>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              {/* Selected Code Display */}
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <div className="text-xs text-gray-500 uppercase font-medium mb-1">
                  {STANDARD_INFO[selectedCode.type].type === 'framework' ? 'Fokusområde / Domän' : 'Vald Kod'}
                </div>
                <div className={`font-mono font-bold text-gray-900 break-words ${STANDARD_INFO[selectedCode.type].type === 'framework' ? 'text-lg' : 'text-xl'}`}>
                  {selectedCode.code}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Info size={16} className="text-gray-400" />
                  Beskrivning
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {STANDARD_INFO[selectedCode.type].description}
                </p>
              </div>

              {/* ICF Specific Explanation */}
              {selectedCode.type === 'ICF' && (
                 <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-3 text-xs uppercase tracking-wide flex items-center gap-2">
                    <Layers size={14} />
                    Kodnyckel: ICF-Struktur
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                       <span className="font-mono text-base font-bold text-purple-700 bg-white w-8 h-8 flex items-center justify-center rounded-lg shrink-0">b</span>
                       <div>
                         <strong className="block text-purple-900 text-sm">Kropp</strong>
                         <span className="text-purple-600 text-xs leading-tight block">Funktioner (body)</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-2">
                       <span className="font-mono text-base font-bold text-purple-700 bg-white w-8 h-8 flex items-center justify-center rounded-lg shrink-0">d</span>
                       <div>
                         <strong className="block text-purple-900 text-sm">Aktivitet</strong>
                         <span className="text-purple-600 text-xs leading-tight block">Delaktighet (doing)</span>
                       </div>
                    </div>
                    <div className="flex items-start gap-2">
                       <span className="font-mono text-base font-bold text-purple-700 bg-white w-8 h-8 flex items-center justify-center rounded-lg shrink-0">e</span>
                       <div>
                         <strong className="block text-purple-900 text-sm">Miljö</strong>
                         <span className="text-purple-600 text-xs leading-tight block">Omgivning (environment)</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-lg">👶</span>
                  Barnperspektivet
                </h4>
                <div className={`p-4 rounded-xl border text-sm ${STANDARD_INFO[selectedCode.type].color}`}>
                  {STANDARD_INFO[selectedCode.type].childContext}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <a
                href={STANDARD_INFO[selectedCode.type].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
              >
                Läs mer hos Socialstyrelsen <ExternalLink size={14} />
              </a>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
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

export default memo(DataProfile);
