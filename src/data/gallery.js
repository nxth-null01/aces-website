const galleryDirectory = `${import.meta.env.BASE_URL}images/gallery/`;
const acesPhotoCredit = 'Photo courtesy of SCST – Association of Computer Education Students.';

const sportfestPhotos = galleryCollection({
  slug: 'aces-presidents-sportfest-2026',
  title: 'President’s Sportfest 2026',
  category: 'Sports Activities',
  sourceUrl: 'https://www.facebook.com/scstACES/posts/pfbid02tSWAZvrErE9SFhi8UBMy4am7XVwgJxyBfbbpBEjm5JoWBefDgGpMpw3ee6qHDoa2l',
  photoSet: '122123425209420294',
}, [
  { number: '01', photoId: '122123422341420294', caption: 'A group photo from the Sportfest recap.', alt: 'A group smiles and leans together in front of a red and white wall.' },
  { number: '02', photoId: '122123422299420294', caption: 'Four attendees pose together at Sportfest.', alt: 'Four people stand shoulder to shoulder, including one wearing a blue sash.' },
  { number: '03', photoId: '122123422317420294', caption: 'A group portrait from inside the Sportfest venue.', alt: 'A group in mostly dark shirts stands together in a busy indoor venue.' },
  { number: '04', photoId: '122123422437420294', caption: 'A wide view of the seated Sportfest audience.', alt: 'A large group seated in rows turns toward the camera and smiles.' },
  { number: '05', photoId: '122123422467420294', caption: 'Another view from the Sportfest audience.', alt: 'A group smiles in the foreground, with more spectators seated behind them.' },
  { number: '06', photoId: '122123422413420294', caption: 'Three attendees show their certificates at Sportfest.', alt: 'Three people hold up certificates in front of a colorful Sportfest backdrop.' },
]);

const boothFairPhotos = galleryCollection({
  slug: 'aces-sportfest-booth-fair-2026-day-3',
  title: 'Sports Fest Booth Fair 2026 · Day 3',
  category: 'School Events',
  sourceUrl: 'https://www.facebook.com/scstACES/posts/pfbid0qXfYnbHjBYhn6FGBUAxMnWSsRL1zzL6PvnoH9gdWpE74raAcN2ns21xnAm5S4JN7l',
  photoSet: '122122355511420294',
}, [
  { number: '01', photoId: '122122351059420294', caption: 'A group gathers around a table during the third day of the Booth Fair.', alt: 'Attendees in white shirts sit around a table with a crowd behind them.' },
  { number: '02', photoId: '122122351149420294', caption: 'A group poses at a booth on Day 3.', alt: 'Four people sit around a table beside a red foil curtain.' },
]);

function galleryCollection({ slug, title, category, sourceUrl, photoSet, date, dateLabel }, photos) {
  return photos.map(({ number, photoId, caption, alt }) => {
    const id = `${slug}-${number}`;
    const filename = `${id}.webp`;

    return {
      id,
      filename,
      image: `${galleryDirectory}${filename}`,
      thumbnail: `${galleryDirectory}${id}-thumb.webp`,
      title,
      category,
      date,
      dateLabel,
      description: caption,
      alt,
      sourceUrl,
      photoUrl: `https://www.facebook.com/photo/?fbid=${photoId}&set=pcb.${photoSet}`,
      credit: acesPhotoCredit,
    };
  });
}

export const galleryItems = [...sportfestPhotos, ...boothFairPhotos];
export const galleryPreviewItems = [...sportfestPhotos.slice(0, 4), ...boothFairPhotos.slice(0, 1)];
