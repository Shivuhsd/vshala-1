// import React from "react";

// const DegreeHome = () => {
//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       {/* Header */}
//       <header className="bg-blue-700 text-white shadow-md py-5 px-6 md:px-12 flex justify-between items-center">
//         <div className="flex items-center gap-3">
//           <img src="/logo.png" alt="Degree Logo" className="w-10 h-10" />
//           <h1 className="text-xl md:text-2xl font-bold">XYZ Degree College</h1>
//         </div>
//         <nav className="hidden md:flex gap-8 text-white font-medium">
//           <a href="#about" className="hover:underline">
//             About
//           </a>
//           <a href="#courses" className="hover:underline">
//             Departments
//           </a>
//           <a href="#contact" className="hover:underline">
//             Contact
//           </a>
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <section className="bg-blue-50 py-20 px-6 text-center">
//         <h2 className="text-4xl font-bold text-blue-800 mb-4">
//           Welcome to XYZ Degree College
//         </h2>
//         <p className="text-lg text-gray-700 max-w-2xl mx-auto">
//           Explore a vibrant academic environment, experienced faculty, and
//           career-focused programs.
//         </p>
//         <div className="mt-8">
//           <a
//             href="/school-login"
//             className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-lg transition"
//           >
//             Login to Degree Portal
//           </a>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="py-20 px-6 bg-white text-center">
//         <h3 className="text-3xl font-semibold text-blue-700 mb-6">
//           About Our Institution
//         </h3>
//         <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
//           XYZ Degree College offers undergraduate education designed to equip
//           students with the skills and knowledge required to thrive in a dynamic
//           world. We focus on academic excellence, industry exposure, and
//           holistic development.
//         </p>
//       </section>

