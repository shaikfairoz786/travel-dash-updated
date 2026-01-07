import React, { useState } from 'react';
import {
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    SparklesIcon,
    HomeModernIcon,
    SunIcon,
    UserIcon,
    FireIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

/* --- TYPES --- */
type Vibe = 'Wildlife/Adventure' | 'Cultural/Festive' | 'Relaxation';
type TravelerType = 'Solo' | 'Family' | 'Corporate' | 'Pet-Friendly';
type Pace = 'Slow & Soulful' | 'Fast-Paced';
type StayType = 'Homestay' | 'Eco-Resort';

interface WizardData {
    vibe: Vibe | null;
    travelerType: TravelerType | null;
    pace: Pace;
    stayType: StayType;
    name: string;
    email: string;
    whatsapp: string;
}

const ItineraryBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<WizardData>({
        vibe: null,
        travelerType: null,
        pace: 'Slow & Soulful',
        stayType: 'Homestay',
        name: '',
        email: '',
        whatsapp: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(c => c + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    const canProceed = () => {
        if (currentStep === 1) return !!formData.vibe;
        if (currentStep === 2) return !!formData.travelerType;
        if (currentStep === 3) return true; // Defaults set
        return formData.name && formData.email && formData.whatsapp;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    // Render Functions
    const renderProgressBar = () => (
        <div className="w-full bg-travores-sand/30 h-2 rounded-full mb-8 overflow-hidden">
            <div
                className="bg-travores-green h-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
            />
        </div>
    );

    const SelectionCard = ({
        selected,
        onClick,
        icon,
        label,
        desc
    }: {
        selected: boolean;
        onClick: () => void;
        icon: React.ReactNode;
        label: string
        desc?: string
    }) => (
        <div
            onClick={onClick}
            className={`
        cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 transform hover:-translate-y-1
        flex flex-col items-center text-center gap-4 h-full
        ${selected
                    ? 'border-travores-green bg-travores-green/10 shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-travores-green/50 hover:shadow-md'
                }
      `}
        >
            <div className={`p-4 rounded-full ${selected ? 'bg-travores-green text-white' : 'bg-travores-sand text-travores-brown'}`}>
                {icon}
            </div>
            <div>
                <h3 className={`font-bold text-lg mb-1 ${selected ? 'text-travores-green' : 'text-gray-800'}`}>{label}</h3>
                {desc && <p className="text-sm text-gray-500">{desc}</p>}
            </div>
            {selected && <div className="absolute top-4 right-4 text-travores-green"><CheckCircleIcon className="w-6 h-6" /></div>}
        </div>
    );

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-travores-sand/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center animate-fade-in-down">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <SparklesIcon className="w-12 h-12 text-travores-green" />
                    </div>
                    <h2 className="text-3xl font-bold text-travores-brown mb-4">Itinerary Generated!</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Your custom {formData.pace} {formData.vibe} journey is ready.
                        {formData.travelerType === 'Pet-Friendly' && <span className="block mt-2 font-semibold text-travores-green">🐾 Showing pet-verified destinations</span>}
                    </p>
                    <a
                        href={`https://wa.me/919398281078?text=Hi, I'm interested in a ${formData.vibe} trip for ${formData.travelerType} travelers. I prefer ${formData.stayType} accommodation.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-travores-green hover:bg-green-800 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg mb-4"
                    >
                        Talk to a Community Expert via WhatsApp
                    </a>
                    <button onClick={() => navigate('/')} className="text-gray-500 hover:text-travores-brown underline">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-travores-sand/20 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-travores-green font-bold tracking-widest uppercase mb-2">Build Your Journey</p>
                    <h1 className="text-3xl md:text-5xl font-bold text-travores-brown mb-4">Your tour, your choice, your say.</h1>
                </div>

                {/* Wizard Container */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                    {/* Progress Header */}
                    <div className="p-8 pb-0">
                        {renderProgressBar()}
                        <div className="flex justify-between text-sm font-medium text-gray-400 mb-6">
                            <span>Vibe</span>
                            <span>Type</span>
                            <span>Choice</span>
                            <span>Finalize</span>
                        </div>
                    </div>

                    <div className="flex-1 p-8 pt-0 overflow-y-auto">
                        {currentStep === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">What's the vibe of this trip?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <SelectionCard
                                        selected={formData.vibe === 'Wildlife/Adventure'}
                                        onClick={() => setFormData({ ...formData, vibe: 'Wildlife/Adventure' })}
                                        icon={<FireIcon className="w-8 h-8" />}
                                        label="Wildlife & Adventure"
                                        desc="Thrills, nature trails, and wild encounters."
                                    />
                                    <SelectionCard
                                        selected={formData.vibe === 'Cultural/Festive'}
                                        onClick={() => setFormData({ ...formData, vibe: 'Cultural/Festive' })}
                                        icon={<HomeModernIcon className="w-8 h-8" />}
                                        label="Cultural & Festive"
                                        desc="Heritage, local traditions, and festivals."
                                    />
                                    <SelectionCard
                                        selected={formData.vibe === 'Relaxation'}
                                        onClick={() => setFormData({ ...formData, vibe: 'Relaxation' })}
                                        icon={<SunIcon className="w-8 h-8" />}
                                        label="Relaxation"
                                        desc="Unwind, wellness, and peaceful retreats."
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Who is traveling?</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {(['Solo', 'Family', 'Corporate', 'Pet-Friendly'] as TravelerType[]).map((type) => (
                                        <SelectionCard
                                            key={type}
                                            selected={formData.travelerType === type}
                                            onClick={() => setFormData({ ...formData, travelerType: type })}
                                            icon={<UserIcon className="w-8 h-8" />}
                                            label={type}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="animate-fade-in max-w-2xl mx-auto space-y-12 py-8">
                                {/* Pace Toggle */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Preferred Pace</h2>
                                    <div className="bg-gray-100 p-1 rounded-xl flex relative">
                                        <div
                                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${formData.pace === 'Fast-Paced' ? 'left-[50%]' : 'left-1'}`}
                                        />
                                        <button
                                            onClick={() => setFormData({ ...formData, pace: 'Slow & Soulful' })}
                                            className={`flex-1 relative z-10 py-4 font-bold rounded-lg transition-colors ${formData.pace === 'Slow & Soulful' ? 'text-travores-green' : 'text-gray-500'}`}
                                        >
                                            Slow & Soulful
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, pace: 'Fast-Paced' })}
                                            className={`flex-1 relative z-10 py-4 font-bold rounded-lg transition-colors ${formData.pace === 'Fast-Paced' ? 'text-travores-green' : 'text-gray-500'}`}
                                        >
                                            Fast-Paced
                                        </button>
                                    </div>
                                </div>

                                {/* Stay Type Toggle */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Accommodation Style</h2>
                                    <div className="bg-gray-100 p-1 rounded-xl flex relative">
                                        <div
                                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${formData.stayType === 'Eco-Resort' ? 'left-[50%]' : 'left-1'}`}
                                        />
                                        <button
                                            onClick={() => setFormData({ ...formData, stayType: 'Homestay' })}
                                            className={`flex-1 relative z-10 py-4 font-bold rounded-lg transition-colors ${formData.stayType === 'Homestay' ? 'text-travores-green' : 'text-gray-500'}`}
                                        >
                                            Homestay
                                        </button>
                                        <button
                                            onClick={() => setFormData({ ...formData, stayType: 'Eco-Resort' })}
                                            className={`flex-1 relative z-10 py-4 font-bold rounded-lg transition-colors ${formData.stayType === 'Eco-Resort' ? 'text-travores-green' : 'text-gray-500'}`}
                                        >
                                            Eco-Resort
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="animate-fade-in max-w-md mx-auto">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Where should we send your itinerary?</h2>
                                <p className="text-gray-500 text-center mb-8">We'll craft a custom plan just for you.</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-travores-green focus:border-transparent outline-none transition-shadow"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-travores-green focus:border-transparent outline-none transition-shadow"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-travores-green focus:border-transparent outline-none transition-shadow"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 1}
                                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className="flex items-center px-8 py-3 bg-travores-green text-white rounded-xl font-bold shadow-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:translate-x-1"
                                >
                                    Next Step <ArrowRightIcon className="w-5 h-5 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isSubmitting}
                                    className="flex items-center px-8 py-3 bg-travores-brown text-white rounded-xl font-bold shadow-lg hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[200px] justify-center"
                                >
                                    {isSubmitting ? (
                                        <>Generating Journey...</>
                                    ) : (
                                        <>Create My Itinerary <SparklesIcon className="w-5 h-5 ml-2" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryBuilderPage;
