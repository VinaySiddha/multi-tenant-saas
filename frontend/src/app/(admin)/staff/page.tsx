"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  Mail, 
  Phone, 
  UserCheck, 
  UserX, 
  Edit3, 
  Trash2, 
  X,
  ChefHat,
  Receipt,
  Utensils,
  KeyRound,
  Building2
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { StaffMember, UserRole } from "@/types";

const DEMO_STAFF: StaffMember[] = [
  { id: "u1", tenantId: "demo", email: "owner@royalbistro.com", fullName: "Alex Mercer", phoneNumber: "+91 98765 43210", role: "RESTAURANT_OWNER", isActive: true },
  { id: "u2", tenantId: "demo", email: "cashier@royalbistro.com", fullName: "Rahul Verma", phoneNumber: "+91 98765 43211", role: "CASHIER", isActive: true },
  { id: "u3", tenantId: "demo", email: "chef@royalbistro.com", fullName: "Sanjay Kapoor", phoneNumber: "+91 98765 43212", role: "CHEF", isActive: true },
  { id: "u4", tenantId: "demo", email: "waiter@royalbistro.com", fullName: "Priya Sharma", phoneNumber: "+91 98765 43213", role: "WAITER", isActive: true },
];

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(DEMO_STAFF);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");

  // Modal states
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form states
  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "WAITER" as UserRole,
    password: ""
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/staff");
      if (res.data?.data && res.data.data.length > 0) {
        setStaffList(res.data.data);
      }
    } catch {
      // Keep demo fallback
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staff: StaffMember) => {
    const newStatus = !staff.isActive;
    try {
      await apiClient.patch(`/staff/${staff.id}/status?active=${newStatus}`);
      setStaffList(staffList.map(s => s.id === staff.id ? { ...s, isActive: newStatus } : s));
    } catch {
      setStaffList(staffList.map(s => s.id === staff.id ? { ...s, isActive: newStatus } : s));
    }
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const res = await apiClient.put(`/staff/${editingStaff.id}`, {
          fullName: staffForm.fullName,
          phoneNumber: staffForm.phoneNumber,
          role: staffForm.role,
          password: staffForm.password || undefined
        });
        const updated = res.data?.data || { ...editingStaff, ...staffForm };
        setStaffList(staffList.map(s => s.id === editingStaff.id ? updated : s));
      } else {
        const res = await apiClient.post("/staff", {
          email: staffForm.email,
          fullName: staffForm.fullName,
          phoneNumber: staffForm.phoneNumber,
          role: staffForm.role,
          password: staffForm.password || "Admin@123"
        });
        const created = res.data?.data || {
          id: String(Date.now()),
          tenantId: "demo",
          email: staffForm.email,
          fullName: staffForm.fullName,
          phoneNumber: staffForm.phoneNumber,
          role: staffForm.role,
          isActive: true
        };
        setStaffList([...staffList, created]);
      }
      setShowStaffModal(false);
      setEditingStaff(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save staff member");
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff account?")) return;
    try {
      await apiClient.delete(`/staff/${id}`);
      setStaffList(staffList.filter(s => s.id !== id));
    } catch {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  const openEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffForm({
      fullName: staff.fullName,
      email: staff.email,
      phoneNumber: staff.phoneNumber || "",
      role: staff.role,
      password: ""
    });
    setShowStaffModal(true);
  };

  const filteredStaff = staffList.filter(s => {
    const matchesRole = selectedRole === "ALL" || s.role === selectedRole;
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "RESTAURANT_OWNER":
      case "PLATFORM_ADMIN":
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case "BRANCH_MANAGER":
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case "CASHIER":
        return <Receipt className="w-4 h-4 text-blue-600" />;
      case "CHEF":
        return <ChefHat className="w-4 h-4 text-rose-600" />;
      case "WAITER":
        return <Utensils className="w-4 h-4 text-amber-600" />;
      default:
        return <Users className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Staff & Access Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your restaurant workforce, portal access levels, cashier terminals, kitchen displays, and waiter accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStaff}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => {
              setEditingStaff(null);
              setStaffForm({ fullName: "", email: "", phoneNumber: "", role: "WAITER", password: "" });
              setShowStaffModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition"
          >
            <Plus className="w-4 h-4" /> Add Team Member
          </button>
        </div>
      </div>

      {/* Roster Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Staff Members</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{staffList.length}</span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Active Roster</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Kitchen & Chefs</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {staffList.filter(s => s.role === "CHEF").length}
            </span>
            <span className="text-xs font-semibold text-slate-500">KDS Access</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Cashiers & POS</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {staffList.filter(s => s.role === "CASHIER").length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Billing Terminal</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Waiters & Service</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {staffList.filter(s => s.role === "WAITER").length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Floor Service</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["ALL", "RESTAURANT_OWNER", "CASHIER", "CHEF", "WAITER"].map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedRole === role
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {role === "ALL" ? "All Roles" : role.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Employee Name</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">System Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-300">
                        {staff.fullName.charAt(0)}
                      </div>
                      <div>
                        <div>{staff.fullName}</div>
                        <div className="text-[11px] font-normal text-slate-500">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                      {getRoleIcon(staff.role)}
                      <span>{staff.role.replace("_", " ")}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{staff.phoneNumber || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(staff)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                        staff.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                      }`}
                      title="Click to toggle account access"
                    >
                      {staff.isActive ? (
                        <>
                          <UserCheck className="w-3 h-3" /> Active Access
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3" /> Suspended
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(staff)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        title="Edit Staff Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                        title="Remove Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {editingStaff ? "Edit Employee Account" : "Add New Employee"}
              </h3>
              <button
                onClick={() => {
                  setShowStaffModal(false);
                  setEditingStaff(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {!editingStaff && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address (Login ID) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. waiter@royalbistro.com"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={staffForm.phoneNumber}
                  onChange={(e) => setStaffForm({ ...staffForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned System Role *
                </label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="WAITER">WAITER (Floor Orders & Service)</option>
                  <option value="CASHIER">CASHIER (POS Terminal & Billing)</option>
                  <option value="CHEF">CHEF (Kitchen Display System KDS)</option>
                  <option value="BRANCH_MANAGER">BRANCH MANAGER (Operations)</option>
                  <option value="RESTAURANT_OWNER">RESTAURANT OWNER (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {editingStaff ? "Reset Password (leave blank to keep current)" : "Initial Password *"}
                </label>
                <input
                  type="password"
                  required={!editingStaff}
                  placeholder={editingStaff ? "••••••••" : "Admin@123"}
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowStaffModal(false);
                    setEditingStaff(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                >
                  {editingStaff ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
