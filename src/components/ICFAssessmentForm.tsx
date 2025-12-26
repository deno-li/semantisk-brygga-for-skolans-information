/**
 * ICF Assessment Form Component
 * Form for professionals to conduct ICF assessments
 * Includes Performance, Capacity, Environmental Factors, and automatic gap calculation
 */

import React, { useState, useMemo } from 'react';
import { Save, Plus, X, AlertCircle, CheckCircle2, Info, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import {
  ICFQualifierValue,
  BarrierLevel,
  FacilitatorLevel,
  EnvironmentalFactorType,
  calculateGap,
  interpretGap,
  getQualifierDescription
} from '../types/icf-types';
import { ActorSector, WelfareWheelSpoke } from '../types/types';

// Import core sets for dropdown options
import {
  getAllCoreSets
} from '../data/icf-core-sets';

interface EnvironmentalFactorInput {
  code: string;
  domain: string;
  type: EnvironmentalFactorType;
  level: number;
  description: string;
  relatedSpokes: WelfareWheelSpoke[];
  context: 'home' | 'school' | 'healthcare' | 'community';
}

interface ICFAssessmentFormProps {
  onSave: (assessment: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ICFAssessmentForm: React.FC<ICFAssessmentFormProps> = ({
  onSave,
  onCancel,
  initialData
}) => {
  // Form state
  const [selectedCode, setSelectedCode] = useState<string>(initialData?.code || '');
  const [performance, setPerformance] = useState<ICFQualifierValue | null>(
    initialData?.performance?.value ?? null
  );
  const [capacity, setCapacity] = useState<ICFQualifierValue | null>(
    initialData?.capacity?.value ?? null
  );
  const [assessedDate, setAssessedDate] = useState<string>(
    initialData?.assessedDate || new Date().toISOString().split('T')[0]
  );
  const [context, setContext] = useState<'home' | 'school' | 'healthcare' | 'leisure'>(
    initialData?.context || 'school'
  );
  const [source, setSource] = useState<'observation' | 'survey' | 'assessment' | 'parent-report' | 'child-report'>(
    initialData?.source || 'observation'
  );
  const [assessedBy, setAssessedBy] = useState<ActorSector>(
    initialData?.assessedBy || 'Skola'
  );
  const [notes, setNotes] = useState<string>(initialData?.notes || '');
  const [environmentalFactors, setEnvironmentalFactors] = useState<EnvironmentalFactorInput[]>([]);
  const [showAddFactor, setShowAddFactor] = useState(false);

  // Environmental factor form state
  const [efCode, setEfCode] = useState('');
  const [efDomain, setEfDomain] = useState('');
  const [efType, setEfType] = useState<EnvironmentalFactorType>('facilitator');
  const [efLevel, setEfLevel] = useState<number>(1);
  const [efDescription, setEfDescription] = useState('');
  const [efContext, setEfContext] = useState<'home' | 'school' | 'healthcare' | 'community'>('school');

  // Get all available ICF codes - memoize to avoid recalculating on every render
  const allCoreSets = useMemo(() => getAllCoreSets(), []);
  const availableCodes = useMemo(() => {
    const codes: Array<{ code: string; domain: string; spoke: WelfareWheelSpoke }> = [];
    allCoreSets.forEach(coreSet => {
      coreSet.items.forEach(item => {
        codes.push({
          code: item.code,
          domain: item.domain,
          spoke: coreSet.spoke
        });
      });
    });
    return codes;
  }, [allCoreSets]);

  // Get selected domain
  const selectedDomain = useMemo(() => {
    const found = availableCodes.find(c => c.code === selectedCode);
    return found?.domain || '';
  }, [selectedCode, availableCodes]);

  // Calculate gap
  const gap = useMemo(() => {
    if (performance === null || capacity === null) return null;
    return calculateGap(performance, capacity);
  }, [performance, capacity]);

  const gapInterpretation = useMemo(() => {
    if (gap === null) return null;
    return interpretGap(gap);
  }, [gap]);

  // Get gap display
  const getGapDisplay = () => {
    if (gap === null) return null;

    let icon;
    let color;
    let text;

    if (gapInterpretation === 'facilitators-work') {
      icon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
      color = 'bg-green-50 border-green-300 text-green-900';
      text = `Gap: ${gap} ✅ Anpassningar fungerar!`;
    } else if (gapInterpretation === 'barriers-exist') {
      icon = <AlertCircle className="w-5 h-5 text-red-600" />;
      color = 'bg-red-50 border-red-300 text-red-900';
      text = `Gap: +${gap} ⚠️ Barriärer finns`;
    } else {
      icon = <Minus className="w-5 h-5 text-gray-600" />;
      color = 'bg-gray-50 border-gray-300 text-gray-900';
      text = `Gap: 0 ➖ Neutral`;
    }

    return (
      <div className={`flex items-center gap-2 p-3 rounded border ${color}`}>
        {icon}
        <span className="font-semibold">{text}</span>
      </div>
    );
  };

  // Validation
  const isValid = useMemo(() => {
    return selectedCode && performance !== null && capacity !== null && assessedDate;
  }, [selectedCode, performance, capacity, assessedDate]);

  // Handle save
  const handleSave = () => {
    if (!isValid) return;

    const assessment = {
      code: selectedCode,
      domain: selectedDomain,
      performance: {
        value: performance,
        description: getQualifierDescription(performance!)
      },
      capacity: {
        value: capacity,
        description: getQualifierDescription(capacity!)
      },
      gap,
      gapInterpretation,
      assessedDate,
      assessedBy,
      timeSpan: 'Senaste 2 veckor',
      context,
      source,
      notes,
      environmentalFactors: environmentalFactors.map(ef => ({
        ...ef,
        identifiedDate: assessedDate,
        identifiedBy: assessedBy,
        status: 'active' as const
      }))
    };

    onSave(assessment);
  };

  // Add environmental factor
  const handleAddEnvironmentalFactor = () => {
    if (!efCode || !efDomain) return;

    const newFactor: EnvironmentalFactorInput = {
      code: efCode,
      domain: efDomain,
      type: efType,
      level: efLevel,
      description: efDescription,
      relatedSpokes: [], // Could be extended to allow selection
      context: efContext
    };

    setEnvironmentalFactors([...environmentalFactors, newFactor]);

    // Reset form
    setEfCode('');
    setEfDomain('');
    setEfType('facilitator');
    setEfLevel(1);
    setEfDescription('');
    setShowAddFactor(false);
  };

  // Remove environmental factor
  const handleRemoveEnvironmentalFactor = (index: number) => {
    setEnvironmentalFactors(environmentalFactors.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Ny ICF-bedömning</h2>
        <p className="text-sm text-gray-600 mt-1">
          Fyll i Performance (med anpassningar) och Capacity (utan anpassningar)
        </p>
      </div>

      {/* Info Box */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">WHO ICF bedömning:</p>
            <p className="mt-1">
              <strong>Performance</strong> = vad barnet GÖR med anpassningar.{' '}
              <strong>Capacity</strong> = vad barnet KAN utan anpassningar.{' '}
              Gap beräknas automatiskt.
            </p>
          </div>
        </div>
      </div>

      {/* ICF Code Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          ICF-kod *
        </label>
        <select
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Välj ICF-kod...</option>
          {availableCodes.map((item, index) => (
            <option key={index} value={item.code}>
              {item.code} - {item.domain} ({item.spoke})
            </option>
          ))}
        </select>
      </div>

      {/* Performance Qualifier */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Performance (med anpassningar) *
        </label>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((value) => (
            <label
              key={value}
              className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                performance === value
                  ? 'bg-green-50 border-green-500 font-semibold'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="performance"
                value={value}
                checked={performance === value}
                onChange={(e) => setPerformance(Number(e.target.value) as ICFQualifierValue)}
                className="mr-3"
              />
              <span>
                {value} - {getQualifierDescription(value as ICFQualifierValue)}
              </span>
              {performance === value && (
                <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Capacity Qualifier */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Capacity (utan anpassningar) *
        </label>
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((value) => (
            <label
              key={value}
              className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${
                capacity === value
                  ? 'bg-gray-50 border-gray-500 font-semibold'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="capacity"
                value={value}
                checked={capacity === value}
                onChange={(e) => setCapacity(Number(e.target.value) as ICFQualifierValue)}
                className="mr-3"
              />
              <span>
                {value} - {getQualifierDescription(value as ICFQualifierValue)}
              </span>
              {capacity === value && (
                <CheckCircle2 className="w-5 h-5 text-gray-600 ml-auto" />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Gap Display */}
      {gap !== null && (
        <div className="mb-6">
          {getGapDisplay()}
        </div>
      )}

      {/* Environmental Factors */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900">
            Environmental Factors
          </label>
          <button
            type="button"
            onClick={() => setShowAddFactor(!showAddFactor)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Lägg till
          </button>
        </div>

        {/* List of added factors */}
        {environmentalFactors.length > 0 && (
          <div className="space-y-2 mb-3">
            {environmentalFactors.map((factor, index) => (
              <div
                key={index}
                className={`flex items-start justify-between p-3 rounded border ${
                  factor.type === 'barrier'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {factor.code}: {factor.domain}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">{factor.description}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {factor.type === 'barrier' ? 'Barrier' : 'Facilitator'} •{' '}
                    Nivå: {factor.type === 'barrier' ? '.' : '+'}{factor.level} •{' '}
                    {factor.context}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEnvironmentalFactor(index)}
                  className="ml-3 p-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add factor form */}
        {showAddFactor && (
          <div className="p-4 bg-gray-50 border border-gray-300 rounded space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  E-kod
                </label>
                <input
                  type="text"
                  value={efCode}
                  onChange={(e) => setEfCode(e.target.value)}
                  placeholder="e310"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Domän
                </label>
                <input
                  type="text"
                  value={efDomain}
                  onChange={(e) => setEfDomain(e.target.value)}
                  placeholder="Familj"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Typ
                </label>
                <select
                  value={efType}
                  onChange={(e) => setEfType(e.target.value as EnvironmentalFactorType)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="facilitator">Facilitator (+)</option>
                  <option value="barrier">Barrier (.)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nivå
                </label>
                <select
                  value={efLevel}
                  onChange={(e) => setEfLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4].map(level => (
                    <option key={level} value={level}>
                      {efType === 'barrier' ? '.' : '+'}{level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Kontext
                </label>
                <select
                  value={efContext}
                  onChange={(e) => setEfContext(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="home">Hem</option>
                  <option value="school">Skola</option>
                  <option value="healthcare">Vård</option>
                  <option value="community">Fritid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Beskrivning
              </label>
              <input
                type="text"
                value={efDescription}
                onChange={(e) => setEfDescription(e.target.value)}
                placeholder="Beskriv faktorn..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddEnvironmentalFactor}
              disabled={!efCode || !efDomain}
              className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Lägg till faktor
            </button>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Metadata</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Datum *
            </label>
            <input
              type="date"
              value={assessedDate}
              onChange={(e) => setAssessedDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kontext
            </label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="home">Hem</option>
              <option value="school">Skola</option>
              <option value="healthcare">Vård</option>
              <option value="leisure">Fritid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Källa
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="observation">Observation</option>
              <option value="survey">Enkät</option>
              <option value="assessment">Bedömning</option>
              <option value="parent-report">Föräldrarapport</option>
              <option value="child-report">Barnrapport</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bedömd av
            </label>
            <select
              value={assessedBy}
              onChange={(e) => setAssessedBy(e.target.value as ActorSector)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Skola">Skola</option>
              <option value="Hälso- och sjukvård">Hälso- och sjukvård</option>
              <option value="Socialtjänst">Socialtjänst</option>
              <option value="Kommun">Kommun</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Anteckningar
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Valfria anteckningar om bedömningen..."
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          Spara bedömning
        </button>
      </div>

      {/* Validation message */}
      {!isValid && (
        <div className="mt-3 flex items-center gap-2 text-sm text-orange-700">
          <AlertCircle className="w-4 h-4" />
          <span>Fyll i ICF-kod, Performance och Capacity för att spara</span>
        </div>
      )}
    </div>
  );
};

export default ICFAssessmentForm;
