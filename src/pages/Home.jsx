import { ArrowUpRight } from 'lucide-react';
import ContactSection from '../components/ContactSection.jsx';
import AboutStory from '../components/AboutStory.jsx';
import ActivitiesSection from '../components/ActivitiesSection.jsx';
import ElectionsSection from '../components/ElectionsSection.jsx';
import GalleryGrid from '../components/GalleryGrid.jsx';
import Hero from '../components/Hero.jsx';
import LearningSection from '../components/LearningSection.jsx';
import OrganizationSection from '../components/OrganizationSection.jsx';
import ResourcesSection from '../components/ResourcesSection.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { FocusSection, OpportunitiesSection } from '../components/StudentSections.jsx';
import { galleryPreviewItems } from '../data/gallery.js';


export default function Home({ hash }) {
  return (
    <>
      <main>
        <Hero />
        <AboutStory />
        <FocusSection />
        <LearningSection />
        <ActivitiesSection />
        <OrganizationSection />
        <OpportunitiesSection />
        <section id="gallery" className="section-space gallery-section">
          <div className="site-shell">
            <div className="section-cap mono" data-stamp><span>07 / GALLERY</span><a href="#/gallery">OPEN GALLERY <ArrowUpRight size={15} /></a></div>
            <div className="section-intro"><h2>In the frame<span>.</span></h2><p>{galleryPreviewItems.length ? 'Explore approved photographs from ACES activities.' : 'Approved ACES event photos will appear here when available.'}</p></div>
            <GalleryGrid items={galleryPreviewItems} />
          </div>
        </section>
        <ElectionsSection />
        <ResourcesSection />
        <ContactSection hash={hash} />
      </main>
      <SiteFooter />
    </>
  );
}
