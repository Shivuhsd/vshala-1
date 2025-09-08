// // school_Admin/pages/school_Admin/DashboardHome.jsx
// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";
// import {
//   FiUsers,
//   FiBook,
//   FiCalendar,
//   FiUserPlus,
//   FiBell,
//   FiActivity,
//   FiArrowRight,
//   FiPlusCircle,
//   FiSettings,
//   FiUserCheck,
//   FiChevronRight,
//   FiStar,
// } from "react-icons/fi";
// import { Bar, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { useSchool } from "../context/SchoolContext";
// import axiosInstance from "../../../services/axiosInstance";
// import { toast } from "react-toastify";

// /* ------------------------ Chart.js Register ------------------------ */
// ChartJS.register(
//   ArcElement,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend
// );

// /* ----------------------------- Helpers ----------------------------- */
// const formatInt = (n) =>
//   typeof n === "number"
//     ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
//     : "0";

// const Skeleton = ({ className = "" }) => (
//   <div className={`animate-pulse bg-gray-200/70 rounded-xl ${className}`} />
// );

// /* tiny SVG sparkline (no extra deps) */
// const Sparkline = ({ points = [], color = "currentColor" }) => {
//   if (!points.length) points = [5, 8, 7, 10, 12, 15];
//   const max = Math.max(...points, 1);
//   const min = Math.min(...points, 0);
//   const H = 44,
//     W = 100;
//   const y = (v) => (max === min ? H / 2 : H - ((v - min) / (max - min)) * H);
//   const step = W / (points.length - 1);
//   const d = points
//     .map((v, i) => `${i ? "L" : "M"} ${i * step},${y(v)}`)
//     .join(" ");
//   return (
//     <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10">
//       <path d={d} stroke={color} strokeWidth="2.5" fill="none" />
//     </svg>
//   );
// };

// /* ----------------------------- Primitives ----------------------------- */
// const Glass = ({ children, className = "" }) => (
//   <div
//     className={`relative rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_12px_44px_rgba(16,24,40,0.12)] ring-1 ring-black/5 ${className}`}
//   >
//     {children}
//   </div>
// );

// const GradientCard = ({ children, gradient = "" }) => (
//   <div className={`relative overflow-hidden rounded-3xl ${gradient}`}>
//     <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.25),transparent_35%)]" />
//     <div className="relative">{children}</div>
//   </div>
// );

// /* ----------------------------- Components ----------------------------- */
// const HeroBanner = ({ schoolLabel, sessionLabel }) => (
//   <div className="relative">
//     {/* ambient animated background */}
//     <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_210deg_at_50%_50%,#F0ABFC_0deg,#93C5FD_90deg,#34D399_180deg,#FDE68A_270deg,#F0ABFC_360deg)] opacity-30 blur-3xl" />
//     <Glass className="p-6 md:p-8">
//       {/* subtle confetti pattern */}
//       <div
//         className="absolute inset-0 -z-10 opacity-20 rounded-3xl"
//         style={{
//           backgroundImage:
//             "radial-gradient(#a78bfa 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px), radial-gradient(#60a5fa 1px, transparent 1px)",
//           backgroundPosition: "0 0, 25px 25px, 50px 50px",
//           backgroundSize: "60px 60px",
//         }}
//       />
//       <div className="flex items-center gap-2 text-sm text-indigo-700">
//         <FiActivity />
//         <span className="font-medium">Welcome back</span>
//       </div>
//       <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-gray-900">
//         School Admin Dashboard
//       </h1>
//       <p className="text-sm md:text-base text-gray-700 mt-2">
//         Managing{" "}
//         <span className="font-semibold text-indigo-700">
//           {schoolLabel || "…"}
//         </span>{" "}
//         • Session{" "}
//         <span className="font-semibold text-teal-700">
//           {sessionLabel || "…"}
//         </span>
//       </p>

//       <div className="mt-5 flex flex-wrap gap-2">
//         <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white hover:opacity-95 transition">
//           <FiPlusCircle /> Onboard School
//         </button>
//         <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:opacity-95 transition">
//           <FiUserCheck /> Invite Staff
//         </button>
//         <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 ring-1 ring-indigo-200 hover:ring-indigo-300 transition">
//           <FiSettings /> Settings
//         </button>
//       </div>
//     </Glass>
//   </div>
// );

