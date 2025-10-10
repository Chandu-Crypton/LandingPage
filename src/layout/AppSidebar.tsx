// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useSidebar } from "../context/SidebarContext";
// import {
//   BoxCubeIcon,
//   // CalenderIcon,
//   ChevronDownIcon,
//   GridIcon,
//   HorizontaLDots,
//   PieChartIcon,
//   // UserCircleIcon,
//   FolderIcon,
//   BoxIcon,
// } from "../icons/index";
// import SidebarWidget from "./SidebarWidget";

// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     path: "/",
//   },
// ];

// const moduleItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Module",
//     path: "/module-management/module",
//   },
//   {
//     icon: <FolderIcon />,
//     name: "Category",
//     path: "/category-management/category",
//   },
//   {
//     icon: <BoxIcon />,
//     name: "SubCategory",
//     path: "/subCategory-management/subCategory",
//   },
//   {
//     icon: <FolderIcon />,
//     name: "Banner",
//     subItems: [
//       { name: "Add Banner", path: "/banner-management/add-banner", pro: false },
//       { name: "Banner-list", path: "/banner-management/banners", pro: false },
//     ],
//   },
// ];

// const customerItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Users",
//     path: "/customer-management/user/user-list",
//   },
//   {
//     icon: <BoxCubeIcon />,
//     name: "Franchise",
//     path: "/customer-management/franchise/franchise-list",
//   },
// ];

// const providerItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Provider",
//     subItems: [
//       { name: "Add Provider", path: "/provider-management/add-provider", pro: false },
//       { name: "Provider Request", path: "/provider-management/provider-request", pro: false },
//       { name: "Provider List", path: "/provider-management/provider-list", pro: false },
//     ],
//   },
//   {
//     icon: <BoxCubeIcon />,
//     name: "Zone Setup",
//     subItems: [
//       { name: "Add Zone", path: "/zone-management/add-zone", pro: false },
//       { name: "Zone List", path: "/zone-management/zone-list", pro: false },
//     ],
//   },
// ];

// const serviceItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Service",
//     subItems: [
//       { name: "Add New Service", path: "/service-management/add-service", pro: false },
//       { name: "Service List", path: "/service-management/service-list", pro: false },
//       { name: "Add Why Choose BizBooster", path: "/service-management/add-why-choose", pro: false },
//     ],
//   },
// ];



// const counterItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Counter",
//     subItems: [
//       { name: "Add New Counter", path: "/counter-management/Add-Counter", pro: false },
//       { name: "Counter List", path: "/counter-management/Counter-List", pro: false },
//     ],
//   },
// ];

// const jobItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Job",
//     subItems: [
//       { name: "Add New Job", path: "/job-management/Add-Job", pro: false },
//       { name: "Job List", path: "/job-management/Job-List", pro: false },
//     ],
//   },
// ];

// const candidateItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Candidates",
//     subItems: [
//       // { name: "Add New Candidate", path: "/appliedcandidates-management/Add-Candidates", pro: false },
//       { name: "Candidate List", path: "/appliedcandidates-management/Candidates-List", pro: false },
//     ],
//   },
// ];


// const footerItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Footer",
//     subItems: [
//       { name: "Add New Footer", path: "/footer-management/Add-Footer", pro: false },
//       { name: "Footer List", path: "/footer-management/Footer-List", pro: false },
//     ],
//   },
// ];


// const testimonialItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Testimonial",
//     subItems: [
//       { name: "Add New Testimonial", path: "/testimonial-management/Add-Testimonial", pro: false },
//       { name: "Testimonial List", path: "/testimonial-management/Testimonial-List", pro: false },
//     ],
//   },
// ];


// const blogItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Blog",
//     subItems: [
//       { name: "Add New Blog", path: "/blog-management/Add-Blog", pro: false },
//       { name: "Blog List", path: "/blog-management/Blog-List", pro: false },
//     ],
//   },
// ];


// const aboutItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "About",
//     subItems: [
//       { name: "Add New About", path: "/about-management/Add-About", pro: false },
//       { name: "About List", path: "/about-management/About-List", pro: false },
//     ],
//   },
// ];


