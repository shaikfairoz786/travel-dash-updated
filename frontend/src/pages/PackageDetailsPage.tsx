import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import BookingModal from "../components/BookingModal";
import useAuth from "../hooks/useAuth";
import { API_BASE_URL } from "../config/api";
const placeholder = "/default-placeholder.jpg";


interface Package {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string;
  overview?: string;
  itinerary?: string[];
  inclusions?: string[];
  exclusions?: string[];
  price: number;
  currency: string;
  images?: {
    main?: string;
    gallery?: string[];
  };
  highlights?: string[];
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    name: string;
  };
}

const PackageDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { session } = useAuth();
  const accessToken = session?.access_token;

  /* Core Page State */
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  /* State for Slider */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // ✅ Unified Image Resolver
  const getImageUrl = (url?: string): string => {
    if (!url) return placeholder;
    if (url.startsWith("http")) return url;

    const cleanBase = API_BASE_URL.replace(/\/$/, "");
    const cleanUrl = url.replace(/^\/+/, "");

    return `${cleanBase}/${cleanUrl}`;
  };

  // Prepare all images array
  const allImages = React.useMemo(() => {
    if (!packageData) return [];
    const imgs: string[] = [];
    if (packageData.images?.main) imgs.push(packageData.images.main);
    if (packageData.images?.gallery) imgs.push(...packageData.images.gallery);
    return imgs.length > 0 ? imgs : [placeholder];
  }, [packageData]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/packages/${slug}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPackageData(data.package);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [slug]);

  // Auto-Slide Effect
  useEffect(() => {
    if (allImages.length <= 1 || isHovering) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [allImages.length, isHovering]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  // SEO: Update Page Title
  useEffect(() => {
    if (packageData) {
      document.title = `${packageData.title} | TravelTemplate Packages`;
    }
  }, [packageData]);

  const handleBookingSuccess = () => setIsBookingModalOpen(false);

  const downloadItineraryPDF = () => {
    if (!packageData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(packageData.title, margin, yPosition);
    yPosition += 15;

    // Package Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    if (packageData.shortDesc) {
      doc.text(packageData.shortDesc, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
      yPosition += doc.getTextDimensions(packageData.shortDesc, { maxWidth: pageWidth - 2 * margin }).h + 10;
    }

    // Price
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Price: ${packageData.currency} ${packageData.price.toFixed(2)}`, margin, yPosition);
    yPosition += 15;

    // Overview
    if (packageData.overview) {
      checkPageBreak(30);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Overview", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const overviewLines = doc.splitTextToSize(packageData.overview, pageWidth - 2 * margin);
      doc.text(overviewLines, margin, yPosition);
      yPosition += overviewLines.length * 6 + 10;
    }

    // Itinerary
    let itineraryArray: string[] = [];
    if (packageData.itinerary) {
      if (Array.isArray(packageData.itinerary)) {
        itineraryArray = packageData.itinerary;
      } else if (typeof packageData.itinerary === 'object') {
        // Handle JSON object format
        const itineraryObj = packageData.itinerary as Record<string, unknown>;
        if (itineraryObj.days && Array.isArray(itineraryObj.days)) {
          itineraryArray = itineraryObj.days.map((day: unknown) =>
            typeof day === 'string' ? day : `${(day as Record<string, unknown>).title || ''}: ${(day as Record<string, unknown>).description || ''}`
          );
        } else if (itineraryObj.items && Array.isArray(itineraryObj.items)) {
          itineraryArray = itineraryObj.items as string[];
        }
      }
    }

    if (itineraryArray.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Itinerary", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      itineraryArray.forEach((day, index) => {
        if (!day || day.trim() === '') return;
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.text(`Day ${index + 1}:`, margin, yPosition);
        yPosition += 7;

        doc.setFont("helvetica", "normal");
        const dayLines = doc.splitTextToSize(String(day), pageWidth - 2 * margin - 10);
        doc.text(dayLines, margin + 5, yPosition);
        yPosition += dayLines.length * 5 + 8;
      });
    }

    // Inclusions
    if (packageData.inclusions && Array.isArray(packageData.inclusions) && packageData.inclusions.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("What's Included", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      packageData.inclusions.forEach((item) => {
        checkPageBreak(10);
        doc.text(`• ${item}`, margin + 5, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    }

    // Exclusions
    if (packageData.exclusions && Array.isArray(packageData.exclusions) && packageData.exclusions.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("What's Excluded", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      packageData.exclusions.forEach((item) => {
        checkPageBreak(10);
        doc.text(`• ${item}`, margin + 5, yPosition);
        yPosition += 7;
      });
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );
    }

    // Save the PDF
    const fileName = `${packageData.title.replace(/[^a-z0-9]/gi, "_")}_Itinerary.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-secondary-700">
            Loading package details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-xl font-semibold text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Package not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 pt-4 md:pt-8">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* ===== Left Content ===== */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {packageData.title}
            </h1>

            {/* ===== Premium Auto-Slider Gallery ===== */}
            <div
              className="mb-8 select-none"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Main Slider Window */}
              <div className="relative h-[22rem] sm:h-[28rem] md:h-[34rem] w-full rounded-2xl overflow-hidden shadow-2xl mb-6 bg-secondary-900 group">

                {/* Sliding Track */}
                <div
                  className="flex h-full transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                  {allImages.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 relative">
                      <img
                        src={getImageUrl(img)}
                        alt={`${packageData.title} view ${idx + 1}`}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = placeholder;
                        }}
                      />
                      {/* Dark Gradient for Text/Controls visibility */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar (Visible when auto-sliding) */}
                {!isHovering && allImages.length > 1 && (
                  <div className="absolute bottom-0 left-0 h-1 bg-primary-500 z-20 transition-all duration-3000 ease-linear w-full animate-progress-bar origin-left"></div>
                )}
                {/* Static Bar Background */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10"></div>

                {/* Navigation Arrows (Glassmorphism) */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <button
                    onClick={prevImage}
                    className="pointer-events-auto bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all transform hover:scale-110 border border-white/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="pointer-events-auto bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all transform hover:scale-110 border border-white/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>

                {/* Image Counter Badge */}
                <div className="absolute bottom-6 left-6 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-medium tracking-wider">
                  {currentImageIndex + 1} / {allImages.length}
                </div>

                {/* Rating Badge Overlay */}
                {packageData.averageRating && (
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl flex items-center shadow-lg shadow-black/5 border border-white/50 z-10">
                    <svg className="w-5 h-5 text-yellow-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-bold text-gray-900">{packageData.averageRating.toFixed(1)}</span>
                      {packageData.reviewCount ? (
                        <span className="text-[10px] text-gray-500 font-medium tracking-wide">{packageData.reviewCount} Reviews</span>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>


            </div>

            {/* ===== Overview ===== */}
            {packageData.overview && (
              <Section title="Overview">
                <p className="text-gray-600 leading-relaxed">
                  {packageData.overview}
                </p>
              </Section>
            )}

            {/* ===== Highlights ===== */}
            {packageData.highlights && Array.isArray(packageData.highlights) && packageData.highlights.length > 0 && (
              <Section title="Key Highlights">
                <List items={packageData.highlights} color="green" />
              </Section>
            )}

            {/* ===== Itinerary ===== */}
            {packageData.itinerary && (
              <Section title="Itinerary">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Download the complete itinerary as PDF</span>
                  <button
                    onClick={downloadItineraryPDF}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300 font-semibold"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Download Itinerary
                  </button>
                </div>
                {Array.isArray(packageData.itinerary) ? (
                  <div className="space-y-4">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-semibold text-gray-800">
                          Day {index + 1}
                        </h3>
                        <p className="text-gray-600 mt-1">{day}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700">
                    {JSON.stringify(packageData.itinerary, null, 2)}
                  </pre>
                )}
              </Section>
            )}

            {/* ===== Inclusions ===== */}
            {packageData.inclusions && (
              <Section title="Inclusions">
                <List items={packageData.inclusions} color="green" />
              </Section>
            )}

            {/* ===== Exclusions ===== */}
            {packageData.exclusions && (
              <Section title="Exclusions">
                <List items={packageData.exclusions} color="red" />
              </Section>
            )}

            {/* ===== Reviews ===== */}
            {packageData.reviews?.length ? (
              <Section title="Reviews">
                <div className="space-y-4">
                  {packageData.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-xl shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {review.customer.name}
                        </h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            ) : null}
          </div>

          {/* ===== Right Sidebar ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Book This Package
              </h3>
              <p className="text-gray-600 mb-4">{packageData.shortDesc}</p>
              <div className="text-3xl font-bold text-primary-600 mb-6">
                {packageData.currency} {packageData.price.toFixed(2)}
              </div>

              {/* Download Itinerary Button */}
              {packageData.itinerary && (
                <button
                  onClick={downloadItineraryPDF}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-primary-600 text-primary-600 py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors duration-300 font-semibold mb-4"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download Itinerary
                </button>
              )}

              {accessToken ? (
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-300 font-semibold"
                >
                  Book Now
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Please login to book this package
                  </p>
                  <a
                    href="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Login
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {isBookingModalOpen && (
          <BookingModal
            packageId={packageData.id}
            packageName={packageData.title}
            price={packageData.price}
            onClose={() => setIsBookingModalOpen(false)}
            onBook={handleBookingSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default PackageDetailsPage;

/* ===== Helper Components ===== */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="bg-white p-6 rounded-xl shadow-sm">{children}</div>
  </div>
);

const List: React.FC<{ items: string[]; color: "green" | "red" }> = ({
  items,
  color,
}) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex items-center">
        <svg
          className={`w-5 h-5 mr-3 ${color === "green" ? "text-green-500" : "text-red-500"
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d={
              color === "green"
                ? "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                : "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            }
            clipRule="evenodd"
          />
        </svg>
        <span className="text-gray-700">{item}</span>
      </li>
    ))}
  </ul>
);
