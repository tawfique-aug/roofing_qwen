import { useState, useRef, type FormEvent } from 'react';
import {
  ChevronRight, ChevronLeft, Camera, Upload, X,
  Home, Wrench, AlertTriangle, Search, Droplets, CalendarDays, HelpCircle,
  CheckCircle2, Loader2
} from 'lucide-react';
import {
  validateName, validateEmail, validatePhone, validateZipCode,
  validateDescription, validatePhotoFile, validatePhotoCount,
  sanitizeInput, sanitizePhone, sanitizeZipCode
} from '../lib/validation';
import { calculateLeadScore } from '../lib/lead-scoring';
import { addDemoLead } from '../lib/demo-store';
import type { ServiceType, Urgency } from '../lib/types';

const SERVICES: { value: ServiceType; label: string; icon: typeof Home; desc: string }[] = [
  { value: 'roof_repair', label: 'Roof Repair', icon: Wrench, desc: 'Fix leaks, missing shingles, or damage' },
  { value: 'roof_replacement', label: 'Roof Replacement', icon: Home, desc: 'Complete new roof installation' },
  { value: 'storm_damage', label: 'Storm Damage', icon: AlertTriangle, desc: 'Hail, wind, or fallen tree damage' },
  { value: 'roof_inspection', label: 'Roof Inspection', icon: Search, desc: 'Professional assessment & report' },
  { value: 'gutter_service', label: 'Gutter Service', icon: Droplets, desc: 'Gutter repair, cleaning, or installation' },
  { value: 'emergency', label: 'Emergency', icon: AlertTriangle, desc: 'Immediate help for active leaks or danger' },
  { value: 'other', label: 'Other', icon: HelpCircle, desc: 'Something else — tell us more' },
];

const URGENCIES: { value: Urgency; label: string; desc: string; color: string }[] = [
  { value: 'emergency', label: 'Emergency', desc: 'Active leak or danger — need help NOW', color: 'border-red-300 bg-red-50 hover:bg-red-100' },
  { value: 'urgent', label: 'This Week', desc: 'Need service within a few days', color: 'border-orange-300 bg-orange-50 hover:bg-orange-100' },
  { value: 'soon', label: 'This Month', desc: 'Scheduling within the next few weeks', color: 'border-blue-300 bg-blue-50 hover:bg-blue-100' },
  { value: 'planning', label: 'Just Planning', desc: 'Researching options, no rush', color: 'border-green-300 bg-green-50 hover:bg-green-100' },
];

const TOTAL_STEPS = 5;

interface FormData {
  service_type: ServiceType | '';
  urgency: Urgency | '';
  name: string;
  email: string;
  phone: string;
  zip_code: string;
  description: string;
}

