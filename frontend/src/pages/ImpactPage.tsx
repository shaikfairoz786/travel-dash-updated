import React, { useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DEMO_IMAGES = {
    impact1: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600",
    impact2: "https://images.unsplash.com/photo-1516937941348-c09645f871cd?auto=format&fit=crop&q=80&w=600",
    impact3: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600",
    impact4: "https://images.unsplash.com/photo-1528642474493-227685869aac?auto=format&fit=crop&q=80&w=600",
    impact5: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b09?auto=format&fit=crop&q=80&w=600",
    impact6: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=600",
};

const ImpactCard = ({ image, title, description, slug, highlight = false }: { image: string; title: string; description: string; slug: string; highlight?: boolean }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 cursor-pointer">
        <div className="h-56 overflow-hidden">
            <Link to={`/impact/${slug}`}>
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </Link>
        </div>
        <div className="p-6 h-full flex flex-col">
            <Link to={`/impact/${slug}`}>
                <h3 className={`text-xl font-bold mb-3 ${highlight ? 'text-yellow-600' : 'text-gray-900 group-hover:text-primary-600'} transition-colors`}>{title}</h3>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
            <div className="mt-auto">
                <Link to={`/impact/${slug}`} className="text-primary-600 font-bold text-sm hover:text-emerald-700 transition-colors cursor-pointer">Read more &rarr;</Link>
            </div>
        </div>
    </div>
);

const ImpactPage: React.FC = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Hero Section */}
            <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&q=80&w=2000"
                        alt="Impact Background"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                    <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Our Impact</h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-3xl leading-relaxed font-light">
                        Generating alternative livelihoods, minimizing distress migration, and preserving the unique cultures of villages across the globe.
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ImpactCard
                            slug="village-of-lum"
                            image={DEMO_IMAGES.impact1}
                            title="The Village of Lum"
                            description="Come, Stay with The Lepcha Tribe in Dzongu, North Sikkim. Experience their rich culture and sustainable way of life in a village that protects its heritage."
                        />
                        <ImpactCard
                            slug="rafis-house-our-first-homestay"
                            image={DEMO_IMAGES.impact2}
                            title="Rafi's House: Our First Homestay"
                            description="Meet Rafi - his house is one of the most popular getaways in Chamba. This initiative helped his family earn sustainable income without leaving their ancestral land."
                            highlight
                        />
                        <ImpactCard
                            slug="farmers-innovation-center"
                            image={DEMO_IMAGES.impact3}
                            title="Farmer's Innovation Center"
                            description="Nagaland: A Home to Several Indigenous Tribes fostering innovation in agriculture. We support local farmers in adopting organic practices."
                        />
                        <ImpactCard
                            slug="womens-weaver-cooperative"
                            image={DEMO_IMAGES.impact4}
                            title="Women's Weaver Cooperative"
                            description="Empowering women in Spiti Valley through traditional weaving. This cooperative ensures fair wages and preserves ancient textile techniques."
                        />
                        <ImpactCard
                            slug="waste-warriors-of-the-hills"
                            image={DEMO_IMAGES.impact5}
                            title="Waste Warriors of the Hills"
                            description="A community-led initiative to keep the Himalayas clean. Our trekking groups participate in cleanup drives, removing tons of plastic waste annually."
                        />
                        <ImpactCard
                            slug="education-for-all"
                            image={DEMO_IMAGES.impact6}
                            title="Education for All"
                            description="Supporting local schools in remote Ladakh villages. A portion of every trip booking goes towards providing books and solar power for classrooms."
                        />
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Want to make a difference?</h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Travel with us and directly contribute to these communities. Every journey leaves a positive footprint.
                    </p>
                    <Link to="/packages">
                        <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full text-lg shadow-lg transition-transform hover:-translate-y-1">
                            Plan Your Impact Trip
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ImpactPage;
