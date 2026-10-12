import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Upload,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Construction,
  Trash2,
  Droplets,
  Lightbulb,
  Trees,
  ShieldAlert,
  Save,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MapPicker from '../components/MapPicker';
import AICategorySuggester from '../components/AICategorySuggester';

export const ReportIssue = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(
    searchParams.get('category') || 'Roads & Footpaths'
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [wardOrZone, setWardOrZone] = useState('Central Zone 12');
  const [priority, setPriority] = useState('MEDIUM');
  const [coordinates, setCoordinates] = useState([80.2707, 13.0827]);
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Restore draft from localStorage on initial load
  useEffect(() => {
    const savedDraft = localStorage.getItem('civicfix_draft_report');
    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft);
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.category) setCategory(data.category);
        if (data.address) setAddress(data.address);
        if (data.landmark) setLandmark(data.landmark);
        if (data.priority) setPriority(data.priority);
        if (data.coordinates) setCoordinates(data.coordinates);
      } catch (e) {
        console.warn('Failed parsing draft');
      }
    }
  }, []);

  // Autosave draft
  const handleSaveDraft = () => {
    const draft = {
      title,
      description,
      category,
      address,
      landmark,
      wardOrZone,
      priority,
      coordinates,
    };
    localStorage.setItem('civicfix_draft_report', JSON.stringify(draft));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  // Image Upload handler (File Reader to Base64)
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [
          ...prev,
          { url: reader.result, caption: file.name, uploadedAt: new Date() },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Add realistic demo sample photo
  const addSamplePhoto = (sampleUrl, sampleCaption) => {
    setPhotos((prev) => [
      ...prev,
      { url: sampleUrl, caption: sampleCaption, uploadedAt: new Date() },
    ]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !address.trim()) {
      alert('Please fill in title, description, and street address.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title,
        description,
        category,
        priority,
        address,
        landmark,
        wardOrZone,
        coordinates,
        photos:
          photos.length > 0
            ? photos
            : [
                {
                  url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
                  caption: 'Civic issue photo',
                },
              ],
      };

      const res = await api.createComplaint(payload);

      if (res.success && res.complaint) {
        // Clear draft
        localStorage.removeItem('civicfix_draft_report');

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setSubmittedTicket(res.complaint.ticketId);
      }
    } catch (err) {
      alert(err.message || 'Error submitting complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { name: 'Roads & Footpaths', icon: Construction },
    { name: 'Waste Management', icon: Trash2 },
    { name: 'Drainage & Water', icon: Droplets },
    { name: 'Street Lighting', icon: Lightbulb },
    { name: 'Parks & Trees', icon: Trees },
    { name: 'Public Health', icon: ShieldAlert },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Success Modal */}
      {submittedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-emerald-100 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Complaint Registered!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your report has been received by municipal triage.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Official Tracking Ticket ID
              </div>
              <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
                {submittedTicket}
              </div>
              <div className="text-[11px] text-emerald-600 mt-1">
                Save this Ticket ID to track on-ground progress updates anytime.
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to={`/track?id=${submittedTicket}`}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                Track Status Now
              </Link>
              <Link
                to="/dashboard"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
              >
                Go to Citizen Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">
            Civic Participation Portal
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('formTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('formSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveDraft}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-2xs transition-colors"
        >
          <Save className="w-3.5 h-3.5 text-slate-500" />
          <span>{draftSaved ? t('saveDraft') : 'Save Draft Locally'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        {/* 1. Category Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            1. {t('labelCategory')} <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = category === cat.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 text-brand-900 shadow-xs ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50/50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-white border text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Issue Title & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              2. {t('labelTitle')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep hazardous potholes on MG Ring Road near Metro Pillar 14"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. {t('labelDescription')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide clear details regarding the problem: severity, when it started, how it impacts pedestrian or vehicular safety..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
            />
          </div>

          {/* AI Category Suggester */}
          <AICategorySuggester
            text={`${title} ${description}`}
            currentCategory={category}
            onSelectCategory={(suggested) => setCategory(suggested)}
          />
        </div>

        {/* 3. Urgency / Priority Level */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            4. {t('labelUrgency')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'LOW', label: 'Low', desc: 'Routine cosmetic' },
              { id: 'MEDIUM', label: 'Medium', desc: 'Noticeable issue' },
              { id: 'HIGH', label: 'High', desc: 'Safety concern' },
              { id: 'CRITICAL', label: 'Critical', desc: 'Immediate hazard' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  priority === p.id
                    ? p.id === 'CRITICAL'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-400/30'
                      : 'border-brand-600 bg-brand-50 text-brand-900 font-bold ring-2 ring-brand-400/30'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">{p.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Location Details & Map Picker */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            5. Location & Geotagging <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address or location name (e.g. Market Yard 3rd Cross)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
              />
            </div>
            <div>
              <input
                type="text"
                value={wardOrZone}
                onChange={(e) => setWardOrZone(e.target.value)}
                placeholder="Ward / Municipal Zone"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Nearby Landmark (e.g. Opposite State Bank Branch)"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-600"
            />
          </div>

          {/* Interactive OpenStreetMap */}
          <MapPicker
            coordinates={coordinates}
            onCoordinatesChange={(newCoords) => setCoordinates(newCoords)}
            address={address}
          />
        </div>

        {/* 5. Photo Upload & Evidence */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            6. {t('labelPhoto')}
          </label>

          <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-600 shadow-xs border">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800">
                Click to browse or drop issue photos here
              </span>
              <span className="text-[11px] text-slate-500">
                Supports JPG, PNG up to 5MB (Geotagged evidence speeds up verification)
              </span>
            </label>
          </div>

          {/* Preset Sample Photos for Fast Demo Testing */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-semibold">
              Or attach a demo sample:
            </span>
            <button
              type="button"
              onClick={() =>
                addSamplePhoto(
                  'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
                  'Road pothole sample'
                )
              }
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg border border-slate-200 font-medium transition-colors"
            >
              + Road Damage Photo
            </button>
            <button
              type="button"
              onClick={() =>
                addSamplePhoto(
                  'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
                  'Garbage dumpster sample'
                )
              }
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg border border-slate-200 font-medium transition-colors"
            >
              + Garbage Overflow Photo
            </button>
            <button
              type="button"
              onClick={() =>
                addSamplePhoto(
                  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
                  'Broken streetlamp sample'
                )
              }
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-lg border border-slate-200 font-medium transition-colors"
            >
              + Streetlight Failure Photo
            </button>
          </div>

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {photos.map((item, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 h-28">
                  <img
                    src={item.url}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-90 hover:opacity-100 shadow-md"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-700 hover:from-brand-700 hover:to-teal-800 shadow-lg shadow-brand-600/25 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Submitting to Municipal Registry...</span>
            ) : (
              <>
                <span>{t('btnSubmitIssue')}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
