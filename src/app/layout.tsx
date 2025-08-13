import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { ModuleProvider } from '@/context/ModuleContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { SubcategoryProvider } from '@/context/SubcategoryContext';
import { BannerProvider } from '@/context/BannerContext';
import { ServiceProvider } from '@/context/ServiceContext';
import { ProviderContextProvider } from '@/context/ProviderContext';
import { WhyChooseProvider } from '@/context/WhyChooseContext';
import { ZoneProvider } from '@/context/ZoneContext';
import RouteLoader from '@/components/RouteLoader';
import { SubscribeProvider } from '@/context/SubscribeContext';
import { CouponProvider } from '@/context/CouponContext';
import { ServiceCustomerProvider } from '@/context/ServiceCustomerContext';
import { CounterProvider } from '@/context/CounterContext';
import { JobProvider } from '@/context/JobContext';
import { AppliedCandidatesProvider } from '@/context/AppliedCandidatesContext';
import { FooterProvider } from '@/context/FooterContext';
import { TestimonialProvider } from '@/context/TestimonialContext';

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
                      <AuthProvider>
                        <UserProvider>
                          <ModuleProvider>
                            <CategoryProvider>
                              <SubcategoryProvider>
                                <BannerProvider>
                                  <ServiceProvider>
                                    <ProviderContextProvider>
                                      <WhyChooseProvider>
                                        <ZoneProvider>
                                          <SubscribeProvider>
                                            <CouponProvider>
                                              <ServiceCustomerProvider>
                                                {children}
                                              </ServiceCustomerProvider>
                                            </CouponProvider>
                                          </SubscribeProvider>
                                        </ZoneProvider>
                                      </WhyChooseProvider>
                                    </ProviderContextProvider>
                                  </ServiceProvider>
                                </BannerProvider>
                              </SubcategoryProvider>
                            </CategoryProvider>
                          </ModuleProvider>
                        </UserProvider>
                      </AuthProvider>
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