//       {/* Departments / Courses */}
//       <section id="courses" className="py-20 px-6 bg-gray-50">
//         <h3 className="text-3xl font-semibold text-center text-blue-700 mb-10">
//           Departments & Programs
//         </h3>
//         <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
//             <h4 className="text-xl font-bold text-blue-600 mb-2">
//               Bachelor of Commerce (B.Com)
//             </h4>
//             <p className="text-gray-600">
//               Finance, Accounting, Business Management
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
//             <h4 className="text-xl font-bold text-blue-600 mb-2">
//               Bachelor of Science (B.Sc)
//             </h4>
//             <p className="text-gray-600">
//               Computer Science, Electronics, Mathematics
//             </p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
//             <h4 className="text-xl font-bold text-blue-600 mb-2">
//               Bachelor of Arts (B.A)
//             </h4>
//             <p className="text-gray-600">
//               Economics, Sociology, Political Science
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Contact Footer */}
//       <footer id="contact" className="bg-blue-700 text-white py-10 text-center">
//         <h4 className="text-xl font-semibold mb-2">Contact Us</h4>
//         <p className="text-sm">
//           456 College Lane, Bengaluru, Karnataka - 560002
//         </p>
//         <p className="text-sm">
//           Email: info@xyzdegree.edu.in | Phone: +91 98765 43211
//         </p>
//         <p className="mt-4 text-xs text-blue-200">
//           &copy; {new Date().getFullYear()} XYZ Degree College. All rights
//           reserved.
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default DegreeHome;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaTrophy,
  FaQuoteLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const DegreeHome = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Floating animation for elements
  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Fade in animation for sections
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Stagger animation for children
  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Courses data
  const courses = [
    {
      title: "Science Stream",
      description:
        "Physics, Chemistry, Mathematics, Biology with advanced lab facilities",
      icon: <FaGraduationCap className="text-blue-500" />,
    },
    {
      title: "Commerce Stream",
      description: "Accountancy, Business Studies, Economics, Statistics",
      icon: <FaGraduationCap className="text-purple-500" />,
    },
    {
      title: "Arts Stream",
      description:
        "History, Political Science, Sociology, Psychology, Languages",
      icon: <FaGraduationCap className="text-teal-500" />,
    },
  ];

  // Faculty data
  const faculty = [
    {
      name: "Dr. Ananya Sharma",
      position: "Head of Science Department",
      experience: "15+ years",
      achievement: "Published 12 research papers",
    },
    {
      name: "Prof. Rajiv Mehta",
      position: "Commerce Department",
      experience: "12+ years",
      achievement: "Industry expert in Finance",
    },
    {
      name: "Dr. Priya Chatterjee",
      position: "Head of Humanities",
      experience: "18+ years",
      achievement: "Award-winning educator",
    },
  ];

  // Achievements data
  const achievements = [
    {
      title: "State Science Quiz Champions",
      description:
        "Our students won 1st place in the Karnataka State Science Quiz.",
    },
    {
      title: "Cultural Fest Winners",
      description:
        "Overall champions at the inter-collegiate cultural festival.",
    },
    {
      title: "Best Faculty Award",
      description:
        "Honored with Best Faculty in Pre-University Education 2024.",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      text: "The faculty at Sri Channabasava Mahaswamiji First Class Arts and Commerce College, Munavalli provided me with the perfect foundation for my engineering career. Their dedication to student success is unmatched.",
      author: "Rahul Sharma",
      role: "Class of 2023",
    },
    {
      text: "The holistic approach to education at Sri Channabasava Mahaswamiji First Class Arts and Commerce College, Munavalli helped me develop both academically and personally. I'm grateful for the supportive environment.",
      author: "Priya Patel",
      role: "Class of 2024",
    },
  ];

  // Header animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 font-sans overflow-x-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-10 blur-3xl"
          animate={floatAnimation}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full opacity-10 blur-2xl"
          animate={floatAnimation}
          style={{ animationDelay: "2s" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full opacity-10 blur-2xl"
          animate={floatAnimation}
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Navbar */}
      <header className="bg-white/90 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
            <FaGraduationCap className="text-xl" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            <span className="text-blue-700">
              Sri Channabasava Mahaswamiji First Class Arts and Commerce College
            </span>
          </h1>
        </div>

        <nav className="hidden md:flex gap-6 items-center text-gray-700">
          {[
            "About",
            "Courses",
            "Faculty",
            "Achievements",
            "Testimonials",
            "Contact",
          ].map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase()}`}
              className="font-medium hover:text-blue-600 transition-colors"
            >
              {item}
            </a>
          ))}
          <Link
            to="/puc"
            className="ml-4 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            PU College
          </Link>
          <Link
            to="/school-login"
            className="ml-2 text-sm bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
          >
            Login
          </Link>
        </nav>

        <button className="md:hidden text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-full inline-block text-sm font-medium mb-6">
              Shaping Tomorrow's Leaders
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
              Excellence in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"></span>{" "}
              Education
            </h1>
            <p className="text-gray-600 text-lg max-w-xl mb-8">
              Join our vibrant academic community and embark on a journey of
              discovery, innovation, and personal growth with our comprehensive
              Degree programs.
            </p>
            {/* <div className="flex flex-wrap gap-4">
              <Link
                to="/admissions"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                Apply Now
              </Link>
              <Link
                to="/virtual-tour"
                className="bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
              >
                Virtual Tour
              </Link>
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="images/slider_2.jpeg"
                  alt="PUC College Campus"
                  className="rounded-2xl shadow-xl w-full h-48"
                />
                <img
                  src="images/slider_3.jpeg"
                  alt="PUC College Campus"
                  className="rounded-2xl shadow-xl w-full h-48"
                />
                <img
                  src="images/slider_4.jpeg"
                  alt="PUC College Campus"
                  className="rounded-2xl shadow-xl w-full h-48"
                />
                <img
                  src="images/slider_5.jpeg"
                  alt="PUC College Campus"
                  className="rounded-2xl shadow-xl w-full h-48"
                />
              </div>
            </div>
            {/* <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm">Success Rate</div>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-blue-600 font-medium mb-4">ABOUT US</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Legacy of Excellence
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Sri Channabasava Mahaswamiji First Class Arts and Commerce
              College, Munavalli has been a pioneer in pre-university education,
              shaping young minds for over three decades.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="images/slider_1.jpg"
                alt="PUC College Campus"
                className="rounded-2xl shadow-xl w-full h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 mb-6">
                At Sri Channabasava Mahaswamiji First Class Arts and Commerce
                College, Munavalli, we are dedicated to delivering top-tier
                pre-university education with a focus on innovation, practical
                learning, and holistic development.
              </p>
              <p className="text-gray-600 mb-8">
                Our mission is to prepare students for success in academics and
                life through experienced faculty, modern infrastructure, and
                value-based learning.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "35+", label: "Years of Excellence" },
                  { value: "12,000+", label: "Successful Alumni" },
                  { value: "150+", label: "Expert Faculty" },
                  { value: "95%", label: "Pass Percentage" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-blue-50 border border-gray-100 rounded-xl p-4 shadow-sm"
                  >
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section
        id="courses"
        className="py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-blue-600 font-medium mb-4">
              ACADEMIC PROGRAMS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explore Our Courses
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive programs designed to meet the needs of
              diverse learners and prepare them for future success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    {course.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                  <button className="text-blue-600 font-medium flex items-center gap-2 hover:text-blue-800 transition-colors">
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 w-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section id="faculty" className="py-16 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-blue-600 font-medium mb-4">OUR FACULTY</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Expert Educators
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our distinguished faculty members bring years of experience and
              passion to the classroom.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faculty.map((person, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-blue-50 border border-gray-100 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-500 relative">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="pt-16 pb-8 px-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {person.name}
                  </h3>
                  <p className="text-blue-600 mb-4">{person.position}</p>

                  <div className="flex justify-center gap-6 mt-6">
                    <div>
                      <div className="font-medium text-gray-800">
                        Experience
                      </div>
                      <div className="text-gray-600">{person.experience}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Achievement
                      </div>
                      <div className="text-gray-600">{person.achievement}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section
        id="achievements"
        className="py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-blue-600 font-medium mb-4">
              OUR ACHIEVEMENTS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Celebrating Excellence
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We take pride in our students' accomplishments and institutional
              recognitions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                  <FaTrophy className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-blue-600 font-medium mb-4">
              STUDENT TESTIMONIALS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Hear from our alumni about their experiences at Sri Channabasava
              Mahaswamiji First Class Arts and Commerce College, Munavalli
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeIn}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white to-blue-50 border border-gray-100 rounded-2xl shadow-lg p-8 relative"
              >
                <div className="absolute top-8 left-8 text-blue-100 text-5xl">
                  <FaQuoteLeft />
                </div>
                <p className="text-gray-700 text-lg mb-6 relative z-10">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="font-bold text-gray-800">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-blue-600 font-medium mb-4">CONTACT US</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Have questions? Our admissions team is here to help you with any
              inquiries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">
                        Campus Address
                      </div>
                      <div className="text-gray-600">
                        Sri Channabasava Mahaswamiji First Class Arts and
                        Commerce College, Munavalli Munavalli, Manolli,
                        Karnataka, Munuvalli-591117
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <FaPhone />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">
                        Phone Number
                      </div>
                      <div className="text-gray-600">+91 98765 43210</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <FaEnvelope />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">
                        Email Address
                      </div>
                      <div className="text-gray-600">admissions@.edu.in</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-bold text-gray-800 mb-4">
                    Connect With Us
                  </h4>
                  <div className="flex gap-4">
                    {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map(
                      (Icon, index) => (
                        <a
                          key={index}
                          href="#"
                          className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                        >
                          <Icon />
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Send us a message
                </h3>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all mt-4"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center">
                  <FaGraduationCap />
                </div>
                <h1 className="text-xl font-bold">
                  <span className="text-blue-400">XYZ</span> PUC College
                </h1>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Committed to excellence in pre-university education, research,
                and innovation since 1985.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Courses",
                  "Faculty",
                  "Admissions",
                  "Campus Life",
                  "Contact",
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Programs</h3>
              <ul className="space-y-2">
                {[
                  "Science Programs",
                  "Commerce Programs",
                  "Arts Programs",
                  "Competitive Exam Prep",
                  "Language Courses",
                ].map((program, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {program}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and news.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-3 bg-gray-700 text-white rounded-l-lg focus:outline-none w-full"
                />
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-r-lg font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Sri Channabasava Mahaswamiji First
            Class Arts and Commerce College, Munavalli. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DegreeHome;