// const technologyItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Technology",
//     subItems: [
//       { name: "Add New Technology", path: "/technology-management/Add-Technology", pro: false },
//       { name: "Technology List", path: "/technology-management/Technology-List", pro: false },
//     ],
//   },
// ];


// const productItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Product",
//     subItems: [
//       { name: "Add New Product", path: "/product-management/Add-Product", pro: false },
//       { name: "Product List", path: "/product-management/Product-List", pro: false },
//     ],
//   },
// ];


// const boardItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Board",
//     subItems: [
//       { name: "Add New Board", path: "/board-management/Add-Board", pro: false },
//       { name: "Board List", path: "/board-management/Board-List", pro: false },
//     ],
//   },
// ];

// const internshipItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Internship",
//     subItems: [
//       { name: "Add New Internship", path: "/internship-management/Add-Internship", pro: false },
//       { name: "Internship List", path: "/internship-management/Internship-List", pro: false },
//     ],
//   },
// ];

// const contactItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Contact",
//     subItems: [
//       { name: "Add New Contact", path: "/contact-management/Add-Contact", pro: false },
//       { name: "Contact List", path: "/contact-management/Contact-List", pro: false },
//     ],
//   },
// ];

// const newsletterItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Newsletter",
//     subItems: [
//       { name: "Add New Newsletter", path: "/newsletter-management/Add-NewsLetter", pro: false },
//       { name: "Newsletter List", path: "/newsletter-management/NewsLetter-List", pro: false },
//     ],
//   },
// ];


// const policyItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Policy",
//     subItems: [
//       { name: "Privacy Policy", path: "/policy-management/privacy-policy", pro: false },
//       { name: "Terms and Conditions", path: "/policy-management/termsconditions", pro: false },
//     ],
//   },
// ];


// const fcontactItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "FContact",
//     subItems: [
//       // { name: "Add New FContact", path: "/fcontact-management/Add-FContact", pro: false },
//       { name: "FContact List", path: "/fcontact-management/FContact-List", pro: false },
//     ],
//   },
// ];


// const fservicesItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "FServices",
//     subItems: [
//       { name: "Add New FServices", path: "/fservices-management/Add-FServices", pro: false },
//       { name: "FServices List", path: "/fservices-management/FServices-List", pro: false },
//     ],
//   },
// ];







// const AppSidebar: React.FC = () => {
// const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
// const pathname = usePathname();

// const [openSubmenu, setOpenSubmenu] = useState<{
//   type: string;
//   index: number;
// } | null>(null);
// const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
// const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

// const isActive = useCallback((path: string): boolean => path === pathname, [pathname]);

// const handleSubmenuToggle = (index: number, menuType: string) => {
//   setOpenSubmenu((prevOpenSubmenu) => {
//     if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
//       return null;
//     }
//     return { type: menuType, index };
//   });
// };

// useEffect(() => {
//   let submenuMatched = false;
//   const allMenuTypes = [
//     { type: "main", items: navItems },
//     { type: "customer", items: customerItems },
//     { type: "module", items: moduleItems },
//     { type: "provider", items: providerItems },
//     { type: "service", items: serviceItems },
//     { type: "counter", items: counterItems },
//     { type: "job", items: jobItems },
//     { type: "footer", items: footerItems },
//     { type: "testimonial", items: testimonialItems },
//     { type: "blog", items: blogItems },
//     { type: "about", items: aboutItems },
//     { type: "technology", items: technologyItems },
//     { type: "product", items: productItems },
//     { type: "board", items: boardItems },
//     { type: "internship", items: internshipItems },
//     { type: "contact", items: contactItems },
//     { type: "candidate", items: candidateItems },
//     { type: "newsletter", items: newsletterItems },
//     { type: "policy", items: policyItems },
//     { type: "fcontact", items: fcontactItems },
//     { type: "fservices", items: fservicesItems },
//   ];

//   // Iterate over all menu types to find a matching submenu
//   allMenuTypes.forEach(({ type, items }) => {
//     items.forEach((nav, index) => {
//       if (nav.subItems) {
//         nav.subItems.forEach((subItem) => {
//           if (isActive(subItem.path)) {
//             setOpenSubmenu({ type, index });
//             submenuMatched = true;
//           }
//         });
//       }
//     });
//   });