// const StatTile = ({ label, value, Icon, gradient, sparkColor, spark }) => (
//   <GradientCard gradient={gradient}>
//     <div className="p-5 text-white">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xs uppercase tracking-wide/relaxed text-white/90">
//             {label}
//           </p>
//           <p className="mt-1 text-[30px] leading-none md:text-[34px] font-extrabold drop-shadow-sm">
//             {formatInt(value)}
//           </p>
//         </div>
//         <div className="p-3 rounded-2xl bg-white/20 backdrop-blur">
//           <Icon size={22} />
//         </div>
//       </div>
//       <div className="mt-3">
//         <Sparkline points={spark} color={sparkColor} />
//       </div>
//     </div>
//   </GradientCard>
// );

// const ChartCard = ({ title, note, children }) => (
//   <Glass className="p-6">
//     <div className="mb-4">
//       <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//       {note && <p className="text-xs text-gray-500 mt-0.5">{note}</p>}
//     </div>
//     {children}
//   </Glass>
// );

// const SectionCard = ({ title, icon: Icon, children, action }) => (
//   <Glass className="p-6">
//     <div className="flex items-center justify-between mb-4">
//       <div className="flex items-center gap-2">
//         <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 text-white flex items-center justify-center">
//           <Icon />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
//       </div>
//       {action || null}
//     </div>
//     {children}
//   </Glass>
// );

// /* ------------------------------ Page ------------------------------ */
// const DashboardHome = () => {
//   const { selectedSchool, selectedSession } = useSchool();
//   const [dashboardStats, setDashboardStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const mountedRef = useRef(true);

//   const fetchDashboardStats = useCallback(async () => {
//     if (!selectedSchool?.id || !selectedSession?.id) return;
//     setLoading(true);
//     try {
//       const { data } = await axiosInstance.get(
//         `/schools/v1/dashboard/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
//       );
//       if (mountedRef.current) setDashboardStats(data);
//     } catch {
//       toast.error("Failed to load dashboard data");
//     } finally {
//       if (mountedRef.current) setLoading(false);
//     }
//   }, [selectedSchool?.id, selectedSession?.id]);

//   useEffect(() => {
//     mountedRef.current = true;
//     fetchDashboardStats();
//     return () => {
//       mountedRef.current = false;
//     };
//   }, [fetchDashboardStats]);

//   /* --------------------------- KPI Tiles --------------------------- */
//   const statItems = useMemo(() => {
//     const s = dashboardStats || {};
//     return [
//       {
//         label: "Total Students",
//         value: s.total_students ?? 0,
//         Icon: FiUsers,
//         gradient: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500",
//         sparkColor: "#FFFFFF",
//         spark: s.students_spark ?? [5, 8, 12, 10, 13, 17, 20],
//       },
//       {
//         label: "Total Staff",
//         value: s.total_staff ?? 0,
//         Icon: FiBook,
//         gradient: "bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400",
//         sparkColor: "#FFFFFF",
//         spark: s.staff_spark ?? [2, 3, 4, 6, 5, 7, 8],
//       },
//       {
//         label: "Classes Running",
//         value: s.total_classes ?? 0,
//         Icon: FiCalendar,
//         gradient:
//           "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-400",
//         sparkColor: "#FFFFFF",
//         spark: s.classes_spark ?? [8, 9, 9, 10, 11, 12, 12],
//       },
//       {
//         label: "Students This Session",
//         value: s.students_in_current_session ?? 0,
//         Icon: FiUserPlus,
//         gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-400",
//         sparkColor: "#FFFFFF",
//         spark: s.session_students_spark ?? [6, 7, 8, 11, 12, 14, 16],
//       },
//     ];
//   }, [dashboardStats]);

//   /* --------------------------- Chart Data -------------------------- */
//   const barData = useMemo(() => {
//     const labels = dashboardStats?.class_counts?.map((c) => c.label) || [
//       "I",
//       "II",
//       "III",
//       "IV",
//       "V",
//       "VI",
//       "VII",
//     ];
//     const data = dashboardStats?.class_counts?.map((c) => c.count) || [
//       30, 42, 38, 50, 44, 36, 41,
//     ];
//     return {
//       labels,
//       datasets: [
//         {
//           label: "Students",
//           data,
//           backgroundColor: [
//             "#A78BFA",
//             "#60A5FA",
//             "#34D399",
//             "#F472B6",
//             "#F59E0B",
//             "#22D3EE",
//             "#F97316",
//           ],
//           borderRadius: 12,
//           barThickness: 28,
//           maxBarThickness: 36,
//         },
//       ],
//     };
//   }, [dashboardStats]);

