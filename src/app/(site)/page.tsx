import { HeroSlider } from '@/components/home/HeroSlider';
import { Ticker } from '@/components/home/Ticker';
import { FeaturedStudios } from '@/components/home/FeaturedStudios';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { HowItWorks } from '@/components/home/HowItWorks';
import { HostPromise } from '@/components/home/HostPromise';
import { ClosingCta } from '@/components/home/ClosingCta';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Ticker />
      <FeaturedStudios />
      <CategoryShowcase />
      <HowItWorks />
      <HostPromise />
      <ClosingCta />
    </>
  );
}
