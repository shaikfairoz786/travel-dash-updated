import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Types
interface ImpactStory {
    slug: string;
    title: string;
    subtitle: string;
    images: {
        hero: string;
        main: string;
        gallery1: string;
        gallery2: string;
        before1: string;
        before2: string;
        after1: string;
        after2: string;
        homestays: { name: string; image: string }[];
    };
    location: string;
    whereIs: {
        title: string;
        content: React.ReactNode;
    };
    before: {
        title: string;
        content: React.ReactNode;
    };
    after: {
        title: string;
        content: React.ReactNode;
    };
    impact: {
        points: string[];
    };
}

const DEMO_IMAGES = {
    hero: "https://images.unsplash.com/photo-1572888195250-3037a59d695c?auto=format&fit=crop&q=80&w=2000",
    lumVillage: "https://images.unsplash.com/photo-1626621341139-e3271a940b95?auto=format&fit=crop&q=80&w=800",
    food: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
    woman: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800",
    before1: "https://images.unsplash.com/photo-1518182170546-07fb6123bc33?auto=format&fit=crop&q=80&w=800",
    before2: "https://images.unsplash.com/photo-1504966981333-1eb888025281?auto=format&fit=crop&q=80&w=800",
    homestay1: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80&w=600",
    homestay2: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&q=80&w=600",
    homestay3: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600",
    homestay4: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
    homestay5: "https://images.unsplash.com/photo-1605658865615-585a9c94be22?auto=format&fit=crop&q=80&w=600",
    homestay6: "https://images.unsplash.com/photo-1596395818816-65c363994e4a?auto=format&fit=crop&q=80&w=600",
};