//   const doughnutData = useMemo(() => {
//     const boys = dashboardStats?.gender_split?.boys ?? 120;
//     const girls = dashboardStats?.gender_split?.girls ?? 100;
//     const others = dashboardStats?.gender_split?.others ?? 5;
//     return {
//       labels: ["Boys", "Girls", "Others"],
//       datasets: [
//         {
//           label: "Gender",
//           data: [boys, girls, others],
//           backgroundColor: ["#60A5FA", "#F472B6", "#FCD34D"],
//           borderColor: "#ffffff",
//           borderWidth: 4,
//           hoverOffset: 8,
//           cutout: "62%",
//         },
//       ],
//     };
//   }, [dashboardStats]);

//   /* ---------------------- Right-rail mock data --------------------- */
//   const recent = useMemo(
//     () => [
//       { id: 1, text: "Session ‘2025-26’ created", when: "2h ago" },
//       { id: 2, text: "New school onboarded: ‘SV College’", when: "5h ago" },
//       { id: 3, text: "Permissions updated for Staff Admin", when: "1 day ago" },
//       { id: 4, text: "10 classes imported to ‘CS Dept’", when: "2 days ago" },
//     ],
//     []
//   );

//   const events = useMemo(
//     () => [
//       {
//         id: 1,
//         title: "Parent-Teacher Meeting",
//         date: "Aug 28",
//         time: "10:00 AM",
//       },
//       {
//         id: 2,
//         title: "Orientation (New Teachers)",
//         date: "Aug 30",
//         time: "11:30 AM",
//       },
//       { id: 3, title: "Library Drive", date: "Sep 02", time: "01:00 PM" },
//     ],
//     []
//   );

//   /* ----------------------------- Render ---------------------------- */
//   return (
//     <div className="space-y-10">
//       {/* HERO */}
//       <HeroBanner
//         schoolLabel={selectedSchool?.label}
//         sessionLabel={selectedSession?.label}
//       />

//       {/* KPI TILES */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//         {loading
//           ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-36" />)
//           : statItems.map((s, i) => <StatTile key={i} {...s} />)}
//       </div>

//       {/* CHARTS + RIGHT RAIL */}
//       <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
//         <div className="space-y-6 2xl:col-span-2">
//           <ChartCard
//             title="Students by Class"
//             note="Current session distribution"
//           >
//             {loading ? (
//               <Skeleton className="h-80" />
//             ) : (
//               <div className="min-h-[320px]">
//                 <Bar
//                   data={barData}
//                   options={{
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                       legend: { display: false },
//                       tooltip: {
//                         mode: "index",
//                         intersect: false,
//                         padding: 12,
//                         backgroundColor: "rgba(15,23,42,0.95)",
//                         titleColor: "#fff",
//                         bodyColor: "#fff",
//                         borderColor: "rgba(255,255,255,0.15)",
//                         borderWidth: 1,
//                       },
//                     },
//                     scales: {
//                       x: {
//                         grid: { display: false },
//                         ticks: { color: "#64748b", font: { size: 12 } },
//                       },
//                       y: {
//                         beginAtZero: true,
//                         grid: { color: "rgba(148,163,184,0.15)" },
//                         ticks: {
//                           color: "#64748b",
//                           font: { size: 12 },
//                           stepSize: 10,
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             )}
//           </ChartCard>

//           <ChartCard title="Gender Mix" note="School-wide snapshot">
//             {loading ? (
//               <Skeleton className="h-80" />
//             ) : (
//               <div className="min-h-[320px] grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex items-center justify-center">
//                   <div className="w-full max-w-[320px]">
//                     <Doughnut
//                       data={doughnutData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: true,
//                         plugins: {
//                           legend: {
//                             position: "bottom",
//                             labels: { boxWidth: 12, color: "#334155" },
//                           },
//                           tooltip: {
//                             padding: 12,
//                             backgroundColor: "rgba(15,23,42,0.95)",
//                             titleColor: "#fff",
//                             bodyColor: "#fff",
//                             borderColor: "rgba(255,255,255,0.15)",
//                             borderWidth: 1,
//                           },
//                         },
//                       }}
//                     />
//                   </div>
//                 </div>
//                 {/* colorful legend card */}
//                 <div className="grid grid-cols-3 gap-4 self-center">
//                   {[
//                     {
//                       k: "Boys",
//                       v: doughnutData.datasets[0].data[0],
//                       c: "bg-sky-400",
//                     },
//                     {
//                       k: "Girls",
//                       v: doughnutData.datasets[0].data[1],
//                       c: "bg-pink-400",
//                     },
//                     {
//                       k: "Others",
//                       v: doughnutData.datasets[0].data[2],
//                       c: "bg-amber-300",
//                     },
//                   ].map((x) => (
//                     <div
//                       key={x.k}
//                       className="rounded-2xl p-4 text-center bg-white ring-1 ring-black/5"
//                     >
//                       <div className={`w-3 h-3 rounded-full mx-auto ${x.c}`} />
//                       <div className="mt-2 text-xs text-gray-500">{x.k}</div>
//                       <div className="text-xl font-extrabold text-gray-800">
//                         {formatInt(x.v)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </ChartCard>
//         </div>

