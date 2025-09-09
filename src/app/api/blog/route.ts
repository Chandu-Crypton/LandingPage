import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectToDatabase } from "@/utils/db";
import imagekit from "@/utils/imagekit";
import mongoose from "mongoose";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS() {
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}


export async function GET() {
    await connectToDatabase();

    try {

        const docs = await Blog.find({});

        if (docs.length === 0) {
            return NextResponse.json(
                { success: true, data: [], message: 'No Blog documents found.' },
                { status: 200, headers: corsHeaders }
            );
        }


        return NextResponse.json(
            { success: true, data: docs },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error('GET /api/blog error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}


// export async function GET() {
//     await connectToDatabase();

// const dummyBlogs = [
//   {
//     blogHeading: "Artificial Intelligence in Everyday Life",
//     title: "AI Transforming Daily Routines",
//     description: "Artificial Intelligence is now integrated into everyday routines, from smart assistants to recommendation engines, improving efficiency, convenience, decision-making, personalization, automation, predictive analysis, problem-solving, safety, accessibility, and enhancing human activities in multiple domains effectively for all users.",
//     readtime: "5 min",
//     category: "Technology",
//     featured: true,
//     tags: ["AI", "Machine Learning", "Daily Life"],
//     bestQuote: "AI is not the future; it’s the present transforming our world.",
//     keyTechnologies: [
//       {
//         itemTitle: "Machine Learning",
//         itemPoints: ["Predictive analytics", "Pattern recognition", "Automated decision-making"],
//         itemDescription: "Machine learning enables systems to analyze data, recognize patterns, predict outcomes, automate decisions, improve continuously, and provide intelligent solutions without explicit programming or manual intervention."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Smart Home Devices",
//         itemDescription: "AI-enabled thermostats, lights, and security systems learn user behavior and adjust automatically, improving comfort, convenience, energy efficiency, safety, personalization, and daily home management effectively."
//       },
//       {
//         itemTitle: "Virtual Assistants",
//         itemDescription: "Assistants like Siri, Alexa, and Google Assistant understand voice commands, manage schedules, answer questions, provide recommendations, streamline tasks, and enhance productivity and convenience across daily activities."
//       },
//       {
//         itemTitle: "Recommendation Systems",
//         itemDescription: "AI analyzes user behavior to suggest personalized products, media, services, or content, improving engagement, satisfaction, relevance, retention, decision-making, and overall digital experience effectively."
//       },
//       {
//         itemTitle: "Autonomous Vehicles",
//         itemDescription: "Self-driving cars use AI and sensors to navigate safely, optimize traffic flow, avoid collisions, improve efficiency, reduce human errors, and provide reliable transportation in complex environments."
//       }
//     ],
//     mainImage: "/images/ai-daily.jpg",
//     headingImage: "/images/ai-banner.jpg"
//   },
//   {
//     blogHeading: "Minimalist Web Design Principles",
//     title: "Less is More: Minimalist Design",
//     description: "Minimalist web design emphasizes simplicity, clarity, functionality, and user experience, removing unnecessary elements to create visually appealing, intuitive, clean, efficient, well-structured, easily navigable, aesthetically pleasing, accessible, and professional digital interfaces for all users effectively.",
//     readtime: "6 min",
//     category: "Design",
//     featured: true,
//     tags: ["Design", "UX", "Minimalism"],
//     bestQuote: "Simplicity is the ultimate sophistication.",
//     keyTechnologies: [
//       {
//         itemTitle: "Grid Systems",
//         itemPoints: ["Flexible layout", "Consistency", "Alignment"],
//         itemDescription: "Grid systems provide a consistent framework, aligning content precisely, maintaining visual balance, ensuring responsiveness, improving hierarchy, organization, aesthetics, and enhancing overall user experience in digital interfaces."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Whitespace Usage",
//         itemDescription: "Whitespace improves readability, reduces clutter, highlights key content, enhances visual appeal, focus, and organization, supporting a clean, balanced, minimalist website layout effectively."
//       },
//       {
//         itemTitle: "Color Scheme",
//         itemDescription: "A cohesive color palette ensures clarity, visual harmony, emphasis, aesthetic consistency, focus on content, readability, and a professional, minimalist digital design appearance across all pages."
//       },
//       {
//         itemTitle: "Typography",
//         itemDescription: "Clear and readable fonts establish hierarchy, improve comprehension, support accessibility, enhance aesthetics, guide user focus, and strengthen brand identity in minimalistic web layouts."
//       },
//       {
//         itemTitle: "Simplified Navigation",
//         itemDescription: "Minimalist navigation reduces cognitive load with clear menus and links, improving usability, accessibility, efficiency, and seamless browsing across all devices and screen sizes effectively."
//       }
//     ],
//     mainImage: "/images/minimalist-web.jpg",
//     headingImage: "/images/minimalist-banner.jpg"
//   },
//   {
//     blogHeading: "Web Performance Optimization",
//     title: "Speed Matters: Optimizing Web Apps",
//     description: "Optimizing web performance is essential for user engagement, faster load times, higher search rankings, improved efficiency, responsiveness, accessibility, retention, smooth interactions, minimal latency, and scalable, high-performing web applications for modern users effectively.",
//     readtime: "5 min",
//     category: "Technology",
//     featured: false,
//     tags: ["Web", "Performance", "Optimization"],
//     bestQuote: "A fast website is a happy user.",
//     keyTechnologies: [
//       {
//         itemTitle: "Caching Strategies",
//         itemPoints: ["Browser caching", "CDN", "Server-side caching"],
//         itemDescription: "Caching strategies reduce server load and speed up content delivery by storing frequently accessed data temporarily, ensuring fast, responsive, scalable, and efficient web applications for all users."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Image Optimization",
//         itemDescription: "Compress and resize images to reduce file size, improve load speed, maintain quality, enhance performance, responsiveness, and provide seamless experiences across all devices."
//       },
//       {
//         itemTitle: "Minifying Resources",
//         itemDescription: "Minify CSS, JS, and HTML files to reduce load times, improve website performance, speed, and efficiency while preserving full functionality and responsiveness across browsers."
//       },
//       {
//         itemTitle: "Lazy Loading",
//         itemDescription: "Load images and content only when visible in viewport to decrease initial page load times, improve performance, reduce bandwidth, and enhance user experience effectively."
//       },
//       {
//         itemTitle: "Code Splitting",
//         itemDescription: "Divide large JavaScript bundles into smaller chunks for faster initial load, better resource management, improved performance, and smooth, responsive interactions on websites."
//       }
//     ],
//     mainImage: "/images/web-performance.jpg",
//     headingImage: "/images/performance-banner.jpg"
//   },
//   {
//     blogHeading: "Virtual Reality in Education",
//     title: "Immersive Learning with VR",
//     description: "Virtual Reality enables immersive learning environments, enhancing engagement, understanding, retention, experiential learning, interactive lessons, simulations, collaboration, exploration, skill development, practical comprehension, creativity, and knowledge acquisition across various subjects effectively for students.",
//     readtime: "6 min",
//     category: "Education",
//     featured: true,
//     tags: ["VR", "Education", "Immersive Learning"],
//     bestQuote: "Learning is more effective when it feels real.",
//     keyTechnologies: [
//       {
//         itemTitle: "VR Headsets",
//         itemPoints: ["HTC Vive", "Oculus Rift", "Windows Mixed Reality"],
//         itemDescription: "VR headsets provide immersive environments, allowing students to explore, interact, and experience educational content realistically, enhancing engagement, understanding, retention, and practical knowledge acquisition."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Virtual Labs",
//         itemDescription: "Students perform interactive experiments in virtual labs safely, improving comprehension, skill acquisition, engagement, and understanding without real-world hazards in educational contexts effectively."
//       },
//       {
//         itemTitle: "Historical Simulations",
//         itemDescription: "VR recreates historical events, enabling students to experience history vividly, engage deeply with content, understand contexts, develop empathy, and retain knowledge efficiently."
//       },
//       {
//         itemTitle: "Interactive Lessons",
//         itemDescription: "Teachers design simulations to explain complex concepts actively, enhancing comprehension, engagement, practical understanding, and knowledge retention for all learners effectively."
//       },
//       {
//         itemTitle: "Remote Collaboration",
//         itemDescription: "Students collaborate in virtual spaces regardless of location, improving teamwork, communication skills, project execution, engagement, and collaborative learning experiences across multiple subjects."
//       }
//     ],
//     mainImage: "/images/vr-education.jpg",
//     headingImage: "/images/vr-banner.jpg"
//   },
//   {
//     blogHeading: "The Art of Fonts",
//     title: "Typography Influences Emotions",
//     description: "Typography affects readability, user perception, and emotional response, making font selection critical for design, branding, communication, hierarchy, accessibility, engagement, consistency, clarity, professionalism, usability, visual appeal, and delivering messages effectively across all platforms.",
//     readtime: "4 min",
//     category: "Design",
//     featured: false,
//     tags: ["Fonts", "Typography", "Design"],
//     bestQuote: "Fonts speak louder than words.",
//     keyTechnologies: [
//       {
//         itemTitle: "Serif vs Sans-Serif",
//         itemPoints: ["Readability", "Professionalism", "Mood"],
//         itemDescription: "Choosing the correct font style enhances readability, conveys professionalism, evokes emotions, sets mood, supports branding, and improves clarity and user engagement in digital and print media effectively."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Font Pairing",
//         itemDescription: "Combine complementary fonts to maintain aesthetic harmony, improve readability, create contrast, enhance visual appeal, support hierarchy, and guide users through content effectively."
//       },
//       {
//         itemTitle: "Hierarchy",
//         itemDescription: "Use font size, weight, and style to establish content hierarchy, guiding users to important information, enhancing readability, and structuring information effectively."
//       },
//       {
//         itemTitle: "Line Spacing",
//         itemDescription: "Proper line spacing improves readability, reduces eye strain, enhances visual balance, and supports clarity, flow, and user comprehension across content."
//       },
//       {
//         itemTitle: "Responsive Typography",
//         itemDescription: "Adjust font sizes dynamically for different screens to maintain readability, hierarchy, visual consistency, and optimal user experience across devices."
//       }
//     ],
//     mainImage: "/images/fonts.jpg",
//     headingImage: "/images/fonts-banner.jpg"
//   },
//   {
//     blogHeading: "Improving API Speed",
//     title: "APIs and Smart Caching",
//     description: "Smart caching improves API response times, reduces server load, ensures scalability, reliability, and efficiency, optimizes performance, minimizes latency, enhances user experience, maintains high availability, supports growth, and manages heavy traffic effectively for applications.",
//     readtime: "5 min",
//     category: "Technology",
//     featured: false,
//     tags: ["API", "Caching", "Performance"],
//     bestQuote: "Faster APIs mean happier users.",
//     keyTechnologies: [
//       {
//         itemTitle: "Server-Side Caching",
//         itemPoints: ["Redis", "Memcached", "Database caching"],
//         itemDescription: "Server-side caching stores frequently accessed data in memory, reducing database load, improving response times, enhancing performance, scalability, efficiency, and reliability in API services."
//       },
//       {
//         itemTitle: "Client-Side Caching",
//         itemPoints: ["Browser caching", "LocalStorage", "IndexedDB"],
//         itemDescription: "Client-side caching stores data in browsers, reduces repeated requests, improves performance, offline availability, load speed, and ensures efficient API usage for end users."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "CDN Integration",
//         itemDescription: "Deliver content via geographically distributed servers to reduce latency, increase speed, improve reliability, and enhance global user experience efficiently."
//       },
//       {
//         itemTitle: "API Gateway",
//         itemDescription: "Manage API requests, routing, authentication, throttling, and traffic efficiently, ensuring reliable, high-performance API delivery across services and clients."
//       },
//       {
//         itemTitle: "Rate Limiting",
//         itemDescription: "Control API request volume per user or application to prevent overload, ensure fairness, improve performance, and maintain reliability of services effectively."
//       },
//       {
//         itemTitle: "Monitoring & Logging",
//         itemDescription: "Track performance metrics, errors, and system health to quickly detect issues, optimize performance, and ensure reliable, high-performing API operations."
//       }
//     ],
//     mainImage: "/images/api-speed.jpg",
//     headingImage: "/images/api-banner.jpg"
//   },
//   {
//     blogHeading: "Remote Work Tech",
//     title: "Digital Tools Empowering Remote Teams",
//     description: "Remote work is enabled by technology like Slack, Zoom, and cloud services, enabling distributed teams to collaborate efficiently, communicate seamlessly, manage tasks, share files, monitor progress, stay productive, connected, and organized across locations and time zones effectively.",
//     readtime: "5 min",
//     category: "Technology",
//     featured: true,
//     tags: ["Remote Work", "Collaboration", "Tools"],
//     bestQuote: "Work happens anywhere with the right tools.",
//     keyTechnologies: [
//       {
//         itemTitle: "Communication Tools",
//         itemPoints: ["Slack", "Teams", "Zoom"],
//         itemDescription: "Communication platforms provide messaging, video calls, collaboration, notifications, and file sharing, enabling real-time, efficient teamwork for distributed teams globally."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Task Management",
//         itemDescription: "Applications like Trello or Asana allow teams to organize, assign, track, and manage tasks efficiently for improved project execution and accountability in remote environments."
//       },
//       {
//         itemTitle: "Time Tracking",
//         itemDescription: "Apps like Clockify monitor work hours, track productivity, ensure accountability, optimize performance, and manage distributed team workloads effectively."
//       },
//       {
//         itemTitle: "File Sharing",
//         itemDescription: "Cloud storage enables teams to share, collaborate, access, edit, and synchronize documents securely, improving workflow efficiency and accessibility across locations."
//       },
//       {
//         itemTitle: "Video Collaboration",
//         itemDescription: "Video conferencing tools facilitate virtual meetings, workshops, and discussions, keeping teams connected, engaged, and collaborative regardless of physical distance."
//       }
//     ],
//     mainImage: "/images/remote-work.jpg",
//     headingImage: "/images/remote-banner.jpg"
//   },
//   {
//     blogHeading: "Impact of Colors in Branding",
//     title: "Colors Shape Brand Perception",
//     description: "Colors influence customer perception, emotional response, and brand identity, making color choice crucial for marketing, design, brand recognition, user engagement, memorability, aesthetics, clarity, communication, consistency, and conveying desired messages effectively across platforms.",
//     readtime: "4 min",
//     category: "Marketing",
//     featured: false,
//     tags: ["Colors", "Branding", "Marketing"],
//     bestQuote: "Color is the silent ambassador of your brand.",
//     keyTechnologies: [
//       {
//         itemTitle: "Color Psychology",
//         itemPoints: ["Emotions", "Behavior", "Perception"],
//         itemDescription: "Understanding color psychology helps brands evoke desired emotions, influence decisions, impact behavior, and communicate effectively, enhancing engagement, recall, and brand perception strategically."
//       },
//       {
//         itemTitle: "Palette Tools",
//         itemPoints: ["Adobe Color", "Coolors", "Canva"],
//         itemDescription: "Digital tools assist in selecting harmonious, accessible, and visually appealing color combinations that maintain brand consistency, aesthetics, and effective design across platforms."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Primary Colors",
//         itemDescription: "Use consistent dominant colors to strengthen brand identity, improve recognition, maintain visual consistency, and enhance overall brand perception effectively across platforms."
//       },
//       {
//         itemTitle: "Accent Colors",
//         itemDescription: "Highlight important elements, calls-to-action, or features with accent colors to attract attention, improve usability, and create visual hierarchy effectively."
//       },
//       {
//         itemTitle: "Contrast",
//         itemDescription: "Ensure sufficient contrast between colors to improve readability, accessibility, clarity, and user experience across digital and print media effectively."
//       },
//       {
//         itemTitle: "Consistency",
//         itemDescription: "Maintain the same color palette and usage rules across platforms to reinforce brand identity, create cohesion, and enhance professional appearance."
//       }
//     ],
//     mainImage: "/images/colors.jpg",
//     headingImage: "/images/colors-banner.jpg"
//   },
//   {
//     blogHeading: "Optimizing React Apps",
//     title: "React Performance Best Practices",
//     description: "React app performance can degrade without optimization. Techniques like memoization, lazy loading, code splitting, and efficient state management ensure fast, smooth, responsive, scalable, maintainable, and highly interactive applications for optimal user experience.",
//     readtime: "5 min",
//     category: "Technology",
//     featured: true,
//     tags: ["React", "Optimization", "Frontend"],
//     bestQuote: "A smooth UI keeps users engaged.",
//     keyTechnologies: [
//       {
//         itemTitle: "Memoization",
//         itemPoints: ["React.memo", "useMemo", "useCallback"],
//         itemDescription: "Memoization prevents unnecessary re-renders, improves performance, reduces resource usage, enhances responsiveness, maintains state integrity, and ensures efficient execution in React applications."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Virtualization",
//         itemDescription: "Render only visible list items using libraries like react-window to improve performance, reduce memory usage, and enhance responsiveness in applications handling large datasets."
//       },
//       {
//         itemTitle: "Optimized State Management",
//         itemDescription: "Keep state localized, avoid frequent updates on unrelated components, reduce re-renders, improve performance, maintain data consistency, and ensure smooth application behavior."
//       },
//       {
//         itemTitle: "Lazy Loading Components",
//         itemDescription: "Load components on demand to reduce initial bundle size, improve render speed, and ensure smooth user experience in large React applications effectively."
//       },
//       {
//         itemTitle: "Code Splitting",
//         itemDescription: "Split code into smaller bundles so only required code loads, reducing initial load time, improving performance, and enhancing responsiveness."
//       }
//     ],
//     mainImage: "/images/react-optimization.jpg",
//     headingImage: "/images/react-banner.jpg"
//   },
//   {
//     blogHeading: "Big Data in Business",
//     title: "Analytics Driving Strategy",
//     description: "Data analytics empowers businesses to predict trends, optimize operations, make informed decisions, enhance customer understanding, improve efficiency, generate actionable insights, support growth, mitigate risks, and gain competitive advantages in a data-driven business environment effectively.",
//     readtime: "6 min",
//     category: "Finance",
//     featured: false,
//     tags: ["Big Data", "Analytics", "Business"],
//     bestQuote: "Data-driven decisions outperform intuition every time.",
//     keyTechnologies: [
//       {
//         itemTitle: "Data Warehousing",
//         itemPoints: ["Redshift", "BigQuery", "Snowflake"],
//         itemDescription: "Centralized storage solutions allow businesses to efficiently query, manage, analyze, and extract insights from large datasets across multiple sources effectively."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Customer Insights",
//         itemDescription: "Analyze patterns in customer behavior, preferences, and engagement to improve services, personalize experiences, and enhance marketing strategies effectively."
//       },
//       {
//         itemTitle: "Operational Efficiency",
//         itemDescription: "Leverage analytics to streamline operations, reduce costs, optimize workflows, and improve productivity across business functions efficiently."
//       },
//       {
//         itemTitle: "Predictive Analytics",
//         itemDescription: "Use historical data to forecast trends, anticipate customer needs, mitigate risks, and support strategic decision-making effectively."
//       },
//       {
//         itemTitle: "Reporting Dashboards",
//         itemDescription: "Visualize metrics, KPIs, and analytics through dashboards to monitor performance, track goals, and make informed, actionable decisions."
//       }
//     ],
//     mainImage: "/images/big-data.jpg",
//     headingImage: "/images/big-data-banner.jpg"
//   },
//   {
//     blogHeading: "Sustainable Tech Practices",
//     title: "Eco-Friendly Digital Solutions",
//     description: "Sustainable technology integrates energy efficiency, reduced waste, responsible resource usage, green hosting, eco-conscious design, renewable energy, lifecycle optimization, digital sustainability, environmental impact awareness, and corporate responsibility to ensure sustainable growth in the digital era.",
//     readtime: "5 min",
//     category: "Environment",
//     featured: true,
//     tags: ["Sustainability", "Tech", "Green IT"],
//     bestQuote: "Innovation should leave the planet better than it found it.",
//     keyTechnologies: [
//       {
//         itemTitle: "Green Hosting",
//         itemPoints: ["Renewable energy", "Energy-efficient servers", "Low carbon footprint"],
//         itemDescription: "Using servers powered by renewable energy reduces carbon emissions, supports environmental sustainability, improves efficiency, and minimizes ecological impact of digital infrastructure."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Efficient Coding",
//         itemDescription: "Writing optimized, clean code reduces computational load, energy consumption, and resource usage while improving performance, speed, and maintainability."
//       },
//       {
//         itemTitle: "Device Longevity",
//         itemDescription: "Promote longer hardware lifespan by designing software efficiently, reducing e-waste, and supporting sustainable device usage practices."
//       },
//       {
//         itemTitle: "Resource Monitoring",
//         itemDescription: "Track energy and resource consumption to identify inefficiencies, optimize performance, and reduce environmental impact across technology systems."
//       },
//       {
//         itemTitle: "Eco-conscious Design",
//         itemDescription: "Design user interfaces, workflows, and architectures that minimize computational overhead, power usage, and support sustainability goals effectively."
//       }
//     ],
//     mainImage: "/images/sustainable-tech.jpg",
//     headingImage: "/images/sustainable-banner.jpg"
//   },
//   {
//     blogHeading: "Cybersecurity Essentials",
//     title: "Protecting Digital Assets",
//     description: "Cybersecurity safeguards data, systems, networks, and digital assets from threats, attacks, breaches, malware, ransomware, social engineering, phishing, and human errors, ensuring confidentiality, integrity, availability, and compliance across organizational and personal digital environments effectively.",
//     readtime: "6 min",
//     category: "Technology",
//     featured: true,
//     tags: ["Cybersecurity", "Protection", "Data"],
//     bestQuote: "Security is not optional; it’s essential.",
//     keyTechnologies: [
//       {
//         itemTitle: "Encryption",
//         itemPoints: ["AES", "RSA", "TLS/SSL"],
//         itemDescription: "Encryption protects sensitive information by converting it into unreadable formats, ensuring confidentiality, integrity, and security against unauthorized access or cyber threats."
//       }
//     ],
//     items: [
//       {
//         itemTitle: "Firewalls",
//         itemDescription: "Firewalls filter incoming and outgoing traffic, preventing unauthorized access, controlling communication, and enhancing overall network security effectively."
//       },
//       {
//         itemTitle: "Multi-Factor Authentication",
//         itemDescription: "MFA adds additional security layers to logins, verifying user identity, reducing unauthorized access, and enhancing overall digital safety."
//       },
//       {
//         itemTitle: "Regular Updates",
//         itemDescription: "Keeping systems, software, and devices up-to-date ensures vulnerability fixes, security patches, and protection against emerging threats effectively."
//       },
//       {
//         itemTitle: "Security Awareness",
//         itemDescription: "Educating users about phishing, social engineering, password hygiene, and safe digital behavior reduces risks and strengthens cybersecurity posture effectively."
//       }
//     ],
//     mainImage: "/images/cybersecurity.jpg",
//     headingImage: "/images/cybersecurity-banner.jpg"
//   }
// ];


//    try {
//     await Blog.deleteMany({});
//     await Blog.insertMany(dummyBlogs);
//     console.log("Dummy blogs inserted successfully!");
//   } catch (err) {
//     console.error("Failed to insert dummy blogs:", err);
//   }
// }


export async function POST(req: NextRequest) {
    await connectToDatabase();

    try {
        const formData = await req.formData();
      
        const addHeading = formData.get('addHeading')?.toString() || undefined; // Optional
        const blogHeading = formData.get('blogHeading')?.toString();
        const title = formData.get('title')?.toString();
        const description = formData.get('description')?.toString();
        const bestQuote = formData.get('bestQuote')?.toString();
        const category = formData.get('category')?.toString();
        const featured = formData.get('featured')?.toString() === 'true';
        const readtime = formData.get('readtime')?.toString();
        const tagsString = formData.get('tags')?.toString();
        const keyTechnologiesString = formData.get('keyTechnologies')?.toString();
        const mainImageFile = formData.get('mainImage') as File | null;
        const headingImageFile = formData.get('headingImage') as File | null;
        const bannerImageFile = formData.get('bannerImage') as File | null;
        const itemsString = formData.get('items')?.toString();
   
        const tags: string[] = tagsString ? JSON.parse(tagsString) : [];

        // const description: string[] = descriptionString ? JSON.parse(descriptionString) : [];


        let keyTechnologies: { itemTitle: string; itemPoints: string[]; itemDescription: string }[] = [];
        if (keyTechnologiesString) {
            try {
                const parsed = JSON.parse(keyTechnologiesString);

                // Always normalize to array
                const parsedArray = Array.isArray(parsed) ? parsed : [parsed];

                keyTechnologies = parsedArray.map(item => ({
                    itemTitle: item.itemTitle ? String(item.itemTitle).trim() : '',
                    itemPoints: Array.isArray(item.itemPoints)
                        ? item.itemPoints.map((point: string) => String(point).trim())
                        : [],
                    itemDescription: item.itemDescription ? String(item.itemDescription).trim() : '',
                })).filter(item => item.itemTitle !== '' || item.itemDescription !== '');
            } catch (jsonError) {
                console.error("Failed to parse keyTechnologies JSON:", jsonError);
                return NextResponse.json(
                    { success: false, message: 'Invalid format for keyTechnologies.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        }




        let items: { itemTitle: string; itemDescription: string }[] = [];
        if (itemsString) {
            try {
                const parsedItems = JSON.parse(itemsString);
                if (Array.isArray(parsedItems)) {
                    items = parsedItems.map(item => ({
                        itemTitle: item.itemTitle ? String(item.itemTitle).trim() : '',
                        itemDescription: item.itemDescription ? String(item.itemDescription).trim() : '',
                    })).filter(item => item.itemTitle !== '' || item.itemDescription !== '');
                }
            } catch (jsonError) {
                console.error("Failed to parse items JSON:", jsonError);
                return NextResponse.json(
                    { success: false, message: 'Invalid format for blog items.' },
                    { status: 400, headers: corsHeaders }
                );
            }
        }

        // Basic validation for REQUIRED fields
        if (!blogHeading || !title || !description || !category ||  tags.length === 0 || !readtime || !bestQuote || (keyTechnologies.length === 0) || (items.length === 0)) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields (blogHeading, title, description, category, tags, keyTechnologies, or items).' },
                { status: 400, headers: corsHeaders }
            );
        }

        let mainImageUrl: string | undefined;
        if (mainImageFile && mainImageFile.size > 0) {
            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer, // Required
                fileName: mainImageFile.name, // Required
                folder: '/blog_images', // Optional, good for organization
            });
            mainImageUrl = uploadRes.url; // ImageKit public URL
        }

        let headingImageUrl: string | undefined;
        if (headingImageFile && headingImageFile.size > 0) {
            const buffer = Buffer.from(await headingImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: headingImageFile.name,
                folder: '/blog_images',
            });
            headingImageUrl = uploadRes.url; // ImageKit public URL
        }


        let bannerImageUrl: string | undefined;
        if (bannerImageFile && bannerImageFile.size > 0) {
            const buffer = Buffer.from(await bannerImageFile.arrayBuffer());
            const uploadRes = await imagekit.upload({
                file: buffer,
                fileName: bannerImageFile.name,
                folder: '/blog_images',
            });
            bannerImageUrl = uploadRes.url; // ImageKit public URL
        }

        const newBlog = await Blog.create({
            addHeading,
            blogHeading,
            title,
            tags,
            featured,
            readtime,
            bestQuote,
            keyTechnologies,
            category,
            description,
            mainImage: mainImageUrl,
            headingImage: headingImageUrl,
            bannerImage: bannerImageUrl,
            items,
        });

        return NextResponse.json(
            { success: true, data: newBlog, message: 'Blog created successfully.' },
            { status: 201, headers: corsHeaders }
        );

    } catch (error) {
        console.error('POST /api/blog error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(err => (err as mongoose.Error.ValidatorError).message);
            return NextResponse.json(
                { success: false, message: 'Validation failed: ' + errors.join(', ') },
                { status: 400, headers: corsHeaders }
            );
        }
        return NextResponse.json(
            { success: false, message },
            { status: 500, headers: corsHeaders }
        );
    }
}