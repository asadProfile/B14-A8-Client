import { HeroSlider } from '@/components/home/HeroSlider';
import { Ticker } from '@/components/home/Ticker';
import { FeaturedStudios } from '@/components/home/FeaturedStudios';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Ticker />
      <FeaturedStudios />
      <CategoryShowcase />
    </>
  );
}
