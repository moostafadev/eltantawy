import { Suspense } from "react";

import Hero from "./Hero";
import BestSellers from "./BestSellers";
import AboutUs from "./AboutUs";
import HowToOrder from "./HowToOrder";
import HomeCategories from "./Categories";
import SectionFallback from "./SectionFallback";

const Home = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <BestSellers />
      </Suspense>
      <AboutUs />
      <HowToOrder />
      <Suspense fallback={<SectionFallback />}>
        <HomeCategories />
      </Suspense>
    </>
  );
};

export default Home;
