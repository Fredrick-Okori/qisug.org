'use client'

import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Mail, 
  Globe, 
  Database,
  Shield,
  Save,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [settings, setSettings] = useState({
    siteName: 'Queensgate International School',
    siteUrl: 'https://qgis.ac.ug',
    timezone: 'Africa/Kampala',
    language: 'en',
    emailNotifications: true,
    applicationUpdates: true,
    paymentAlerts: true,
    weeklyReports: false,
    twoFactorAuth: false,
    sessionTimeout: '30',
    ipWhitelist: '',
    applicationOpen: true,
    maxApplications: '500',
    reviewDeadline: '2024-03-31',
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'admissions', label: 'Admissions', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your admin panel configuration</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-[#053f52] text-white rounded-lg hover:bg-[#0a4d63] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#053f52] text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {activeTab === 'general' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">General Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Site URL</label>
                      <input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
                        >
                          <option value="Africa/Kampala">Africa/Kampala (UTC+3)</option>
                          <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>
                          <option value="Africa/Lagos">Africa/Lagos (UTC+1)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Language</label>
                        <select
                          value={settings.language}
                          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
                        >
                          <option value="en">English</option>
                          <option value="fr">French</option>
                          <option value="sw">Swahili</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Email Notifications</p>
                          <p className="text-sm text-slate-500">Receive notifications via email</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="w-5 h-5 text-[#053f52] rounded focus:ring-[#053f52]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Application Updates</p>
                          <p className="text-sm text-slate-500">Get notified when applications are submitted</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.applicationUpdates}
                        onChange={(e) => setSettings({ ...settings, applicationUpdates: e.target.checked })}
                        className="w-5 h-5 text-[#053f52] rounded focus:ring-[#053f52]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Payment Alerts</p>
                          <p className="text-sm text-slate-500">Receive alerts for payment activities</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.paymentAlerts}
                        onChange={(e) => setSettings({ ...settings, paymentAlerts: e.target.checked })}
                        className="w-5 h-5 text-[#053f52] rounded focus:ring-[#053f52]"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Weekly Reports</p>
                          <p className="text-sm text-slate-500">Receive weekly summary reports</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.weeklyReports}
                        onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                        className="w-5 h-5 text-[#053f52] rounded focus:ring-[#053f52]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                          <p className="text-sm text-slate-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                        className="w-5 h-5 text-[#053f52] rounded focus:ring-[#053f52]"
                      />
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Session Timeout (minutes)</label>
                      <select
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent bg-white"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">IP Whitelist</label>
                      <textarea
                        value={settings.ipWhitelist}
                        onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                        placeholder="Enter IP addresses, one per line"
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                      />
                      <p className="text-sm text-slate-500 mt-1">Leave empty to allow all IP addresses</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admissions' && (
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Admissions Configuration</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">Applications Open</p>
                          <p className="text-sm text-slate-500">Allow new applications to be submitted</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.applicationOpen}
                        onChange={(e) => setSettings({ ...settings, applicationOpen: e.target.checked })}
                        className="w-5 h-5 text-[#053f52] rounded focus:ring-[#053f52]"
                      />
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Applications</label>
                      <input
                        type="number"
                        value={settings.maxApplications}
                        onChange={(e) => setSettings({ ...settings, maxApplications: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                      />
                      <p className="text-sm text-slate-500 mt-1">Maximum number of applications to accept</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Review Deadline</label>
                      <input
                        type="date"
                        value={settings.reviewDeadline}
                        onChange={(e) => setSettings({ ...settings, reviewDeadline: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053f52] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

