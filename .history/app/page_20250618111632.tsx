import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-6">
      {/* Hero Section */}
      <section id="hero" className="w-full text-center py-20">
        <h1 className="text-5xl font-bold">Your Name - Voice Talent</h1>
        <p className="mt-4 text-xl">Professional Voiceovers for all your needs.</p>
        {/* Add your photo/avatar here */}
        {/* Add a demo reel link/button here */}
      </section>

      {/* About Section */}
      <section id="about" className="w-full max-w-4xl mx-auto py-20">
        <h2 className="text-4xl font-semibold text-center">About Me</h2>
        <p className="mt-6 text-lg leading-relaxed">
          {/* Write your bio here. Talk about your experience, style, and passion for voice acting. */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        {/* Add more details about your skills and experience */}
      </section>

      {/* Services Section */}
      <section id="services" className="w-full max-w-4xl mx-auto py-20">
        <h2 className="text-4xl font-semibold text-center">Services</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* List your services here (e.g., Commercials, Narration, Audiobooks, etc.) */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">Service 1</h3>
            <p className="mt-4">Description of service 1.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">Service 2</h3>
            <p className="mt-4">Description of service 2.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">Service 3</h3>
            <p className="mt-4">Description of service 3.</p>
          </div>
        </div>
      </section>

      {/* Portfolio/Samples Section */}
      <section id="portfolio" className="w-full max-w-4xl mx-auto py-20">
        <h2 className="text-4xl font-semibold text-center">Portfolio & Samples</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Embed audio samples or link to projects here */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">Sample Title 1</h3>
            {/* Audio player or link */}
            <p className="mt-4">Brief description of the sample.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold">Sample Title 2</h3>
            {/* Audio player or link */}
            <p className="mt-4">Brief description of the sample.</p>
          </div>
        </div>
      </section>

      {/* Testimonials/Clients Section */}
      <section id="testimonials" className="w-full max-w-4xl mx-auto py-20">
        <h2 className="text-4xl font-semibold text-center">Testimonials</h2>
        <div className="mt-10 space-y-8">
          {/* Add client testimonials here */}
          <div className="p-6 border rounded-lg italic">
            <p>"Your voice brought our project to life!"</p>
            <p className="mt-4 font-bold">- Client Name</p>
          </div>
          <div className="p-6 border rounded-lg italic">
            <p>"Professional, fast, and excellent quality."</p>
            <p className="mt-4 font-bold">- Another Client</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full max-w-4xl mx-auto py-20">
        <h2 className="text-4xl font-semibold text-center">Get in Touch</h2>
        <p className="mt-6 text-lg text-center">
          {/* Add your contact information or a contact form here */}
          Email: your.email@example.com | Phone: (123) 456-7890
        </p>
        {/* You might want to add a contact form component here */}
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-10 border-t mt-20">
        <p>&copy; 2025 Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
}
