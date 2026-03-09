import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClockIcon,
  CameraIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  CalendarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import SearchBar from "../components/SearchBar";
import WhyChooseUs from "../components/WhyChooseUs";
import WhatOurTravelersSay from "../components/WhatOurTravelersSay";
import { API_BASE_URL } from "../config/api";

const placeholder = "/default-placeholder.jpg";

// High-quality demo images for Video/Carousel effect
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1920", // Bali
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1920", // Paris
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1920", // Tokyo
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920", // Swiss
];

const DEMO_IMAGES = {
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=600",
  swiss: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=600",
  gallery1: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400",
  gallery2: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=400",
  gallery3: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
  gallery4: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80&w=400",
  impact1: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600", // Child/Village
  impact2: "https://images.unsplash.com/photo-1516937941348-c09645f871cd?auto=format&fit=crop&q=80&w=600", // Traditional House
  impact3: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600", // Farmer
};

interface Package {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  price: number;
  currency: string;
  images?: {
    main?: string;
  };
  averageRating?: number;
  reviewCount?: number;
  difficulty?: string;
  duration?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  image?: string;
  content?: string;
  createdAt: string;
}

const HomePage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hero Slider State
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Experience Slider Logic - Responsive
  const [activeSlide, setActiveSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3); // Default to desktop

  // Impact Slider State
  const [impactActiveSlide, setImpactActiveSlide] = useState(0);

  // Stories Slider State
  const [storiesActiveSlide, setStoriesActiveSlide] = useState(0);

  const getImageUrl = (url?: string): string => {
    if (!url) return placeholder;
    if (url.startsWith("http")) return url;
    const cleanBase = API_BASE_URL.replace(/\/$/, "");
    const cleanUrl = url.replace(/^\/+/, "");
    return `${cleanBase}/${cleanUrl}`;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    handleResize(); // Init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure activeSlide is valid when itemsPerSlide changes
  useEffect(() => {
    setActiveSlide(0);
    setImpactActiveSlide(0);
    setStoriesActiveSlide(0);
  }, [itemsPerSlide]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/packages?limit=9`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPackages(data.packages || []);

        const blogRes = await fetch(`${API_BASE_URL}/api/blogs?limit=9`); // Increased limit for slider
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          setBlogs(blogData.blogs || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-secondary-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Error</h2>
          <p className="text-secondary-600 mb-6">{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  // IMPACT DATA
  const IMPACT_STORIES_DATA = [
    {
      slug: "village-of-lum",
      image: DEMO_IMAGES.impact1,
      title: "The Village of Lum",
      description: "Come, Stay with The Lepcha Tribe. Experience their rich culture and sustainable way of life.",
      highlight: false
    },
    {
      slug: "rafis-house-our-first-homestay",
      image: DEMO_IMAGES.impact2,
      title: "Rafi's House: Our First Homestay",
      description: "Meet Rafi - his house is one of the most popular getaways in Chamba for authentic local living.",
      highlight: true
    },
    {
      slug: "farmers-innovation-center",
      image: DEMO_IMAGES.impact3,
      title: "Farmer's Innovation Center",
      description: "Nagaland: A Home to Several Indigenous Tribes fostering innovation in agriculture and sustainable farming.",
      highlight: false
    },
    { // Extra items to demonstrate slider
      slug: "womens-weaver-cooperative",
      image: DEMO_IMAGES.impact1, // Placeholder
      title: "Women's Weaver Cooperative",
      description: "Empowering women in Spiti Valley through traditional weaving.",
      highlight: false
    },
    {
      slug: "waste-warriors-of-the-hills",
      image: DEMO_IMAGES.impact2, // Placeholder
      title: "Waste Warriors of the Hills",
      description: "A community-led initiative to keep the Himalayas clean.",
      highlight: false
    },
    {
      slug: "education-for-all",
      image: DEMO_IMAGES.impact3, // Placeholder
      title: "Education for All",
      description: "Supporting local schools in remote Ladakh villages.",
      highlight: false
    }
  ];

  // Calculate slides
  const totalSlides = Math.ceil(packages.length / itemsPerSlide);
  const visiblePackages = packages.slice(activeSlide * itemsPerSlide, (activeSlide + 1) * itemsPerSlide);

  const totalImpactSlides = Math.ceil(IMPACT_STORIES_DATA.length / itemsPerSlide);
  const visibleImpacts = IMPACT_STORIES_DATA.slice(impactActiveSlide * itemsPerSlide, (impactActiveSlide + 1) * itemsPerSlide);

  const totalStorySlides = Math.ceil(blogs.length / itemsPerSlide);
  const visibleStories = blogs.slice(storiesActiveSlide * itemsPerSlide, (storiesActiveSlide + 1) * itemsPerSlide);

  return (
    <div className="min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900">

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={img}
              alt="Hero Background"
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${index === currentHeroIndex ? "scale-110" : "scale-100"
                }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/50 to-secondary-900/40"></div>
          </div>
        ))}

        <div className="relative z-10 container mx-auto px-4 text-center mt-28 md:mt-40">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-wide mb-6 animate-fade-in-down shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Explore the World with TravelTemplate
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl animate-slide-up">
            Chase The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-accent-300">
              Extraordinary
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md animate-slide-up animation-delay-200">
            Discover curated packages, hidden gems, and unforgettable experiences. Your next great story begins today.
          </p>

          <div className="max-w-3xl mx-auto transform hover:scale-[1.01] transition-transform duration-300 animate-slide-up animation-delay-400">
            <SearchBar />
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in animation-delay-600 border-t border-white/10 pt-8 max-w-6xl mx-auto">
            <StatItem number="500+" label="Destinations" />
            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
            <StatItem number="10k+" label="Happy Travelers" />
            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
            <StatItem number="4.9/5" label="Average Rating" />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle text-white/70 flex flex-col items-center gap-2 cursor-pointer hover:text-white transition-colors">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll to Explore</span>
          <ChevronDownIcon className="w-6 h-6" />
        </div>
      </section>

      {/* TRENDING LOCATIONS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">Trending Locations</h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Curated locations that are capturing the hearts of travelers worldwide this season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[600px] md:h-[500px]">
            <DestinationCard
              image={DEMO_IMAGES.bali}
              title="Bali, Indonesia"
              subtitle="Tropical Paradise"
              className="md:col-span-2 md:row-span-2"
            />
            <DestinationCard
              image={DEMO_IMAGES.paris}
              title="Paris, France"
              subtitle="City of Lights"
              className=""
            />
            <DestinationCard
              image={DEMO_IMAGES.tokyo}
              title="Tokyo, Japan"
              subtitle="Future Meets Tradition"
              className=""
            />
            <DestinationCard
              image={DEMO_IMAGES.swiss}
              title="Swiss Alps"
              subtitle="Winter Wonderland"
              className="md:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* ❤️ IMPACT SECTION (New) */}
      <section className="py-24 bg-primary-600 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-primary-500 pb-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold text-yellow-300 mb-6">Impact</h2>
              <p className="text-primary-100 text-lg leading-relaxed">
                We work to generate alternative livelihoods & minimize distress migration from villages.
                Read more about the impact created by the TravelTemplate team in several communities across the world.
              </p>
            </div>
            <Link to="/impact" className="hidden md:inline-flex items-center font-bold text-white hover:text-yellow-300 transition-colors mt-6 md:mt-0">
              See All Impacts <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Cards Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {visibleImpacts.map((story, idx) => (
              <ImpactCard
                key={idx}
                slug={story.slug}
                image={story.image}
                title={story.title}
                description={story.description}
                highlight={story.highlight}
              />
            ))}
          </div>

          {/* Dots Navigation for Impact */}
          {totalImpactSlides > 1 && (
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: totalImpactSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setImpactActiveSlide(idx)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${idx === impactActiveSlide ? "bg-yellow-400 w-8" : "bg-primary-400 hover:bg-yellow-200"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/impact" className="inline-flex items-center font-bold text-white hover:text-yellow-300 transition-colors">
              See All Impacts <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* DESTINATIONS SLIDER */}
      <section className="py-24 relative overflow-hidden min-h-[900px]">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
            alt="Mountain Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent h-1/3"></div>
          <div className="absolute inset-0 bg-white/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 mb-4 inline-block">
              Destinations
            </h2>
          </div>

          {/* Cards Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transition-all max-w-6xl mx-auto">
            {visiblePackages.map((pkg) => (
              <Link to={`/package/${pkg.slug}`} key={pkg.id} className="block h-full">
                <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-2 cursor-pointer border border-transparent hover:border-primary-100">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getImageUrl(pkg.images?.main)}
                      alt={pkg.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholder;
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow text-left bg-white relative">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">
                      {pkg.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-sm text-gray-500 font-medium">From</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {pkg.currency} {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">per person</span>
                    </div>
                    <div className="flex flex-col gap-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600 font-medium">
                        <ClockIcon className="h-5 w-5 mr-3 text-emerald-500" />
                        {pkg.duration || "10 Days"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 font-medium">
                        <CalendarIcon className="h-5 w-5 mr-3 text-emerald-500" />
                        Availability: March - June, Sept - Oct
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {pkg.shortDesc || "High altitude Himalayan passes, sleepy villages of the Monpa tribe, and Buddhist monasteries. Visit the land that was once perhaps the only way to reach..."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots Navigation */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mb-12">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${idx === activeSlide ? "bg-emerald-600 w-8" : "bg-emerald-200 hover:bg-emerald-400"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/packages">
              <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-full text-lg shadow-lg hover:bg-emerald-700 transition-transform active:scale-95 hover:-translate-y-1">
                View All Destinations
              </button>
            </Link>
          </div>
        </div>
      </section>



      {/* WHY CHOOSE US */}
      <WhyChooseUs />

      {/* GALLERY */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm">#TravelDiaries</span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2">Captured Moments</h2>
          </div>
          <div className="columns-2 md:columns-4 gap-4 space-y-4">
            <div className="break-inside-avoid rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
              <img src={DEMO_IMAGES.gallery1} alt="Gallery" className="w-full h-auto rounded-xl" />
            </div>
            <div className="break-inside-avoid rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
              <img src={DEMO_IMAGES.gallery2} alt="Gallery" className="w-full h-auto rounded-xl" />
            </div>
            <div className="break-inside-avoid rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
              <img src={DEMO_IMAGES.gallery3} alt="Gallery" className="w-full h-auto rounded-xl" />
            </div>
            <div className="break-inside-avoid rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
              <img src={DEMO_IMAGES.gallery4} alt="Gallery" className="w-full h-auto rounded-xl" />
            </div>
            <div className="break-inside-avoid rounded-xl overflow-hidden bg-primary-600 text-white p-8 flex flex-col justify-center items-center text-center h-48">
              <CameraIcon className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="font-bold text-xl">Share Your Story</h3>
            </div>
            <div className="break-inside-avoid rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
              <img src={DEMO_IMAGES.bali} alt="Gallery" className="w-full h-auto rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="py-24 relative overflow-hidden bg-gray-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
            alt="Stories Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/30"></div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">Latest Travel Stories</h2>
            <p className="text-gray-200 max-w-2xl mx-auto text-lg">
              Tips, guides, and inspiration from our travel experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {visibleStories.map((blog) => (
              <Link to={`/blogs/${blog.slug}`} key={blog.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={getImageUrl(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : 'Read this amazing story...'}
                  </p>
                  <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                    <span className="text-gray-500 text-sm font-medium">Read Article</span>
                    <span className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                      <PaperAirplaneIcon className="w-4 h-4 transform -rotate-45 group-hover:rotate-0 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {blogs.length === 0 && (
              <div className="col-span-3 text-center text-white/50 py-10 border-2 border-dashed border-white/20 rounded-xl backdrop-blur-sm">
                Coming Soon...
              </div>
            )}
          </div>

          {/* Dots Navigation for Stories */}
          {totalStorySlides > 1 && (
            <div className="flex justify-center gap-2 mb-12">
              {Array.from({ length: totalStorySlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setStoriesActiveSlide(idx)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${idx === storiesActiveSlide ? "bg-primary-500 w-8" : "bg-white/30 hover:bg-white/60"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/blogs">
              <button className="px-10 py-4 bg-white text-gray-900 font-bold rounded-full text-lg shadow-xl hover:bg-gray-100 transition-transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 mx-auto">
                View All Stories <ArrowRightIcon className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <WhatOurTravelersSay />




    </div>
  );
};

/* --- SUB-COMPONENTS --- */
const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center group cursor-default">
    <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">{number}</div>
    <div className="text-sm font-medium text-white/80 uppercase tracking-widest">{label}</div>
  </div>
);

const DestinationCard = ({ image, title, subtitle, className = "" }: { image: string; title: string; subtitle: string; className?: string }) => (
  <div className={`relative group rounded-3xl overflow-hidden cursor-pointer ${className}`}>
    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
    <div className="absolute bottom-0 left-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
      <p className="text-primary-300 font-medium">{subtitle}</p>
    </div>
  </div>
);

const ImpactCard = ({ image, title, description, slug, highlight = false }: { image: string; title: string; description: string; slug: string; highlight?: boolean }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 cursor-pointer">
    <div className="h-56 overflow-hidden">
      <Link to={`/impact/${slug}`}>
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </Link>
    </div>
    <div className="p-6 h-full flex flex-col">
      <Link to={`/impact/${slug}`}>
        <h3 className={`text-xl font-bold mb-3 ${highlight ? 'text-yellow-500' : 'text-gray-900 group-hover:text-primary-600'} transition-colors`}>{title}</h3>
      </Link>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
      <div className="mt-auto">
        <Link to={`/impact/${slug}`} className="text-primary-600 font-bold text-sm hover:text-emerald-700 transition-colors">Read more &rarr;</Link>
      </div>
    </div>
  </div>
);

export default HomePage;
