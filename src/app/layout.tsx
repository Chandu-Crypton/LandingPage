import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { WhyChooseProvider } from '@/context/WhyChooseContext';
import { ZoneProvider } from '@/context/ZoneContext';
import RouteLoader from '@/components/RouteLoader';
import { CounterProvider } from '@/context/CounterContext';
import { JobProvider } from '@/context/JobContext';
import { AppliedCandidatesProvider } from '@/context/AppliedCandidatesContext';
import { FooterProvider } from '@/context/FooterContext';
import { TestimonialProvider } from '@/context/TestimonialContext';
import { BlogProvider } from '@/context/BlogContext';
import { AboutProvider } from '@/context/AboutContext';
import { TechnologyProvider } from '@/context/TechnologyContext';
import { ProductProvider } from '@/context/ProductContext';
import { ContactProvider } from '@/context/ContactContext';
import { NewsLetterProvider } from '@/context/NewsLetterContext';
import { InternshipProvider } from '@/context/InternshipContext';
import { BoardProvider } from '@/context/BoardContext';
import { FContactProvider } from '@/context/FContactContext';
import { FServicesProvider } from '@/context/FServicesContext';
import { FBlogProvider } from '@/context/FBlogContext';
import { ServiceProvider } from '@/context/ServiceContext';
import { PackageProvider } from '@/context/PackageContext';
import { BannerProvider } from '@/context/BannerContext';
import { ReviewProvider } from '@/context/ReviewContext';
import { FaqProvider } from '@/context/FaqContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <RouteLoader />
        <ThemeProvider>
          <SidebarProvider>
            <CounterProvider>
              <JobProvider>
                <AppliedCandidatesProvider>
                  <FooterProvider>
                    <TestimonialProvider>
                      <BlogProvider>
                        <AboutProvider>
                          <TechnologyProvider>
                            <ProductProvider>
                              <ContactProvider>
                                <NewsLetterProvider>
                                  <InternshipProvider>
                                    <BoardProvider>
                                      <FContactProvider>
                                        <FServicesProvider>
                                          <FBlogProvider>
                                            <AuthProvider>
                                              <ServiceProvider>
                                                <PackageProvider>
                                                  <BannerProvider>
                                                    <ReviewProvider>
                                                      <FaqProvider>
                                                        <UserProvider>
                                                          <WhyChooseProvider>
                                                            <ZoneProvider>

                                                              {children}

                                                            </ZoneProvider>
                                                          </WhyChooseProvider>
                                                        </UserProvider>
                                                      </FaqProvider>
                                                    </ReviewProvider>
                                                  </BannerProvider>
                                                </PackageProvider>
                                              </ServiceProvider>
                                            </AuthProvider>
                                          </FBlogProvider>
                                        </FServicesProvider>
                                      </FContactProvider>
                                    </BoardProvider>
                                  </InternshipProvider>
                                </NewsLetterProvider>
                              </ContactProvider>
                            </ProductProvider>
                          </TechnologyProvider>
                        </AboutProvider>
                      </BlogProvider>
                    </TestimonialProvider>
                  </FooterProvider>
                </AppliedCandidatesProvider>
              </JobProvider>
            </CounterProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
