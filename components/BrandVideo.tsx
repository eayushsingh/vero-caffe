export default function BrandVideo() {
    return (
        <section className="w-full py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <h2
                    className="text-center font-serif text-3xl sm:text-4xl tracking-[0.12em] uppercase text-[#1A1A1A] mb-12"
                    style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}
                >
                    Experience VERO CAFFÉ
                </h2>

                <div
                    className="relative rounded-2xl overflow-hidden border border-black/[0.06] aspect-video"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.10)" }}
                >
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                    >
                        <source src="/video/vero-brand.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>
        </section>
    );
}
