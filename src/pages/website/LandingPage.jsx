import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaUniversity,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const float = {
  float: {
    y: [0, -20, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const rotate = {
  rotate: {
    rotate: [0, 5, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [collegeType, setCollegeType] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleSelect = (type) => {
    setCollegeType(type);
    navigate(`/${type}`);
  };

  // const tabs = [
  //   // { id: 0, title: "Programs", icon: <FaBookOpen /> },
  //   // { id: 1, title: "Faculty", icon: <FaChalkboardTeacher /> },
  //   { id: 2, title: "Events", icon: <FaCalendarAlt /> },
  //   { id: 3, title: "Admissions", icon: <FaUsers /> },
  // ];

  // const programs = [
  //   {
  //     title: "Science Stream",
  //     description:
  //       "Physics, Chemistry, Mathematics, Biology with advanced lab facilities",
  //     icon: <FaBookOpen className="text-blue-500" />,
  //   },
  //   {
  //     title: "Commerce Stream",
  //     description: "Accountancy, Business Studies, Economics, Statistics",
  //     icon: <FaBookOpen className="text-purple-500" />,
  //   },
  //   {
  //     title: "Arts Stream",
  //     description:
  //       "History, Political Science, Sociology, Psychology, Languages",
  //     icon: <FaBookOpen className="text-teal-500" />,
  //   },
  // ];

  // const faculty = [
  //   {
  //     name: "Dr. Ananya Sharma",
  //     position: "Head of Science Department",
  //     experience: "15+ years",
  //     achievement: "Published 12 research papers",
  //   },
  //   {
  //     name: "Prof. Rajiv Mehta",
  //     position: "Commerce Department",
  //     experience: "12+ years",
  //     achievement: "Industry expert in Finance",
  //   },
  //   {
  //     name: "Dr. Priya Chatterjee",
  //     position: "Head of Humanities",
  //     experience: "18+ years",
  //     achievement: "Award-winning educator",
  //   },
  // ];

  // Slider images
  const sliderImages = [
    "images/slider_1.jpg",
    "images/slider_2.jpeg",
    "images/slider_3.jpeg",
    "images/slider_4.jpeg",
    "images/slider_5.jpeg",
  ];

  const sliderContent = [
    {
      title: "Transformative Education",
      subtitle: "Shaping the leaders of tomorrow",
    },
    {
      title: "Excellence in Academics",
      subtitle: "Discover your potential with us",
    },
    {
      title: "Innovative Learning Spaces",
      subtitle: "State-of-the-art facilities for growth",
    },
    {
      title: "Global Opportunities",
      subtitle: "Preparing students for the world",
    },
    {
      title: "Community of Excellence",
      subtitle: "Join our vibrant academic family",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-white to-[#e6f0ff] flex flex-col font-poppins overflow-x-hidden relative text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Floating Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Floating Blobs */}
          <motion.div
            className="absolute left-[10%] top-[15%] w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 blur-2xl"
            variants={float}
            animate="float"
          />

          <motion.div
            className="absolute right-[15%] top-[30%] w-48 h-48 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full opacity-30 blur-xl"
            variants={float}
            animate="float"
            style={{ animationDelay: "2s" }}
          />

          <motion.div
            className="absolute left-[25%] bottom-[20%] w-56 h-56 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-25 blur-xl"
            variants={float}
            animate="float"
            style={{ animationDelay: "4s" }}
          />

          {/* Floating Shapes */}
          <motion.div
            className="absolute right-[10%] bottom-[15%] w-32 h-32 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 opacity-30"
            variants={rotate}
            animate="rotate"
          />

          <motion.div
            className="absolute left-[20%] top-[40%] w-24 h-24 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 opacity-40"
            variants={rotate}
            animate="rotate"
            style={{ animationDelay: "3s" }}
          />
        </div>

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30 border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold text-sm shadow-md">
              <FaUniversity className="text-lg" />
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-gray-800">
              <span className="text-blue-700">
                ಶ್ರೀ ಮುರುಘರಾಜೇಂದ್ರ ಯೋಗ ವಿದ್ಯಾ ಕೇಂದ್ರ(ನಿ) ಮುನವಳ್ಳಿ
              </span>
            </h1>
          </div>

          <nav className="hidden md:flex gap-8 text-gray-600 font-medium text-sm">
            {/* <a href="#programs" className="hover:text-blue-600 transition-all">
              Programs
            </a>
            <a href="#faculty" className="hover:text-blue-600 transition-all">
              Faculty
            </a> */}
            <a
              href="#testimonials"
              className="hover:text-blue-600 transition-all"
            >
              Testimonials
            </a>
            <a href="#contact" className="hover:text-blue-600 transition-all">
              Contact
            </a>
          </nav>

          {/* <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all">
            Apply Now
          </button> */}
        </header>

        {/* Premium Image Slider */}
        <section className="relative w-full h-[85vh] overflow-hidden z-10">
          <Swiper
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            effect="fade"
            speed={1200}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              waitForTransition: true,
            }}
            pagination={{
              clickable: true,
              el: ".slider-pagination",
              bulletClass: "slider-bullet",
              bulletActiveClass: "slider-bullet-active",
            }}
            navigation={{
              nextEl: ".slider-next",
              prevEl: ".slider-prev",
            }}
            loop={true}
            className="h-full w-full"
          >
            {sliderImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl"
                  >
                    <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-100 py-2 px-6 rounded-full inline-block text-sm font-medium mb-6">
                      {sliderContent[index].subtitle}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                      {sliderContent[index].title}
                    </h1>
                    {/* <div className="flex justify-center gap-4">
                      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
                        Explore Programs
                      </button>
                      <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-all">
                        Virtual Tour
                      </button>
                    </div> */}
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}

            {/* Slider Navigation */}
            <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
              <div className="slider-prev cursor-pointer p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                <FaChevronLeft className="text-white" />
              </div>
              <div className="slider-pagination flex gap-2"></div>
              <div className="slider-next cursor-pointer p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                <FaChevronRight className="text-white" />
              </div>
            </div>
          </Swiper>
        </section>

        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col justify-center items-center text-center py-16 px-6 z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white/90 backdrop-blur-xl border border-gray-100 shadow-xl p-8 md:p-12 rounded-2xl max-w-5xl w-full -mt-24 relative z-20"
          >
            <motion.div
              className="bg-blue-50 text-blue-600 py-2 px-4 rounded-full inline-block text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            ></motion.div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Excellence in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Education
              </span>{" "}
              and Innovation
            </h1>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              Join our vibrant academic community and embark on a journey of
              discovery, innovation, and personal growth.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect("puc")}
                className="cursor-pointer bg-gradient-to-br from-white to-blue-50 border border-blue-100 hover:border-blue-300 transition-all p-8 rounded-xl shadow-sm hover:shadow-md group"
              >
                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center rounded-xl shadow-md group-hover:shadow-lg transition-all">
                    <FaUniversity className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-700">
                    PUC College
                  </h3>
                </div>
                <p className="text-gray-500 text-sm">
                  Comprehensive foundation program for pre-university excellence
                  with specialized streams.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect("degree")}
                className="cursor-pointer bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 hover:border-indigo-300 transition-all p-8 rounded-xl shadow-sm hover:shadow-md group"
              >
                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center rounded-xl shadow-md group-hover:shadow-lg transition-all">
                    <FaGraduationCap className="text-2xl" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-indigo-700">
                    Degree College
                  </h3>
                </div>
                <p className="text-gray-500 text-sm">
                  Undergraduate programs designed to prepare you for successful
                  careers and advanced studies.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        {/*<section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "95%", label: "Placement Rate" },
                { value: "40+", label: "Courses Offered" },
                { value: "150+", label: "Expert Faculty" },
                { value: "10,000+", label: "Alumni Network" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>*/}

        {/* Programs Section */}
        {/*<section id="programs" className="py-16 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                className="text-blue-600 font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ACADEMIC PROGRAMS
              </motion.div>
              <motion.h2
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Explore Our Diverse Curriculum
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                We offer comprehensive programs designed to meet the needs of
                diverse learners and prepare them for future success.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <motion.div
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      {program.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {program.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">{program.description}</p>
                  <button className="mt-6 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                    Learn More →
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>*/}

        {/* Faculty Section 
        <section
          id="faculty"
          className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                className="text-blue-600 font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                OUR FACULTY
              </motion.div>
              <motion.h2
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Meet Our Expert Educators
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Our distinguished faculty members bring years of experience and
                passion to the classroom.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {faculty.map((person, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="p-6 -mt-12">
                    <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 mx-auto mb-4"></div>
                    <h3 className="text-xl font-bold text-center text-gray-800">
                      {person.name}
                    </h3>
                    <p className="text-blue-600 text-center text-sm mb-2">
                      {person.position}
                    </p>
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">Experience</div>
                        <div>{person.experience}</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">Achievement</div>
                        <div>{person.achievement}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>*/}

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 relative z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                className="text-blue-600 font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                STUDENT TESTIMONIALS
              </motion.div>
              <motion.h2
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                What Our Students Say
              </motion.h2>
            </div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-8 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl"></div>
              <div className="text-5xl text-blue-100 absolute top-6 left-6">
                “
              </div>
              <p className="text-gray-700 text-lg mb-8 mt-6">
                Academix University provided me with the perfect environment to
                grow academically and personally. The faculty's dedication and
                the cutting-edge facilities helped me secure my dream job at a
                top tech firm.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                <div>
                  <div className="font-bold text-gray-800">Rahul Sharma</div>
                  <div className="text-sm text-gray-600">
                    Computer Science, Class of 2022
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 relative z-10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <motion.div
                className="text-blue-600 font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                CONTACT US
              </motion.div>
              <motion.h2
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Get In Touch
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Have questions? Our admissions team is here to help you with any
                inquiries.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Campus Address
                      </div>
                      <div className="text-gray-600">
                        123 Education Avenue, Knowledge City, 560001
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaPhone className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Phone Number
                      </div>
                      <div className="text-gray-600">+91 98765 43210</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Email Address
                      </div>
                      <div className="text-gray-600">
                        admissions@academix.edu
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-xl font-bold mb-6">Send us a message</h3>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your message"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {/* <div className="h-15 w-15 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center rounded-lg">
                    <FaUniversity />
                  </div>*/}
                  <h1 className="text-xl font-bold">
                    ಶ್ರೀ ಮುರುಘರಾಜೇಂದ್ರ ಯೋಗ ವಿದ್ಯಾ ಕೇಂದ್ರ (ನಿ) ಮುನವಳ್ಳಿ
                  </h1>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Committed to excellence in education, research, and
                  innovation.
                </p>
                {/* <div className="flex gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      <div className="h-4 w-4 rounded-full bg-gray-400"></div>
                    </div>
                  ))}
                </div> */}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {[
                    "About Us",
                    "Programs",
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
                    className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none w-full"
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-r-lg font-medium">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} ಶ್ರೀ ಮುರುಘರಾಜೇಂದ್ರ ಯೋಗ ವಿದ್ಯಾ
              ಕೇಂದ್ರ (ನಿ)ಮುನವಳ್ಳಿ. All rights reserved.
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default LandingPage;