// Data Dictionary
const IMPACT_STORIES: Record<string, ImpactStory> = {
    'village-of-lum': {
        slug: 'village-of-lum',
        title: 'The Village of Lum',
        subtitle: 'Come, Stay with The Lepcha Tribe',
        location: 'Lower Dzongu, North Sikkim, India',
        images: {
            hero: DEMO_IMAGES.hero,
            main: DEMO_IMAGES.lumVillage,
            gallery1: DEMO_IMAGES.food,
            gallery2: DEMO_IMAGES.woman,
            before1: DEMO_IMAGES.before1,
            before2: DEMO_IMAGES.before2,
            after1: DEMO_IMAGES.homestay1,
            after2: DEMO_IMAGES.homestay2,
            homestays: [
                { name: 'Loksummo Homestay', image: DEMO_IMAGES.homestay3 },
                { name: 'Dibongo Homestay', image: DEMO_IMAGES.homestay4 },
                { name: 'Tarjimmo Homestay', image: DEMO_IMAGES.homestay5 },
                { name: 'Singyen Homestay', image: DEMO_IMAGES.homestay6 },
                { name: 'Adhomoo Homestay', image: DEMO_IMAGES.homestay1 },
                { name: 'Kathar Homestay', image: DEMO_IMAGES.homestay2 },
            ]
        },
        whereIs: {
            title: 'Where is the Lum Village?',
            content: (
                <>
                    <strong>The Lum Village</strong> lies hidden in the <em>Lower Dzongu</em> region in <em>North Sikkim</em>.
                    Existing about 50 km away from the bustling town of <em>Gangtok</em>, Lum remains a completely secluded destination.
                    The <em>Dzongu</em> Region is a declared reserve of '<strong>The Lepcha Tribe</strong>' and one needs special permission to enter here.
                </>
            )
        },
        before: {
            title: 'Before Travores (NotOnMap Initiative)-',
            content: (
                <>
                    Previously, Lum Village had been actively involved in initiatives such as '<em>Shodhyatra</em>' and '<em>Organic Fairs</em>'.
                    It lay on the route of the <em>34th Shodhyatra</em> organized by <em>SRISTI Foundation</em>.
                    Inspired by the success and beauty of hosting a group of people, the former <strong>Pradhan</strong> of the village
                    <em>Tsering Lepcha</em> grew an interest in making his village more sustainable in the travel industry by establishing stays.
                    We came together to guide and educate these communities to become entrepreneurs in the travel vertical.
                </>
            )
        },
        after: {
            title: 'After Travores Intervention-',
            content: (
                <>
                    <p className="mb-4">
                        Just a single interaction made the intention of Lum People evident: to improve tourism in their locality.
                        Their dedication and efforts inspired us, and we helped by boosting their confidence in becoming entrepreneurs and running
                        self-sustainable homestays.
                    </p>
                    <p>
                        We worked from the grassroots level, introduced our concepts, and guided them to redesign their rooms according to tourist requirements.
                        We encouraged them to make use of locally procured materials, mainly bamboo as it was available in abundance.
                        We provided them guidelines for design and sustainable measures such as cleanliness drives, dustbin installations...
                    </p>
                </>
            )
        },
        impact: {
            points: [
                'Life of around 300 people will be impacted through the combined efforts and interventions.',
                'Travores on-boarded 9 homestays which are mainly run by the women of the family.',
                'Different community development programs will be run by us for benefit of locals.',
                'This Travores Community village is now creating employment opportunities within the village for the youth taking steps towards self-sustainability.'
            ]
        }
    },
    'rafis-house-our-first-homestay': {
        slug: 'rafis-house-our-first-homestay',
        title: "Rafi's House: Our First Homestay",
        subtitle: 'Authentic Local Living in Chamba',
        location: 'Chamba, Himachal Pradesh, India',
        images: {
            hero: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000",
            main: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
            gallery1: DEMO_IMAGES.food,
            gallery2: DEMO_IMAGES.woman,
            before1: DEMO_IMAGES.before1,
            before2: DEMO_IMAGES.before2,
            after1: DEMO_IMAGES.homestay1,
            after2: DEMO_IMAGES.homestay2,
            homestays: [
                { name: "Rafi's Main House", image: DEMO_IMAGES.homestay3 },
                { name: "Garden View Room", image: DEMO_IMAGES.homestay4 },
            ]
        },
        whereIs: {
            title: "Where is Rafi's House?",
            content: (
                <>
                    Nestled in the pristine valleys of <strong>Chamba</strong>, Rafi's house offers a panoramic view of the <em>Pir Panjal</em> range.
                    A short hike from the main road brings you to this traditional wooden home that has stood for over 100 years.
                </>
            )
        },
        before: {
            title: "The Beginning",
            content: "Rafi, a local artisan, struggled to maintain his ancestral home. The lack of livelihood options in the remote valley forced many youths to migrate to cities."
        },
        after: {
            title: "The Transformation",
            content: "We partnered with Rafi to restore his home without altering its traditional architecture. Today, it hosts travelers from around the world, providing a steady income and preserving the local heritage."
        },
        impact: {
            points: [
                "Restored a 100-year-old heritage property.",
                "provides direct livelihood to Rafi's family of 6.",
                "Promotes local handicrafts to visitors."
            ]
        }
    },
    // Default fallback for others
    'farmers-innovation-center': {
        slug: 'farmers-innovation-center',
        title: "Farmer's Innovation Center",
        subtitle: "Fostering Sustainable Agriculture",
        location: "Kohima, Nagaland",
        images: {
            hero: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000",
            main: DEMO_IMAGES.lumVillage,
            gallery1: DEMO_IMAGES.food,
            gallery2: DEMO_IMAGES.woman,
            before1: DEMO_IMAGES.before1,
            before2: DEMO_IMAGES.before2,
            after1: DEMO_IMAGES.homestay1,
            after2: DEMO_IMAGES.homestay2,
            homestays: []
        },
        whereIs: {
            title: "Where is the Center?",
            content: "Located in the heart of Nagaland's agricultural belt, this center serves as a hub for indigenous farming knowledge."
        },
        before: {
            title: "Challenges",
            content: "Farmers in the region were facing declining yields due to soil degradation and lack of access to modern organic techniques."
        },
        after: {
            title: "Innovation",
            content: "The center now trains over 500 farmers annually in permaculture, seed preservation, and organic certification."
        },
        impact: {
            points: [
                "500+ farmers trained annually.",
                "Preservation of rare indigenous seed varieties.",
                "Established a direct farm-to-table supply chain."
            ]
        }
    },
    'womens-weaver-cooperative': {
        slug: 'womens-weaver-cooperative',
        title: "Women's Weaver Cooperative",
        subtitle: "Empowering Women through Textiles",
        location: "Spiti Valley, Himachal Pradesh",
        images: {
            hero: DEMO_IMAGES.hero, // Placeholder
            main: DEMO_IMAGES.woman,
            gallery1: DEMO_IMAGES.food,
            gallery2: DEMO_IMAGES.lumVillage,
            before1: DEMO_IMAGES.before1,
            before2: DEMO_IMAGES.before2,
            after1: DEMO_IMAGES.homestay1,
            after2: DEMO_IMAGES.homestay2,
            homestays: []
        },
        whereIs: {
            title: "Where is the Cooperative?",
            content: "Located in the high-altitude desert of Spiti Valley, engaging women from remote villages."
        },
        before: {
            title: "The Challenge",
            content: "Traditional weaving skills were fading as younger generations moved away for work. Women had limited financial independence."
        },
        after: {
            title: "The Solution",
            content: "We established a cooperative that ensures fair wages, market access, and preservation of ancient designs."
        },
        impact: {
            points: [
                "Financial independence for 50+ women.",
                "Revival of lost traditional patterns.",
                "Global market access for local artisans."
            ]
        }
    },
    'waste-warriors-of-the-hills': {
        slug: 'waste-warriors-of-the-hills',
        title: "Waste Warriors of the Hills",
        subtitle: "Cleaning the Himalayas",
        location: "Uttarakhand & Himachal Pradesh",
        images: {
            hero: "https://images.unsplash.com/photo-1618477461853-5f8dd37af4b2?auto=format&fit=crop&q=80&w=2000",
            main: DEMO_IMAGES.lumVillage,
            gallery1: DEMO_IMAGES.food,
            gallery2: DEMO_IMAGES.woman,
            before1: DEMO_IMAGES.before1,
            before2: DEMO_IMAGES.before2,
            after1: DEMO_IMAGES.homestay1,
            after2: DEMO_IMAGES.homestay2,
            homestays: []
        },
        whereIs: {
            title: "Our Operational Areas",
            content: "We operate along major trekking routes and hill stations that face high tourist footfall."
        },
        before: {
            title: "The Crisis",
            content: "Unregulated tourism led to massive accumulation of plastic waste in pristine mountain ecosystems."
        },
        after: {
            title: "Our Action",
            content: "Regular cleanup drives, installation of waste management systems, and awareness campaigns for tourists."
        },
        impact: {
            points: [
                "Over 10 tons of waste removed annually.",
                "Implementation of segregation systems in villages.",
                "Plastic-free zones established in sensitive areas."
            ]
        }
    },
    'education-for-all': {
        slug: 'education-for-all',
        title: "Education for All",
        subtitle: "Supporting Remote Schools",
        location: "Ladakh, India",
        images: {
            hero: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2000",
            main: DEMO_IMAGES.lumVillage,
            gallery1: DEMO_IMAGES.food,
            gallery2: DEMO_IMAGES.woman,
            before1: DEMO_IMAGES.before1,
            before2: DEMO_IMAGES.before2,
            after1: DEMO_IMAGES.homestay1,
            after2: DEMO_IMAGES.homestay2,
            homestays: []
        },
        whereIs: {
            title: "Project Location",
            content: "High-altitude villages in Ladakh where government schools often lack resources due to inaccessibility."
        },
        before: {
            title: "The Gap",
            content: "Schools faced shortages of books, stationary, and electricity, affecting the quality of education."
        },
        after: {
            title: "Our Support",
            content: "We provide educational materials, solar power setups for digital classrooms, and teacher training support."
        },
        impact: {
            points: [
                "Solar power installed in 5 schools.",
                "Library established with 1000+ books.",
                "Scholarships for meritorious students."
            ]
        }
    }

};

