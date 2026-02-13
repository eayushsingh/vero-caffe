import Navbar from "@/components/navbar";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-neutral-500">Contact</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold">Visit VERO CAFFE</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location</h3>
            <p>Plot No.36, Himayat Sagar Rd<br />Himayatnagar, Hyderabad<br />Telangana 500075, India</p>

            <h3 className="mt-6 text-lg font-medium">Hours</h3>
            <p>Mon — Fri: 7:00 AM — 7:00 PM<br />Saturday: 8:00 AM — 8:00 PM<br />Sunday: 8:00 AM — 6:00 PM</p>

            <h3 className="mt-6 text-lg font-medium">Contact</h3>
            <p>Phone: <a href="tel:+919701750099" className="hover:text-[#6A4B3A] transition-colors">+91 97017 50099</a></p>

            <div className="mt-4 flex items-center gap-3 text-sm text-[#6B6B6B]">
              <span className="inline-flex items-center gap-1"><span className="text-green-600">✓</span> Dine-in</span>
              <span className="inline-flex items-center gap-1"><span className="text-green-600">✓</span> Takeout</span>
            </div>
            <p className="mt-2 text-sm text-[#6B6B6B]">₹400–600 per person</p>
          </div>

          <div>
            <div className="w-full h-64 rounded-2xl overflow-hidden bg-white/80 shadow-sm">
              <iframe
                title="map"
                src="https://maps.google.com/maps?hl=en&q=VERO%20CAFFE%20Hyderabad&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                className="border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
