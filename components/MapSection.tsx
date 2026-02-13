"use client";

import dynamic from "next/dynamic";

const MapEmbed = dynamic(
    () =>
        import("react").then(() => {
            // Return a simple component that renders the iframe
            const Embed = () => (
                <div className="rounded-2xl overflow-hidden border border-black/[0.06] shadow-md">
                    <div className="relative w-full h-64 sm:h-80 md:h-96">
                        <iframe
                            title="VERO CAFFÉ Location"
                            src="https://maps.google.com/maps?hl=en&q=VERO%20CAFFE%20Hyderabad&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                            className="absolute inset-0 w-full h-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            style={{ border: 0 }}
                        />
                    </div>
                </div>
            );
            Embed.displayName = "MapEmbed";
            return { default: Embed };
        }),
    {
        ssr: false,
        loading: () => (
            <div className="rounded-2xl border border-black/[0.06] h-64 sm:h-80 md:h-96 bg-neutral-100 animate-pulse" />
        ),
    }
);

export default function MapSection() {
    return (
        <section className="w-full py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                <h2
                    className="text-center font-serif text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#1A1A1A] mb-10 sm:mb-12 font-semibold"
                    style={{ fontFamily: "var(--font-serif)" }}
                >
                    Visit VERO CAFFÉ
                </h2>

                <MapEmbed />
            </div>
        </section>
    );
}