//         {/* Right Rail */}
//         <div className="space-y-6">
//           {/* Announcements */}
//           <SectionCard
//             title="Announcements"
//             icon={FiBell}
//             action={
//               <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900">
//                 View all <FiChevronRight />
//               </button>
//             }
//           >
//             {loading ? (
//               <>
//                 <Skeleton className="h-4 w-4/5 mb-2" />
//                 <Skeleton className="h-4 w-3/5 mb-2" />
//                 <Skeleton className="h-4 w-2/5" />
//               </>
//             ) : (
//               <ul className="space-y-2 text-sm text-gray-800">
//                 <li>🎯 Mid‑term exams start next week</li>
//                 <li>🧭 New teacher orientation on Monday</li>
//                 <li>📚 Library updated with 50+ new books</li>
//               </ul>
//             )}
//           </SectionCard>

//           {/* Quick Actions (colorful) */}
//           <Glass className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center">
//                   <FiStar />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Quick Actions
//                 </h3>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 {
//                   label: "Add Student",
//                   to: "/school-admin/student/admission",
//                   icon: <FiUserPlus />,
//                   color: "from-fuchsia-500 to-rose-500",
//                 },
//                 {
//                   label: "Add Staff",
//                   icon: <FiBook />,
//                   color: "from-indigo-500 to-sky-500",
//                 },
//                 {
//                   label: "Create Session",
//                   icon: <FiCalendar />,
//                   color: "from-emerald-500 to-teal-400",
//                 },
//                 {
//                   label: "Settings",
//                   icon: <FiSettings />,
//                   color: "from-amber-400 to-orange-500",
//                 },
//               ].map((a, i) => (
//                 <button
//                   key={i}
//                   className={`group w-full rounded-2xl p-3 text-left ring-1 ring-black/5 bg-white hover:bg-gradient-to-r ${a.color} hover:text-white transition`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${a.color} text-white`}
//                     >
//                       {a.icon}
//                     </div>
//                     <div className="text-sm font-semibold text-gray-800 group-hover:text-white">
//                       {a.label}
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </Glass>

//           {/* Recent Activity */}
//           <SectionCard title="Recent Activity" icon={FiActivity}>
//             <ul className="divide-y divide-gray-100">
//               {recent.map((r) => (
//                 <li key={r.id} className="py-3">
//                   <div className="text-sm text-gray-900">{r.text}</div>
//                   <div className="text-xs text-gray-500">{r.when}</div>
//                 </li>
//               ))}
//             </ul>
//           </SectionCard>

//           {/* Upcoming Events */}
//           <SectionCard title="Upcoming Events" icon={FiCalendar}>
//             <ul className="space-y-3">
//               {events.map((e) => (
//                 <li
//                   key={e.id}
//                   className="flex items-center justify-between rounded-2xl px-3 py-2 bg-gradient-to-r from-indigo-50 to-rose-50"
//                 >
//                   <div>
//                     <div className="text-sm font-semibold text-gray-900">
//                       {e.title}
//                     </div>
//                     <div className="text-xs text-gray-600">
//                       {e.date} • {e.time}
//                     </div>
//                   </div>
//                   <button className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1">
//                     Open <FiArrowRight />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </SectionCard>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;
// school_Admin/pages/school_Admin/DashboardHome.jsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  FiUsers,
  FiBook,
  FiCalendar,
  FiUserPlus,
  FiBell,
  FiActivity,
  FiArrowRight,
  FiPlusCircle,
  FiSettings,
  FiUserCheck,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useSchool } from "../context/SchoolContext";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

