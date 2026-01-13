import React, { useState } from 'react';
import {
  BookOpen, Database, Share2, TrendingUp, Code, CheckSquare,
  ChevronDown, ChevronUp, Info, Eye, Lock, AlertTriangle
} from 'lucide-react';
import {
  JOURNEY_LEVELS,
  WELFARE_WHEEL_SPOKES,
  ESCALATION_RULES,
  CODE_SYSTEMS,
  LEVEL_COLORS,
  getSpokeColor
} from '../data/journeyConstants';

type TabType = 'overview' | 'levels' | 'wheel' | 'escalation' | 'code-systems';

const MatrixOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const tabs = [
    { id: 'overview', name: 'Översikt', icon: BookOpen },
    { id: 'levels', name: 'Nivåmodell', icon: TrendingUp },
    { id: 'wheel', name: 'Välbefinnandehjul', icon: Eye },
    { id: 'escalation', name: 'Eskalering', icon: AlertTriangle },
    { id: 'code-systems', name: 'Kodsystem', icon: Code }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Barnets Resa - Matrisöversikt</h1>
        <p className="text-blue-100">
          Omfattande modell för barnets välfärd från universell nivå till samordnade insatser
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <Database size={16} />
            <span>ICF • KSI • SNOMED • SS 12000</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 size={16} />
            <span>Tvärsektoriell samverkan</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* ÖVERSIKT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Syfte och omfattning</h2>
                <p className="text-gray-700 leading-relaxed">
                  Barnets resa-matrisen knyter ihop hälsofrämjande/förebyggande arbete med riktat stöd och
                  samordnade insatser i en gemensam profil. Modellen har <strong>3 nivåer</strong>,
                  <strong>8 välbefinnandeekrar</strong>, och integrerar <strong>semantisk mappning</strong> till
                  ICF, KSI, SNOMED CT och skolans informationsstandard SS 12000.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700 mb-2">3</div>
                  <div className="font-semibold text-blue-900">Nivåer</div>
                  <div className="text-sm text-blue-700">Universell → Stöd → Samordning</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-700 mb-2">8</div>
                  <div className="font-semibold text-purple-900">Välbefinnandeekrar</div>
                  <div className="text-sm text-purple-700">Med ICF/KSI-mappning</div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-700 mb-2">6</div>
                  <div className="font-semibold text-green-900">Kodsystem</div>
                  <div className="text-sm text-green-700">ICF, KSI, SNOMED, ICD, KVÅ, SS 12000</div>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
                <div className="flex items-start gap-3">
                  <Info className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">Nyckelprinciper</h3>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>• <strong>Dataminimering:</strong> Endast nödvändig information delas på varje nivå</li>
                      <li>• <strong>Multi-perspektiv:</strong> Barn, vårdnadshavare och profession ser olika vyer</li>
                      <li>• <strong>Automatisk eskalering:</strong> Triggrar säkerställer rätt stödnivå vid rätt tillfälle</li>
                      <li>• <strong>Semantisk interoperabilitet:</strong> Gemensamt språk över sektorsgränser</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NIVÅMODELL */}
          {activeTab === 'levels' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nivåmodell (3 nivåer)</h2>
              {JOURNEY_LEVELS.map((level) => (
                <div
                  key={level.level}
                  className="border-l-4 rounded-lg overflow-hidden shadow"
                  style={{ borderColor: LEVEL_COLORS[level.level].border }}
                >
                  <div
                    className="p-6 cursor-pointer"
                    style={{ backgroundColor: LEVEL_COLORS[level.level].bg }}
                    onClick={() => toggleSection(level.level)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="text-xl font-bold mb-1"
                          style={{ color: LEVEL_COLORS[level.level].text }}
                        >
                          {level.name}
                        </h3>
                        <p className="text-sm font-semibold" style={{ color: LEVEL_COLORS[level.level].text }}>
                          {level.targetGroup}
                        </p>
                      </div>
                      {expandedSections.has(level.level) ? (
                        <ChevronUp size={24} style={{ color: LEVEL_COLORS[level.level].text }} />
                      ) : (
                        <ChevronDown size={24} style={{ color: LEVEL_COLORS[level.level].text }} />
                      )}
                    </div>
                  </div>

                  {expandedSections.has(level.level) && (
                    <div className="bg-white p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">🎯 Syfte</h4>
                        <p className="text-gray-700">{level.purpose}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <Eye size={16} />
                            Familjevy (1177)
                          </h4>
                          <ul className="space-y-1">
                            {level.familyView.map((item, idx) => (
                              <li key={idx} className="text-sm text-blue-800">• {item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-purple-50 p-4 rounded border border-purple-200">
                          <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <Eye size={16} />
                            Professionell vy
                          </h4>
                          <ul className="space-y-1">
                            {level.professionalView.map((item, idx) => (
                              <li key={idx} className="text-sm text-purple-800">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Lock size={16} />
                          Dataminimering
                        </h4>
                        <p className="text-sm text-gray-700">{level.dataMinimization}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">📅 Uppföljningsfrekvens</h4>
                          <p className="text-sm text-gray-700">{level.followUpFrequency}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">⚡ Triggers till nästa nivå</h4>
                          <ul className="space-y-1">
                            {level.escalationTriggers.map((trigger, idx) => (
                              <li key={idx} className="text-sm text-orange-700">• {trigger}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* VÄLBEFINNANDEHJUL */}
          {activeTab === 'wheel' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Välbefinnandehjul (8 ekrar)</h2>
              <p className="text-gray-700 mb-6">
                Varje eker har tre perspektiv (barn, vårdnadshavare, profession) och är semantiskt mappad till
                ICF-domäner, KSI-insatser, SNOMED CT (vid vård-källa), och skolans bärlager (SS 12000).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WELFARE_WHEEL_SPOKES.map((spoke) => (
                  <div
                    key={spoke.spoke}
                    className="bg-white rounded-lg shadow border-2 overflow-hidden"
                    style={{ borderColor: getSpokeColor(spoke.spoke) }}
                  >
                    <div
                      className="p-4"
                      style={{ backgroundColor: getSpokeColor(spoke.spoke) + '10' }}
                    >
                      <h3 className="font-bold text-lg" style={{ color: getSpokeColor(spoke.spoke) }}>
                        {spoke.name}
                      </h3>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <span className="font-semibold text-blue-900">👦 Barn:</span>{' '}
                          <span className="text-blue-800">{spoke.childIndicator}</span>
                        </div>
                        <div className="bg-purple-50 p-2 rounded text-sm">
                          <span className="font-semibold text-purple-900">👨‍👩‍👧 Vårdnadshavare:</span>{' '}
                          <span className="text-purple-800">{spoke.guardianIndicator}</span>
                        </div>
                        <div className="bg-teal-50 p-2 rounded text-sm">
                          <span className="font-semibold text-teal-900">👩‍🏫 Profession:</span>{' '}
                          <span className="text-teal-800">{spoke.professionalIndicator}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <details className="text-sm">
                          <summary className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700">
                            Semantisk mappning
                          </summary>
                          <div className="mt-2 space-y-2 text-xs">
                            <div>
                              <span className="font-semibold text-indigo-900">ICF:</span>{' '}
                              <span className="text-indigo-700">{spoke.icfDomains.join(', ')}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-green-900">KSI:</span>
                              <ul className="ml-2 mt-1">
                                {spoke.ksiTargets.map((ksi, idx) => (
                                  <li key={idx} className="text-green-700">• {ksi}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-semibold text-amber-900">SS 12000:</span>{' '}
                              <span className="text-amber-700">{spoke.ss12000Source.join(', ')}</span>
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ESKALERING */}
          {activeTab === 'escalation' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Eskalering (Triggers och åtgärder)</h2>
              <p className="text-gray-700 mb-6">
                Regler för när universell profil fördjupas till stödprofil och när samordning aktiveras.
              </p>

              <div className="space-y-4">
                {Object.entries(ESCALATION_RULES).map(([key, rule]) => (
                  <div key={key} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle size={20} className="text-orange-500" />
                      {rule.situation}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {rule.universalAction && (
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                          <div className="font-semibold text-blue-900 text-sm mb-2">Universell åtgärd</div>
                          <p className="text-sm text-blue-800">{rule.universalAction}</p>
                        </div>
                      )}

                      {rule.supportAction && (
                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                          <div className="font-semibold text-yellow-900 text-sm mb-2">Stödprofilåtgärd</div>
                          <p className="text-sm text-yellow-800">{rule.supportAction}</p>
                        </div>
                      )}

                      {rule.coordinationAction && (
                        <div className="bg-pink-50 p-4 rounded border border-pink-200">
                          <div className="font-semibold text-pink-900 text-sm mb-2">Samordningsåtgärd</div>
                          <p className="text-sm text-pink-800">{rule.coordinationAction}</p>
                        </div>
                      )}
                    </div>

                    {rule.comment && (
                      <div className="mt-3 text-sm text-gray-600 italic flex items-start gap-2">
                        <Info size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{rule.comment}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KODSYSTEM */}
          {activeTab === 'code-systems' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kodsystem & Versioner</h2>
              <p className="text-gray-700 mb-6">
                Modellen integrerar sex nationella och internationella kodsystem för semantisk interoperabilitet.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(CODE_SYSTEMS).map(([key, system]) => (
                  <div
                    key={key}
                    className="bg-white rounded-lg shadow border-2 border-gray-200 p-6 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl text-gray-900">{key}</h3>
                      <Code size={24} className="text-blue-600" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Roll i modellen</div>
                        <p className="text-sm text-gray-900">{system.role}</p>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Master för</div>
                        <p className="text-sm text-gray-900">{system.masterFor}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="text-xs font-semibold text-gray-600 mb-1">Förvaltare</div>
                        <p className="text-sm text-gray-900">{system.maintainer}</p>
                      </div>

                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <div className="text-xs font-semibold text-blue-900 mb-1">Kommentar</div>
                        <p className="text-xs text-blue-800">{system.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatrixOverview;
