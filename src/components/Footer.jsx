const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold">Camp<span className="text-green-400">Gear</span></h3>
            <p className="text-gray-400 text-sm mt-1">Rental Alat Camping Terpercaya</p>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p>© 2026 CampGear - All rights reserved</p>
            <p className="mt-1">Nikmati alam bebas dengan perlengkapan terbaik</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-green-400 transition">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;