//   if (!submenuMatched) {
//     setOpenSubmenu(null);
//   }
// }, [pathname, isActive,]);


// useEffect(() => {
//   if (openSubmenu !== null) {
//     const key = `${openSubmenu.type}-${openSubmenu.index}`;
//     if (subMenuRefs.current[key]) {
//       setSubMenuHeight((prevHeights) => ({
//         ...prevHeights,
//         [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//       }));
//     }
//   }
// }, [openSubmenu]);

//   const renderMenuItems = (
//     navItems: NavItem[],
//     menuType: string
//   ) => (
//     <ul className="flex flex-col gap-4">
//       {navItems.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group  ${openSubmenu?.type === menuType && openSubmenu?.index === index
//                 ? "menu-item-active"
//                 : "menu-item-inactive"
//                 } cursor-pointer ${!isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "lg:justify-start"
//                 }`}
//             >
//               <span
//                 className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-icon-active"
//                   : "menu-item-icon-inactive"
//                   }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className={`menu-item-text`}>{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
//                     openSubmenu?.index === index
//                     ? "rotate-180 text-brand-500"
//                     : ""
//                     }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 href={nav.path}
//                 className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                   }`}
//               >
//                 <span
//                   className={`${isActive(nav.path)
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                     }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className={`menu-item-text`}>{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       href={subItem.path}
//                       className={`menu-dropdown-item ${isActive(subItem.path)
//                         ? "menu-dropdown-item-active"
//                         : "menu-dropdown-item-inactive"
//                         }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`ml-auto ${isActive(subItem.path)
//                               ? "menu-dropdown-badge-active"
//                               : "menu-dropdown-badge-inactive"
//                               } menu-dropdown-badge `}
//                           >
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span
//                             className={`ml-auto ${isActive(subItem.path)
//                               ? "menu-dropdown-badge-active"
//                               : "menu-dropdown-badge-inactive"
//                               } menu-dropdown-badge `}
//                           >
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (

//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${isExpanded || isMobileOpen
//           ? "w-[290px]"
//           : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`pb-8 pt-3 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//           }`}
//       >
//         <Link href="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <Image
//                 className="dark:hidden"
//                 src="/images/icons/ftfllogo.jpeg"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <Image
//               src="/images/icons/ftfllogo.jpeg"
//               alt="Logo"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">


// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
//   </h2>
//   {renderMenuItems(navItems, "main")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "COUNTER MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(counterItems, "counter")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "JOB MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(jobItems, "job")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "CANDIDATE MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(candidateItems, "candidate")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "FOOTER MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(footerItems, "footer")}
// </div>


// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "TESTIMONIAL MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(testimonialItems, "testimonial")}
// </div>


// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "BLOG MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(blogItems, "blog")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "ABOUT MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(aboutItems, "about")}
// </div>


// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "TECHNOLOGY MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(technologyItems, "technology")}
// </div>


// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "PRODUCT MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(productItems, "product")}
// </div>


// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "BOARD MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(boardItems, "board")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "INTERNSHIP MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(internshipItems, "internship")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "CONTACT MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(contactItems, "contact")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "NEWSLETTER MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(newsletterItems, "newsletter")}
// </div>

// <div>
//   <h2
//     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//       ? "lg:justify-center"
//       : "justify-start"
//       }`}
//   >
//     {isExpanded || isHovered || isMobileOpen ? (
//       "POLICY MANAGEMENT"
//     ) : (
//       <HorizontaLDots />
//     )}
//   </h2>
//   {renderMenuItems(policyItems, "policy")}
// </div>


//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "justify-start"
//                   }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "FCONTACT MANAGEMENT"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2>
//               {renderMenuItems(fcontactItems, "fcontact")}
//             </div>


//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
//                   ? "lg:justify-center"
//                   : "justify-start"
//                   }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "FSERVICES MANAGEMENT"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2>
//               {renderMenuItems(fservicesItems, "fservices")}
//             </div>

//           </div>
//         </nav>
//         {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
//       </div>
//     </aside>





//   );
// };

// export default AppSidebar;





"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PieChartIcon,
  FolderIcon,
  BoxIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  isSpecialSection?: boolean;
};



const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
];




const moduleItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Module",
    path: "/module-management/module",
  },
  {
    icon: <FolderIcon />,
    name: "Category",
    path: "/category-management/category",
  },
  {
    icon: <BoxIcon />,
    name: "SubCategory",
    path: "/subCategory-management/subCategory",
  },
  {
    icon: <FolderIcon />,
    name: "Banner",
    subItems: [
      { name: "Add Banner", path: "/banner-management/add-banner", pro: false },
      { name: "Banner-list", path: "/banner-management/banners", pro: false },
    ],
  },
];

const customerItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Users",
    path: "/customer-management/user/user-list",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Franchise",
    path: "/customer-management/franchise/franchise-list",
  },
];

const providerItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Provider",
    subItems: [
      { name: "Add Provider", path: "/provider-management/add-provider", pro: false },
      { name: "Provider Request", path: "/provider-management/provider-request", pro: false },
      { name: "Provider List", path: "/provider-management/provider-list", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Zone Setup",
    subItems: [
      { name: "Add Zone", path: "/zone-management/add-zone", pro: false },
      { name: "Zone List", path: "/zone-management/zone-list", pro: false },
    ],
  },
];

const serviceItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Service",
    subItems: [
      { name: "Add New Service", path: "/service-management/add-service", pro: false },
      { name: "Service List", path: "/service-management/service-list", pro: false },
      { name: "Add Why Choose BizBooster", path: "/service-management/add-why-choose", pro: false },
    ],
  },
];



const counterItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Counter",
    subItems: [
      { name: "Add New Counter", path: "/counter-management/Add-Counter", pro: false },
      { name: "Counter List", path: "/counter-management/Counter-List", pro: false },
    ],
  },
];

const jobItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Job",
    subItems: [
      { name: "Add New Job", path: "/job-management/Add-Job", pro: false },
      { name: "Job List", path: "/job-management/Job-List", pro: false },
       { name: "Add New Vacancy", path: "/job-management/Add-Vacancy", pro: false },
      { name: "Vacancy List", path: "/job-management/Vacancy-List", pro: false },
    ],
  },
];

const candidateItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Candidates",
    subItems: [
      // { name: "Add New Candidate", path: "/appliedcandidates-management/Add-Candidates", pro: false },
      { name: "Candidate List", path: "/appliedcandidates-management/Candidates-List", pro: false },
    ],
  },
];


const footerItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Footer",
    subItems: [
      { name: "Add New Footer", path: "/footer-management/Add-Footer", pro: false },
      { name: "Footer List", path: "/footer-management/Footer-List", pro: false },
    ],
  },
];


const testimonialItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Testimonial",
    subItems: [
      { name: "Add New Testimonial", path: "/testimonial-management/Add-Testimonial", pro: false },
      { name: "Testimonial List", path: "/testimonial-management/Testimonial-List", pro: false },
    ],
  },
];


const blogItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Blog",
    subItems: [
      { name: "Add New Blog", path: "/blog-management/Add-Blog", pro: false },
      { name: "Blog List", path: "/blog-management/Blog-List", pro: false },
    ],
  },
];


const aboutItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "About",
    subItems: [
      { name: "Add New About", path: "/about-management/Add-About", pro: false },
      { name: "About List", path: "/about-management/About-List", pro: false },
      { name: "Add New Gallery", path: "/gallery-management/Add-Gallery", pro: false },
      { name: "Gallery List", path: "/gallery-management/Gallery-List", pro: false },

    ],
  },
];


const technologyItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Technology",
    subItems: [
      { name: "Add New Technology", path: "/technology-management/Add-Technology", pro: false },
      { name: "Technology List", path: "/technology-management/Technology-List", pro: false },
    ],
  },
];


const productItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Product",
    subItems: [
      { name: "Add New Product", path: "/product-management/Add-Product", pro: false },
      { name: "Product List", path: "/product-management/Product-List", pro: false },
    ],
  },
];


const boardItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Board",
    subItems: [
      { name: "Add New Board", path: "/board-management/Add-Board", pro: false },
      { name: "Add New Core Team", path: "/departmentboard-component/Add-DepartmentBoard", pro: false },
      { name: "Board List", path: "/board-management/Board-List", pro: false },
      { name: "Core Team List", path: "/departmentboard-component/DepartmentBoard-List", pro: false },
    ],
  },
];

const internshipItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Internship",
    subItems: [
      { name: "Add New Internship", path: "/internship-management/Add-Internship", pro: false },
      { name: "Internship List", path: "/internship-management/Internship-List", pro: false },
      // { name: "Add New PaidInternshipContact", path: "/internship-management/Add-PaidInternshipContact", pro: false },
      // { name: "PaidInternshipContact List", path: "/internship-management/PaidInternshipContact-List", pro: false },
    ],
  },
];


const reviewItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Review",
    subItems: [
      { name: "Add New Review", path: "/review-management/Add-Review", pro: false },
      { name: "Review List", path: "/review-management/Review-List", pro: false },
    ],
  },
];


const faqItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "FAQ",
    subItems: [
      { name: "Add New Faq", path: "/faq-management/Add-Faq", pro: false },
      { name: "Faq List", path: "/faq-management/Faq-List", pro: false },
    ],
  },
];

const contactItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Contact",
    subItems: [
      // { name: "Add New Contact", path: "/contact-management/Add-Contact", pro: false },
      // { name: "Add New Sales Contact", path: "/salescontact-management/Add-SaleContact", pro: false },
      { name: "Add New Display Contact", path: "/displaycontact-management/Add-DisplayContact", pro: false },
      { name: "Candidates Contact List", path: "/contact-management/Contact-List", pro: false },
      { name: "Sales Contact List", path: "/salescontact-management/SaleContact-List", pro: false },
      { name: "Display Contact List", path: "/displaycontact-management/DisplayContact-List", pro: false },
    ],
  },
];


const bannerItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Banner",
    subItems: [
      { name: "Add New Banner", path: "/banner-management/Add-Banner", pro: false },
      { name: "Banner List", path: "/banner-management/Banner-List", pro: false },
    ],
  },
];


const newsletterItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Newsletter",
    subItems: [
      { name: "Add New Newsletter", path: "/newsletter-management/Add-NewsLetter", pro: false },
      { name: "Newsletter List", path: "/newsletter-management/NewsLetter-List", pro: false },
        { name: "Subscribers List", path: "/newsletter-management/Subscribe-List", pro: false },
    ],
  },
];


const policyItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Policy",
    subItems: [
      { name: "Privacy Policy", path: "/policy-management/privacy-policy", pro: false },
      { name: "Refund Policy", path: "/policy-management/refund-policy", pro: false },
      { name: "Terms and Conditions", path: "/policy-management/termsconditions", pro: false },
    ],
  },
];


const servicesItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Services",
    subItems: [
      { name: "Add New Services", path: "/service-management/Add-Service", pro: false },
      { name: "Services List", path: "/service-management/Service-List", pro: false },
    ],
  },
];



const fcontactItems: NavItem[] = [
  {
    icon: <PieChartIcon />, // Use existing icon with blue color
    name: "Contact",
    subItems: [
      // { name: "Add New Contact", path: "/fcontact-management/Add-FContact", pro: false },
      { name: "Contact List", path: "/fcontact-management/FContact-List", pro: false },
    ],
    isSpecialSection: true,
  },
];

const fservicesItems: NavItem[] = [
  {
    icon: <PieChartIcon />, // Use existing icon with blue color
    name: "Services",
    subItems: [
      { name: "Add New Services", path: "/fservices-management/Add-FServices", pro: false },
      { name: "Services List", path: "/fservices-management/FServices-List", pro: false },
    ],
    isSpecialSection: true,
  },
];

const fblogItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Blog",
    subItems: [
      { name: "Add New Blog", path: "/fblog-management/Add-FBlog", pro: false },
      { name: "Blog List", path: "/fblog-management/FBlog-List", pro: false },
    ],
    isSpecialSection: true,
  },
];


const packageItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Package",
    subItems: [
      { name: "Add New Package", path: "/package-management/Add-Package", pro: false },
      { name: "Package List", path: "/package-management/PackageList", pro: false },
    ],
    isSpecialSection: true,
  },
];


const fnewsletterItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "NewsLetter",
    subItems: [
      { name: "Add New NewsLetter", path: "/fnewsletter-management/Add-NewsLetter", pro: false },
      { name: "NewsLetter List", path: "/fnewsletter-management/NewsLetter-List", pro: false },
    ],
    isSpecialSection: true,
  },
];


const ourPartnersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Our Partners",
    subItems: [
      { name: "Add New Our Partner", path: "/ourpartners-management/Add-OurPartners", pro: false },
      { name: "Our Partner List", path: "/ourpartners-management/OurPartners-List", pro: false },
    ],
    isSpecialSection: true,
  },
];



const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeView, setActiveView] = useState<'all' | 'fetchTrue'>('all'); // New state for toggle

  const isActive = useCallback((path: string): boolean => path === pathname, [pathname]);

  const handleLogoClick = (e: React.MouseEvent, viewType: 'all' | 'fetchTrue') => {
    e.preventDefault();
    e.stopPropagation();
    setActiveView(viewType);
  };


  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  useEffect(() => {
    let submenuMatched = false;
    const allMenuTypes = [
      { type: "main", items: navItems },
      { type: "customer", items: customerItems },
      { type: "module", items: moduleItems },
      { type: "provider", items: providerItems },
      { type: "service", items: serviceItems },
      { type: "counter", items: counterItems },
      { type: "job", items: jobItems },
      { type: "footer", items: footerItems },
      { type: "testimonial", items: testimonialItems },
      { type: "blog", items: blogItems },
      { type: "about", items: aboutItems },
      { type: "technology", items: technologyItems },
      { type: "product", items: productItems },
      { type: "board", items: boardItems },
      { type: "internship", items: internshipItems },
      { type: "contact", items: contactItems },
      { type: "candidate", items: candidateItems },
      { type: "newsletter", items: newsletterItems },
      { type: "policy", items: policyItems },
      { type: "service", items: servicesItems },
      { type: "contact", items: fcontactItems },
      { type: "services", items: fservicesItems },
      { type: "blog", items: fblogItems },
      { type: "package", items: packageItems },
      { type: "banner", items: bannerItems },
      { type: "review", items: reviewItems },
      { type: "faq", items: faqItems },
      { type: "fnewsletter", items: fnewsletterItems },
      { type: "ourpartners", items: ourPartnersItems },

    ];

    allMenuTypes.forEach(({ type, items }) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: string
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                } ${nav.isSpecialSection ? "bg-blue-50 border-l-4 border-grey-500" : ""}`}
            >
              <span
                className={`${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  } ${nav.isSpecialSection ? "text-grey-500" : ""}`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text ${nav.isSpecialSection ? "text-grey-600 font-semibold" : ""}`}>
                  {nav.name}
                </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    } ${nav.isSpecialSection ? "text-grey-500" : ""}`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  } ${nav.isSpecialSection ? "bg-blue-50 border-l-4 border-grey-500" : ""}`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    } ${nav.isSpecialSection ? "text-blue-500" : ""}`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text ${nav.isSpecialSection ? "text-blue-600 font-semibold" : ""}`}>
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        } ${nav.isSpecialSection ? "border-l-2 border-grey-500" : ""}`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`pb-8 pt-3 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <div className="flex flex-col gap-2">
          {/* First Logo - Shows all sections except special ones */}
          <button
            onClick={(e) => handleLogoClick(e, 'all')}
            className={`p-1 rounded-md transition-colors ${activeView === 'all' ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title="Show all sections"
          >
            <Image
              src="/images/icons/ftfllogo.jpeg"
              alt="Main Logo"
              width={isExpanded || isHovered || isMobileOpen ? 150 : 32}
              height={isExpanded || isHovered || isMobileOpen ? 40 : 32}
            />
          </button>

          {/* Second Logo - Shows only Fetch True sections */}
          <button
            onClick={(e) => handleLogoClick(e, 'fetchTrue')}
            className={`p-1 rounded-md transition-colors ${activeView === 'fetchTrue' ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            title="Show Fetch True sections only"
          >
            <Image
              // src="/images/logo/final-logo.png"
              src="/images/logo/Fetch-True-icon.png"
              alt="Fetch True Logo"
              width={isExpanded || isHovered || isMobileOpen ? 110 : 32}
              height={isExpanded || isHovered || isMobileOpen ? 50 : 32}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">

            {/* Show regular sections only when activeView is 'all' */}
            {activeView === 'all' && (
              <>
                <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                    {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
                  </h2>
                  {renderMenuItems(navItems, "main")}
                </div>

                <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                    {isExpanded || isHovered || isMobileOpen ? "COUNTER MANAGEMENT" : <HorizontaLDots />}
                  </h2>
                  {renderMenuItems(counterItems, "counter")}
                </div>

                {/* ... Repeat for all other regular sections ... */}
                <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                    {isExpanded || isHovered || isMobileOpen ? "JOB MANAGEMENT" : <HorizontaLDots />}
                  </h2>
                  {renderMenuItems(jobItems, "job")}
                </div>

                <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                    {isExpanded || isHovered || isMobileOpen ? "CANDIDATE MANAGEMENT" : <HorizontaLDots />}
                  </h2>
                  {renderMenuItems(candidateItems, "candidate")}
                </div>


              <div>    
                 <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>  FOOTER MANAGEMENT</h2>    
                  {renderMenuItems(footerItems, "footer")}  
               </div>

                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "TESTIMONIAL MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(testimonialItems, "testimonial")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "BLOG MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(blogItems, "blog")}
                </div>

                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "ABOUT MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(aboutItems, "about")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "TECHNOLOGY MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(technologyItems, "technology")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "PRODUCT MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(productItems, "product")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "SERVICES MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(servicesItems, "services")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "BOARD MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(boardItems, "board")}
                </div>

                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "INTERNSHIP MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(internshipItems, "internship")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "REVIEW MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(reviewItems, "review")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "FAQ MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(faqItems, "faq")}
                </div>

                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "CONTACT MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(contactItems, "contact")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "BANNER MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(bannerItems, "banner")}
                </div>


                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "NEWSLETTER MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(newsletterItems, "newsletter")}
                </div>

                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                      }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "POLICY MANAGEMENT"
                    ) : (
                      <HorizontaLDots />
                    )}
                  </h2>
                  {renderMenuItems(policyItems, "policy")}
                </div>



              </>
            )}

            {/* Show special sections only when activeView is 'fetchTrue' OR always show but conditionally render based on activeView */}
            {(activeView === 'fetchTrue' || activeView === 'all') && (
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                {/* <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-500 dark:text-gray-400">
                    Fetch True Sections
                  </span>
                </div> */}
              </div>
            )}

            {/* Always show special sections but conditionally based on activeView */}
            {(activeView === 'fetchTrue') && (
              <>
                <div>

                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}>
                    {isExpanded || isHovered || isMobileOpen ? "CONTACT MANAGEMENT" : <PieChartIcon className="text-grey-500" />}
                  </h2>
                  {renderMenuItems(fcontactItems, "contact")}
                </div>

                <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}>
                    {isExpanded || isHovered || isMobileOpen ? "SERVICES MANAGEMENT" : <PieChartIcon className="text-blue-500" />}
                  </h2>
                  {renderMenuItems(fservicesItems, "services")}
                </div>

                <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}>
                    {isExpanded || isHovered || isMobileOpen ? "BLOG MANAGEMENT" : <PieChartIcon className="text-blue-500" />}
                  </h2>
                  {renderMenuItems(fblogItems, "blog")}
                </div>

                  <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}>
                    {isExpanded || isHovered || isMobileOpen ? "NEWSLETTER MANAGEMENT" : <PieChartIcon className="text-blue-500" />}
                  </h2>
                  {renderMenuItems(fnewsletterItems, "fnewsletter")}
                </div>


                <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}>
                    {isExpanded || isHovered || isMobileOpen ? "PACKAGE MANAGEMENT" : <PieChartIcon className="text-blue-500" />}
                  </h2>
                  {renderMenuItems(packageItems, "package")}
                </div>


                 <div>
                  <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}>
                    {isExpanded || isHovered || isMobileOpen ? "OURPARTNERS MANAGEMENT" : <PieChartIcon className="text-blue-500" />}
                  </h2>
                  {renderMenuItems(ourPartnersItems, "ourpartners")}
                </div>
              </>
            )}

          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;