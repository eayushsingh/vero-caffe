import Navbar from "@/components/navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-24">

          <div className="text-center mb-8">
            <p className="text-sm tracking-[0.2em] uppercase text-neutral-500">
              Contact
            </p>

            <h2 className="mt-4 text-3xl md:text-4xl font-semibold">
              Visit VERO CAFFÈ
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location</h3>

              <p>
                Plot No.36, Himayat Sagar Rd
                <br />
                Hyderabad, Telangana
              </p>

              <h3 className="mt-6 text-lg font-medium">Hours</h3>

              <p>
                Mon – Fri: 7:00 AM – 7:00 PM
                <br />
                Saturday: 8:00 AM – 8:00 PM
              </p>

              <h3 className="mt-6 text-lg font-medium">Contact</h3>

              <p>
                Phone:{" "}
                <a
                  href="tel:+919701750099"
                  className="hover:text-[#6A4B3A]"
                >
                  +91 9701750099
                </a>
              </p>

            </div>

          </div>

        </div>
      </main>
    </>
  );
}