/* ------------------------ Chart.js Register ------------------------ */
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

/* ----------------------------- Helpers ----------------------------- */
const formatInt = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : "0";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200/70 rounded-xl ${className}`} />
);

/* tiny SVG sparkline (no extra deps) */
const Sparkline = ({ points = [], color = "currentColor" }) => {
  if (!points.length) points = [5, 8, 7, 10, 12, 15];
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const H = 44,
    W = 100;
  const y = (v) => (max === min ? H / 2 : H - ((v - min) / (max - min)) * H);
  const step = W / (points.length - 1);
  const d = points
    .map((v, i) => `${i ? "L" : "M"} ${i * step},${y(v)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10" aria-hidden="true">
      <path d={d} stroke={color} strokeWidth="2.5" fill="none" />
    </svg>
  );
};

/* ----------------------------- Primitives ----------------------------- */
const Glass = ({ children, className = "" }) => (
  <div
    className={`relative rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_12px_44px_rgba(16,24,40,0.12)] ring-1 ring-black/5 ${className}`}
  >
    {children}
  </div>
);

const GradientCard = ({ children, gradient = "" }) => (
  <div className={`relative overflow-hidden rounded-3xl ${gradient}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.25),transparent_35%)]" />
    <div className="relative">{children}</div>
  </div>
);

/* ----------------------------- Components ----------------------------- */
const HeroBanner = ({ schoolLabel, sessionLabel }) => (
  <div className="relative">
    {/* ambient animated background */}
    <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_210deg_at_50%_50%,#F0ABFC_0deg,#93C5FD_90deg,#34D399_180deg,#FDE68A_270deg,#F0ABFC_360deg)] opacity-30 blur-3xl" />
    <Glass className="p-6 md:p-8">
      {/* subtle confetti pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-20 rounded-3xl"
        style={{
          backgroundImage:
            "radial-gradient(#a78bfa 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px), radial-gradient(#60a5fa 1px, transparent 1px)",
          backgroundPosition: "0 0, 25px 25px, 50px 50px",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="flex items-center gap-2 text-sm text-indigo-700">
        <FiActivity />
        <span className="font-medium">Welcome back</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-gray-900">
        School Admin Dashboard
      </h1>
      <p className="text-sm md:text-base text-gray-700 mt-2">
        Managing{" "}
        <span className="font-semibold text-indigo-700">
          {schoolLabel || "…"}
        </span>{" "}
        • Session{" "}
        <span className="font-semibold text-teal-700">
          {sessionLabel || "…"}
        </span>
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white hover:opacity-95 transition">
          <FiPlusCircle /> Onboard School
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:opacity-95 transition">
          <FiUserCheck /> Invite Staff
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-700 ring-1 ring-indigo-200 hover:ring-indigo-300 transition">
          <FiSettings /> Settings
        </button>
      </div>
    </Glass>
  </div>
);

const StatTile = ({ label, value, Icon, gradient, sparkColor, spark }) => (
  <GradientCard gradient={gradient}>
    <div className="p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide/relaxed text-white/90">
            {label}
          </p>
          <p className="mt-1 text-[30px] leading-none md:text-[34px] font-extrabold drop-shadow-sm">
            {formatInt(value)}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur">
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-3">
        <Sparkline points={spark} color={sparkColor} />
      </div>
    </div>
  </GradientCard>
);

const ChartCard = ({ title, note, children }) => (
  <Glass className="p-6">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {note && <p className="text-xs text-gray-500 mt-0.5">{note}</p>}
    </div>
    {children}
  </Glass>
);

const SectionCard = ({ title, icon: Icon, children, action }) => (
  <Glass className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 text-white flex items-center justify-center">
          <Icon />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {action || null}
    </div>
    {children}
  </Glass>
);

/* ------------------------------ Page ------------------------------ */
const DashboardHome = () => {
  const { selectedSchool, selectedSession } = useSchool();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetchDashboardStats = useCallback(async () => {
    if (!selectedSchool?.id || !selectedSession?.id) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/schools/v1/dashboard/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
      );
      if (mountedRef.current) setDashboardStats(data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [selectedSchool?.id, selectedSession?.id]);

  useEffect(() => {
    mountedRef.current = true;
    fetchDashboardStats();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchDashboardStats]);

  /* --------------------------- KPI Tiles --------------------------- */
  const statItems = useMemo(() => {
    const s = dashboardStats || {};
    return [
      {
        label: "Total Students",
        value: s.total_students ?? 0,
        Icon: FiUsers,
        gradient: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500",
        sparkColor: "#FFFFFF",
        spark: s.students_spark ?? [5, 8, 12, 10, 13, 17, 20],
      },
      {
        label: "Total Staff",
        value: s.total_staff ?? 0,
        Icon: FiBook,
        gradient: "bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400",
        sparkColor: "#FFFFFF",
        spark: s.staff_spark ?? [2, 3, 4, 6, 5, 7, 8],
      },
      {
        label: "Classes Running",
        value: s.total_classes ?? 0,
        Icon: FiCalendar,
        gradient:
          "bg-gradient-to-br from-emerald-500 via-teal-500 to-green-400",
        sparkColor: "#FFFFFF",
        spark: s.classes_spark ?? [8, 9, 9, 10, 11, 12, 12],
      },
      {
        label: "Students This Session",
        value: s.students_in_current_session ?? 0,
        Icon: FiUserPlus,
        gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-400",
        sparkColor: "#FFFFFF",
        spark: s.session_students_spark ?? [6, 7, 8, 11, 12, 14, 16],
      },
    ];
  }, [dashboardStats]);

  /* --------------------------- Chart Data -------------------------- */
  const barData = useMemo(() => {
    const labels = dashboardStats?.class_counts?.map((c) => c.label) || [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
    ];
    const data = dashboardStats?.class_counts?.map((c) => c.count) || [
      30, 42, 38, 50, 44, 36, 41,
    ];
    return {
      labels,
      datasets: [
        {
          label: "Students",
          data,
          backgroundColor: [
            "#A78BFA",
            "#60A5FA",
            "#34D399",
            "#F472B6",
            "#F59E0B",
            "#22D3EE",
            "#F97316",
          ],
          borderRadius: 12,
          barThickness: 28,
          maxBarThickness: 36,
        },
      ],
    };
  }, [dashboardStats]);

  const doughnutData = useMemo(() => {
    const boys = dashboardStats?.gender_split?.boys ?? 120;
    const girls = dashboardStats?.gender_split?.girls ?? 100;
    const others = dashboardStats?.gender_split?.others ?? 5;
    return {
      labels: ["Boys", "Girls", "Others"],
      datasets: [
        {
          label: "Gender",
          data: [boys, girls, others],
          backgroundColor: ["#60A5FA", "#F472B6", "#FCD34D"],
          borderColor: "#ffffff",
          borderWidth: 4,
          hoverOffset: 8,
          cutout: "62%",
        },
      ],
    };
  }, [dashboardStats]);

  /* ---------------------- Right-rail mock data --------------------- */
  const recent = useMemo(
    () => [
      { id: 1, text: "Session ‘2025-26’ created", when: "2h ago" },
      { id: 2, text: "New school onboarded: ‘SV College’", when: "5h ago" },
      { id: 3, text: "Permissions updated for Staff Admin", when: "1 day ago" },
      { id: 4, text: "10 classes imported to ‘CS Dept’", when: "2 days ago" },
    ],
    []
  );

  const events = useMemo(
    () => [
      {
        id: 1,
        title: "Parent-Teacher Meeting",
        date: "Aug 28",
        time: "10:00 AM",
      },
      {
        id: 2,
        title: "Orientation (New Teachers)",
        date: "Aug 30",
        time: "11:30 AM",
      },
      { id: 3, title: "Library Drive", date: "Sep 02", time: "01:00 PM" },
    ],
    []
  );

  /* ----------------------------- Render ---------------------------- */
  return (
    <div className="space-y-10">
      {/* HERO */}
      <HeroBanner
        schoolLabel={selectedSchool?.label}
        sessionLabel={selectedSession?.label}
      />

      {/* KPI TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-36" />)
          : statItems.map((s, i) => <StatTile key={i} {...s} />)}
      </div>

      {/* CHARTS + RIGHT RAIL */}
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
        <div className="space-y-6 2xl:col-span-2">
          <ChartCard
            title="Students by Class"
            note="Current session distribution"
          >
            {loading ? (
              <Skeleton className="h-80" />
            ) : (
              <div className="min-h-[320px]">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        mode: "index",
                        intersect: false,
                        padding: 12,
                        backgroundColor: "rgba(15,23,42,0.95)",
                        titleColor: "#fff",
                        bodyColor: "#fff",
                        borderColor: "rgba(255,255,255,0.15)",
                        borderWidth: 1,
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: "#64748b", font: { size: 12 } },
                      },
                      y: {
                        beginAtZero: true,
                        grid: { color: "rgba(148,163,184,0.15)" },
                        ticks: {
                          color: "#64748b",
                          font: { size: 12 },
                          stepSize: 10,
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </ChartCard>

          <ChartCard title="Gender Mix" note="School-wide snapshot">
            {loading ? (
              <Skeleton className="h-80" />
            ) : (
              <div className="min-h-[320px] grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-[320px]">
                    <Doughnut
                      data={doughnutData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: { boxWidth: 12, color: "#334155" },
                          },
                          tooltip: {
                            padding: 12,
                            backgroundColor: "rgba(15,23,42,0.95)",
                            titleColor: "#fff",
                            bodyColor: "#fff",
                            borderColor: "rgba(255,255,255,0.15)",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                {/* colorful legend card */}
                <div className="grid grid-cols-3 gap-4 self-center">
                  {[
                    {
                      k: "Boys",
                      v: doughnutData.datasets[0].data[0],
                      c: "bg-sky-400",
                    },
                    {
                      k: "Girls",
                      v: doughnutData.datasets[0].data[1],
                      c: "bg-pink-400",
                    },
                    {
                      k: "Others",
                      v: doughnutData.datasets[0].data[2],
                      c: "bg-amber-300",
                    },
                  ].map((x) => (
                    <div
                      key={x.k}
                      className="rounded-2xl p-4 text-center bg-white ring-1 ring-black/5"
                    >
                      <div className={`w-3 h-3 rounded-full mx-auto ${x.c}`} />
                      <div className="mt-2 text-xs text-gray-500">{x.k}</div>
                      <div className="text-xl font-extrabold text-gray-800">
                        {formatInt(x.v)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Right Rail */}
        <div className="space-y-6">
          {/* Announcements */}
          <SectionCard
            title="Announcements"
            icon={FiBell}
            action={
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900">
                View all <FiChevronRight />
              </button>
            }
          >
            {loading ? (
              <>
                <Skeleton className="h-4 w-4/5 mb-2" />
                <Skeleton className="h-4 w-3/5 mb-2" />
                <Skeleton className="h-4 w-2/5" />
              </>
            ) : (
              <ul className="space-y-2 text-sm text-gray-800">
                <li>🎯 Mid-term exams start next week</li>
                <li>🧭 New teacher orientation on Monday</li>
                <li>📚 Library updated with 50+ new books</li>
              </ul>
            )}
          </SectionCard>

          {/* Quick Actions (now navigates) */}
          <Glass className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center">
                  <FiStar />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Add Student",
                  to: "/school-admin/student/admission",
                  icon: <FiUserPlus />,
                  color: "from-fuchsia-500 to-rose-500",
                },
                {
                  label: "Add Staff",
                  to: "/school-admin/staff-list",
                  icon: <FiBook />,
                  color: "from-indigo-500 to-sky-500",
                },
                {
                  label: "Create Session",
                  to: "/school-admin/sessions",
                  icon: <FiCalendar />,
                  color: "from-emerald-500 to-teal-400",
                },
                {
                  label: "Settings",
                  to: "/school-admin/settings",
                  icon: <FiSettings />,
                  color: "from-amber-400 to-orange-500",
                },
              ].map((a, i) => (
                <Link
                  key={i}
                  to={a.to}
                  className={`group w-full rounded-2xl p-3 text-left ring-1 ring-black/5 bg-white hover:bg-gradient-to-r ${a.color} transition`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${a.color} text-white`}
                    >
                      {a.icon}
                    </div>
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-white">
                      {a.label}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Glass>

          {/* Recent Activity */}
          <SectionCard title="Recent Activity" icon={FiActivity}>
            <ul className="divide-y divide-gray-100">
              {recent.map((r) => (
                <li key={r.id} className="py-3">
                  <div className="text-sm text-gray-900">{r.text}</div>
                  <div className="text-xs text-gray-500">{r.when}</div>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Upcoming Events */}
          <SectionCard title="Upcoming Events" icon={FiCalendar}>
            <ul className="space-y-3">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between rounded-2xl px-3 py-2 bg-gradient-to-r from-indigo-50 to-rose-50"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {e.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {e.date} • {e.time}
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1">
                    Open <FiArrowRight />
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
