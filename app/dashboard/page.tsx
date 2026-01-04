"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";


interface Contact {
  id: number | string;
  name: string;
  email: string;
  company: string;
  position: string;
  status: string;
  is_sent?: boolean;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  isDefault?: boolean;
}

interface Activity {
  id: string;
  description: string;
  created_at: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedContacts, setExtractedContacts] = useState<Contact[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userName, setUserName] = useState("User");
  
  // Stats State
  const [stats, setStats] = useState({
    pdfCount: 0,
    emailsSent: 0,
    dailyLimit: 20
  });

  const [settings, setSettings] = useState({
    professionalEmail: "",
    appPassword: ""
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  
  // Email Templates State
  const [defaultTemplate, setDefaultTemplate] = useState({
    id: 'default',
    name: 'Default Job Application Template',
    subject: 'Application for {position} at {company}',
    body: `Loading template...`,
    isDefault: true
  });
  
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [isEnhancingTemplate, setIsEnhancingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: ''
  });
  
  // UI Logging State
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const response = await fetch("https://hr-message-backend-2.onrender.com/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Set user name
          if (data.name) {
            setUserName(data.name);
          }

          // Set Stats
          setStats({
            pdfCount: data.pdf_upload_count || 0,
            emailsSent: data.emails_sent || 0,
            dailyLimit: data.daily_limit || 20
          });

          // Set contacts from API
          if (data.contacts && Array.isArray(data.contacts)) {
            setExtractedContacts(data.contacts.map((c: any) => ({
              id: c.id,
              name: c.name,
              email: c.email,
              company: c.company_name || c.company || "Unknown",
              position: "Recruiter",
              status: c.is_sent ? "sent" : "pending"
            })));
          }
          
          // Set Activities/Logs
          if (data.activities && Array.isArray(data.activities)) {
            const formattedLogs = data.activities.map((a: Activity) => {
              const time = new Date(a.created_at).toLocaleTimeString();
              return `[${time}] ${a.description}`;
            });
            setLogs(formattedLogs);
          }

          // Set settings from API
          if (data.professional_email || data.mail_app_password) {
            setSettings({
              professionalEmail: data.professional_email || "",
              appPassword: data.mail_app_password || ""
            });
          }
          
          // Set default template from API if available
          if (data.template) {
            setDefaultTemplate({
              id: data.template.id || 'default',
              name: data.template.name || 'Default Job Application Template',
              subject: data.template.subject || 'Application for {position} at {company}',
              body: data.template.body || '',
              isDefault: true
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile");
      }
    };

    fetchUserProfile();
  }, []);


  const processFiles = async (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    setIsProcessing(true);

    const uploadPromise = (async () => {
      const formData = new FormData();
      formData.append("file", files[0]);

      const token = Cookies.get("token");
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("https://hr-message-backend-2.onrender.com/upload", {
        method: "POST",
        body: formData,
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const contacts = Array.isArray(data) ? data : (data.contacts || []);
      
      const formattedContacts: Contact[] = contacts.map((c: Partial<Contact> & { company_name?: string }, index: number) => ({
        id: c.id || Date.now() + index,
        name: c.name || "Unknown",
        email: c.email || "N/A",
        company: c.company_name || c.company || "Unknown",
        position: c.position || "Recruiter",
        status: "pending"
      }));

      setExtractedContacts(prev => [...prev, ...formattedContacts]);
      return formattedContacts;
    })();

    toast.promise(uploadPromise, {
      loading: 'Extracting contacts...',
      success: 'Contacts extracted successfully!',
      error: 'Failed to extract contacts.',
    });

    try {
      await uploadPromise;
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const sendEmails = async () => {
    if (isProcessing) return;
    
    const pendingContacts = extractedContacts.filter(c => c.status !== 'sent');
    if (pendingContacts.length === 0) {
      toast.success("All contacts have already been emailed!");
      return;
    }

    if (!settings.professionalEmail || !settings.appPassword) {
      toast.error("Please configure your email settings first.");
      setActiveTab("settings");
      return;
    }

    setIsProcessing(true);
    let sentCount = 0;

    for (let i = 0; i < pendingContacts.length; i++) {
      const contact = pendingContacts[i];
      console.log(contact)
      
      // Rate limiting removed by user request
      // if (i > 0) { ... }

      try {
        // Template replacement with robust matching and logging
        let subject = defaultTemplate.subject;
        let body = defaultTemplate.body;

        console.log(`[Email Debug] Preparing email for ${contact.email}`);
        addLog(`Preparing email for ${contact.name} (${contact.email})...`);
        console.log(`[Email Debug] Raw Subject: "${subject}"`);

        const replacementMap: Record<string, string> = {
          'name': contact.name,
          'company': contact.company,
          'position': contact.position || 'Recruiter',
          'Hiring Manager Name': contact.name,
          'Company': contact.company,
          'Position': contact.position || 'Recruiter'
        };

        Object.entries(replacementMap).forEach(([key, value]) => {
           // Match {key} case-insensitive
           const regex = new RegExp(`{${key}}`, 'gi');
           subject = subject.replace(regex, value);
           body = body.replace(regex, value);
        });

        console.log(`[Email Debug] Final Subject: "${subject}"`);
        addLog(`Replaced placeholders. Subject: "${subject}"`);
        console.log(`[Email Debug] Final Body (first 200 chars): "${body.substring(0, 200)}..."`);

        const response = await fetch("https://hr-message-backend-2.onrender.com/api/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            sender_email: settings.professionalEmail,
            sender_password: settings.appPassword,
            recipient_email: contact.email,
            subject: subject,
            body: body
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send to ${contact.email}`);
        }

        // Update status in backend
        try {
          await fetch(`https://hr-message-backend-2.onrender.com/api/contacts/${contact.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({
              is_sent: true
            }),
          });
        } catch (updateError) {
          console.error(`Failed to update status for ${contact.id}:`, updateError);
          // Don't stop the process, just log the error
        }

        // Update status locally
        setExtractedContacts(prev => 
          prev.map(c => c.id === contact.id ? { ...c, status: 'sent' } : c)
        );
        
        setStats(prev => ({ ...prev, emailsSent: prev.emailsSent + 1 }));
        sentCount++;
        toast.success(`Email sent to ${contact.name}`);
        addLog(`SUCCESS: Email sent to ${contact.email}`);

      } catch (error) {
        console.error(`Error sending email to ${contact.name}:`, error);
        toast.error(`Failed to send email to ${contact.name}`);
        addLog(`ERROR: Failed to send to ${contact.email}. check console for details.`);
      }
    }

    setIsProcessing(false);
    if (sentCount > 0) {
      toast.success(`Process completed. Sent ${sentCount} emails.`);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user_name");
    router.push("/");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    const token = Cookies.get("token");
    if (!token) {
      toast.error("You are not logged in.");
      setIsSavingSettings(false);
      return;
    }

    try {
      const response = await fetch("https://hr-message-backend-2.onrender.com/api/auth/email-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          professional_email: settings.professionalEmail,
          mail_app_password: settings.appPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      toast.success("Settings saved successfully!");
      setIsEditingSettings(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSavingSettings(false);
    }
  };
  
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const template = {
      id: Date.now().toString(),
      ...newTemplate,
      isDefault: false
    };
    setCustomTemplates([...customTemplates, template]);
    setNewTemplate({ name: '', subject: '', body: '' });
    setIsCreatingTemplate(false);
    toast.success("Template created successfully!");
  };
  
  const handleDeleteTemplate = (id: string) => {
    setCustomTemplates(customTemplates.filter(t => t.id !== id));
    toast.success("Template deleted successfully!");
  };

  const handleEnhanceTemplate = async () => {
    setIsEnhancingTemplate(true);
    
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You are not logged in.");
      setIsEnhancingTemplate(false);
      return;
    }

    try {
      const response = await fetch("https://hr-message-backend-2.onrender.com/api/template/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: defaultTemplate.body
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the template with the enhanced content from backend
        setDefaultTemplate({
          ...defaultTemplate,
          body: data.body
        });
        toast.success("Template enhanced and saved!");
      } else {
        throw new Error(data.message || "Failed to enhance template");
      }
    } catch (error) {
      console.error("Error enhancing template:", error);
      toast.error("Failed to enhance template. Please try again.");
    } finally {
      setIsEnhancingTemplate(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">HR</span>
                </div>
                <span className="text-xl font-bold text-gray-900">HR Connect Pro</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Software Engineer</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">HR Outreach Dashboard</h1>
          <p className="text-gray-600 mt-2">Automate your job applications with AI-powered HR contact extraction</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">PDFs Uploaded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pdfCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contacts Found</p>
                <p className="text-2xl font-bold text-gray-900">{extractedContacts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-50 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Limit</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}/{stats.dailyLimit}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex -mb-px min-w-max sm:min-w-0">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === "upload"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Upload PDF
                  </button>
                  <button
                    onClick={() => setActiveTab("contacts")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === "contacts"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Extracted Contacts ({extractedContacts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === "settings"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => setActiveTab("templates")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === "templates"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Email Templates
                  </button>
                  <button
                    onClick={() => setActiveTab("logs")}
                    className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === "logs"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Activity Logs
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "upload" && (
                  <div>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center cursor-pointer hover:border-blue-400 transition-colors duration-200"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf"
                        multiple
                        className="hidden"
                      />
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload HR Contact PDFs</h3>
                      <p className="text-gray-500 mb-4">Drag and drop your PDF files here, or click to browse</p>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                        Select Files
                      </button>
                      <p className="text-sm text-gray-400 mt-4">Supports PDF files up to 10MB</p>
                    </div>

                    {isProcessing && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                          <div>
                            <p className="text-blue-800 font-medium">Processing PDF...</p>
                            <p className="text-blue-600 text-sm">AI is extracting HR contacts from your document</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {uploadedFiles.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Uploaded Files</h4>
                        <div className="space-y-3">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-gray-700 truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                              </div>
                              <span className="text-sm text-green-600 font-medium whitespace-nowrap ml-2">Processed</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "contacts" && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                      <h3 className="text-lg font-medium text-gray-900">Extracted HR Contacts</h3>
                      {extractedContacts.length > 0 && (
                        <button
                          onClick={sendEmails}
                          disabled={isProcessing}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {isProcessing ? "Sending..." : `Send Emails (${extractedContacts.length})`}
                        </button>
                      )}
                    </div>

                    {extractedContacts.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Contacts Found</h3>
                        <p className="text-gray-500">Upload a PDF to extract HR contacts.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {extractedContacts.map((contact) => (
                              <tr key={contact.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                      {contact.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                      <div className="text-xs text-gray-500">{contact.position}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{contact.company}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-blue-600 hover:underline cursor-pointer">{contact.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    contact.status === 'sent' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {contact.status === 'sent' ? 'Sent' : 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
                      {!isEditingSettings && (
                        <button
                          onClick={() => setIsEditingSettings(true)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        >
                          Edit Settings
                        </button>
                      )}
                    </div>
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={settings.professionalEmail}
                          onChange={(e) => setSettings({ ...settings, professionalEmail: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="you@company.com"
                          disabled={!isEditingSettings}
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">The email address used to send job applications.</p>
                      </div>

                      <div>
                        <label htmlFor="appPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          App Password
                        </label>
                        <input
                          type="password"
                          id="appPassword"
                          value={settings.appPassword}
                          onChange={(e) => setSettings({ ...settings, appPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="••••••••••••••••"
                          disabled={!isEditingSettings}
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Generate an App Password from your email provider&apos;s security settings.
                          <a href="#" className="text-blue-600 hover:text-blue-500 ml-1">Learn how</a>
                        </p>
                      </div>

                      {isEditingSettings && (
                        <div className="pt-4 flex space-x-3">
                          <button
                            type="submit"
                            disabled={isSavingSettings}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                          >
                            {isSavingSettings ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              "Save Settings"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingSettings(false)}
                            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}
                
                {activeTab === "templates" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Email Templates</h3>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleEnhanceTemplate}
                          disabled={isEnhancingTemplate}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                        >
                          {isEnhancingTemplate ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              Enhance with AI
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setIsCreatingTemplate(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Create Custom Template
                      </button>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900 flex items-center">
                              {defaultTemplate.name}
                              <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">Default</span>
                            </h4>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-600">Subject:</p>
                            <p className="text-sm text-gray-800">{defaultTemplate.subject}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600">Body:</p>
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{defaultTemplate.body}</p>
                          </div>
                          <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                            <p className="text-xs text-gray-600">
                              <strong>Available placeholders:</strong> {'{name}'}, {'{company}'}, {'{position}'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {customTemplates.length > 0 && (
                      <div className="space-y-4 mb-6">
                        <h4 className="font-medium text-gray-900">Your Custom Templates</h4>
                        {customTemplates.map((template) => (
                          <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{template.name}</h5>
                              <button
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                            <div className="mt-3 space-y-2">
                              <div>
                                <p className="text-xs font-medium text-gray-600">Subject:</p>
                                <p className="text-sm text-gray-800">{template.subject}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600">Body:</p>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{template.body}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {isCreatingTemplate && (
                      <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                        <h4 className="font-medium text-gray-900 mb-4">Create New Template</h4>
                        <form onSubmit={handleCreateTemplate} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Template Name
                            </label>
                            <input
                              type="text"
                              value={newTemplate.name}
                              onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="My Custom Template"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Subject
                            </label>
                            <input
                              type="text"
                              value={newTemplate.subject}
                              onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Use {name}, {company}, {position} placeholders"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Body
                            </label>
                            <textarea
                              value={newTemplate.body}
                              onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                              rows={8}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Write your email template here. Use {name}, {company}, {position} as placeholders."
                              required
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                            >
                              Save Template
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatingTemplate(false);
                                setNewTemplate({ name: '', subject: '', body: '' });
                              }}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "logs" && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">Activity Logs</h3>
                      <button
                        onClick={() => setLogs([])}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear Logs
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm">
                      {logs.length === 0 ? (
                        <p className="text-gray-500 italic">No activity logs yet...</p>
                      ) : (
                        logs.map((log, index) => (
                          <div key={index} className="mb-2 text-gray-300 border-b border-gray-800 pb-1 last:border-0 last:pb-0">
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={triggerFileInput}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-gray-700">Upload New PDF</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-gray-700">View Sent Emails</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setActiveTab("templates")}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-gray-700">Email Templates</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Emails Sent</span>
                    <span>{stats.emailsSent}/{stats.dailyLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(stats.emailsSent / stats.dailyLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Daily limit resets in:</p>
                  <p className="text-lg font-medium text-gray-900">12 hours 34 minutes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-700">PDF &quot;Tech Companies HR List&quot; processed</p>
                    <p className="text-xs text-gray-500">5 contacts extracted • 2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-700">2 emails sent to HR contacts</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
