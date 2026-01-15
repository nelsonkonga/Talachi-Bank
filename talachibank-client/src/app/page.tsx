import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, ClockIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-900 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              TB
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-900 tracking-tight">Talachi Bank</h1>
              <p className="text-xs text-primary-500 font-medium tracking-wide">POST-QUANTUM SECURE</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="bg-primary-900 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-800 transition-colors">
              Secure Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Post-Quantum Security for <span className="text-secondary-500">Banking Transactions</span>
            </h2>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Protect high-value transfers with the SDitH signature scheme. NIST-compliant, quantum-resistant cryptography designed for the future of finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="px-8 py-4 bg-secondary-500 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-secondary-600 transition-all transform hover:-translate-y-1 flex items-center justify-center">
                Access Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <a href="https://github.com/nelsonkonga/Talachi-Bank/blob/main/DEMARRAGE.md" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center">
                View Documentation (DEMARRAGE.md)
              </a>
            </div>
          </div>
        </div>

        {/* Abstract shape decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#F59E0B" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.4C93.5,8.4,82.2,21.1,70.8,32.3C59.4,43.5,47.9,53.2,35.6,61.8C23.3,70.4,10.2,77.9,-1.9,81.2C-14,84.5,-25.1,83.6,-35.3,77.2C-45.5,70.8,-54.8,58.9,-63.3,47.2C-71.8,35.5,-79.5,24,-81.9,11.5C-84.3,-1,-81.4,-14.5,-74.6,-26.4C-67.8,-38.3,-57.1,-48.6,-45.3,-56.6C-33.5,-64.6,-20.6,-70.3,-6.9,-71.2C6.8,-72,20.6,-68,30.5,-83.6L44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Quantum-Resistant Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Protect transactions against future quantum computer attacks using code-based cryptography (Syndrome Decoding in GF(256)).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mb-6">
                <ClockIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Enterprise Performance</h3>
              <p className="text-slate-600 leading-relaxed">
                Sign transactions in ~450ms. Suitable for high-value transfers requiring maximum security without sacrificing speed.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-success-100 text-success-600 rounded-full flex items-center justify-center mb-6">
                <DocumentCheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Compliance Ready</h3>
              <p className="text-slate-600 leading-relaxed">
                NIST PQC standardization compliant. Full audit trails for regulatory requirements including SOX, Basel III, and GDPR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-16 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <div className="text-4xl font-bold text-secondary-500 mb-2">~12 KB</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Signature Size</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-500 mb-2">256-bit</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Max Security Level</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-500 mb-2">~450ms</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">Processing Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success-500 mb-2">PQC</div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">NIST Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Why Upgrade to Post-Quantum?</h2>

          <div className="bg-white rounded-xl shadow-lg run-off overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">Feature</th>
                  <th className="p-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">RSA-2048</th>
                  <th className="p-6 text-sm font-semibold text-slate-500 uppercase tracking-wider">ECDSA P-256</th>
                  <th className="p-6 text-sm font-bold text-primary-700 uppercase tracking-wider bg-primary-50">SDitH-128 (PQ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-6 font-medium text-slate-900">Quantum Safe</td>
                  <td className="p-6 text-danger-500 font-medium">❌ No</td>
                  <td className="p-6 text-danger-500 font-medium">❌ No</td>
                  <td className="p-6 text-success-600 font-bold bg-primary-50/30">✅ Yes</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-slate-900">NIST PQC Status</td>
                  <td className="p-6 text-slate-500">Deprecated 2030</td>
                  <td className="p-6 text-slate-500">Deprecated 2030</td>
                  <td className="p-6 text-primary-700 font-medium bg-primary-50/30">Standardized</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-slate-900">Security Type</td>
                  <td className="p-6 text-slate-500">Factoring</td>
                  <td className="p-6 text-slate-500">Elliptic Curve</td>
                  <td className="p-6 text-primary-700 font-medium bg-primary-50/30">Code-Based</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>&copy; 2026 Talachi Bank. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-primary-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary-600">Terms of Service</Link>
            <Link href="#" className="hover:text-primary-600">Compliance Statement</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
