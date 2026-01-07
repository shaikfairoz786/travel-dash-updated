import React from 'react';
import { HeartIcon, GlobeAmericasIcon, SparklesIcon } from '@heroicons/react/24/solid';

const ImpactSection: React.FC = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent-50 rounded-full blur-3xl opacity-50"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Our Mission</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-secondary-900 mb-6 leading-tight">
                            Creating a Positive <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                                Impact Worldwide
                            </span>
                        </h2>

                        <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
                            At Travores, we believe travel is more than just sightseeing. It's about connecting with communities, preserving nature, and leaving destinations better than we found them.
                        </p>

                        <div className="space-y-6">
                            <ImpactCard
                                icon={GlobeAmericasIcon}
                                title="Sustainable Travel"
                                desc="We offset 100% of carbon emissions for every trip booked through our platform."
                                color="text-blue-500"
                                bg="bg-blue-100"
                            />
                            <ImpactCard
                                icon={HeartIcon}
                                title="Community Support"
                                desc="5% of our profits go directly to supporting local artisans and schools in the regions we visit."
                                color="text-red-500"
                                bg="bg-red-100"
                            />
                        </div>

                        <button className="mt-10 btn-secondary group">
                            Learn More About Our Impact
                            <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                        </button>
                    </div>

                    {/* Image/Visual Content */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1596395818822-b25845c43232?auto=format&fit=crop&q=80&w=800"
                                alt="Community Impact"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="font-bold text-xl">10,000+ Trees Planted</p>
                                <p className="text-sm opacity-90">In partnership with OneTreePlanted</p>
                            </div>
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs transform -rotate-2 hover:rotate-0 transition-all duration-300 hidden md:block">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <GlobeAmericasIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Eco-Certified</p>
                                    <p className="text-xs text-gray-500">Global Standard</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">recognized for responsible tourism practices.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

const ImpactCard = ({ icon: Icon, title, desc, color, bg }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-100">
        <div className={`p-3 rounded-lg ${bg} shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <h3 className="font-bold text-secondary-900 mb-1">{title}</h3>
            <p className="text-sm text-secondary-600">{desc}</p>
        </div>
    </div>
);

export default ImpactSection;
