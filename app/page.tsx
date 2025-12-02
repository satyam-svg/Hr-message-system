"use client";

import { useState } from "react";
import Link from "next/link";
import SignupPopup from "@/components/SignupPopup";
import LoginPopup from "@/components/LoginPopup";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-xl">HR</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  HR Connect Pro
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <Link href="#features" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium group">
                <span className="group-hover:shadow-cyan-500/25">Features</span>
              </Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-all duration-300 font-medium group">
                How It Works
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium group">
                Contact
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setShowLoginPopup(true)}
                className="px-6 py-2.5 text-gray-300 hover:text-white font-medium transition-all duration-300 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignupPopup(true)}
                className="px-7 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-cyan-400 focus:outline-none transition-colors duration-300"
              >
                <svg
                  className="h-7 w-7"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-xl border-t border-gray-700 animate-fade-in">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <Link
                href="#features"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-cyan-400 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-cyan-500/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-blue-400 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-blue-500/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#contact"
                className="block px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-purple-400 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-purple-500/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 space-y-3 border-t border-gray-700">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLoginPopup(true);
                  }}
                  className="w-full block px-4 py-3 text-center text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl transition-all duration-300 font-medium border border-gray-600 hover:border-cyan-500/50"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowSignupPopup(true);
                  }}
                  className="w-full block px-4 py-3 text-center bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 animate-fade-in-up">
              Automate Your{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                HR Outreach
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 animate-fade-in-up max-w-4xl mx-auto leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Upload PDFs. Extract Contacts. Send Emails. <span className="text-cyan-400">Automatically.</span>
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto" style={{ animationDelay: "0.3s" }}>
              Stop the tedious manual work. Our AI-powered system extracts HR contacts from your PDFs and sends personalized emails automatically. 20 emails per day, zero effort.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={() => setShowSignupPopup(true)}
                className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">Start Automating Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto px-10 py-5 bg-gray-800/50 text-gray-300 rounded-xl font-semibold text-lg border-2 border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-500 backdrop-blur-sm"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-20 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="relative max-w-6xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl shadow-blue-500/10 p-8">
                <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center space-x-2 p-4 border-b border-gray-700 bg-gray-800/50">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-gray-400 text-sm font-medium">HR Connect Pro - Dashboard</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Upload Card */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-cyan-500/20">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-2">Upload PDF</h3>
                        <p className="text-gray-400 text-sm">Drag & drop your HR contact PDFs</p>
                      </div>

                      {/* Process Card */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-blue-500/20">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-2">AI Extraction</h3>
                        <p className="text-gray-400 text-sm">Automatically extract emails & company data</p>
                      </div>

                      {/* Send Card */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-2">Auto-Send</h3>
                        <p className="text-gray-400 text-sm">Send 20 personalized emails daily</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              How It <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to automate your HR outreach and land your dream job
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50"></div>
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-cyan-500/25">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Upload Your PDF</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Simply upload the HR contact PDF. Our system supports all major PDF formats and automatically processes the document.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Extracts Contacts</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Our advanced AI scans the PDF and intelligently extracts HR emails, names, and company information with 99% accuracy.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-purple-500/25">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Auto-Send Emails</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  System automatically sends personalized emails to 20 HR contacts daily. Track responses and manage everything in one dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Powerful <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to automate your job application process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-cyan-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-cyan-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart PDF Processing</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced OCR technology that accurately extracts HR contact information from any PDF format with precision.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-blue-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Extraction</h3>
              <p className="text-gray-400 leading-relaxed">
                Machine learning algorithms that intelligently identify and extract relevant HR contacts and company data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-purple-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Automated Email Campaigns</h3>
              <p className="text-gray-400 leading-relaxed">
                Send personalized emails automatically with daily limits and smart scheduling to maximize response rates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-cyan-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-cyan-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Analytics Dashboard</h3>
              <p className="text-gray-400 leading-relaxed">
                Track email performance, response rates, and campaign effectiveness with detailed analytics and insights.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-blue-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Secure & Private</h3>
              <p className="text-gray-400 leading-relaxed">
                Enterprise-grade security with end-to-end encryption to protect your data and HR contacts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-purple-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mobile Optimized</h3>
              <p className="text-gray-400 leading-relaxed">
                Access your campaigns and track progress on-the-go with our fully responsive mobile interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
            Stop Manual HR Outreach
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start automating your job applications today. Upload PDFs and let our AI handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              onClick={() => setShowSignupPopup(true)}
              className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-500"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
            <Link
              href="#how-it-works"
              className="px-12 py-5 bg-gray-800/50 text-gray-300 rounded-xl font-semibold text-lg border-2 border-gray-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-500 backdrop-blur-sm"
            >
              Learn More
            </Link>
          </div>
          <p className="text-gray-400 mt-8 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-xl">HR</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HR Connect Pro
              </span>
            </div>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Automating HR outreach for software engineers and job seekers worldwide.
            </p>
            <div className="flex justify-center space-x-8 mb-8">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#contact" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                Contact
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 HR Connect Pro. All rights reserved. Designed for job seekers who mean business.
            </p>
          </div>
        </div>
      </footer>

      {/* Signup Popup */}
      <SignupPopup 
        isOpen={showSignupPopup} 
        onClose={() => setShowSignupPopup(false)} 
        onSwitchToLogin={() => {
          setShowSignupPopup(false);
          setShowLoginPopup(true);
        }}
      />

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)} 
        onSwitchToSignup={() => {
          setShowLoginPopup(false);
          setShowSignupPopup(true);
        }}
      />
    </div>
  );
}