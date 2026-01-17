"use client"

import { useState } from "react"
import { X, Phone, Mail, Plus, Trash2 } from "lucide-react"

interface Contact {
  id: string
  name: string
  phone: string
  email: string
}

interface EmergencyContactsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EmergencyContactsModal({ isOpen, onClose }: EmergencyContactsModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "John (Sister)", phone: "+1-555-0100", email: "john@example.com" },
    { id: "2", name: "Mom", phone: "+1-555-0101", email: "mom@example.com" },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "" })

  const handleAddContact = () => {
    if (newContact.name && (newContact.phone || newContact.email)) {
      setContacts([...contacts, { id: Date.now().toString(), ...newContact }])
      setNewContact({ name: "", phone: "", email: "" })
      setShowAdd(false)
    }
  }

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border-2 border-red-500 rounded-lg w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Emergency Contacts</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-slate-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white">{contact.name}</h4>
                <button onClick={() => handleDelete(contact.id)} className="text-red-400 hover:text-red-300 transition">
                  <Trash2 size={18} />
                </button>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Phone size={16} />
                  {contact.phone}
                </div>
              )}
              {contact.email && (
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mail size={16} />
                  {contact.email}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Contact Form */}
        {showAdd && (
          <div className="border-t border-slate-700 p-4 space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddContact}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer Button */}
        {!showAdd && (
          <div className="border-t border-slate-700 p-4">
            <button
              onClick={() => setShowAdd(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              <Plus size={20} />
              Add Contact
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