export default function StepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    service_type: '',
    urgency: '',
    name: '',
    email: '',
    phone: '',
    zip_code: '',
    description: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ score: number; priority: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.service_type) newErrors.service_type = 'Please select a service type';
        break;
      case 2:
        if (!formData.urgency) newErrors.urgency = 'Please select how soon you need service';
        break;
      case 3:
        const nameErr = validateName(formData.name);
        if (nameErr) newErrors.name = nameErr;
        const emailErr = validateEmail(formData.email);
        if (emailErr) newErrors.email = emailErr;
        const phoneErr = validatePhone(formData.phone);
        if (phoneErr) newErrors.phone = phoneErr;
        const zipErr = validateZipCode(formData.zip_code);
        if (zipErr) newErrors.zip_code = zipErr;
        break;
      case 4:
        const descErr = validateDescription(formData.description);
        if (descErr) newErrors.description = descErr;
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handlePhotoUpload = (files: FileList | null) => {
    if (!files) return;

    const newPhotos = Array.from(files);
    const totalPhotos = photos.length + newPhotos.length;

    const countErr = validatePhotoCount(totalPhotos);
    if (countErr) {
      setErrors(prev => ({ ...prev, photos: countErr }));
      return;
    }

    for (const file of newPhotos) {
      const fileErr = validatePhotoFile(file);
      if (fileErr) {
        setErrors(prev => ({ ...prev, photos: fileErr }));
        return;
      }
    }

    // Generate previews
    newPhotos.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setPhotos(prev => [...prev, ...newPhotos]);
    setErrors(prev => {
      const next = { ...prev };
      delete next.photos;
      return next;
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setSubmitting(true);

    try {
      // Calculate lead score (in production, this is done server-side)
      const leadScore = calculateLeadScore({
        service_type: formData.service_type as ServiceType,
        urgency: formData.urgency as Urgency,
        has_photos: photos.length > 0,
        description_length: formData.description.length,
        zip_code: sanitizeZipCode(formData.zip_code),
      });

      setScore(leadScore);

      // In production: submit to Supabase via Edge Function
      // For demo: add to local store
      addDemoLead({
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email).toLowerCase(),
        phone: sanitizePhone(formData.phone),
        zip_code: sanitizeZipCode(formData.zip_code),
        service_type: formData.service_type as ServiceType,
        urgency: formData.urgency as Urgency,
        description: sanitizeInput(formData.description),
        photo_urls: [],
        score: leadScore.score,
        status: 'new',
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again or call us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Estimate Request Received!</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          Thank you, {sanitizeInput(formData.name)}! We've received your request and will contact you within 1 business hour.
        </p>
        {score && (
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            score.priority === 'high' ? 'bg-red-100 text-red-800' :
            score.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
            'bg-green-100 text-green-800'
          }`}>
            Priority: {score.priority.charAt(0).toUpperCase() + score.priority.slice(1)}
          </div>
        )}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-blue-800 font-medium">📞 Need immediate help?</p>
          <a href="tel:+15551234567" className="text-blue-600 font-bold text-lg hover:underline">
            Call (555) 123-4567
          </a>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setFormData({ service_type: '', urgency: '', name: '', email: '', phone: '', zip_code: '', description: '' });
            setPhotos([]);
            setPhotoPreviews([]);
            setScore(null);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Step {step} of {TOTAL_STEPS}</span>
          <span className="text-sm text-gray-500">{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {/* Step 1: Service Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">What service do you need?</h3>
              <p className="text-gray-500">Select the type of roofing service you're looking for.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('service_type', value)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    formData.service_type === value
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    formData.service_type === value ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <div className={`font-semibold ${
                      formData.service_type === value ? 'text-blue-700' : 'text-gray-900'
                    }`}>{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
            {errors.service_type && <p className="text-red-600 text-sm">{errors.service_type}</p>}
          </div>
        )}

        {/* Step 2: Urgency */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">How soon do you need service?</h3>
              <p className="text-gray-500">This helps us prioritize your request appropriately.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {URGENCIES.map(({ value, label, desc, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField('urgency', value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.urgency === value
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : `${color} border`
                  }`}
                >
                  <div className={`font-semibold ${
                    formData.urgency === value ? 'text-blue-700' : 'text-gray-900'
                  }`}>{label}</div>
                  <div className="text-sm text-gray-500 mt-1">{desc}</div>
                </button>
              ))}
            </div>
            {errors.urgency && <p className="text-red-600 text-sm">{errors.urgency}</p>}
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your Contact Information</h3>
              <p className="text-gray-500">We'll use this to reach you about your estimate.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="John Smith"
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                maxLength={100}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="john@example.com"
                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                maxLength={254}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => updateField('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                maxLength={20}
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={e => updateField('zip_code', e.target.value)}
                placeholder="75001"
                className={`w-full px-4 py-3 rounded-xl border ${errors.zip_code ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all max-w-[200px]`}
                maxLength={10}
              />
              {errors.zip_code && <p className="text-red-600 text-sm mt-1">{errors.zip_code}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Description + Photos */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Describe Your Roofing Issue</h3>
              <p className="text-gray-500">The more detail you provide, the more accurate your estimate will be.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What's going on with your roof? *
              </label>
              <textarea
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="E.g., I noticed water stains on my ceiling after the last rainstorm. The issue seems to be near the chimney..."
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none`}
                maxLength={2000}
              />
              <div className="flex justify-between mt-1">
                {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}
                <p className="text-xs text-gray-400 ml-auto">{formData.description.length}/2000</p>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photos <span className="text-gray-400">(optional — helps us give a better estimate)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
              >
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Click to upload photos</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — Max 10MB each, up to 5 photos</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic"
                multiple
                onChange={e => handlePhotoUpload(e.target.files)}
                className="hidden"
              />
              {errors.photos && <p className="text-red-600 text-sm mt-1">{errors.photos}</p>}

              {/* Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Roof photo ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Review Your Request</h3>
              <p className="text-gray-500">Please confirm everything looks correct before submitting.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Service</p>
                  <p className="font-medium text-gray-900">
                    {SERVICES.find(s => s.value === formData.service_type)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Urgency</p>
                  <p className="font-medium text-gray-900">
                    {URGENCIES.find(u => u.value === formData.urgency)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="font-medium text-gray-900">{formData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="font-medium text-gray-900">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-medium text-gray-900">{formData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">ZIP Code</p>
                  <p className="font-medium text-gray-900">{formData.zip_code}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Description</p>
                <p className="text-gray-700 text-sm mt-1">{formData.description}</p>
              </div>
              {photos.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Photos</p>
                  <p className="text-gray-700 text-sm">{photos.length} photo(s) attached</p>
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {errors.submit}
              </div>
            )}

            <p className="text-xs text-gray-400 text-center">
              By submitting, you agree to be contacted about your roofing estimate request.
              We'll never share your information with third parties.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div />}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CalendarDays className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