const ImpactDetailsPage: React.FC = () => {
    const { slug } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const story = slug ? IMPACT_STORIES[slug] : null;

    if (!story) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Story Not Found</h1>
                <p className="text-gray-600 mb-8">We found't find the impact story you were looking for.</p>
                <Link to="/impact" className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                    Back to All Impacts
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">

            {/* 1. HERO SECTION */}
            <section className="relative h-[80vh] min-h-[600px] w-full">
                <div className="absolute inset-0">
                    <img
                        src={story.images.hero}
                        alt={story.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg max-w-5xl">
                        {story.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide drop-shadow-md">
                        {story.subtitle}
                    </p>
                </div>

                {/* Back Button */}
                <div className="absolute top-24 left-4 md:left-12 z-10">
                    <Link to="/impact" className="inline-flex items-center text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Impacts
                    </Link>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-20">

                {/* 2. WHERE IS? */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">{story.whereIs.title}</h2>
                        <div className="text-lg leading-relaxed text-gray-700 mb-6">
                            {story.whereIs.content}
                        </div>
                        <div className="flex items-center text-primary-600 font-medium">
                            <MapPinIcon className="w-5 h-5 mr-2" />
                            {story.location}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <img src={story.images.main} alt="Main View" className="h-48 w-full object-cover rounded-lg transform translate-y-8" />
                        <img src={story.images.gallery1} alt="Gallery 1" className="h-48 w-full object-cover rounded-lg" />
                        <img src={story.images.gallery2} alt="Gallery 2" className="h-48 w-full object-cover rounded-lg transform translate-y-8" />
                    </div>
                </div>

                <div className="border-t border-gray-100 my-12"></div>

                {/* 3. BEFORE */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{story.before.title}</h2>
                    <div className="text-lg leading-relaxed text-gray-700 mb-8 max-w-4xl">
                        {story.before.content}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <img src={story.images.before1} alt="Before 1" className="w-full h-80 object-cover rounded-xl shadow-md" />
                        <img src={story.images.before2} alt="Before 2" className="w-full h-80 object-cover rounded-xl shadow-md" />
                    </div>
                </div>

                {/* 4. AFTER */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{story.after.title}</h2>
                    <div className="text-lg leading-relaxed text-gray-700 mb-8 max-w-4xl">
                        {story.after.content}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <img src={story.images.after1} alt="After 1" className="w-full h-80 object-cover rounded-xl shadow-md" />
                        <img src={story.images.after2} alt="After 2" className="w-full h-80 object-cover rounded-xl shadow-md" />
                    </div>
                </div>

                {/* 5. IMPACT STATS */}
                <div className="mb-24">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Impact:</h2>
                    <ul className="list-disc list-outside ml-6 space-y-3 mb-12 text-lg text-gray-700 max-w-3xl">
                        {story.impact.points.map((point, idx) => (
                            <li key={idx} dangerouslySetInnerHTML={{ __html: point.replace(/(\d+)/g, '<strong>$1</strong>') }} />
                        ))}
                    </ul>

                    {/* Homestay Grid */}
                    {story.images.homestays.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {story.images.homestays.map((homestay, idx) => (
                                <div className="group" key={idx}>
                                    <img src={homestay.image} className="w-full h-64 object-cover rounded-lg mb-3" alt={homestay.name} />
                                    <p className="text-center font-medium text-gray-600 italic">{homestay.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Footer Note */}
            <div className="bg-gray-50 py-12 text-center px-4">
                <p className="text-gray-600 text-sm max-w-2xl mx-auto">
                    Since the COVID-19 pandemic, we have successfully guided them in sustaining themselves by selling local produce and maintaining revenue.
                </p>
            </div>

        </div>
    );
};

export default ImpactDetailsPage;
